## ENS Integration

**Purpose**: Human-readable identity + income metadata.

### Reads Only

```solidity
interface IENSResolver {
  function addr(bytes32 node) external view returns (address);
  function text(bytes32 node, string calldata key) external view returns (string memory);
}
```

### Used For

- Resolve `zezinho.eth → address`
- Read:
  - `income:type`
  - `income:currency`

No ENS writes required on-chain for MVP.
