# UsuryPay - Agent Development Guide

## Philosophy

**Minimalism优先**: Short code > long code. Fewer comments = faster reading. Simplicity > complexity. Less code = fewer bugs.

**Source of Truth (SoT) 优先**: docs/ directory is absolute authority. Implementation must reflect SoT. Changes to SoT required? Update SoT first and inform user explicitly. Work outside SoT? Plan integration via SoT before implementation. SoT must be split into human-readable docs, not immense monoliths. Implementation contradicting SoT: FORBIDDEN.

## Project Overview

Next.js payroll dApp demonstrating the Expected Cashflow (EC) primitive - a DeFi primitive for tokenizing future payment streams with default risk. The payroll use case enables employees to sell future salary for immediate liquidity (factoring, NOT loans). React 19 + TypeScript + Tailwind + Web3 (Wagmi/Viem).

## Development Commands

```bash
pnpm install          # Install dependencies
pnpm add <package>    # Add dependency
pnpm dev              # Dev server (localhost:3000)
pnpm build            # Build for production
pnpm lint             # Run ESLint
# Note: No test framework yet - consider Vitest + Playwright

# Smart contract development (Foundry)
forge build    # Build contracts
forge test     # Run tests
forge fmt      # Format contracts
```

## ⚠️ CRITICAL: Never Hardcode Contract Addresses

**Problem**: Contract addresses change frequently in development and vary by chain/environment.

**Why This Matters**:
- **Local (Anvil)**: Addresses change on EVERY redeploy (multiple times per day)
- **Testnet/Mainnet**: Addresses change on redeployments or upgrades
- **Multi-chain**: Same contract = different address per chain
- **Environments**: Dev/staging/prod may have different addresses

**❌ NEVER Do This**:
```typescript
// WRONG - Hardcoded address
const TOKEN_ADDRESS = '0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9';

// WRONG - Manually typed addresses
export const addresses = {
  31337: {
    mockECToken: '0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9',
  }
};
```

**✅ ALWAYS Do This**:
```typescript
// RIGHT - Import from deployment artifact
import deployments from '../../deployments.json';

export const addresses = {
  [ANVIL_CHAIN_ID]: {
    mockECToken: deployments.MockECToken as Address,
  }
};
```

**Foundry Best Practices**:
- Track `contracts/broadcast/` for production/testnet (deployment history)
- Only ignore `contracts/broadcast/*/31337/` (local anvil)
- Use broadcast JSON files as deployment source of truth
- See: https://book.getfoundry.sh/tutorials/best-practices#scripts

**Deployment Workflow**:
1. Deploy: `pnpm deploy:local` → Updates `deployments.json`
2. Generate: `pnpm wagmi:generate` → Generates hooks with new addresses
3. Frontend: Imports from `deployments.json` (auto-synced)

**If You Must Reference Addresses**:
- Smart contracts: Use constructor injection or setter functions
- Frontend: Import from `deployments.json` or use wagmi-generated hooks
- Scripts: Read from `broadcast/<script>/<chainId>/run-latest.json`

---

## Code Style Guidelines

### File Structure & Organization

```
src/
├── app/              # Next.js App Router pages
│   ├── globals.css  # Global styles with Tailwind
│   ├── layout.tsx   # Root layout
│   └── page.tsx     # Home page
├── contracts/       # Smart contract files (currently empty)
└── components/      # React components (to be added)
```

### Imports

- Use absolute imports with `@/` prefix for internal modules
- External imports: React hooks first, then libraries, then local components
- Group imports in this order: React → Third-party → Internal → Types

```typescript
// Correct order
import { useState, useEffect } from 'react';
import { useAccount, useConnect } from 'wagmi';
import { Button } from '@/components/ui';
import type { CashflowNFT } from '@/types';
```

### TypeScript Configuration

- Strict mode enabled
- Path alias: `@/*` maps to `./src/*`
- Target: ES2017, Module: esnext
- JSX: react-jsx

### Component Patterns

- Use function components with React 19 features
- Prefer explicit return types for complex components
- Use TypeScript interfaces for props
- Leverage React 19's automatic client-side features

### Styling with Tailwind CSS v4

- Use utility classes for styling
- Leverage the inline theme configuration in globals.css
- Custom CSS variables: `--font-sans`, `--font-mono`
- Color scheme: Light mode only (`only light`)

### Naming Conventions

- **Files**: PascalCase for components (e.g., `CashflowCard.tsx`)
- **Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Interfaces/Types**: PascalCase with descriptive names
- **Functions**: camelCase, verb-based for actions

### Web3 Integration (Wagmi + Viem)

- Use Wagmi hooks for wallet connections and blockchain interactions
- Viem for typed contract interactions
- React Query for server state management and caching
- Handle loading/error states explicitly

