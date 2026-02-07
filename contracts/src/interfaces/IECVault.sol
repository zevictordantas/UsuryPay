// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title IECVault
 * @notice Escrow vault for expected cashflow payments
 */
interface IECVault {
    struct DefaultEvent {
        uint256 timestamp;
        uint256 shortfall;
        bytes settlementData;
    }

    struct VaultInfo {
        address asset;
        uint256 startTime;
        uint256 endTime;
        address payer;
        bytes metadata;
    }

    // Events
    event Funded(address indexed payer, uint256 amount, uint256 timestamp);
    event Claimed(uint256 indexed tokenId, address indexed claimer, uint256 amount, uint256 timestamp);
    event DefaultDetected(uint256 indexed tokenId, uint256 shortfall, uint256 timestamp);
    event DefaultAmended(uint256 indexed tokenId, uint256 defaultIndex, bytes settlementData);

    // View Functions
    function getVaultInfo() external view returns (VaultInfo memory);
    function getBalance() external view returns (uint256);
    function getRequiredEscrow() external view returns (uint256);
    function getDefaults(uint256 tokenId) external view returns (DefaultEvent[] memory);
    function checkSolvency() external view returns (bool isSolvent, uint256 shortfall);

    // State-Changing Functions
    function fund(uint256 amount) external payable;
    function claim(uint256 tokenId, uint256 amount) external returns (uint256 claimed, bool defaultOccurred);
    function amendDefault(uint256 tokenId, uint256 defaultIndex, bytes calldata settlementData) external;
    function onDefaultDetected(uint256 tokenId, uint256 shortfall) external;
}
