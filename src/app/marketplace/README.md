# EC Token Marketplace

The marketplace UI showcases secondary market trading of Expected Cashflow (EC) tokens.

## Features

### Main Page (`/marketplace`)
- Grid layout with sidebar filters and main listings area
- Responsive design (mobile-friendly)
- Filter and sorting capabilities

### Components

#### `MarketplaceFilters.tsx`
- **Sort Options**: Discount, amount, duration, credit score
- **Min Credit Score Filter**: Numeric input (0-850)
- **Max Duration Filter**: Optional days limit
- **Show Defaulted Only**: Checkbox to filter tokens from vaults with defaults
- **Reset Filters**: Button to clear all filters

#### `MarketplaceListings.tsx`
- Fetches and displays EC tokens from marketplace
- Applies filters and sorting
- Shows loading state
- Empty state when no tokens match filters
- Grid layout (2 columns on desktop)
- **Mock Data**: Diverse token types (payroll, rental, subscription, dividend)

#### `ECTokenCard.tsx`
- Compact card showing token details:
  - Token type badge (color-coded)
  - Default count badge (if any)
  - Risk level indicator (low/medium/high)
  - Seller information
  - Price and discount
  - Calculated APR
  - Credit score
  - Payment progress
- **Expandable Details Section**:
  - Token ID
  - Total amount and claimed amount
  - Remaining value
  - Days since listing
  - Default history
- **Buy Button**: Triggers purchase flow (with TODOs for Web3 integration)

## Mock Data

The marketplace includes diverse mock tokens:
- **Payroll tokens** from tech companies and startups
- **Rental tokens** from commercial properties
- **Subscription tokens** from SaaS companies
- **Dividend tokens** from investment vehicles
- Various credit scores (650-800)
- Different risk levels and default counts
- Range of durations (45-300 days)

## TODOs for Web3 Integration

### In `MarketplaceListings.tsx`
```typescript
// TODO: Implement Web3 call to fetch marketplace listings
// const listings = await marketplaceContract.getActiveListings();
// const tokenData = await Promise.all(
//   listings.map(async (listing) => {
//     const tokenInfo = await ecTokenContract.getTokenInfo(listing.tokenId);
//     const vaultInfo = await ecVaultContract.getVaultInfo(tokenInfo.vaultAddress);
//     return { ...listing, ...tokenInfo, ...vaultInfo };
//   })
// );
```

### In `ECTokenCard.tsx`
```typescript
// TODO: Implement Web3 purchase
// 1. Approve USDC/payment token for askPrice amount
// await usdcContract.approve(marketplaceAddress, token.askPrice);
// 2. Execute purchase on marketplace contract
// await marketplaceContract.buyToken(token.tokenId);
// 3. Token transfers to buyer, USDC transfers to seller
```

## Styling

- Uses Tailwind CSS v4 with consistent design system
- Matches styling from employee/employer/usurer dashboards
- Black buttons with hover states
- Card-based layout with shadows
- Color-coded badges for status indicators
- Responsive grid layouts

## Navigation

The marketplace is accessible from:
- Home page "Browse Marketplace" button
- Direct link: `/marketplace`

## Implementation Notes

- **Frontend-only component**: As per `docs/Marketplace.md`, implementation details (pricing, matching, settlement) are TBD
- **Not payroll-specific**: Works with any EC token implementation
- **Demo component**: Showcases the EC primitive's potential beyond payroll use case
- All smart contract calls have TODO comments for future Web3 integration
