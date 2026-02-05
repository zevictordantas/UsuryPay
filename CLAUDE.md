# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Please read AGENTS.md for detailed guidelines.** Consider AGENTS.md the comprehensive reference.

## Project Overview

UsuryPay demonstrates the **Expected Cashflow (EC) primitive** - a DeFi primitive for tokenizing future payment streams with default risk. The payroll dApp enables employees to sell future salary for immediate liquidity (factoring, NOT loans).

**Three-actor model:**
- **Employers** - Fund vault, mint EC tokens for employees
- **Employees** - Receive EC tokens, can sell them for immediate cash
- **PayrollDApp** - Buys EC tokens at discount, manages risk assessment

## Development Commands

```bash
pnpm install          # Install dependencies
pnpm dev              # Dev server (localhost:3000)
pnpm build            # Production build
pnpm lint             # Run ESLint
pnpm format           # Format with Prettier
pnpm format:check     # Check formatting

# Smart contracts (Foundry)
forge build           # Build contracts
forge test            # Run contract tests
forge fmt             # Format Solidity
```

## Architecture

**Tech Stack:** Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4 + Wagmi/Viem

**Directory Structure:**
```
src/
├── app/                    # Next.js App Router
│   ├── components/         # Shared components (Header, Providers)
│   ├── employee/           # Employee dashboard route
│   ├── employer/           # Employer dashboard route
│   ├── usurer/             # Investor dashboard route
│   └── WagmiConfig/        # Web3 configuration
└── contracts/              # Solidity contracts (Foundry)

docs/                       # SOURCE OF TRUTH
├── README.md               # Documentation index
├── Primitive.md            # EC primitive specification (CORE)
├── UseCases/Payroll.md     # Payroll implementation
└── Integrations.md         # Optional integrations
```

## Key Terminology

**Use these terms:**
- **EC** (Expected Cashflow) - The primitive
- **ECVault** - Escrow contract where payer deposits funds
- **ECToken** - ERC-721 representing claim rights
- **Factoring** - Selling future cashflows (what we do)

**DO NOT use these deprecated terms:**
- ~~RBN~~ (Revenue-Backed Notes)
- ~~CashflowNFT~~
- ~~SettlementManager~~
- ~~Loan/Credit Line~~ (incorrect - it's asset sale)

## Key Development Principles

**Source of Truth:** `docs/` is the absolute authority. Read `docs/README.md` first, then `docs/Primitive.md`.

**Minimalism:** Short code > long code. Fewer comments = faster reading. Less code = fewer bugs.

## Web3 Integration

- Wagmi hooks for wallet connections and contract calls
- Viem for typed contract interactions
- React Query for blockchain data caching
- Reown AppKit for wallet modal (project ID in `.env.local`)
- Currently configured for Arc Testnet

## Current State

- Frontend UI implemented with **mock data** - TODOs exist for Web3 integration
- Smart contracts scaffolded but **not yet implemented**
- No test framework configured (Vitest + Playwright recommended)
- Protocol integrations (ENS, Arc, Yellow) are optional enhancements
