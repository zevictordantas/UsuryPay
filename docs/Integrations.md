# External Protocol Integrations

**Status:** Optional enhancements for the EC primitive and payroll dApp.

These integrations are NOT required for the core MVP functionality but can enhance the user experience and expand capabilities.

## ENS Integration

**Purpose:** Human-readable identity and metadata storage.

**Status:** Optional for MVP

### Usage

**Read-only integration:**
```solidity
interface IENSResolver {
  function addr(bytes32 node) external view returns (address);
  function text(bytes32 node, string calldata key) external view returns (string memory);
}
```

**Use cases:**
- Resolve `alice.eth` → address
- Store employer/employee metadata in ENS text records:
  - `credit:score`
  - `credit:tier`
  - `income:type`
  - `income:currency`

**Benefits:**
- Human-readable borrower/employer profiles
- Portable, composable credit signaling
- No additional smart contracts needed

**Implementation:**
- Frontend uses wagmi/viem for ENS resolution
- No on-chain ENS writes required for MVP
- Can be added incrementally

## Arc / Circle Integration

**Purpose:** Chain-agnostic USDC routing.

**Status:** Optional for MVP (can deploy on single chain initially)

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

## Yellow Network Integration

**Purpose:** Off-chain state channels for high-frequency micropayments.

**Status:** Future work (NOT in MVP scope)

### Conceptual Architecture

```solidity
interface IYellowAdapter {
  function startSession(uint256 cashflowId) external;
  function submitAccruedAmount(uint256 cashflowId, uint256 amount) external;
  function closeSession(uint256 cashflowId) external;
}
```

### Use Cases

- Continuous earning/spending sessions (payroll, subscriptions)
- Off-chain balance updates with on-chain settlement
- Gasless micropayments during session

### Integration Points

1. **Yellow session opens** for an EC token
2. **Off-chain accrual** updates during session
3. **On-chain settlement** at session end
4. Settled amounts feed into EC vault

**Why not in MVP:**
- Requires off-chain session logic and attestations
- Adds execution risk for limited development time
- Core EC primitive doesn't require it

**Future potential:**
- High-frequency cashflow sources
- Instant liquidity for session participants
- Gas optimization for frequent payments

## Integration Priority

For a functional MVP, focus on:

1. ✅ **Core EC Primitive** - ECVault + ECToken (REQUIRED)
2. ✅ **Payroll Use Case** - PayrollVault + PayrollDApp (REQUIRED)
3. 🟡 **ENS** - Optional, low effort, high narrative value
4. 🟡 **Arc/Circle** - Optional, enables cross-chain but adds complexity
5. ⚪ **Yellow** - Future work, high value but high complexity

## Deployment Recommendations

### MVP (Minimal Viable)
- Single chain deployment (e.g., Base, Optimism, or Arc Testnet)
- USDC as sole payment token
- Direct on-chain interactions (no ENS required)
- Manual claiming (no automation needed)

### Enhanced MVP
- Deploy on Arc Testnet for USDC liquidity
- Add ENS resolution for user profiles
- Keep Yellow integration as documented future work

### Production
- Multi-chain deployment via Arc
- ENS integration for credit identity
- Yellow sessions for high-frequency cashflows
- Automated keepers for claims and settlements
