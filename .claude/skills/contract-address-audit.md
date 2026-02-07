# contract-address-audit

Audit and fix contract address management issues in the codebase.

## Description

Validates that contract addresses are properly managed via `deployments.json` instead of being hardcoded. Checks deployment workflow integrity and suggests/fixes issues.

## Usage

```
/contract-address-audit
/contract-address-audit --fix
/contract-address-audit --check-only
```

## What This Skill Does

1. **Scans for Hardcoded Addresses**
   - Searches `.ts`, `.tsx`, `.js` files for potential hardcoded addresses
   - Flags hex strings that look like Ethereum addresses (0x followed by 40 hex chars)
   - Ignores addresses in comments, imports from deployments.json, and test files

2. **Validates Deployment Workflow**
   - Checks if `deployments.json` exists and is recent
   - Verifies `wagmi.config.ts` imports from `deployments.json`
   - Verifies `src/contracts/addresses.ts` imports from `deployments.json`
   - Checks if `src/generated.ts` is newer than `deployments.json` (indicates wagmi:generate was run)

3. **Checks .gitignore Patterns**
   - Ensures `contracts/broadcast/*/31337/` is ignored (local anvil)
   - Ensures `contracts/broadcast/*/dry-run/` is ignored
   - Ensures `src/generated.ts` is ignored
   - Ensures `deployments.json` is ignored

4. **Suggests Fixes**
   - "Run `pnpm wagmi:generate` - generated.ts is outdated"
   - "Redeploy contracts - deployments.json is stale"
   - "Fix hardcoded address in <file>:<line>"
   - "Update .gitignore - missing Foundry patterns"

5. **Auto-Fix Mode** (with --fix flag)
   - Runs `pnpm wagmi:generate` if needed
   - Updates .gitignore patterns
   - Suggests code changes for hardcoded addresses (doesn't auto-replace without confirmation)

## When to Use

- After deployment
- Before committing code
- When debugging address issues
- During onboarding
- In CI/CD pipelines
