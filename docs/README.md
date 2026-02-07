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

## Application Structure

The frontend is organized into two main applications:

- **UsuryPay** - Payroll dApp where employers mint EC tokens and employees sell them for cash
  - Routes: `/employer`, `/employee`
  - Core payroll factoring functionality

- **UsuryMarket** - Secondary marketplace for trading EC tokens
  - Route: `/usurer`
  - Investors (called "usuriers" in UI) buy EC tokens at risk-adjusted discounts
  - Demonstrates the primitive beyond payroll

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
- **Usurer** - UI term for investors/marketplace participants (docs use "investor" or "buyer")

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

## Local Dev & Wagmi Hooks

Minimal local flow (see `package.json` scripts):

1. Run local chain: `pnpm anvil`
2. Deploy contracts + write `deployments.json`: `pnpm deploy:local`
3. Generate wagmi hooks into `src/generated.ts`: `pnpm wagmi:generate` (or `pnpm wagmi:watch`)
4. Start app: `pnpm dev`

### Wagmi Hook Development Rules

**RULE**: Always use wagmi-generated hooks directly. Never create custom wrapper hooks.

**Implementation**:

- Import hooks directly from `@/generated`
- For dynamic addresses: `useReadContractName({ address: dynamicAddress, args })`
- For static addresses: `useReadContractName({ args })`
- Never create custom wrappers around wagmi functionality

**Exceptions**: Complex multi-step business logic only.

Local deploy also creates `MockUSDC` and a `MockECToken` (one token minted to the deployer) for marketplace testing.

## Environment-Based Chains

Use `NEXT_PUBLIC_ENV` to choose the environment and default chain set:

- `dev` (default): `anvil`
- `stage`: `sepolia`
- `prod`: `arcTestnet`

Override per environment with comma-separated chain names:

- `NEXT_PUBLIC_DEV_CHAINS`
- `NEXT_PUBLIC_STAGE_CHAINS`
- `NEXT_PUBLIC_PROD_CHAINS`

Example: `NEXT_PUBLIC_DEV_CHAINS=anvil,sepolia`

## Questions?

For architectural questions, refer to:

- Primitive.md:322-442 (Design rationale)
- UseCases/Payroll.md:17-32 (What is/isn't a loan)
- Integrations.md:47-66 (Integration priority)

For implementation details, refer to:

- Primitive.md:91-280 (Solidity interfaces)
- UseCases/Payroll.md:81-139 (Contract components)
