// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title IRBNPrimitive
 * @notice Interface for the RBN (Rights-Based NFT) Primitive contract
 * @dev ERC1155 implementation representing rights to future cashflows
 */
interface IRBNPrimitive {
    /// @notice Types of cashflows that can be represented
    enum CashflowType {
        PAYROLL,
        DIVIDEND
    }

    /// @notice Represents a future cashflow right
    /// @param treasury Source of funds (EmployerTreasury, DAO treasury, or Circle wallet)
    /// @param beneficiary Original recipient of the cashflow (employee)
    /// @param settlementManager Address of the settlement manager contract
    /// @param totalAmount Total amount of the cashflow (e.g., 2000 USDC)
    /// @param startTime Start time of the cashflow period
    /// @param endTime End time of the cashflow period
    /// @param currency Address of the currency token (e.g., USDC)
    /// @param cashflowType Type of cashflow (PAYROLL or DIVIDEND)
    struct Cashflow {
        address treasury;
        address beneficiary;
        address settlementManager;
        uint256 totalAmount;
        uint256 startTime;
        uint256 endTime;
        address currency;
        CashflowType cashflowType;
    }

    /// @notice Emitted when a new cashflow NFT is minted
    /// @param tokenId The ID of the newly minted token
    /// @param recipient The address receiving the token
    /// @param cashflow The cashflow data associated with the token
    event CashflowMinted(uint256 indexed tokenId, address indexed recipient, Cashflow cashflow);

    /// @notice Mints a new cashflow NFT
    /// @param recipient The address to receive the NFT
    /// @param data The cashflow data to associate with the NFT
    /// @return tokenId The ID of the newly minted token
    function mintCashflow(address recipient, Cashflow calldata data) external returns (uint256 tokenId);

    /// @notice Gets the cashflow data for a given token ID
    /// @param tokenId The ID of the token
    /// @return The cashflow data
    function getCashflow(uint256 tokenId) external view returns (Cashflow memory);

    /// @notice Gets the owner of a specific token ID
    /// @dev For ERC1155, this returns the address that holds a balance > 0 for the token
    /// @param tokenId The ID of the token
    /// @return The address of the token owner
    function ownerOf(uint256 tokenId) external view returns (address);
}
