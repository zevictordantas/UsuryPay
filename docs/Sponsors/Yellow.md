# Yellow Network Integration

**Purpose:** Off-chain state channels for high-frequency micropayments.

**Status:** Future work (NOT in MVP scope)

## Vision

Platforms like Uber, Airbnb, Ifood, and Mercado Libre pay affiliates via micro-payments aggregated into monthly payouts. Through UsuryPay + Yellow:

1. Platforms open Yellow sessions for affiliates
2. Micropayments accrue off-chain (gasless, instant)
3. Sessions settle to on-chain ECVault
4. Affiliates tokenize accrued balance as EC tokens
5. Immediate liquidity via factoring

**Result:** Platforms function as neo-banks; affiliates get instant access to earned income.

## Architecture Decision

**Approach:** Yellow settles to on-chain ECVault (trustless custody).

```
Yellow Network (off-chain)
         │
         │ session close
         ▼
ECVault Smart Contract ◄── trustless escrow
         │
         ├── holds USDC
         ├── default detection
         └── ECToken minting
         │
         │ (optional) cross-chain
         ▼
Arc/CCTP ◄── USDC routing only
```

**Why NOT Circle wallets as custody:**
- Adds trust dependency on Circle infrastructure
- More complex architecture for similar outcome
- ECVault provides transparent, auditable escrow

**Why this works:**
- Yellow is chain-agnostic (settles to any EVM)
- ECVault remains trustless
- Arc adds cross-chain without changing trust model

## How Yellow Works

### Deposits

1. User deposits USDC to Yellow Custody Contract
2. State channel opens with Yellow Network
3. Balance appears in Yellow's off-chain ledger
4. Unlimited trades/transfers - instant & free

### Withdrawals

1. Request withdrawal to target blockchain
2. Yellow Network signs state update
3. State update submitted to Custody Contract
4. Assets released to wallet (or ECVault)

## Integration Points

```solidity
interface IYellowAdapter {
  /// @notice Start a Yellow session for micropayment accrual
  /// @param vault The ECVault to settle to
  /// @param tokenId The EC token ID (for tracking)
  function startSession(address vault, uint256 tokenId) external;

  /// @notice Submit accrued amount during session (off-chain update)
  function submitAccruedAmount(uint256 tokenId, uint256 amount) external;

  /// @notice Close session and settle to ECVault
  /// @return settledAmount Amount settled to vault
  function closeSession(uint256 tokenId) external returns (uint256 settledAmount);
}
```

### Settlement Flow

1. **Yellow session opens** for an EC token holder
2. **Off-chain accrual** during session (micropayments)
3. **Session closes** → settles to ECVault
4. **ECVault updates** escrow balance
5. **Token holder** can now claim or tokenize

## Use Cases

- Continuous earning sessions (gig economy)
- Subscription micropayments
- Off-chain balance updates with on-chain settlement
- Gasless micropayments during session

## Why NOT in MVP

- Requires off-chain session logic and attestations
- Adds execution risk for limited development time
- Core EC primitive doesn't require it
- Yellow testnet → Sepolia settlement works, but adds complexity

## Future Potential

- High-frequency cashflow sources (gig platforms)
- Instant liquidity for session participants
- Gas optimization for frequent payments
- B2B2C platform integrations

## Deployment Note

Yellow state channels can settle to any EVM chain:
- **MVP:** Settle to Sepolia (test Yellow integration)
- **Production:** Settle to Arc mainnet (cross-chain ready)

See [Integrations.md](../Integrations.md) for full deployment strategy.