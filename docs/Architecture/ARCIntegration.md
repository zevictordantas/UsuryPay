# Arc / Circle Integration

**Purpose**: Chain-agnostic USDC routing and managed treasury.

- USDC transfers routed via Arc SDK
- SettlementManager only sees **final USDC arrival**
- No bridge contracts needed in your repo

---

## Circle Programmable Wallets (Optional Treasury Layer)

For managed treasury UX, employers can deposit into Circle programmable wallets:

- **Managed by platform** (your backend signs transactions)
- **Holds pooled USDC** from multiple employers
- **Integrates with CashflowNFT** as the `treasury` address

### Flow

1. Employer deposits USDC -> Circle wallet
2. CashflowNFT minted with `treasury = circleWalletAddress`
3. SettlementManager.settle() triggers payout from Circle wallet

---

## Terminology Summary

| Term | Context | Meaning |
|------|---------|---------|
| Borrower | Actor/UX | Employee who takes an advance |
| Treasury | Struct field | Address holding funds (EmployerTreasury, Circle wallet) |
| Beneficiary | Struct field | Original employee (for provenance) |
| NFT Owner | Runtime | Current holder who receives payouts |

This keeps "borrower" for user-facing language while using precise field names in contracts.
