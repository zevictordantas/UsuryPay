# Documentation Index

**This directory is the source of truth for the UsuryPay project.**

All implementation must match the specifications in these documents. To change behavior, update docs first.

## Core Documentation

### 1. [Primitive.md](./Primitive.md) - **START HERE**

The Expected Cashflow (EC) primitive is the core innovation of this project.

- What: Tokenization of expected (but not guaranteed) future cashflows
- How: ECVault (escrow) + ECToken (ERC-721 claim rights)
- Why: Enables factoring, invoice discounting, and salary advances on-chain

**Key Concepts:**
- Default handling with registry (not boolean flags)
- Pro-rata distribution on underfunding
- Linear accrual model (extensible)
- No off-chain dependencies

### 2. [UseCases/Payroll.md](./UseCases/Payroll.md) - **PRIMARY USE CASE**

Demonstration of EC primitive applied to payroll scenarios.

- Employees sell future salary for immediate cash (factoring, NOT loans)
- PayrollDApp buys EC tokens at risk-adjusted discounts
- Employer credit scoring determines offer quality
- ~30% APR equivalent (10x cheaper than payday loans)

**Architecture:**
- PayrollVault (extends IECVault) - Employer funds and mints EC tokens
- PayrollDApp - Buys EC tokens, manages risk assessment
- No backend/indexer required (all view functions)

### 3. EC Marketplace - **DEMO COMPONENT**

A simple marketplace frontend for buying and selling EC tokens.

- Purpose: Showcase the primitive's potential beyond payroll
- Status: Implementation details not yet defined
- Frontend-only component for demo purposes
- Allows secondary trading of EC tokens between users

### 4. [Integrations.md](./Integrations.md) - **OPTIONAL ENHANCEMENTS**

External protocol integrations (NOT required for MVP):

- **ENS** - Human-readable identity and metadata (low effort, high value)
- **Arc/Circle** - Chain-agnostic USDC routing (optional)
- **Yellow Network** - Off-chain micropayments (future work)

## Project Structure

```
docs/
├── README.md              # This file - documentation index
├── Primitive.md           # EC primitive specification (CORE)
├── UseCases/
│   └── Payroll.md         # Payroll dApp implementation (PRIMARY USE CASE)
├── Marketplace.md         # EC Marketplace (demo component - details TBD)
└── Integrations.md        # Optional external integrations
```

## Reading Order for New Contributors

1. **Primitive.md** - Understand the EC primitive first
2. **UseCases/Payroll.md** - See how it's applied to payroll
3. **Marketplace.md** - EC token secondary market (demo purposes)
4. **Integrations.md** - Learn about optional enhancements

## Key Principles

### Source of Truth
These documents are the absolute authority. Code must reflect docs.

### Minimalism First
- Simple > complex
- Linear accrual > custom schedules
- Pro-rata > priority tiers
- User-triggered > automatic

### Extensibility
- Implementations can override entitlement calculations
- Metadata fields for future enhancements
- Composable with other DeFi protocols

## Terminology

**Current (Correct) Terms:**
- **EC** (Expected Cashflow) - The primitive
- **ECVault** - Escrow contract
- **ECToken** - ERC-721 claim token
- **Factoring** - Selling future cashflows (not loans)
- **Default Registry** - On-chain default tracking

**Deprecated Terms (DO NOT USE):**
- ~~RBN~~ (Revenue-Backed Notes) - old name
- ~~CashflowNFT~~ - old interface name
- ~~SettlementManager~~ - old architecture
- ~~Loan/Credit Line~~ - incorrect framing (it's factoring)

## Implementation Status

- ✅ **Specification** - Complete (this documentation)
- 🚧 **Smart Contracts** - Not yet implemented
- 🚧 **Frontend** - Partially implemented (using mock data)
- ❌ **Testing** - No framework configured yet

## Questions?

For architectural questions, refer to:
- Primitive.md:322-442 (Design rationale)
- UseCases/Payroll.md:17-32 (What is/isn't a loan)
- Integrations.md:47-66 (Integration priority)

For implementation details, refer to:
- Primitive.md:91-280 (Solidity interfaces)
- UseCases/Payroll.md:81-139 (Contract components)
