// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title ITokenMessenger
 * @notice Circle CCTP TokenMessenger interface for cross-chain USDC transfers
 */
interface ITokenMessenger {
    /**
     * @notice Deposits and burns tokens from sender to be minted on destination domain
     * @param amount Amount of tokens to burn
     * @param destinationDomain Destination domain identifier
     * @param mintRecipient Address of mint recipient on destination domain (as bytes32)
     * @param burnToken Address of token to burn on source domain
     * @return nonce Unique nonce reserved by message
     */
    function depositForBurn(
        uint256 amount,
        uint32 destinationDomain,
        bytes32 mintRecipient,
        address burnToken
    ) external returns (uint64 nonce);

    /**
     * @notice Deposits and burns tokens from sender to be minted on destination domain
     * @param amount Amount of tokens to burn
     * @param destinationDomain Destination domain identifier
     * @param mintRecipient Address of mint recipient on destination domain (as bytes32)
     * @param burnToken Address of token to burn on source domain
     * @param destinationCaller Address permitted to call receiveMessage on destination (bytes32)
     * @return nonce Unique nonce reserved by message
     */
    function depositForBurnWithCaller(
        uint256 amount,
        uint32 destinationDomain,
        bytes32 mintRecipient,
        address burnToken,
        bytes32 destinationCaller
    ) external returns (uint64 nonce);

    /**
     * @notice Returns the local MessageTransmitter address
     */
    function localMessageTransmitter() external view returns (address);

    /**
     * @notice Returns the local minter address
     */
    function localMinter() external view returns (address);
}

/**
 * @title IMessageTransmitter
 * @notice Circle CCTP MessageTransmitter interface for receiving cross-chain messages
 */
interface IMessageTransmitter {
    /**
     * @notice Receives a message from another chain
     * @param message Message bytes from source chain
     * @param attestation Attestation signature from Circle
     * @return success Whether the message was successfully received
     */
    function receiveMessage(bytes calldata message, bytes calldata attestation) external returns (bool success);

    /**
     * @notice Returns the local domain identifier
     */
    function localDomain() external view returns (uint32);

    /**
     * @notice Check if a nonce has been used for a source domain
     * @param sourceDomain Domain of the source chain
     * @param nonce Nonce to check
     * @return Whether the nonce has been used
     */
    function usedNonces(uint32 sourceDomain, uint64 nonce) external view returns (bool);
}
