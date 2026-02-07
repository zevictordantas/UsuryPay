# Payroll dApp - EC Primitive Use Case

**This is a demonstration of the EC primitive applied to payroll scenarios.**

## Overview

The payroll dApp uses the Expected Cashflow primitive to enable employees to **sell their future salary** for immediate liquidity. The dApp acts as a buyer of EC tokens, providing employees with upfront cash in exchange for their future payment entitlements.

**Key Feature:** "Get paid early" - employees can convert future salary into immediate cash by selling their EC tokens to the payroll dApp at a discount.

## Important: This is NOT a Loan

**What this IS:**
- Employee **sells** their EC token to the payroll dApp
- Employee receives immediate cash (less than face value)
- PayrollDApp owns the EC token and collects future payments
- Employee has NO repayment obligation

**What this is NOT:**
- ❌ NOT a loan (employee doesn't borrow and repay)
- ❌ NOT collateralized borrowing (employee doesn't keep EC token)
- ❌ NOT a partial advance (employee can't sell "part" of EC token)

**Financial term:** This is called **factoring** or **invoice discounting** in traditional finance. Employee is selling a receivable (future salary) at a discount.

## Actors

1. **Employer** — Funds vault, mints EC tokens for employees
2. **Employee** — Receives EC tokens, can sell them for immediate cash
3. **Payroll dApp** — Buys EC tokens at a discount, manages risk assessment

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                         Employer                              │
│  1. Funds vault                                               │
│  2. Mints EC tokens for employees                             │
└───────────────────────┬──────────────────────────────────────┘
                        │
                        ▼
            ┌───────────────────────┐
            │      EC Vault          │
            │  ┌─────────────────┐  │
            │  │ Employer funds  │  │
            │  │ $100k deposited │  │
            │  └─────────────────┘  │
            │                        │
            │  Mints EC tokens ──────┼──┐
            └───────────────────────┘  │
                                       │
                                       ▼
                        ┌──────────────────────────┐
                        │   EC Token (Employee A)  │
                        │   $4k/month × 12 months  │
                        │   = $48k total           │
                        └──────────┬───────────────┘
                                   │
                Employee owns ─────┤
                                   │
                                   ▼
            ┌──────────────────────────────────────┐
            │        Payroll dApp                  │
            │  ┌────────────────────────────────┐  │
            │  │ Frontend preview:              │  │
            │  │ • getECTokenValue() → $44k     │  │
            │  │                                │  │
            │  │ Employee calls sellToken():    │  │
            │  │ 1. Calculate offer ($44k)      │  │
            │  │ 2. Transfer EC to dApp         │  │
            │  │ 3. Transfer cash to employee   │  │
            │  └────────────────────────────────┘  │
            └───────────────────────┬──────────────┘
                                    │
                                    ▼
                    ┌──────────────────────────────────────┐
                    │  Result (single transaction)         │
                    │  • Employee got $44k immediately     │
                    │  • dApp owns EC token                │
                    │  • dApp claims $48k over 12 months   │
                    │  • dApp profit: $4k (~9% return)     │
                    └──────────────────────────────────────┘
```

## Core Components

### PayrollVault (extends IECVault)

Extended vault that allows employer to mint EC tokens directly.

```solidity
contract PayrollVault is IECVault {
    // Employer (vault owner) can mint EC tokens
    function mintSalaryToken(
        address employee,
        uint256 monthlyAmount,
        uint256 durationMonths
    ) external onlyEmployer returns (uint256 tokenId);

    // View function: calculate employer's credit score
    function getEmployerCreditScore() external view returns (uint256 score);
}
```

**Employer workflow:**
1. Deploy PayrollVault (or use existing one)
2. Fund vault: `vault.fund(100_000e6)` // $100k USDC
3. Mint EC for Employee A: `vault.mintSalaryToken(employeeA, 4000e6, 12)`
4. Mint EC for Employee B: `vault.mintSalaryToken(employeeB, 3000e6, 12)`
5. Continue funding monthly or upfront as desired

### PayrollDApp Contract

Buys EC tokens from employees, manages liquidity, assesses risk.

```solidity
contract PayrollDApp {
    IERC20 public paymentToken; // e.g., USDC
    address public treasury;

    mapping(uint256 => bool) public ownedTokens;

    // View functions (no indexer needed)
    function getEmployerCreditScore(address vault) external view returns (uint256 score);
    function getECTokenValue(uint256 tokenId) external view returns (
        uint256 currentValue,
        uint256 futureValue,
        uint256 discountedValue
    );

    // State-changing functions
    function sellToken(uint256 tokenId) external returns (uint256 offerAmount);
    function claimFromToken(uint256 tokenId) external;
}
```

## User Flows

### Flow 1: Employer Setup

1. Deploy or use existing PayrollVault
2. Fund vault: `vault.fund(100_000e6)`
3. Mint EC tokens for employees:
   - `vault.mintSalaryToken(alice, 4000e6, 12)` // $48k total
   - `vault.mintSalaryToken(bob, 3000e6, 12)` // $36k total

### Flow 2: Employee Sells EC Token (Get Paid Early)

**Frontend Preview (before transaction):**
1. Employee views token in UI
2. Frontend calls `dApp.getECTokenValue(tokenId)` to preview offer
3. UI displays: "Get $43,776 now (future value: $48,000)"

**On-Chain Transaction (single step):**
1. Employee approves token: `ecToken.approve(dApp.address, tokenId)`
2. Employee sells token: `dApp.sellToken(tokenId)`
3. PayrollDApp calculates offer on-chain (same formula as view function)
4. Atomic transfer:
   - EC token: Employee → PayrollDApp
   - Cash: PayrollDApp → Employee

**Result:**
- Employee has cash immediately
- PayrollDApp owns EC token
- PayrollDApp will collect full amount over time from vault

**Key simplification:** No two-step quote/accept flow. Quote is calculated on frontend using view function, then executed atomically in single transaction.

### Flow 3: PayrollDApp Claims Funds

1. Time passes (e.g., 6 months)
2. PayrollDApp checks claimable: `token.getClaimable(tokenId)` → $24k
3. PayrollDApp claims: `dApp.claimFromToken(tokenId)`
4. Vault transfers $24k to dApp treasury
5. PayrollDApp will claim remaining $24k after another 6 months

## Credit Scoring Formula

### Employer Credit Score

**Purpose:** Assess risk of employer defaulting on vault obligations.

```
score = (fundingRatio × 100) - (defaultCount × 5)

where:
    fundingRatio = totalFunded / totalRequired
    totalFunded = sum of all vault.fund() calls
    totalRequired = sum of requiredEscrow over time
    defaultCount = number of default events recorded

Interpretation:
    100 = Perfect record (fully funded, no defaults)
    80+ = Good (minor delays acceptable)
    50-79 = Average (some defaults, requires discount)
    <50 = Risky (large discount or rejection)
    0 = Constant default (don't buy)
```

### Discount Calculation

**Purpose:** Determine how much to pay for an EC token NOW vs. its future value.

```
offerAmount = futureValue × (baseRate / 100) × (creditAdj / 100) × (timeAdj / 100)

Components:
1. baseRate = 90 (dApp's base profit margin: 10%)

2. creditAdj (employer risk premium):
   - score ≥ 80: creditAdj = 100 (no extra discount)
   - score 50-79: creditAdj = 95 (5% extra discount)
   - score < 50: creditAdj = 85 (15% extra discount)

3. timeAdj (time value of money):
   - ≤ 3 months: timeAdj = 100 (minimal discount)
   - 3-6 months: timeAdj = 98 (2% discount)
   - > 6 months: timeAdj = 95 (5% discount)
```

**Example Calculations:**

```
Scenario 1: Good employer, short term
- Future value: $10,000
- Employer score: 85 (creditAdj = 100)
- Time remaining: 3 months (timeAdj = 100)
- Offer = 10000 × 0.90 × 1.00 × 1.00 = $9,000
- Employee gets: $9,000 (90%)
- dApp profit: $1,000 (11.1% return over 3mo = ~44% APR)

Scenario 2: Risky employer, long term
- Future value: $10,000
- Employer score: 45 (creditAdj = 85)
- Time remaining: 12 months (timeAdj = 95)
- Offer = 10000 × 0.90 × 0.85 × 0.95 = $7,268
- Employee gets: $7,268 (72.7%)
- dApp profit: $2,732 (37.6% return over 12mo)
```

## Frontend Requirements (No Backend/Indexer)

### For Employees

**View EC Tokens and Preview Offer:**
```typescript
const tokens = await ecToken.tokensOfOwner(userAddress);
for (const tokenId of tokens) {
  const info = await ecToken.getTokenInfo(tokenId);
  const { currentValue, futureValue, discountedValue } =
    await payrollDApp.getECTokenValue(tokenId);
  // Display: "Sell now for: $43,776" (preview calculated off-chain)
}
```

**Sell Token (Single Transaction):**
```typescript
// 1. Approve token transfer
await ecToken.approve(payrollDApp.address, tokenId);

// 2. Sell token (calculates offer on-chain and executes atomically)
const tx = await payrollDApp.sellToken(tokenId);
const receipt = await tx.wait();

// Extract offer amount from events if needed
const event = receipt.events.find((e) => e.event === 'TokenPurchased');
const { tokenId, seller, offerAmount } = event.args;
// Employee received offerAmount of USDC
```

### For Employers

**View Vault Status:**
```typescript
const vaultInfo = await vault.getVaultInfo();
const balance = await vault.getBalance();
const required = await vault.getRequiredEscrow();
const score = await payrollDApp.getEmployerCreditScore(vault.address);
```

**Mint EC Tokens:**
```typescript
const monthlyAmount = ethers.utils.parseUnits('4000', 6);
const durationMonths = 12;
await vault.mintSalaryToken(employeeAddress, monthlyAmount, durationMonths);
```

### For PayrollDApp Operator

**Monitor Owned Tokens:**
```typescript
const purchaseEvents = await payrollDApp.queryFilter(
  payrollDApp.filters.TokenPurchased()
);
const ownedTokenIds = purchaseEvents.map((e) => e.args.tokenId);

for (const tokenId of ownedTokenIds) {
  const claimable = await ecToken.getClaimable(tokenId);
  if (claimable > 0) {
    await payrollDApp.claimFromToken(tokenId);
  }
}
```

## Economic Analysis

### Comparison to Traditional Payday Loans

| Feature          | Traditional Payday Loan         | EC Token Sale                               |
| ---------------- | ------------------------------- | ------------------------------------------- |
| **APR**          | 300-400%                        | ~30%                                        |
| **Collateral**   | None (unsecured)                | EC token (secured)                          |
| **Credit check** | Minimal                         | On-chain credit score                       |
| **Repayment**    | Employee must repay             | No repayment (sold asset)                   |
| **Default risk** | Employee defaults → collections | PayrollDApp owns token → vault default risk |
| **Regulation**   | Heavy (usury laws)              | Minimal (crypto)                            |

**Key advantage:** EC token sale is **10x cheaper** (30% vs. 300% APR) and employee has no repayment burden.

## Risk Management

### For PayrollDApp

**Risk 1: Employer Default**
- **Mitigation:** Credit scoring, larger discounts for risky employers
- **Detection:** Default events recorded on-chain
- **Response:** Stop buying tokens from that vault

**Risk 2: Liquidity**
- **Mitigation:** Maintain reserve of USDC to buy tokens
- **Detection:** Track treasury balance vs. outstanding offers
- **Response:** Pause new quotes if underfunded

### For Employees

**Risk 1: Bad Offer**
- **Mitigation:** Show comparison (offer vs. face value)
- **Employee can see discount percentage and reject**

**Risk 2: Employer Default After Sale**
- **Not employee's problem** (they already got paid)

### For Employers

**Risk 1: Reputation Damage**
- Employees get worse offers if employer score is low
- **Mitigation:** Fund vault properly, avoid defaults

## Future Enhancements (Post-MVP)

1. **Secondary Market** - Allow PayrollDApp to sell EC tokens to other buyers
2. **Employee Credit Scoring** - Track employee payment history for better offers
3. **Partial Advances** - Allow employees to borrow against EC without selling
4. **Dynamic Pricing** - Real-time offer updates based on market conditions
5. **Batch Operations** - Process multiple tokens in one transaction

## Key Insights

1. **No loans** — This is asset sale (factoring), not lending
2. **Risk-based pricing** — Employer credit score determines offer quality
3. **No off-chain data** — Everything on-chain, no indexers needed
4. **Simple MVP** — No partial advances, no splitting, no complex features
5. **Transparent** — All calculations visible via view functions

**Market Potential:**
- Traditional payday loans charge 300-400% APR
- EC token sales offer ~30% APR equivalent
- **10x cheaper** for employees
- Still profitable for PayrollDApp (15-25% returns)
- Employers benefit from employee satisfaction
