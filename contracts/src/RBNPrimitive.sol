// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC1155} from "solady/tokens/ERC1155.sol";
import {Ownable} from "solady/auth/Ownable.sol";
import {IRBNPrimitive} from "./interfaces/IRBNPrimitive.sol";

/**
 * @title RBNPrimitive
 * @notice ERC1155 implementation for cashflow rights (Rights-Based NFT)
 * @dev Each token ID represents a unique cashflow right that can be traded
 */
contract RBNPrimitive is ERC1155, Ownable, IRBNPrimitive {
    /// @notice Counter for generating unique token IDs
    uint256 private _nextTokenId;

    /// @notice Mapping from token ID to cashflow data
    mapping(uint256 => Cashflow) private _cashflows;

    /// @notice Mapping from token ID to owner address (for single-owner tracking)
    mapping(uint256 => address) private _tokenOwners;

    /// @notice Address of the settlement manager contract
    address public settlementManager;

    /// @notice Error thrown when querying a non-existent token
    error TokenDoesNotExist();

    /// @notice Modifier to restrict access to settlement manager or owner
    modifier onlySettlementManagerOrOwner() {
        if (msg.sender != settlementManager && msg.sender != owner()) {
            revert Unauthorized();
        }
        _;
    }

    constructor() {
        _initializeOwner(msg.sender);
        _nextTokenId = 1; // Start token IDs at 1
    }

    /// @notice Sets the settlement manager address
    /// @param _settlementManager The address of the settlement manager
    function setSettlementManager(address _settlementManager) external onlyOwner {
        settlementManager = _settlementManager;
    }

    /// @inheritdoc IRBNPrimitive
    function mintCashflow(
        address recipient,
        Cashflow calldata data
    ) external onlySettlementManagerOrOwner returns (uint256 tokenId) {
        tokenId = _nextTokenId++;
        
        _cashflows[tokenId] = data;
        _tokenOwners[tokenId] = recipient;
        
        // Mint 1 token of this ID to the recipient
        _mint(recipient, tokenId, 1, "");
        
        emit CashflowMinted(tokenId, recipient, data);
    }

    /// @inheritdoc IRBNPrimitive
    function getCashflow(uint256 tokenId) external view returns (Cashflow memory) {
        if (_tokenOwners[tokenId] == address(0)) {
            revert TokenDoesNotExist();
        }
        return _cashflows[tokenId];
    }

    /// @inheritdoc IRBNPrimitive
    function ownerOf(uint256 tokenId) external view returns (address) {
        address tokenOwner = _tokenOwners[tokenId];
        if (tokenOwner == address(0)) {
            revert TokenDoesNotExist();
        }
        return tokenOwner;
    }

    /// @notice Returns the URI for a given token ID
    /// @param tokenId The ID of the token
    /// @return The token URI
    function uri(uint256 tokenId) public view override returns (string memory) {
        if (_tokenOwners[tokenId] == address(0)) {
            revert TokenDoesNotExist();
        }
        // TODO: Implement proper metadata URI
        return "";
    }

    /// @dev Override to enable after transfer hooks
    function _useAfterTokenTransfer() internal pure override returns (bool) {
        return true;
    }

    /// @dev Hook that is called after any token transfer to update owner tracking
    function _afterTokenTransfer(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override {
        // Silence unused variable warnings
        (from, amounts, data);
        
        for (uint256 i = 0; i < ids.length; i++) {
            if (to != address(0)) {
                _tokenOwners[ids[i]] = to;
            } else {
                // Burn case
                delete _tokenOwners[ids[i]];
                delete _cashflows[ids[i]];
            }
        }
    }
}
