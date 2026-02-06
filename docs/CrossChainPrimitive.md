# Cross-Chain Integration for Expected Cashflow Primitive

This is written on a separate document because it can be added as a second iteration on top of the MVP

## Using Circle CCTP for Cross-Chain USDC Transfers

## Overview

This brief shows how to add **cross-chain liquidity** to the Expected Cashflow primitive using Circle's Cross-Chain Transfer Protocol (CCTP). The integration is **minimal and non-invasive** - the core primitive remains unchanged, we just add optional cross-chain capabilities.

**Key principle:** EC tokens and vaults stay on ONE chain. Only USDC moves cross-chain.

## What CCTP Enables

1. **Cross-chain claiming**: Employee on Ethereum claims payment, receives USDC on Arbitrum
2. **Cross-chain funding**: Employer on Arbitrum funds vault on Ethereum

## How CCTP Works (Simplified)

CCTP is a **burn-and-mint bridge** for USDC:

```
Source Chain (e.g., Arbitrum)
│
│ 1. User burns USDC
│    CCTP.depositForBurn(1000 USDC, destinationDomain=0, recipientAddress)
│    → Burns 1000 USDC on Arbitrum
│    → Emits MessageSent event
│
│ 2. Circle's attestation service sees the burn
│    → Signs the message (takes ~20 seconds)
│
│ 3. User fetches attestation from Circle API
│    GET https://iris-api.circle.com/attestations/{messageHash}
│    → Returns signature
│
▼
Destination Chain (e.g., Ethereum)
│
│ 4. User submits attestation
│    CCTP.receiveMessage(message, attestation)
│    → Mints 1000 USDC on Ethereum
│    → Transfers to recipient
```

**Why this is simple:**

- No custom bridge contracts
- No liquidity pools
- No wrapped tokens
- Just burn → wait 20 sec → mint

**Supported chains (as of Feb 2025):**

- Ethereum, Arbitrum, Optimism, Base, Polygon PoS, Avalanche

## Architecture: EC Primitive + CCTP

```
                         ETHEREUM (Home Chain)
┌────────────────────────────────────────────────────────┐
│                                                         │
│  ┌──────────────┐         ┌──────────────┐            │
│  │  EC Token    │────────>│   EC Vault   │            │
│  │  (stays here)│         │  (stays here)│            │
│  └──────────────┘         └──────┬───────┘            │
│                                   │                     │
│                                   │ USDC balance       │
│                           ┌───────▼────────┐           │
│                           │  USDC Contract │           │
│                           └───────┬────────┘           │
│                                   │                     │
└───────────────────────────────────┼─────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
            Cross-chain claim              Cross-chain fund
                    │                               │
                    ▼                               ▼

    ARBITRUM                              BASE
┌──────────────────┐                  ┌──────────────────┐
│ Employee receives│                  │ Employer sends   │
│ USDC here        │                  │ USDC from here   │
└──────────────────┘                  └──────────────────┘
```

## Integration: Minimal Changes to Primitive

Add two new functions to `IECVault`:

```solidity
interface IECVault {
    // ... existing functions ...

    /**
     * @notice Claim payment on a different chain via CCTP
     * @param tokenId EC token to claim from
     * @param amount Amount to claim
     * @param destinationDomain CCTP domain (0=Ethereum, 3=Arbitrum, etc.)
     * @param recipient Address on destination chain to receive USDC
     * @return messageHash CCTP message hash (user needs this for attestation)
     */
    function claimCrossChain(
        uint256 tokenId,
        uint256 amount,
        uint32 destinationDomain,
        address recipient
    ) external returns (bytes32 messageHash);

    /**
     * @notice Receive cross-chain funding from another chain via CCTP
     * @dev Anyone can call this to complete a cross-chain transfer
     * @param message CCTP message bytes
     * @param attestation Circle attestation signature
     */
    function receiveCrossChainFunding(
        bytes calldata message,
        bytes calldata attestation
    ) external;
}
```

## Implementation: Cross-Chain Claiming

### Contract Code

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IECVault.sol";
import "@circle/cctp/ITokenMessenger.sol";

