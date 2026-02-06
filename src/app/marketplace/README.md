# EC Token Marketplace

The marketplace UI showcases secondary market trading of Expected Cashflow (EC) tokens.

## Features

### Browse/Buy View (`/marketplace`)
- Grid layout with sidebar filters and main listings area
- Responsive design (mobile-friendly)
- Filter and sorting capabilities
- Buy button with USDC approval flow
- Transaction status handling

### List View (`/marketplace/list`)
- Form to list EC tokens for sale
- Token approval flow (ERC-721/ERC-1155)
- Price input (USDC)
- List of user's current listings with cancel option

### Components

#### Browse/Buy Components (`/marketplace`)

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

#### List Components (`/marketplace/list`)

##### `ListECTokenForm.tsx`
- **Token Address Input**: Contract address of the EC token
- **Token ID Input**: Unique identifier of the token
- **Token Type Selector**: ERC-721 or ERC-1155
- **Price Input**: USDC amount (with decimal support)
- **Approval Flow**: Checks and requests approval before listing
- **List Button**: Triggers the listing flow with Web3 TODOs

##### `UserListings.tsx`
- Displays user's active listings
- Shows listing details (token ID, address, price, listing date)
- **Cancel Button**: Allows seller to cancel listing and retrieve token
- Loading states and empty states
- Mock data with 2 sample user listings

## TODOs for Web3 Integration

### Browse/Buy View

#### In `MarketplaceListings.tsx`
```typescript
// TODO: Web3 Integration - Replace with actual contract calls
// const listings = await marketplaceContract.read.getAllListings();
// Filter active listings and fetch token details from EC token contract
// Fetch vault info for risk assessment
```

#### In `ECTokenCard.tsx`
```typescript
// TODO: Web3 Integration - Replace with actual contract calls
// Step 1: Check USDC balance
// Step 2: Check/approve USDC allowance for marketplace
// Step 3: Execute buy(listingId) on marketplace contract
// Step 4: Listen for Bought event
```

### List View

#### In `ListECTokenForm.tsx`
```typescript
// TODO: Web3 Integration - Replace with actual contract calls
// Step 1: Validate token address
// Step 2: Check token ownership
// Step 3: Check/request token approval (approve() or setApprovalForAll())
// Step 4: Call list() on marketplace with token details and price
// Step 5: Listen for Listed event
```

#### In `UserListings.tsx`
```typescript
// TODO: Web3 Integration - Replace with actual contract calls
// Fetch all listings and filter by user address
// Cancel listing: call cancel(listingId) on marketplace contract
// Listen for Cancelled event
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
- Browse view: `/marketplace`
- List view: `/marketplace/list`
- Navigation between views via "List Token" button and "Back to Marketplace" link

## Implementation Notes

- **Mock data with Web3 TODOs**: All contract interactions have detailed TODO comments for integration
- **USDC-based pricing**: Hard-coded to USDC (6 decimals) as per docs/Marketplace.md
- **Escrow model**: Tokens are transferred to marketplace contract when listed
- **Atomic purchases**: USDC payment and token transfer happen in single transaction
- **Not payroll-specific**: Works with any EC token implementation (payroll, rental, subscription, etc.)
- **Two-view structure**: Browse/buy at `/marketplace`, list at `/marketplace/list`
- All smart contract calls have TODO comments for future Web3 integration

## Contract Functions Referenced

Based on `docs/Marketplace.md`, the marketplace contract should implement:

- `getAllListings()` - Returns all active listings
- `getListing(listingId)` - Returns specific listing details
- `list(tokenAddress, tokenId, tokenType, price)` - Creates new listing (requires token approval)
- `buy(listingId)` - Purchases listing (requires USDC approval)
- `cancel(listingId)` - Cancels listing (seller only)

Events:
- `Listed(listingId, seller, token, tokenId, price)`
- `Bought(listingId, buyer, seller, price)`
- `Cancelled(listingId, seller)`
