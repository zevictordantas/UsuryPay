# Arc/CCTP Integration Testing Guide

Testing guide for the Circle CCTP cross-chain integration on Sepolia.

## Overview

The Arc integration enables cross-chain USDC transfers using Circle's Cross-Chain Transfer Protocol (CCTP). This allows:
- **Cross-chain claiming**: Employees claim salary and receive USDC on another chain
- **Cross-chain funding**: Employers fund vaults from another chain

## Prerequisites

### 1. Sepolia ETH

### 2. Circle Testnet USDC

### 3. Environment Setup

```bash
# .env.local
NEXT_PUBLIC_PROJECT_ID=your-reown-project-id
```

## Deployed Contracts (Sepolia)

| Contract | Address |
|----------|---------|
| MockECToken | `0x5f831b8c021c0c2a8fe471bd8ed76eb675462571` |
| Marketplace | `0x4ed7bd530a763f243ba45f0e2d470148858c05b3` |
| PayrollVaultFactory | `0x17cd72a6119be4e775479cb755a8cf4b79a0f895` |
| PayrollDApp | `0xd3a836ecfd6cbb32203023045fb4a0a97b4b151d` |
| PayrollVaultCCTP | `0xadfcd25a5605d18c2121d00e964b9b1e0ab5b48a` |
| USDC (Circle) | `0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238` |

### CCTP Contracts (Circle's)

| Contract | Address |
|----------|---------|
| TokenMessenger | `0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5` |
| MessageTransmitter | `0x7865fAfC2db2093669d92c0F33AeEF291086BEFD` |

1. Connect wallet to Sepolia
2. Go to `/employer` - create vault or use existing
3. Fund vault with testnet USDC
4. Mint EC tokens for employees
5. As employee, test claiming (regular claim works, cross-chain requires direct contract interaction)

## CCTP Domain IDs

| Chain | Domain ID |
|-------|-----------|
| Ethereum | 0 |
| Avalanche | 1 |
| Optimism | 2 |
| Arbitrum | 3 |
| Noble | 4 |
| Solana | 5 |
| Base | 6 |
| Polygon | 7 |

