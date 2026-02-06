# EC Marketplace

**Purpose:** Minimal single-chain marketplace to demo trading of EC tokens.
**Currency:** USDC (hard-coded at deployment).
**Scope:** Single EVM chain, on-chain escrow, fixed-price whole-token sales only (ERC-721 and ERC-1155). No orderbook, no fractionalization, no fees, no off-chain matching.

---

## High-level design

- Sellers **escrow** EC tokens in a single `Marketplace` contract.
- Listings are stored on-chain (small metadata record).
- Buyers purchase by calling `buy(listingId)`; the contract pulls USDC from buyer and transfers the EC token to buyer in the same transaction (atomic).
- Frontend provides two views: `List EC` and `Browse & Buy`.
- No backend required.

---

# Simple Flow definition:

**Status:** Demo component - implementation details not yet defined

## Purpose

A secondary marketplace frontend for buying and selling EC tokens between users.

**Why it exists:**
- Showcases the EC primitive's potential beyond the payroll use case
- Demonstrates secondary market trading of tokenized cashflows
- Keeps focus on the primitive rather than deep payroll implementation

---

**UI Context:**
- Accessed via the "Usurer" role in the frontend (route: `/usurer`)
- "Usurer" is the UI term for marketplace participants who buy and trade EC tokens
- Investors access the marketplace to purchase EC tokens at risk-adjusted discounts

## Overview


The marketplace allows users to:

- List EC tokens for sale (any EC token, not just payroll)
- Browse available EC tokens
- Purchase EC tokens from other users
- View token details (vault info, entitlement schedule, default history)

---

## On-chain: Contract responsibilities

**Core responsibilities**

- Accept and hold escrowed EC tokens (implement ERC callback receivers).
- Create / cancel listings.
- Execute atomic purchases: pull USDC from buyer → transfer USDC to seller → transfer EC token to buyer → mark sold.
- Expose view functions for UI to fetch listings.

**Payment token**

- USDC address is an immutable parameter set at deployment (hard-coded for the environment).

---

## Data model (on-chain)

```solidity
enum TokenType { ERC721, ERC1155 }

struct Listing {
  uint256 id;
  address tokenAddress;
  uint256 tokenId;
  TokenType tokenType;
  address seller;
  uint256 price;          // in USDC smallest unit (usually 6 decimals)
  bool active;
}
```

- `listingId` => auto incremented uint256.
- `price` stored as `uint256` (USDC smallest unit; frontend must format/parse accordingly).

---

## Minimal contract interface (essential functions & events)

```solidity
// Events
event Listed(uint256 indexed listingId, address indexed seller, address token, uint256 tokenId, uint256 price);
event Cancelled(uint256 indexed listingId, address indexed seller);
event Bought(uint256 indexed listingId, address indexed buyer, address indexed seller, uint256 price);

// Core functions
function list(address token, uint256 tokenId, TokenType tokenType, uint256 price) external returns (uint256 listingId);
function cancel(uint256 listingId) external;
function buy(uint256 listingId) external; // buys with USDC.transferFrom(msg.sender, seller, price)

// Views
function getListing(uint256 listingId) external view returns (Listing memory);
function getAllListings() external view returns (Listing[] memory); // acceptable for demo
```

**ERC callbacks**

- `onERC721Received` and `onERC1155Received` must be implemented so `safeTransferFrom(seller, marketplace, tokenId)` succeeds when listing.

---

## UX / Frontend flows

### 1. List EC (seller)

1. Seller navigates to _List EC_.
2. Seller approves the marketplace contract to transfer the EC token:
   - ERC-721: `approve(marketplace, tokenId)` or `setApprovalForAll`.
   - ERC-1155: `setApprovalForAll(marketplace, true)`.

3. Seller calls `list(tokenAddress, tokenId, tokenType, price)`.
   - Frontend should format `price` to USDC smallest unit.

4. Backend: none. Listing appears via `getAllListings()`.

### 2. Browse & Buy (buyer)

1. Buyer browses listings via `getAllListings()` / `getListing`.
2. Buyer ensures they have USDC on chain and `approve(marketplace, price)` for USDC.
3. Buyer calls `buy(listingId)`.
   - Marketplace contract invokes `USDC.transferFrom(buyer, seller, price)` then transfers token to buyer.

4. UI updates on `Bought` event.

**Notes**

- USDC decimals: frontend must handle decimals for display (commonly 6).
- Approvals: buyer must approve USDC; seller must approve token before listing (or transfer directly if listing requires prior transfer into contract).

---

## Implementation details & constraints

- **Escrow model:** seller must `safeTransferFrom(seller → marketplace, tokenId)` (or the `list()` function can require that marketplace already owns token). Both approaches acceptable; prefer requiring token already transferred for simplicity.
- **Atomic purchase:** perform `USDC.transferFrom(buyer, seller, price)` and token transfer within a single transaction to ensure atomicity.
- **ERC-1155 handling:** only whole-token sales (amount = 1). Do not support fungible amounts.
- **USDC token behavior:** treat USDC as standard ERC-20. Be aware of possible non-compliant tokens; for demo use official USDC.
- **No royalties/metadata handling:** royalties are out of scope; do not attempt to call separate royalty contracts.
- **Gas:** reading `getAllListings()` is non-scalable — acceptable for demo.

