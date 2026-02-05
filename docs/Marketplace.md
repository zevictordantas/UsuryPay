# EC Marketplace

**Status:** Demo component - implementation details not yet defined

## Purpose

A simple marketplace frontend for buying and selling EC tokens between users.

**Why it exists:**
- Showcases the EC primitive's potential beyond the payroll use case
- Demonstrates secondary market trading of tokenized cashflows
- Keeps focus on the primitive rather than deep payroll implementation

## Overview

The marketplace allows users to:
- List EC tokens for sale (any EC token, not just payroll)
- Browse available EC tokens
- Purchase EC tokens from other users
- View token details (vault info, entitlement schedule, default history)

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

**Note:** This marketplace is primarily for demonstration purposes. The core value is the EC primitive itself, which enables any application to create and trade tokenized cashflows.
