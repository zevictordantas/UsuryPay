// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title ISettlementManager
 * @notice Interface for the Settlement Manager contract
 * @dev Manages locked funds, tracks accruals, and handles settlements
 */
interface ISettlementManager {
    /// @notice Emitted when funds are locked for a cashflow
    /// @param cashflowId The ID of the associated cashflow NFT
    /// @param amount The amount of funds locked
    /// @param locker The address that locked the funds
    event FundsLocked(uint256 indexed cashflowId, uint256 amount, address indexed locker);

    /// @notice Emitted when an accrual is recorded
    /// @param cashflowId The ID of the associated cashflow NFT
    /// @param amount The accrued amount
    /// @param totalAccrued The total accrued amount so far
    event AccrualRecorded(uint256 indexed cashflowId, uint256 amount, uint256 totalAccrued);

    /// @notice Emitted when a settlement is executed
    /// @param cashflowId The ID of the settled cashflow NFT
    /// @param recipient The address receiving the settlement
    /// @param amount The settled amount
    event Settled(uint256 indexed cashflowId, address indexed recipient, uint256 amount);

    /// @notice Locks funds for a specific cashflow
    /// @dev Transfers currency from sender to this contract
    /// @param cashflowId The ID of the cashflow NFT
    /// @param amount The amount to lock
    function lockFunds(uint256 cashflowId, uint256 amount) external;

    /// @notice Records an accrual for a cashflow
    /// @dev Can only be called by authorized addresses (e.g., Yellow session)
    /// @param cashflowId The ID of the cashflow NFT
    /// @param amount The amount to accrue
    function recordAccrual(uint256 cashflowId, uint256 amount) external;

    /// @notice Settles a cashflow by transferring accrued funds to the NFT owner
    /// @param cashflowId The ID of the cashflow NFT to settle
    function settle(uint256 cashflowId) external;

    /// @notice Gets the locked amount for a cashflow
    /// @param cashflowId The ID of the cashflow NFT
    /// @return The locked amount
    function getLockedAmount(uint256 cashflowId) external view returns (uint256);

    /// @notice Gets the accrued amount for a cashflow
    /// @param cashflowId The ID of the cashflow NFT
    /// @return The accrued amount
    function getAccruedAmount(uint256 cashflowId) external view returns (uint256);

    /// @notice Gets the settled amount for a cashflow
    /// @param cashflowId The ID of the cashflow NFT
    /// @return The settled amount
    function getSettledAmount(uint256 cashflowId) external view returns (uint256);
}
