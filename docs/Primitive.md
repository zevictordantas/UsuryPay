# Expected Cashflow (EC) Primitive

**The EC primitive is the core innovation of this project.** It enables tokenization and trading of future payment streams that could carry risk.

Unlike yield-bearing assets with guaranteed returns (e.g., Pendle), EC tokens represent _expected_ but _not guaranteed_ cashflows.

## Core Use Cases

- Micro-payments for affiliates (B2B2C like uber, ifood, airbnb)
- Subscription revenues (B2B like stripe)
- Salary payments (employer → employee)
- Rental agreements (tenant → landlord)
- Installment payments
- Stock dividends and fixed-rate instruments
- Commodity enterprise contractual offtake

## Architecture

The primitive works with at least two components:

1. **ECVaults** — escrow contract where payer deposits funds. There can be another ECVault, as third component, where payments received by the ECToken remains, could be a liquidity pool, even to ease discount of future cash flows.
2. **ECToken** — ERC-1155 representing the right to claim from the vault. For the MVP we wont allow fractionalization, but you could tokenize the whole cashflow and an sell only a fraction of it, leaving a bit for yourself and this would improve risk of default.

```
┌─────────────────┐
│ EC Token (1155) │──┐
└─────────────────┘  │
                     │ references
┌─────────────────┐  │
│ EC Token (1155) │──┤
└─────────────────┘  │
                     ├──> ┌──────────────┐
┌─────────────────┐  │    │   EC Vault   │
│ EC Token (1155) │──┤    │              │
└─────────────────┘  │    │ ┌──────────┐ │
                     └───>│ │ Escrow   │ │
                          │ │ Balance  │ │
                          │ └──────────┘ │
                          │              │
                          │ ┌──────────┐ │
                          │ │ Default  │ │           ┌─────────┐
                          │ │ Registry │ │<--funds---│  Payer  │
                          │ └──────────┘ │           └─────────┘
                          └──────────────┘
```

## Key Concepts

### Entitlement & Claims

- **entitled(t)** — total amount the token holder has _become entitled to_ by time `t`
- **claimed** — amount already withdrawn by the holder
- **claimable** — `entitled(t) - claimed` (what holder can ask for)

### Vault Accounting

- **requiredEscrow** — sum of `claimable` across all tokens of this vault
- **escrowed** — `min(vault.balance, requiredEscrow)`
- **effectiveClaimable** — `min(claimable, fundsAvailable)` for a given token

### Default Detection

A **shortfall** occurs when `effectiveClaimable < claimable`.

Defaults are checked:

- When token holder attempts to claim
- When vault is funded (if balance insufficient for current obligations)
- Optionally, via keeper/permissionless checks

### Default Registry

Records default events with:

- Timestamp
- Shortfall amount
- Optional amendment/settlement info (for future reconciliation)

**Not a boolean flag** — can have multiple defaults and partial settlements over time.

## Design Principles (MVP)

### Simplicity First

