## High-Level Architecture

![High-Level Architecture](./high-level-architecture-draw.png)

## CashflowNFT Contract

**Purpose**: Represents the _right to receive a future cashflow_.

### Interface

```solidity
interface ICashflowNFT {
  struct Cashflow {
    address treasury;           // Source of funds (EmployerTreasury, DAO treasury, or Circle wallet)
    address beneficiary;        // Original recipient of the cashflow (employee)
    address settlementManager;
    uint256 totalAmount;        // e.g. 2000 USDC
    uint256 startTime;
    uint256 endTime;
    address currency;           // USDC
    CashflowType cashflowType;  // PAYROLL | DIVIDEND
  }

  function mintCashflow(
    address recipient,
    Cashflow calldata data
  ) external returns (uint256 tokenId);

  function ownerOf(uint256 tokenId) external view returns (address);
}
```

### Notes

- **NFT = asset**, not debt
- Ownership = right to future payments
- Works for payroll _and_ dividends

### Field Definitions

| Field | Description |
|-------|-------------|
| `treasury` | The address that holds and disburses funds (e.g., EmployerTreasury contract, Circle programmable wallet) |
| `beneficiary` | The original earner of the cashflow (employee). Used for provenance even after NFT is sold |
| `ownerOf(tokenId)` | Current NFT holder - receives settlement payouts (may differ from beneficiary after sale) |

---

## SettlementManager Contract

**Purpose**: Owns funds, tracks accruals, and finalizes settlement.

### Interface

```solidity
interface ISettlementManager {
  function lockFunds(
    uint256 cashflowId,
    uint256 amount
  ) external;

  function recordAccrual(
    uint256 cashflowId,
    uint256 amount
  ) external;

  function settle(
    uint256 cashflowId
  ) external;
}
```

### Responsibilities

- Receives USDC from DAO treasury
- Receives accrual proofs from Yellow session
- Transfers USDC to current NFT owner
