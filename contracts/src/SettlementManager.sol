// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "solady/auth/Ownable.sol";
import {SafeTransferLib} from "solady/utils/SafeTransferLib.sol";
import {ISettlementManager} from "./interfaces/ISettlementManager.sol";
import {IRBNPrimitive} from "./interfaces/IRBNPrimitive.sol";

/**
 * @title SettlementManager
 * @notice Manages locked funds, tracks accruals, and handles settlements for cashflow NFTs
 * @dev Works in conjunction with RBNPrimitive to manage cashflow rights
 */
contract SettlementManager is Ownable, ISettlementManager {
    /// @notice Reference to the RBNPrimitive contract
    IRBNPrimitive public rbnPrimitive;

    /// @notice Mapping from cashflow ID to locked amount
    mapping(uint256 => uint256) private _lockedAmounts;

    /// @notice Mapping from cashflow ID to accrued amount
    mapping(uint256 => uint256) private _accruedAmounts;

    /// @notice Mapping from cashflow ID to settled amount
    mapping(uint256 => uint256) private _settledAmounts;

    /// @notice Mapping of authorized accrual recorders (e.g., Yellow session)
    mapping(address => bool) public authorizedRecorders;

    /// @notice Error thrown when insufficient funds are available
    error InsufficientFunds();

    /// @notice Error thrown when the cashflow does not exist
    error CashflowDoesNotExist();

    /// @notice Error thrown when trying to accrue more than locked
    error AccrualExceedsLocked();

    /// @notice Error thrown when nothing to settle
    error NothingToSettle();

    /// @notice Modifier to restrict access to authorized recorders or owner
    modifier onlyAuthorizedRecorder() {
        if (!authorizedRecorders[msg.sender] && msg.sender != owner()) {
            revert Unauthorized();
        }
        _;
    }

    constructor(address _rbnPrimitive) {
        _initializeOwner(msg.sender);
        rbnPrimitive = IRBNPrimitive(_rbnPrimitive);
    }

    /// @notice Sets the RBNPrimitive contract address
    /// @param _rbnPrimitive The address of the RBNPrimitive contract
    function setRBNPrimitive(address _rbnPrimitive) external onlyOwner {
        rbnPrimitive = IRBNPrimitive(_rbnPrimitive);
    }

    /// @notice Adds or removes an authorized recorder
    /// @param recorder The address to authorize/deauthorize
    /// @param authorized Whether the address should be authorized
    function setAuthorizedRecorder(address recorder, bool authorized) external onlyOwner {
        authorizedRecorders[recorder] = authorized;
    }

    /// @inheritdoc ISettlementManager
    function lockFunds(uint256 cashflowId, uint256 amount) external {
        // Get cashflow data to determine currency
        IRBNPrimitive.Cashflow memory cashflow = rbnPrimitive.getCashflow(cashflowId);
        
        // Transfer tokens from sender to this contract
        SafeTransferLib.safeTransferFrom(cashflow.currency, msg.sender, address(this), amount);
        
        _lockedAmounts[cashflowId] += amount;
        
        emit FundsLocked(cashflowId, amount, msg.sender);
    }

    /// @inheritdoc ISettlementManager
    function recordAccrual(uint256 cashflowId, uint256 amount) external onlyAuthorizedRecorder {
        uint256 locked = _lockedAmounts[cashflowId];
        uint256 currentAccrued = _accruedAmounts[cashflowId];
        
        if (currentAccrued + amount > locked) {
            revert AccrualExceedsLocked();
        }
        
        _accruedAmounts[cashflowId] = currentAccrued + amount;
        
        emit AccrualRecorded(cashflowId, amount, _accruedAmounts[cashflowId]);
    }

    /// @inheritdoc ISettlementManager
    function settle(uint256 cashflowId) external {
        uint256 accrued = _accruedAmounts[cashflowId];
        uint256 settled = _settledAmounts[cashflowId];
        uint256 toSettle = accrued - settled;
        
        if (toSettle == 0) {
            revert NothingToSettle();
        }
        
        // Get the current owner of the cashflow NFT
        address recipient = rbnPrimitive.ownerOf(cashflowId);
        
        // Get the currency from cashflow data
        IRBNPrimitive.Cashflow memory cashflow = rbnPrimitive.getCashflow(cashflowId);
        
        // Update settled amount before transfer (CEI pattern)
        _settledAmounts[cashflowId] = accrued;
        
        // Transfer funds to the current NFT owner
        SafeTransferLib.safeTransfer(cashflow.currency, recipient, toSettle);
        
        emit Settled(cashflowId, recipient, toSettle);
    }

    /// @inheritdoc ISettlementManager
    function getLockedAmount(uint256 cashflowId) external view returns (uint256) {
        return _lockedAmounts[cashflowId];
    }

    /// @inheritdoc ISettlementManager
    function getAccruedAmount(uint256 cashflowId) external view returns (uint256) {
        return _accruedAmounts[cashflowId];
    }

    /// @inheritdoc ISettlementManager
    function getSettledAmount(uint256 cashflowId) external view returns (uint256) {
        return _settledAmounts[cashflowId];
    }

    /// @notice Gets the available (unsettled) amount for a cashflow
    /// @param cashflowId The ID of the cashflow NFT
    /// @return The available amount to settle
    function getAvailableAmount(uint256 cashflowId) external view returns (uint256) {
        return _accruedAmounts[cashflowId] - _settledAmounts[cashflowId];
    }
}
