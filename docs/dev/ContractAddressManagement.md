# Contract Address Management Guide

**See also**: `/contract-address-audit` skill for automated validation

## Architecture

```
Deploy → deployments.json → [wagmi.config.ts, addresses.ts] → Components
```

**Single source of truth**: `deployments.json` (auto-generated)

## The Problem

Addresses change frequently:
- **Anvil**: Every `pnpm deploy:local`
- **Testnet/Mainnet**: On redeployments
- **Multi-chain**: Different per chain

## The Solution

Never hardcode. Always import from `deployments.json`:

```typescript
// ✅ RIGHT
import deployments from '../../deployments.json';
export const addresses = {
  [ANVIL_CHAIN_ID]: {
    mockECToken: deployments.MockECToken as Address,
  }
};

// ❌ WRONG
const TOKEN = '0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9';
```

## Workflow

```bash
pnpm deploy:local       # 1. Deploy → writes deployments.json
pnpm wagmi:generate     # 2. Generate → reads deployments.json
pnpm dev                # 3. Serve → addresses.ts imports deployments.json
```

## Validation

Run the skill to check:
```bash
/contract-address-audit          # Check for issues
/contract-address-audit --fix    # Auto-fix what's possible
```

## Git Strategy (Foundry Best Practice)

```gitignore
# Track production/testnet broadcasts
# Ignore local anvil only
contracts/broadcast/*/31337/
contracts/broadcast/*/dry-run/
```

Reference: [Foundry Best Practices](https://book.getfoundry.sh/tutorials/best-practices#scripts)