### Wagmi Hook Usage Rule

**RULE**: **Always use wagmi-generated hooks directly. Never create custom wrapper hooks around wagmi functionality.**

**Implementation**:

- Import hooks directly from `@/generated`
- For dynamic addresses: `useReadContractName({ address: dynamicAddress, args })`
- For static addresses: `useReadContractName({ args })`
- Use wagmi CLI (`pnpm wagmi:generate`) to regenerate hooks after contract changes

**Exceptions** (only for complex business logic):

- Multi-step operations requiring custom state management
- Cross-contract interactions with combined logic
- Hooks that add significant processing beyond simple contract calls

**Rationale**: wagmi codegen provides optimal, type-safe hooks. Custom wrappers violate minimalism principle and create maintenance burden. Generated hooks handle both static and dynamic address patterns correctly.

### Error Handling

- Use try-catch for async operations
- Provide user-friendly error messages
- Log errors appropriately for debugging
- Handle Web3-specific errors (wallet not connected, transaction failed)

### Code Quality

- ESLint configured with Next.js core-web-vitals and TypeScript rules
- No console.log statements in production code
- Use meaningful variable and function names
- Keep components focused and composable

## Web3 Guidelines & Architecture

### Smart Contract Integration

- Contract interfaces in `src/contracts/` directory
- Use typed contract calls with Viem
- Implement proper error handling for blockchain interactions
- Consider gas optimization for frequent operations
- **OpenZeppelin MCP Available**: Use `openzeppelin-solidity-contracts` MCP for access to audited OpenZeppelin contracts (ERC20, ERC721, security modules, etc.) and follow OpenZeppelin best practices for DeFi protocols

### State Management

- React Query for server state and caching
- Local state with React hooks for UI state
- Consider Zustand if complex global state emerges

### Security

- Never expose private keys in frontend
- Validate all user inputs
- Use environment variables for sensitive configuration
- Implement proper access controls for different user roles

### Development Workflow

1. **Setup**: Node.js 18+ and pnpm installed
2. **Development**: `pnpm dev` for hot-reloading
3. **Linting**: `pnpm lint` before committing
4. **Building**: Test with `pnpm build`
5. **Web3 Testing**: Test with multiple wallets/networks

### Architecture Notes

- **App Router**: Next.js 16 App Router for performance
- **Font Loading**: Geist Sans/Mono with CSS variables
- **Layout**: Fixed header/footer, flexible main content
- **Responsive**: Mobile-first with Tailwind utilities

### Performance

- Lazy load heavy components
- Optimize images with Next.js Image component
- Use React.memo for expensive re-renders
- Implement proper caching for blockchain data

---

## Project Documentation Reference

The `./docs/` directory is the **source of truth**. All code must match specifications:

**For any project context, architecture, requirements, or implementation details - read directly from the docs directory:**

- `docs/README.md` - Documentation index and reading guide
- `docs/Primitive.md` - **EC primitive specification (CORE)** - Read this first
- `docs/UseCases/Payroll.md` - Payroll dApp implementation (primary use case)
- `docs/Marketplace.md` - EC Marketplace (demo component - implementation TBD)
- `docs/Integrations.md` - Optional external integrations (ENS, Arc, Yellow)

**Key Terminology:**

- Use "EC" (Expected Cashflow), "ECVault", "ECToken" (NOT "RBN", "CashflowNFT", "SettlementManager")
- This is "factoring" or "asset sale" (NOT "loans" or "credit lines")
- Usurer is the UI display name for investors. Investors are people how buy EC tokens

**Always reference docs when implementing features to ensure accuracy.**

### Application Views

UsuryPay has four distinct views, each serving a different user role:

1. **Employer Dashboard** (`/employer`)
   - Manage PayrollVault
   - Fund escrow with USDC
   - Mint EC tokens for employees (salary payments)
   - Monitor credit score and funding status

2. **Employee Dashboard** (`/employee`)
   - View salary EC tokens received from employer
   - Sell tokens to PayrollDApp for immediate cash (factoring)
   - Track token vesting and claims

3. **Usurer Dashboard** (`/usurer`)
   - **Portfolio view** - shows EC tokens you own (from any source)
   - Monitor token performance (total value, remaining claims)
   - View tokens listed vs not listed on marketplace
   - Link to list tokens for sale
   - **NOT for browsing/buying tokens** - see Marketplace for that

4. **Marketplace** (`/marketplace`)
   - Browse EC tokens available for purchase
   - Buy tokens from other users with USDC
   - Filter and sort by discount, credit score, duration
   - List your own tokens for sale (`/marketplace/list`)

**Important:** Usurer dashboard is for managing your portfolio, not for buying tokens. Marketplace is for trading.
