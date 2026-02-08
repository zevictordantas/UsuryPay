## ENS Integration

**Purpose:** Human-readable identity and metadata storage.

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
