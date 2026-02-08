# Arc / Circle Integration

**Purpose:** Cross-chain USDC routing (NOT custody, we couldnt use circle wallet as our vaults).

## Architecture Note

Arc is used for **cross-chain USDC movement only**. ECVault remains the trustless on-chain custody layer.

```
ECVault (on-chain) -----> Arc/CCTP -----> User on other chain
   |                         |
   | holds USDC              | routes USDC
   | (custody)               | (transport)
```

See [Integrations.md](../Integrations.md) for the full layered architecture.

### Usage

- USDC transfers routed via Arc SDK
- Contracts only see final USDC arrival
- No bridge contracts needed in your repo

**Use cases:**
- Cross-chain liquidity pooling
- Cashflows originating from any EVM chain
- Chain-abstracted user experience

**Benefits:**
- Single treasury on Arc serves all chains
- Simplified liquidity management
- Better capital efficiency

**Implementation:**
- Deploy core contracts on Arc Testnet
- Use Arc SDK for cross-chain USDC transfers
- SettlementManager/PayrollDApp receives USDC directly
