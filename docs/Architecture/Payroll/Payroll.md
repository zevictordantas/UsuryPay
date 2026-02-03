# Payroll dApp — Implementation Brief

Purpose: single-page brief that defines responsibilities, interfaces, flows, and recommended MVP choices. Keep things on-chain-first; off-chain is minimal and only for transaction orchestration or optional scheduling.

---

## Actors

- **Employer** — deposits USDC, creates payrolls.
- **Employee** — receives payroll, requests advance.
- **DAO (Originator)** — funds advances, mints RBNs.
- **Investor** — buys RBNs from marketplace. // Note: Usurer = UI name for Investor role
- **Keeper / Relayer (off-chain)** — optional: triggers scheduled on-chain payments (does NOT hold funds).

---

## High-level architecture

- **Contracts (on-chain)**:
  - `PayrollManager` — registry + query views.
  - `EmployerTreasuryFactory` — deploys and registers per-employer `EmployerTreasury` instances.
  - `EmployerTreasury` — escrow per employer, holds USDC, executes `pay`.
  - `RBNToken` — NFT or ERC-20 representing credit claims.
  - `PayrollMarketplace` — buy/sell RBNs (transfer USDC → DAO and token → buyer).

- **Off-chain**:
  - Minimal keeper (serverless or script) that _only_ calls contract functions (no custody).
  - Frontend (Next.js) directly reads on-chain view functions; writes via wallets.
  - Optional Chainlink Automation/relayer for scheduled execution if needed.

---

## Design choices

- **Avoid indexers**: Expose `view` functions and paginated getters on `PayrollManager` so UI can fetch data directly from chain. Events are emitted for logs but not required for core functionality.
- **No off-chain custody**: All funds remain in `EmployerTreasury` and DAO treasury on-chain.
- **Repayment automation**: prefer **pull-based** model for MVP: borrower (or keeper with allowance) permits `Treasury` to pull repayments. Alternate: keeper calls `pay` to move funds from EmployerTreasury to RBN holder.
- **Simplicity**: Optimize for little code, little infra. Reduce the amount of modules and features to get a working MVP as quickly as possible.

---

## Contract responsibilities

### PayrollManager (on-chain)

**Responsibilities**

- Create/terminate payrolls
- Store payroll metadata
- Provide view APIs (filtered, paginated) to list payrolls by employer/employee
- Emit events for off-chain observers (optional)

**Essential function signatures (interface-style)**

```solidity
function createPayroll(address employee, uint256 amount, uint256 cadenceSeconds, uint256 start, uint256 end) external returns (uint256);
function terminatePayroll(uint256 payrollId, uint256 newEnd) external;
function getPayroll(uint256 payrollId) external view returns (Payroll memory);
function listPayrollsByEmployer(address employer, uint256 cursor, uint256 limit) external view returns (uint256[] memory payrollIds, uint256 nextCursor);
function listPayrollsByEmployee(address employee, uint256 cursor, uint256 limit) external view returns (uint256[] memory payrollIds, uint256 nextCursor);
```

**Not its job**

- Does not handle token transfers
- Does not run cron jobs

---

### EmployerTreasuryFactory (on-chain)

**Responsibilities**

- Deploy a new `EmployerTreasury` for each employer.
- Register and map `employer => treasury`.
- Provide simple discovery (getTreasury) for UI/keepers.
- Emit `TreasuryCreated` event.

**Essential function signatures**

```solidity
function createTreasury(address employer) external returns (address treasury);
function getTreasury(address employer) external view returns (address treasury);
event TreasuryCreated(address indexed employer, address treasury);
```

**Notes**

- Factory allows lightweight per-employer isolation without central registry complexity.
- PayrollManager or UI should use `getTreasury(employer)` to resolve the treasury address for pay/deposit calls.

---

### EmployerTreasury (on-chain)

**Responsibilities**

- Hold employer USDC funds (single-employer per contract)
- `deposit()` by employer (approve + transferFrom)
- `availableBalance()` view (returns contract balance)
- `pay(payrollId, recipient, amount)` callable by `PayrollManager` or authorized keeper

**Essential functions**

```solidity
function deposit(uint256 amount) external;
function pay(uint256 payrollId, address receiver, uint256 amount) external;
function availableBalance() external view returns (uint256);
```

