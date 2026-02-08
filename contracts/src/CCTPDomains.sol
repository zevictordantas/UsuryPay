// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title CCTPDomains
 * @notice Circle CCTP domain identifiers and contract addresses
 */
library CCTPDomains {
    // Domain IDs (Circle's constants)
    uint32 internal constant ETHEREUM = 0;
    uint32 internal constant AVALANCHE = 1;
    uint32 internal constant OPTIMISM = 2;
    uint32 internal constant ARBITRUM = 3;
    uint32 internal constant NOBLE = 4;
    uint32 internal constant SOLANA = 5;
    uint32 internal constant BASE = 6;
    uint32 internal constant POLYGON = 7;

    // Sepolia Testnet Addresses
    address internal constant SEPOLIA_TOKEN_MESSENGER = 0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5;
    address internal constant SEPOLIA_MESSAGE_TRANSMITTER = 0x7865fAfC2db2093669d92c0F33AeEF291086BEFD;
    address internal constant SEPOLIA_USDC = 0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238;

    // Ethereum Mainnet Addresses
    address internal constant MAINNET_TOKEN_MESSENGER = 0xBd3fa81B58Ba92a82136038B25aDec7066af3155;
    address internal constant MAINNET_MESSAGE_TRANSMITTER = 0x0a992d191DEeC32aFe36203Ad87D7d289a738F81;
    address internal constant MAINNET_USDC = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;

    // Arbitrum Sepolia Testnet Addresses
    address internal constant ARB_SEPOLIA_TOKEN_MESSENGER = 0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5;
    address internal constant ARB_SEPOLIA_MESSAGE_TRANSMITTER = 0xaCF1ceeF35caAc005e15888dDb8A3515C41B4872;
    address internal constant ARB_SEPOLIA_USDC = 0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d;

    // Base Sepolia Testnet Addresses
    address internal constant BASE_SEPOLIA_TOKEN_MESSENGER = 0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5;
    address internal constant BASE_SEPOLIA_MESSAGE_TRANSMITTER = 0x7865fAfC2db2093669d92c0F33AeEF291086BEFD;
    address internal constant BASE_SEPOLIA_USDC = 0x036CbD53842c5426634e7929541eC2318f3dCF7e;

    /**
     * @notice Convert address to bytes32 for CCTP recipient format
     */
    function addressToBytes32(address addr) internal pure returns (bytes32) {
        return bytes32(uint256(uint160(addr)));
    }

    /**
     * @notice Convert bytes32 to address
     */
    function bytes32ToAddress(bytes32 b) internal pure returns (address) {
        return address(uint160(uint256(b)));
    }

    /**
     * @notice Validate destination domain is supported
     */
    function isValidDomain(uint32 domain) internal pure returns (bool) {
        return domain <= POLYGON;
    }
}