contract ECVaultWithCCTP is IECVault {
    ITokenMessenger public immutable cctp;
    IERC20 public immutable usdc;

    // CCTP domain IDs (Circle's constants)
    // 0 = Ethereum, 1 = Avalanche, 2 = Optimism, 3 = Arbitrum,
    // 6 = Base, 7 = Polygon

    constructor(address _cctp, address _usdc) {
        cctp = ITokenMessenger(_cctp);
        usdc = IERC20(_usdc);
    }

    /**
     * @notice Claim payment on destination chain via CCTP
     * @dev Two-step process:
     *      1. This function burns USDC on current chain
     *      2. User gets attestation and calls receiveMessage on destination
     */
    function claimCrossChain(
        uint256 tokenId,
        uint256 amount,
        uint32 destinationDomain,
        address recipient
    ) external returns (bytes32 messageHash) {
        // 1. Normal claim validation (same as regular claim)
        require(ecToken.ownerOf(tokenId) == msg.sender, "Not token owner");

        uint256 claimable = _getClaimable(tokenId);
        require(amount <= claimable, "Amount exceeds claimable");

        // Check for default
        uint256 effectiveClaimable = _getEffectiveClaimable(tokenId);
        if (effectiveClaimable < amount) {
            _recordDefault(tokenId, amount - effectiveClaimable);
            amount = effectiveClaimable; // Claim what's available
        }

        // Update claimed amount
        _updateClaimed(tokenId, amount);

        // 2. Burn USDC via CCTP (instead of direct transfer)
        // Approve CCTP to burn USDC
        usdc.approve(address(cctp), amount);

        // Burn USDC and get nonce
        uint64 nonce = cctp.depositForBurn(
            amount,
            destinationDomain,
            bytes32(uint256(uint160(recipient))), // Convert address to bytes32
            address(usdc)
        );

        // Get message hash from CCTP event
        // (In production, parse from MessageSent event)
        messageHash = keccak256(
            abi.encodePacked(
                block.chainid,
                destinationDomain,
                nonce
            )
        );

        emit CrossChainClaimInitiated(
            tokenId,
            msg.sender,
            amount,
            destinationDomain,
            recipient,
            messageHash
        );

        return messageHash;
    }

    event CrossChainClaimInitiated(
        uint256 indexed tokenId,
        address indexed claimer,
        uint256 amount,
        uint32 destinationDomain,
        address recipient,
        bytes32 messageHash
    );

    /**
     * @notice Receive USDC from another chain via CCTP
     * @dev Anyone can call this to complete a cross-chain transfer
     *      This is the "destination" side of the transfer
     */
    function receiveCrossChainFunding(
        bytes calldata message,
        bytes calldata attestation
    ) external {
        // Call Circle's MessageTransmitter to mint USDC
        IMessageTransmitter transmitter = cctp.localMessageTransmitter();

        // This will:
        // 1. Verify attestation signature
        // 2. Mint USDC to this vault
        // 3. Revert if already processed
        uint256 balanceBefore = usdc.balanceOf(address(this));

        transmitter.receiveMessage(message, attestation);

        uint256 balanceAfter = usdc.balanceOf(address(this));
        uint256 received = balanceAfter - balanceBefore;

        // Update vault accounting
        totalFunded += received;

        emit CrossChainFundingReceived(
            msg.sender, // Who submitted attestation
            received,
            block.timestamp
        );

        // Check solvency (same as regular funding)
        (bool isSolvent, uint256 shortfall) = checkSolvency();
        if (!isSolvent) {
            emit StillInDefault(shortfall);
        }
    }

    event CrossChainFundingReceived(
        address indexed submitter,
        uint256 amount,
        uint256 timestamp
    );
}
```

## User Flows

### Cross-Chain Claiming Flow

```typescript
// Step 1: User initiates cross-chain claim on Ethereum
const tx = await vault.claimCrossChain(
  tokenId,
  ethers.utils.parseUnits('1000', 6), // 1000 USDC
  3, // Arbitrum domain ID
  userAddress // Receive on Arbitrum
);

const receipt = await tx.wait();
const event = receipt.events.find(
  (e) => e.event === 'CrossChainClaimInitiated'
);
const messageHash = event.args.messageHash;

// Show user: "Claim initiated! Waiting for attestation..."

// Step 2: Wait for Circle attestation (~20 seconds)
let attestation = null;
while (!attestation) {
  const response = await fetch(
    `https://iris-api.circle.com/attestations/${messageHash}`
  );
  const data = await response.json();

  if (data.status === 'complete') {
    attestation = data.attestation;
    break;
  }

  await new Promise((r) => setTimeout(r, 2000)); // Poll every 2 seconds
}

// Show user: "Attestation ready! Click to receive on Arbitrum"

// Step 3: User switches to Arbitrum and submits attestation
const cctpArbitrum = new ethers.Contract(
  CCTP_ARBITRUM_ADDRESS,
  ['function receiveMessage(bytes calldata, bytes calldata) external'],
  arbitrumSigner
);