- Linear accrual model (like Pendle's rate-per-second)
- No off-chain attestations or legal enforcement
- No token splitting (transfer whole token only)

### Flexibility for Future

- Implementations can override entitlement calculations
- Metadata fields for risk scores, legal docs, formulas
- Extensible default reconciliation hooks
- Minting authorization per implementation

### User-Triggered Mechanics

- Claims trigger default checks
- Funding triggers solvency checks
- No automatic distributions

## Solidity Interfaces

### IECVault

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title IECVault
 * @notice Escrow vault for expected cashflow payments
 */
interface IECVault {
    struct DefaultEvent {
        uint256 timestamp;
        uint256 shortfall;
        bytes settlementData;
    }

    struct VaultInfo {
        address asset;
        uint256 startTime;
        uint256 endTime;
        address payer;
        bytes metadata;
    }

    // Events
    event Funded(address indexed payer, uint256 amount, uint256 timestamp);
    event Claimed(uint256 indexed tokenId, address indexed claimer, uint256 amount, uint256 timestamp);
    event DefaultDetected(uint256 indexed tokenId, uint256 shortfall, uint256 timestamp);
    event DefaultAmended(uint256 indexed tokenId, uint256 defaultIndex, bytes settlementData);

    // View Functions
    function getVaultInfo() external view returns (VaultInfo memory);
    function getBalance() external view returns (uint256);
    function getRequiredEscrow() external view returns (uint256);
    function getDefaults(uint256 tokenId) external view returns (DefaultEvent[] memory);
    function checkSolvency() external view returns (bool isSolvent, uint256 shortfall);

    // State-Changing Functions
    /// @notice Fund vault with ERC20 asset (requires prior approval)
    function fund(uint256 amount) external;
    function claim(uint256 tokenId, uint256 amount) external returns (uint256 claimed, bool defaultOccurred);
    /// @notice Amend a recorded default (callable by payer or governance)
    function amendDefault(uint256 tokenId, uint256 defaultIndex, bytes calldata settlementData) external;
    /// @notice Hook called when default is detected (internal or by keeper)
    function onDefaultDetected(uint256 tokenId, uint256 shortfall) external;
}
```

### IECToken

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

/**
 * @title IECToken
 * @notice Expected Cashflow token (ERC-1155)
 */
interface IECToken is IERC1155 {
    struct PaymentSchedule {
        uint256 totalAmount;
        uint256 startTime;
        uint256 endTime;
        uint256 ratePerSecond;
        bytes customParams;
    }

    struct TokenInfo {
        address vault;
        PaymentSchedule schedule;
        uint256 claimed;
        bytes metadata;
    }

    // Events
    event TokenMinted(uint256 indexed tokenId, address indexed vault, address indexed recipient);
    event Claimed(uint256 indexed tokenId, uint256 amount, uint256 newClaimedTotal);

    // View Functions
    function getTokenInfo(uint256 tokenId) external view returns (TokenInfo memory);
    function calculateEntitled(uint256 tokenId, uint256 timestamp) external view returns (uint256 entitled);
    function getClaimable(uint256 tokenId) external view returns (uint256 claimable);
    function getEffectiveClaimable(uint256 tokenId) external view returns (uint256 effectiveClaimable, uint256 shortfall);
    function getVault(uint256 tokenId) external view returns (address vault);
    /// @notice Get all token IDs owned by an address (for enumeration)
    function tokensOfOwner(address owner) external view returns (uint256[] memory tokenIds);

    // State-Changing Functions
    function mint(
        address recipient,
        address vault,
        PaymentSchedule calldata schedule,
        bytes calldata metadata
    ) external returns (uint256 tokenId);

    function claim(uint256 tokenId, uint256 amount) external;
}
```

## Entitlement Calculation

**Default (Linear) Model:**

```
entitled(t) = min(
    ratePerSecond × (t - startTime),
    totalAmount
)

where:
    ratePerSecond = totalAmount / (endTime - startTime)
```

**Why linear?**

- Simple to understand and price
- Matches most real-world payment schedules (salary, rent)
- Gas-efficient calculation

**Extensibility:**
Implementations can override `calculateEntitled()` for:

- Step functions (discrete monthly payments)
- Irregular schedules (stored in `customParams`)
- Conditional logic (milestones, KPIs)

## Default Handling Flow

```
User calls claim(tokenId, amount)
    │
    ├─> Calculate claimable = entitled(now) - claimed
    │
    ├─> Check vault balance
    │
    ├─> If balance < claimable:
    │       ├─> Create DefaultEvent
    │       ├─> Emit DefaultDetected
    │       ├─> Call onDefaultDetected() hook (if implemented)
    │       └─> Transfer what's available (effectiveClaimable)
    │
    └─> Update claimed amount
```

## Pro-Rata Distribution (MVP)

When vault has insufficient funds:

```
Token A: claimable = 100
Token B: claimable = 200
Vault balance: 150

effectiveClaimable_A = 100 × (150 / 300) = 50
effectiveClaimable_B = 200 × (150 / 300) = 100
```

**Alternative approaches** (for future consideration):

- First-come-first-served
- Priority tiers (senior/junior tokens)
- Waterfall distribution

## Comparison to Existing DeFi Primitives

| Feature              | Pendle (SY/PT/YT)                     | Expected Cashflow                         |
| -------------------- | ------------------------------------- | ----------------------------------------- |
| **Risk**             | No default risk (guaranteed yield)    | Default risk (expected cashflow)          |
| **Underlying**       | Yield-bearing assets (aTokens, stETH) | Escrow vault with payer obligation        |
| **Splitting**        | PT (Principal) + YT (Yield)           | Single EC token (no split in MVP)         |
| **Accrual**          | Based on underlying APY               | Time-based schedule (default: linear)     |
| **Default Handling** | N/A (no defaults)                     | Default registry + events                 |
| **Maturity**         | Fixed maturity date                   | End time (but claims accrue continuously) |

**Key Insight:** Pendle wraps assets with _guaranteed_ returns. EC tokenizes _promises_ to pay — fundamentally higher risk but broader application (any recurring payment).

## Security Considerations

### Reentrancy

- Claims transfer tokens — use ReentrancyGuard or checks-effects-interactions
- Especially critical if supporting ETH (not just ERC20)

### Front-Running

- Pro-rata system creates race conditions on claims when vault underfunded
- Future: Consider commitment schemes or priority queues

### Access Control

- Minting authorization critical — prevents token inflation
- Amendment rights — who can call amendDefault()?

### Integer Overflow

- Use Solidity 0.8+ for automatic overflow checks
- Careful with rate calculations (totalAmount / duration)

## Integration Example

```solidity
// Example: Company payroll system

contract SalaryVault is IECVault {
    constructor(
        address _usdcToken,
        uint256 _startTime,
        uint256 _endTime
    ) {
        // Initialize vault for 1-year payroll period
    }
}

contract SalaryToken is IECToken {
    function mint(
        address employee,
        uint256 vaultId,
        uint256 annualSalary
    ) external onlyHR returns (uint256 tokenId) {
        PaymentSchedule memory schedule = PaymentSchedule({
            totalAmount: annualSalary,
            startTime: vault.startTime,
            endTime: vault.endTime,
            ratePerSecond: annualSalary / 365 days,
            customParams: ""
        });

        return _mint(employee, vaultId, schedule, "");
    }
}

// Employee can now:
// 1. Sell token to get upfront liquidity
// 2. Claim pro-rata as time passes
// 3. See default history if company misses payments
```

## Why This Design?

### Complexity We Can't Avoid

1. **Default Registry (not boolean)**
   - _Why?_ Defaults can happen multiple times, be partially settled, amended
   - _Alternative?_ Single boolean loses too much information for trading/pricing

2. **Two-Component Architecture (Vault + Token)**
   - _Why?_ Separation of escrow logic from entitlement logic
   - _Alternative?_ Monolithic contract would be harder to extend and audit

3. **Time-Based Calculations**
   - _Why?_ Cashflows are inherently time-dependent
   - _Alternative?_ None - this is core to the primitive

### Simplicity We Achieved

- ✅ Linear accrual by default (no complex schedules in MVP)
- ✅ Pro-rata distribution (no priority mechanisms)
- ✅ No automatic distributions (user-triggered only)
- ✅ No token splitting (whole token transfer only via ERC-1155)
- ✅ No off-chain dependencies
- ✅ Minimal governance (minting auth only)

# Cross Chain Implementation

Details on how to implement cross chain can be found in [CrossChainPrimitive.md](./CrossChainPrimitive.md)
