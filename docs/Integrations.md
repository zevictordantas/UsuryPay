# Integration Architecture

**Philosophy:** ECVault is the trustless on-chain core. External integrations enhance capabilities without compromising trust assumptions.

## Layered Architecture

```
Currently WIP
┌─────────────────────────────────────────────────────────────┐
│                    Yellow Network                            │
│            (off-chain micropayment channels)                │
│                                                             │
│  - High-frequency gasless transactions                      │
│  - Session-based accrual (Uber, Airbnb, etc.)               │
│  - Settles to on-chain vault at session close               │
└───────────────────────────┬─────────────────────────────────┘
                            │ session settlement
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              ECVault Smart Contract                          │
│              (on-chain, trustless)                          │
│                                                             │
│  - Holds USDC escrow                                        │
│  - Default detection & registry                             │
│  - Pro-rata distribution                                    │
│  - ECToken minting                                          │
└───────────────────────────┬─────────────────────────────────┘
                            │ cross-chain claims/funding
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Arc / CCTP                                │
│              (cross-chain USDC routing)                     │
│                                                             │
│  - NOT custody (vault remains on-chain)                     │
│  - Burn-mint bridge for USDC                                │
│  - Enables multi-chain funding/claiming                     │
└─────────────────────────────────────────────────────────────┘
```

**Key Principle:** EC tokens and vaults stay on ONE chain. Only USDC moves cross-chain.

## Deployment Strategy

### Phase 1: MVP (Sepolia)

| Component | Status | Notes |
|-----------|--------|-------|
| ECVault + ECToken | Required | Core primitive on Sepolia |
| PayrollVault | Required | Primary use case |
| ENS | Optional | Low effort, high narrative value |
| Yellow | Simulated | Mock micropayment flows |
| Arc/CCTP | Deferred | Single-chain for MVP |

**Why Sepolia:**
- Standard Ethereum testnet with good tooling
- Yellow state channels can settle to any EVM chain
- CCTP available on Sepolia for future testing
- No dependency on Arc testnet integration


## Integration Priority

1. **Core EC Primitive** - ECVault + ECToken (REQUIRED)
2. **Payroll Use Case** - PayrollVault + PayrollDApp (REQUIRED)
3. **ENS** - Optional, low effort, high narrative value
4. **Arc/Circle** - Optional for MVP, enables cross-chain
5. **Yellow** - Future work, high value for B2B2C platforms

## Sponsor Integration Details

| Sponsor | Purpose | Doc |
|---------|---------|-----|
| ENS | Human-readable identity | [ENS.md](./Sponsors/ENS.md) |
| Arc/Circle | Cross-chain USDC | [Arc.md](./Sponsors/Arc.md) |
| Yellow | Off-chain micropayments | [Yellow.md](./Sponsors/Yellow.md) |