await cctpArbitrum.receiveMessage(
  messageBytes, // From event
  attestation // From Circle API
);

// User now has USDC on Arbitrum!
```

### Cross-Chain Funding Flow

```typescript
// Employer is on Base, wants to fund vault on Ethereum

// Step 1: Burn USDC on Base
const cctpBase = new ethers.Contract(
  CCTP_BASE_ADDRESS,
  [
    'function depositForBurn(uint256, uint32, bytes32, address) external returns (uint64)',
  ],
  baseSigner
);

// Approve USDC
await usdc.approve(CCTP_BASE_ADDRESS, amount);

// Burn USDC
const tx = await cctpBase.depositForBurn(
  ethers.utils.parseUnits('10000', 6), // 10k USDC
  0, // Ethereum domain
  ethers.utils.hexZeroPad(vaultAddress, 32), // Vault receives on Ethereum
  USDC_BASE_ADDRESS
);

const receipt = await tx.wait();
const messageHash = calculateMessageHash(receipt);

// Step 2: Wait for attestation
const attestation = await waitForAttestation(messageHash);

// Step 3: Switch to Ethereum and complete funding
await vaultOnEthereum.receiveCrossChainFunding(messageBytes, attestation);

// Vault on Ethereum now has 10k USDC!
```

## CCTP Reference

### Domain IDs

```solidity
uint32 constant ETHEREUM = 0;
uint32 constant AVALANCHE = 1;
uint32 constant OPTIMISM = 2;
uint32 constant ARBITRUM = 3;
uint32 constant BASE = 6;
uint32 constant POLYGON = 7;
```

### Contract Addresses (Mainnet)

```solidity
// TokenMessenger
address constant CCTP_ETHEREUM = 0xBd3fa81B58Ba92a82136038B25aDec7066af3155;
address constant CCTP_ARBITRUM = 0x19330d10D9Cc8751218eaf51E8885D058642E08A;
address constant CCTP_OPTIMISM = 0x2B4069517957735bE00ceE0fadAE88a26365528f;
address constant CCTP_BASE = 0x1682Ae6375C4E4A97e4B583BC394c861A46D8962;
address constant CCTP_POLYGON = 0x9daF8c91AEFAE50b9c0E69629D3F6Ca40cA3B3FE;
address constant CCTP_AVALANCHE = 0x6B25532e1060CE10cc3B0A99e5683b91BFDe6982;
```

## UX Considerations

### Two-Click Flow

**Claiming:**

1. Click "Claim on Arbitrum" (Ethereum transaction)
2. Wait ~20 seconds for attestation
3. Click "Receive USDC" (Arbitrum transaction)

**Funding:**

1. Click "Fund from Base" (Base transaction)
2. Wait ~20 seconds for attestation
3. Click "Complete Funding" (Ethereum transaction)

### Gas Costs

- Regular claim: ~80k gas
- Cross-chain claim: ~250k gas total (both chains)
- **Premium: ~3x gas** for cross-chain convenience

## Why CCTP Over Alternatives?

| Feature         | CCTP                 | LayerZero/Wormhole  |
| --------------- | -------------------- | ------------------- |
| **Token**       | Native USDC          | Wrapped USDC        |
| **Liquidity**   | No pools needed      | Requires liquidity  |
| **Trust**       | Circle (centralized) | Validators          |
| **Integration** | Simple (burn-mint)   | Complex (messaging) |
| **Fees**        | Free (just gas)      | Bridge fees         |
| **Speed**       | ~20 seconds          | 1min - 1hr          |

## Recommendation for MVP

**Phase 1:** Build core primitive (single chain)

- ✅ Prove concept works
- ✅ Ship faster

**Phase 2:** Add CCTP integration

- ✅ ~100 lines of code
- ✅ Non-breaking addition
- ✅ Enables multi-chain UX

**Key Insight:**
Keep EC tokens and vaults on ONE chain (e.g., Ethereum). Only USDC moves cross-chain. This avoids all complexity of bridging NFTs or state synchronization, while still enabling users to receive payments on their preferred chain.

## Code Changes Summary

To add CCTP to existing vault:

```solidity
// 1. Add CCTP interface
ITokenMessenger public immutable cctp;

// 2. Add cross-chain claim
function claimCrossChain(...) external {
  // Same as regular claim, but:
  // cctp.depositForBurn() instead of usdc.transfer()
}

// 3. Add funding receiver
function receiveCrossChainFunding(...) external {
  // transmitter.receiveMessage()
  // Update totalFunded
}
```
