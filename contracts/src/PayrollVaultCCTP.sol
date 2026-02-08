// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./PayrollVault.sol";
import "./interfaces/ICCTP.sol";
import "./CCTPDomains.sol";

/**
 * @title PayrollVaultCCTP
 * @notice PayrollVault with Circle CCTP cross-chain USDC capabilities
 * @dev Extends PayrollVault to enable cross-chain claiming and funding via CCTP
 */
contract PayrollVaultCCTP is PayrollVault {
    using SafeERC20 for IERC20;

    ITokenMessenger public immutable cctp;
    IMessageTransmitter public immutable messageTransmitter;

    event CrossChainClaimInitiated(
        uint256 indexed tokenId,
        address indexed claimer,
        uint256 amount,
        uint32 destinationDomain,
        address recipient,
        uint64 nonce
    );

    event CrossChainFundingReceived(address indexed submitter, uint256 amount, uint256 timestamp);

    error InvalidDestinationDomain();
    error InvalidRecipient();
    error CCTPTransferFailed();

    constructor(
        address _asset,
        address _ecToken,
        address _employer,
        uint256 _vaultId,
        address _cctp,
        address _messageTransmitter
    ) PayrollVault(_asset, _ecToken, _employer, _vaultId) {
        cctp = ITokenMessenger(_cctp);
        messageTransmitter = IMessageTransmitter(_messageTransmitter);
    }

    /**
     * @notice Claim payment on a different chain via CCTP
     * @dev Two-step process:
     *      1. This function burns USDC on current chain, returns nonce
     *      2. User gets attestation from Circle API and calls receiveMessage on destination
     * @param tokenId EC token to claim from
     * @param amount Amount to claim
     * @param destinationDomain CCTP domain (0=Ethereum, 3=Arbitrum, etc.)
     * @param recipient Address on destination chain to receive USDC
     * @return nonce CCTP nonce (user needs this to fetch attestation)
     */
    function claimCrossChain(uint256 tokenId, uint256 amount, uint32 destinationDomain, address recipient)
        external
        nonReentrant
        returns (uint64 nonce)
    {
        if (!CCTPDomains.isValidDomain(destinationDomain)) revert InvalidDestinationDomain();
        if (recipient == address(0)) revert InvalidRecipient();

        // Validate claim (same as regular claim)
        require(_isTokenFromThisVault(tokenId), "Token not from this vault");
        require(ecToken.balanceOf(msg.sender, tokenId) == 1, "Not token owner");

        uint256 claimable = ecToken.getClaimable(tokenId);
        require(claimable >= amount, "Amount exceeds claimable");

        uint256 balance = asset.balanceOf(address(this));

        uint256 actualAmount = amount;

        if (balance < amount) {
            // Partial claim due to insufficient funds
            actualAmount = balance;
            uint256 shortfall = amount - balance;
            defaultCount++;

            emit DefaultDetected(tokenId, shortfall, block.timestamp);
        }

        if (actualAmount == 0) revert CCTPTransferFailed();

        // Update claimed amount
        ecToken.updateClaimed(tokenId, actualAmount);

        // Approve CCTP to burn USDC
        asset.forceApprove(address(cctp), actualAmount);

        // Burn USDC via CCTP
        nonce = cctp.depositForBurn(
            actualAmount, destinationDomain, CCTPDomains.addressToBytes32(recipient), address(asset)
        );

        emit CrossChainClaimInitiated(tokenId, msg.sender, actualAmount, destinationDomain, recipient, nonce);
        emit Claimed(tokenId, msg.sender, actualAmount, block.timestamp);

        return nonce;
    }

    /**
     * @notice Receive cross-chain funding from another chain via CCTP
     * @dev Anyone can call this to complete a cross-chain transfer
     *      This is the "destination" side of the transfer
     * @param message CCTP message bytes from source chain event
     * @param attestation Circle attestation signature
     */
    function receiveCrossChainFunding(bytes calldata message, bytes calldata attestation) external nonReentrant {
        uint256 balanceBefore = asset.balanceOf(address(this));

        // Call Circle's MessageTransmitter to mint USDC
        // This will:
        // 1. Verify attestation signature
        // 2. Mint USDC to this vault
        // 3. Revert if already processed
        bool success = messageTransmitter.receiveMessage(message, attestation);
        if (!success) revert CCTPTransferFailed();

        uint256 balanceAfter = asset.balanceOf(address(this));
        uint256 received = balanceAfter - balanceBefore;

        // Update vault accounting
        totalFunded += received;

        emit CrossChainFundingReceived(msg.sender, received, block.timestamp);
        emit Funded(msg.sender, received, block.timestamp);

        // Check solvency
        (bool isSolvent, uint256 shortfall) = this.checkSolvency();
        if (!isSolvent) {
            // Vault still underfunded after cross-chain funding
            emit DefaultDetected(0, shortfall, block.timestamp);
        }
    }

}