---

## Security considerations (better to write code comments than to introduce complexity in the code)

- Reentrancy guard on `buy()` (use `nonReentrant`).
- Validate listing exists and `active == true`.
- Validate `msg.sender` has approved USDC for `transferFrom` and has sufficient balance (the `transferFrom` call will revert on failure).
- Ensure marketplace currently owns the token before `buy()` (custody invariant).
- Consume listing (set `active = false`) before external calls where possible, or use checks-effects-interactions pattern.
- Only seller can `cancel`.
- Protect against replay: listing is single-use (once sold or cancelled it cannot be reused).
- Emit clear events (`Listed`, `Cancelled`, `Bought`) for frontend sync.
- Implement `onERC721Received` and `onERC1155Received` and validate sender in those callbacks if using auto-listing behavior.

---

## Invariants (must always hold)

1. **Custody:** While `listing.active == true`, marketplace contract is the ERC token owner.
2. **Exclusivity:** Each `listingId` is consumable once; after `Bought` or `Cancelled`, `active == false`.
3. **Atomic Purchase:** `buy()` either completes payment to seller and transfers token to buyer, or reverts; no partial states.
4. **Authorization:** Only the `seller` recorded in the listing may cancel it.
5. **Immutability:** `tokenAddress`, `tokenId`, `tokenType`, and `price` for a listing cannot be changed after creation.
6. **Finality:** After successful `buy()`, listing cannot be reused and token is in buyer custody.

---

## Deployment & configuration

- Deploy `Marketplace` with constructor param `address USDC`.
- For local/hackathon, set `USDC` to a testnet/devnet USDC mock.
- Ensure frontend uses same USDC address and correct decimals (6).

---

## Frontend minimal surface (data & components)

- **API (on-chain):**
  - `getAllListings()` → populate listings grid
  - `getListing(listingId)` → detail pane
  - `list(...)` → list flow
  - `cancel(listingId)` → cancel action
  - `buy(listingId)` → buy action

- **Frontend Views**
  - Marketplace: Aims for buyers who will send USDC to receive EC tokens
  - Marketplace Listing: Aims for sellers who wants to list their EC tokens and whish to recieve USDC in exchange

- **UX notes:** Show USDC price, prompt for approvals where needed, show transaction pending / confirmed state via events.

---

## Non-goals (explicit, do not implement)

- Cross-chain payments or bridging. (the marketplace is single-chain)
- Orderbook, auctions, offers, matching logic.
- Fractionalization or partial purchases.
- Royalties or advanced fee routing.
- Backend indexing or complex off-chain services.

---

## Minimal Implementaiton

1. Write and compile `Marketplace.sol` with tests.
2. Deploy to testnet / local node
3. Build two frontend views and wire contract interactions
4. Test flows with real wallets on testnet and smoke test events

---
## Key Points

- **Frontend-only component** - Simple UI for demo purposes
- **Not payroll-specific** - Works with any EC token implementation
- **Implementation details TBD** - Pricing, matching, settlement mechanics to be defined later
- **Optional** - Core primitive and payroll use case are sufficient for MVP

## Architecture (Conceptual)

```
User A (EC Token Owner)
    │
    └─> Lists EC token for sale
            │
            ▼
    ┌───────────────────┐
    │  EC Marketplace   │  (Frontend)
    │  • Browse tokens  │
    │  • View details   │
    │  • Make offers    │
    └─────────┬─────────┘
              │
              ▼
    User B purchases token
            │
            └─> EC token ownership transfers
```

## Implementation Notes

<!-- Implementation details are not currently defined -->

**To be determined:**
- On-chain orderbook vs. off-chain matching
- Pricing mechanism (fixed price, auction, offers)
- Settlement flow (atomic swap vs. escrow)
- Fee structure (if any)

**Frontend considerations:**
- Display token entitlement schedules
- Show vault credit scores / default history
- Filter by token type, amount, duration
- Risk indicators for buyers

## Related Documentation

- See [Primitive.md](./Primitive.md) for EC token interfaces
- See [UseCases/Payroll.md](./UseCases/Payroll.md) for payroll-specific token trading

---

## Summary

This document defines a compact, single-chain USDC-priced marketplace for whole EC tokens. Keep the implementation minimal and robust: escrow the token in contract custody, accept USDC payments via `transferFrom`, and ensure atomic buy semantics and simple, auditable invariants. The final product is backend-free, demonstrative, and focused on proving the EC primitive behaves as a tradable asset.

**Important to remember:** This marketplace is primarily for demonstration purposes. The core value is the EC primitive itself, which enables any application to create and trade tokenized cashflows.
**Note:** This marketplace is primarily for demonstration purposes. The core value is the EC primitive itself, which enables any application to create and trade tokenized cashflows.

