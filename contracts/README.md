# EC Marketplace Smart Contracts

Foundry-based smart contracts for the EC (Expected Cashflow) Marketplace.

## Overview

The Marketplace contract enables trading of EC tokens (ERC-721 and ERC-1155) for USDC in a minimal, single-chain environment. It provides:

- Fixed-price whole-token sales
- On-chain escrow during active listings
- Atomic purchase transactions
- Support for both ERC-721 and ERC-1155 EC tokens

## Architecture

### Marketplace.sol

The core marketplace contract that:
- Escrows EC tokens during listings
- Manages listing lifecycle (list, cancel, buy)
- Facilitates atomic USDC payments
- Enforces security invariants (reentrancy protection, single-use listings)

**Key Features:**
- Immutable USDC token address set at deployment
- ERC-721 and ERC-1155 receiver implementations
- Reentrancy guard on buy operations
- Checks-effects-interactions pattern
- Comprehensive event emissions

## Development

### Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation)
- Solidity 0.8.28

### Setup

```bash
# Install dependencies (OpenZeppelin)
forge install

# Build contracts
forge build

# Run tests
forge test

# Run tests with verbosity
forge test -vv

# Run tests with gas reporting
forge test --gas-report

# Format code
forge fmt
```

### Project Structure

```
contracts/
├── src/
│   └── Marketplace.sol          # Main marketplace contract
├── test/
│   └── Marketplace.t.sol        # Comprehensive test suite
├── script/
│   └── DeployMarketplace.s.sol  # Deployment script
├── lib/                         # Dependencies (forge-std, OpenZeppelin)
└── foundry.toml                 # Foundry configuration
```

## Testing

The test suite includes:

- **Constructor tests** - Validation and initialization
- **ERC-721 listing tests** - Listing creation, validation, custody
- **ERC-1155 listing tests** - Multi-token support
- **Cancel tests** - Authorization, state transitions, token returns
- **Buy tests** - Atomic purchases, USDC transfers, edge cases
- **Security tests** - Reentrancy protection, custody invariants, immutability
- **View function tests** - getListing(), getAllListings()
- **Interface tests** - ERC-165 support
- **Edge cases** - Multiple listings, self-purchase, double-buy attempts

```bash
# Run all tests
forge test

# Run specific test
forge test --match-test test_BuyERC721Listing

# Run with traces
forge test -vvvv
```

### Test Coverage

```bash
forge coverage
```

## Deployment

### Environment Setup

Create a `.env` file in the contracts directory:

```env
USDC_ADDRESS=0x...                    # USDC token address
PRIVATE_KEY=0x...                     # Deployer private key
RPC_URL=https://...                   # RPC endpoint
ETHERSCAN_API_KEY=...                 # For verification (optional)
```

### Deploy to Testnet

```bash
# Source environment variables
source .env

# Deploy (dry run)
forge script script/DeployMarketplace.s.sol:DeployMarketplace --rpc-url $RPC_URL

# Deploy (broadcast to network)
forge script script/DeployMarketplace.s.sol:DeployMarketplace \
  --rpc-url $RPC_URL \
  --broadcast \
  --verify

# Deploy to local Anvil instance
anvil  # In separate terminal
forge script script/DeployMarketplace.s.sol:DeployMarketplace \
  --rpc-url http://localhost:8545 \
  --broadcast
```

### USDC Addresses

**Testnets:**
- Arc Testnet: (Deploy mock USDC or check Arc docs)
- Sepolia: `0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238`
- Arbitrum Sepolia: `0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d`

**Mainnets:**
- Ethereum: `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`
- Arbitrum One: `0xaf88d065e77c8cC2239327C5EDb3A432268e5831`
- Base: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`

## Contract Interface

### Core Functions

```solidity
// List an EC token for sale
function list(
    address token,
    uint256 tokenId,
    TokenType tokenType,
    uint256 price
) external returns (uint256 listingId);

// Cancel a listing (seller only)
function cancel(uint256 listingId) external;

// Buy a listing with USDC
function buy(uint256 listingId) external;

// View functions
function getListing(uint256 listingId) external view returns (Listing memory);
function getAllListings() external view returns (Listing[] memory);
```

### Events

```solidity
event Listed(uint256 indexed listingId, address indexed seller, address token, uint256 tokenId, uint256 price);
event Cancelled(uint256 indexed listingId, address indexed seller);
event Bought(uint256 indexed listingId, address indexed buyer, address indexed seller, uint256 price);
```

## Security Considerations

The Marketplace contract implements several security best practices:

1. **Reentrancy Protection** - `nonReentrant` modifier on buy()
2. **Checks-Effects-Interactions** - State changes before external calls
3. **Single-Use Listings** - Listings marked inactive before token transfer
4. **Custody Invariant** - Marketplace holds tokens during active listings
5. **Authorization** - Only seller can cancel their listings
6. **Immutability** - USDC address and listing parameters cannot be changed
7. **ERC Receiver Implementation** - Proper callback handlers for safe transfers

### Known Limitations

- `getAllListings()` is not scalable for production (returns all listings including inactive)
- No fee mechanism (by design for demo simplicity)
- No orderbook or price discovery
- Fixed-price sales only (no auctions)
- Single-chain only
- ERC-1155 limited to amount=1 (whole token only)

## Gas Optimization

The contract is optimized for:
- Minimal storage reads/writes
- Efficient event emissions
- Single SLOAD for immutable USDC address
- Compact Listing struct layout

## Specification

For detailed specification, see [/docs/Marketplace.md](../docs/Marketplace.md)

## License

MIT
