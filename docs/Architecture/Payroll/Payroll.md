# Payroll dApp — Implementation Brief

Purpose: single-page brief that defines responsibilities, interfaces, flows, and recommended MVP choices. Keep things on-chain-first; off-chain is minimal and only for transaction orchestration or optional scheduling.

---

## Actors

- **Employer** — deposits USDC, creates payrolls.
- **Employee** — receives payroll, requests advance.
- **DAO (Originator)** — funds advances, mints RBNs.
- **Investor** — buys RBNs from marketplace. // Note: Usurer = UI name for Investor role
- **Keeper / Relayer (off-chain)** — optional: triggers scheduled on-chain payments (does NOT hold funds).

### Terminology Note

- **Borrower** (the actor) = Employee who requests an advance
- **Treasury** (the contract field) = Source of funds in CashflowNFT (`CashflowNFT.treasury`)
- **Beneficiary** (the contract field) = Original employee in CashflowNFT (`CashflowNFT.beneficiary`)

---

## High-level architecture

- **Contracts (on-chain)**:
  - `PayrollManager` — registry + query views.
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
- **Simplicity**: Optimize for little code, little infra. Reduce the amount of modules and features to get a workign MVP as quickly as possible

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

### EmployerTreasury (on-chain)

**Responsibilities**

- Hold employer USDC funds
- `deposit()` by employer (approve + transferFrom)
- `availableBalance()` view
- `pay(payrollId, recipient, amount)` callable by `PayrollManager` or authorized keeper

**Essential functions**

```solidity
function deposit(uint256 amount) external;
function pay(uint256 payrollId, address receiver, uint256 amount) external;
function availableBalance() external view returns (uint256);
```

### Integration: EmployerTreasury <-> CashflowNFT

When a payroll is created:
- `PayrollManager.createPayroll()` registers the payroll
- `CashflowNFT.mintCashflow()` is called with:
  - `treasury` = EmployerTreasury address (or Circle wallet)
  - `beneficiary` = employee address
- The NFT owner initially equals beneficiary, but can be transferred to investors

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
- `EmployerTreasury.deposit(amount)`
- `EmployerTreasury.pay(payrollId, receiver, amount)`
- `RBNToken.mintToDao(metadataUri)`
- `PayrollMarketplace.listRBNs(cursor, limit)`
- `PayrollMarketplace.buy(rbnId, price)`

---

## Recommendations

- **Try to avoid indexers (and the need for a backend)**: expose on-chain views. (Optionally paginated). This should be enough for minimal UI needs.
- **Keep off-chain minimal**: keeper = transaction caller only; DAO backend minimal for minting RBNs.
- **Avoid automatic payments at first** Automation is a nice to have. But for the demo, and local development manuall triggers are easier.

---

## Flows

### Flow A — Employer creates payroll & funds treasury

1. Employer wallet: `approve(EmployerTreasury, amount)`.
2. Employer: `EmployerTreasury.deposit(amount)`.
3. Employer: `PayrollManager.createPayroll(employee, amountPerPeriod, cadence, start, end)`.

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
2. Same as Option 1: resolve recipien, call pay

### Flow D — Investor buys RBN

1. Investor: `USDC.approve(PayrollMarketplace, price)`.
2. Investor: `PayrollMarketplace.buy(rbnId, price)`.
3. Contract transfers USDC to DAO and `RBNToken` to buyer.
