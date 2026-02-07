# Frontend Testing Checklist for Wagmi Hook Migration

## Prerequisites
- [ ] Anvil testnet running (`pnpm anvil`)
- [ ] Contracts deployed (`pnpm deploy:local`)
- [ ] Dev server running (`pnpm dev`)
- [ ] Wallet connected to local Anvil (localhost:8545, Chain ID 31337)
- [ ] Wallet has test USDC (use faucet or mint function)

---

## 🏢 Employer Dashboard Tests (http://localhost:3000/employer)

### TreasuryCard Component
- [ ] **Display**: Credit score displays correctly
- [ ] **Display**: Vault balance shows (may be 0 initially)
- [ ] **Display**: Required escrow displays correctly
- [ ] **Display**: Solvency status shows (Solvent/Underfunded)
- [ ] **Action**: Can enter deposit amount
- [ ] **Action**: Fund button triggers approval + funding
- [ ] **Action**: Balance updates after funding
- [ ] **Action**: Credit score updates after funding

### MintECTokenForm Component
- [ ] **Display**: Form fields render correctly
- [ ] **Display**: Calculated total amount shows when fields filled
- [ ] **Display**: Warning shows if vault underfunded
- [ ] **Display**: Vault balance/required escrow display correctly
- [ ] **Action**: Can enter employee address
- [ ] **Action**: Can enter monthly amount
- [ ] **Action**: Can enter duration in months
- [ ] **Action**: Mint button triggers transaction
- [ ] **Action**: Form clears after successful mint
- [ ] **Action**: Error shows if insufficient funds

### MintedECTokensList Component
- [ ] **Display**: Shows "No tokens" message if empty
- [ ] **Display**: Lists all minted tokens with IDs
- [ ] **Display**: Shows total amount for each token
- [ ] **Display**: Shows claimed amount for each token
- [ ] **Display**: Shows accrual progress bar
- [ ] **Display**: Shows remaining amount for each token
- [ ] **Data**: Token info loads correctly for each minted token
- [ ] **Data**: Progress percentage calculates correctly
- [ ] **Data**: Updates when new token minted

---

## 👤 Employee Dashboard Tests (http://localhost:3000/employee)

### ECTokenPortfolioList Component
- [ ] **Display**: Shows "Connect wallet" if not connected
- [ ] **Display**: Shows "No tokens" if employee owns none
- [ ] **Display**: Shows "Scanning" message while loading
- [ ] **Display**: Lists all owned tokens
- [ ] **Display**: Each token card shows token ID
- [ ] **Display**: Each token shows vault address
- [ ] **Display**: Each token shows total/claimed/claimable/remaining amounts
- [ ] **Display**: Each token shows accrual progress bar
- [ ] **Display**: Each token shows vault credit score
- [ ] **Display**: "Owned" badge shows on owned tokens
- [ ] **Action**: Claim button enabled when claimable > 0
- [ ] **Action**: Claim button disabled when claimable = 0
- [ ] **Action**: Clicking claim triggers transaction
- [ ] **Action**: Amount updates after successful claim
- [ ] **Data**: Scans tokens 1-100 for balance
- [ ] **Data**: Filters to show only owned tokens

### ECTokenSaleCard Component
- [ ] **Display**: Shows "Connect wallet" if not connected
- [ ] **Display**: Shows "No tokens" if employee owns none
- [ ] **Display**: Dropdown lists all owned tokens
- [ ] **Display**: Token details show when token selected
- [ ] **Display**: Shows total/claimed/remaining amounts
- [ ] **Display**: Shows estimated offer (future/discounted/discount%)
- [ ] **Action**: Can select token from dropdown
- [ ] **Action**: "Request Quote" button enabled when token selected
- [ ] **Action**: Clicking "Request Quote" triggers transaction
- [ ] **Action**: Offer card appears after quote requested
- [ ] **Action**: Offer shows correct amounts
- [ ] **Action**: "Decline" button hides offer
- [ ] **Action**: "Accept Offer" triggers approval + transfer
- [ ] **Action**: Token removed from dropdown after sale
- [ ] **Data**: EC token value calculation correct
- [ ] **Data**: Discount percentage correct

---

## 💰 Usurer Dashboard Tests (http://localhost:3000/usurer)

### Note: Usurer dashboard not actively using custom hooks, so lower priority

---

## Integration Flow Tests

### Full Employer → Employee Flow
1. [ ] Employer creates vault (if needed)
2. [ ] Employer funds vault with USDC
3. [ ] Employer mints EC token for employee address
4. [ ] Token appears in MintedECTokensList
5. [ ] Switch to employee wallet
6. [ ] Token appears in ECTokenPortfolioList
7. [ ] Employee can see claimable amount increase over time
8. [ ] Employee can claim accrued salary
9. [ ] Claimed amount updates in both dashboards

### Full Employee → Sell Flow
1. [ ] Employee owns EC token (from above)
2. [ ] Employee navigates to ECTokenSaleCard
3. [ ] Employee selects token
4. [ ] Employee requests quote
5. [ ] Offer appears with correct discount
6. [ ] Employee approves token transfer
7. [ ] Employee accepts offer
8. [ ] USDC received in employee wallet
9. [ ] Token removed from employee portfolio
10. [ ] Token appears in PayrollDApp contract

---

## Critical Business Logic Tests

### Credit Score Impact
- [ ] New vault starts with score 0
- [ ] Funding vault increases score
- [ ] Underfunding (default) decreases score
- [ ] Credit score affects discount rate in offers

### Vesting/Accrual
- [ ] Claimable amount = 0 immediately after mint
- [ ] Claimable amount increases linearly over time
- [ ] Claimable amount never exceeds total - claimed
- [ ] Progress bar shows correct percentage

### Solvency Checks
- [ ] Cannot mint if vault balance < required escrow + new token amount
- [ ] Vault shows underfunded warning if balance < required escrow
- [ ] Partial claims work if vault underfunded during claim

---

## Error Handling Tests

- [ ] Graceful error if wallet not connected
- [ ] Graceful error if wrong network
- [ ] Graceful error if transaction rejected
- [ ] Graceful error if insufficient gas
- [ ] Graceful error if contract call reverts
- [ ] Loading states show during transactions
- [ ] Success messages show after completion

---

## Performance Tests

- [ ] Token scanning (1-100) completes in <5 seconds
- [ ] No excessive re-renders
- [ ] Contract reads cached appropriately
- [ ] Page loads without flickering

---

## How to Use This Checklist

1. **Baseline Test**: Run full checklist BEFORE making any changes (record current state)
2. **After Each Migration Step**: Run only the affected component tests
3. **Final Verification**: Run full checklist AFTER all migrations complete
4. **Mark** items that fail so you know what broke