**Notes**

- Each treasury is single-employer; no employer parameter needed in functions
- Access control for pay() to be added in future iteration
- Ownership patterns to be added in future iteration

---

### PayrollMarketplace (on-chain)

**Responsibilities**

- Accept USDC from buyer, forward to DAO, transfer RBN to buyer
- Minimal checks: token ownership, price match

**Essential functions**

```solidity
function buy(uint256 rbnId, uint256 price) external;
```

---

## Off-chain responsibilities

- **Keeper / Relayer (automations will be done later)**:
  - Read on-chain state (via RPC) and call `EmployerTreasury.pay(...)` when schedule hits or when repayment is due.
  - Store _only_ transaction nonces / credentials needed to submit txs; never custody funds.
  - Options: serverless function (Vercel), GitHub Actions, or local script. Use Chainlink Automation only if on-chain scheduling required and worthwhile.

---

## Repayment automation options (Start with manual, automate later)

1. **Manual / UI-triggered pay** — simplest; no keeper required. (Recommended for strict time constraints.)
2. **Light keeper** — serverless script that calls `pay` when due. No DB required; read on-chain via view functions. (Recommended if you want automated demo.)
3. **Chainlink Automation / Gelato** — more production-like; only use if you need on-chain scheduling and have time.

---

## Minimal API / interface summary (for implementer)

- `PayrollManager.createPayroll(...)`
- `PayrollManager.listPayrollsByEmployer(employer, cursor, limit)`
- `EmployerTreasuryFactory.createTreasury(employer)`
- `EmployerTreasuryFactory.getTreasury(employer)`
- `EmployerTreasury.deposit(amount)`
- `EmployerTreasury.pay(payrollId, receiver, amount)`
- `RBNToken.mintToDao(metadataUri)`
- `PayrollMarketplace.listRBNs(cursor, limit)`
- `PayrollMarketplace.buy(rbnId, price)`

---

## Recommendations

- **Try to avoid indexers (and the need for a backend)**: expose on-chain views. (Optionally paginated). This should be enough for minimal UI needs.
- **Keep off-chain minimal**: keeper = transaction caller only; DAO backend minimal for minting RBNs.
- **Avoid automatic payments at first** Automation is a nice to have. But for the demo, and local development manual triggers are easier.

---

## Flows

### Flow A — Employer creates payroll & funds treasury

1. Employer wallet: `approve(EmployerTreasury, amount)` (resolve treasury via `EmployerTreasuryFactory.getTreasury(employer)`; call `createTreasury` first if absent).
2. Employer: `EmployerTreasury.deposit(amount)`.
3. Employer: `PayrollManager.createPayroll(employee, amountPerPeriod, cadence, start, end)`.

**Note:** UI should resolve treasury addresses via `factory.getTreasury(employer)` before deposit/pay operations.

### Flow B — Employee requests an advance (DAO-funded)

1. Employee UI: request advance -> call DAO backend API (or multisig) to approve.
2. DAO backend: mints RBN via `RBNToken.mintToDao(metadataUri)` and sends `USDC` from DAO treasury to `Employee`.
3. RBN is listed on `PayrollMarketplace` (off-chain registry or on-chain minimal listing).

### Flow C — Scheduled payroll payment / repayment

**Option 1 (keeper-triggered):**

1. Keeper reads `PayrollManager` for due payments (via `listPayrollsByEmployer`).

2. Resolve recipient. We need to check if the employee has "active RBNs".
   - ⚠️ We need to define where and how to store this information. ⚠️

3. Keeper calls `EmployerTreasury.pay(payrollId, recipient, amount)`.
   - If recipient is RBN holder, payment goes to their address.
   - If recipient is employee (no RBN minted), payment goes to the employee.
   - Pay checks treasury balance, if there is an error it emits the error and registers that on the payroll

**Option 2 (user-triggered, simplest):**

1. Employer triggers `pay` via UI when paying cycle arrives.
2. Same as Option 1: resolve recipient, call pay

### Flow D — Investor buys RBN

1. Investor: `USDC.approve(PayrollMarketplace, price)`.
2. Investor: `PayrollMarketplace.buy(rbnId, price)`.
3. Contract transfers USDC to DAO and `RBNToken` to buyer.

---
