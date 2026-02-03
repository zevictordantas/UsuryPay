## Yellow Session Adapter (Off-chain Logic)

**Purpose**: Bridges Yellow off-chain state → on-chain settlement.

### Conceptual Interface

```solidity
interface IYellowAdapter {
  function startSession(uint256 cashflowId) external;

  function submitAccruedAmount(
    uint256 cashflowId,
    uint256 amount
  ) external;

  function closeSession(uint256 cashflowId) external;
}
```

### Notes

- Session logic is **off-chain**
- Only final net amounts touch the chain
- Matches Yellow's model perfectly
