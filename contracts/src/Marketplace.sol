// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title Marketplace
 * @notice Minimal single-chain marketplace for trading EC tokens (ERC-721 and ERC-1155) for USDC
 * @dev Fixed-price whole-token sales only. No orderbook, no fractionalization, no fees.
 *      Security: Uses reentrancy guard, checks-effects-interactions pattern, and single-use listings.
 */
contract Marketplace is IERC721Receiver, IERC1155Receiver, ReentrancyGuard {
    enum TokenType {
        ERC721,
        ERC1155
    }

    struct Listing {
        uint256 id;
        address tokenAddress;
        uint256 tokenId;
        TokenType tokenType;
        address seller;
        uint256 price; // USDC smallest unit (6 decimals)
        bool active;
    }

    // Immutable USDC address set at deployment
    IERC20 public immutable USDC;

    // Listing storage
    uint256 private _nextListingId;
    mapping(uint256 => Listing) private _listings;

    // Events
    event Listed(uint256 indexed listingId, address indexed seller, address token, uint256 tokenId, uint256 price);
    event Cancelled(uint256 indexed listingId, address indexed seller);
    event Bought(uint256 indexed listingId, address indexed buyer, address indexed seller, uint256 price);

    // Errors
    error InvalidToken();
    error InvalidPrice();
    error ListingNotActive();
    error NotSeller();

    /**
     * @notice Deploys marketplace with USDC address
     * @param _usdc USDC token address for payments
     */
    constructor(address _usdc) {
        require(_usdc != address(0), "Invalid USDC address");
        USDC = IERC20(_usdc);
    }

    /**
     * @notice List an EC token for sale
     * @dev Seller must approve marketplace before calling. Token is escrowed in this contract.
     * @param token EC token address (ERC-721 or ERC-1155)
     * @param tokenId Token ID to list
     * @param tokenType ERC-721 or ERC-1155
     * @param price Sale price in USDC smallest unit (6 decimals)
     * @return listingId ID of created listing
     */
    function list(address token, uint256 tokenId, TokenType tokenType, uint256 price)
        external
        returns (uint256 listingId)
    {
        if (token == address(0)) revert InvalidToken();
        if (price == 0) revert InvalidPrice();

        listingId = _nextListingId++;

        // Store listing
        _listings[listingId] = Listing({
            id: listingId,
            tokenAddress: token,
            tokenId: tokenId,
            tokenType: tokenType,
            seller: msg.sender,
            price: price,
            active: true
        });

        // Escrow token in marketplace (seller must have approved beforehand)
        if (tokenType == TokenType.ERC721) {
            IERC721(token).safeTransferFrom(msg.sender, address(this), tokenId);
        } else {
            // ERC-1155: transfer amount = 1 (whole token only)
            IERC1155(token).safeTransferFrom(msg.sender, address(this), tokenId, 1, "");
        }

        emit Listed(listingId, msg.sender, token, tokenId, price);
    }

    /**
     * @notice Cancel a listing and return token to seller
     * @dev Only seller can cancel. Listing must be active.
     * @param listingId Listing to cancel
     */
    function cancel(uint256 listingId) external {
        Listing storage listing = _listings[listingId];

        if (!listing.active) revert ListingNotActive();
        if (listing.seller != msg.sender) revert NotSeller();

        // Mark inactive before external calls (checks-effects-interactions)
        listing.active = false;

        // Return token to seller
        if (listing.tokenType == TokenType.ERC721) {
            IERC721(listing.tokenAddress).safeTransferFrom(address(this), listing.seller, listing.tokenId);
        } else {
            IERC1155(listing.tokenAddress).safeTransferFrom(address(this), listing.seller, listing.tokenId, 1, "");
        }

        emit Cancelled(listingId, listing.seller);
    }

    /**
     * @notice Buy a listed EC token with USDC
     * @dev Buyer must approve USDC for marketplace before calling.
     *      Atomic: pulls USDC from buyer → transfers to seller → transfers token to buyer.
     *      Reentrancy protected.
     * @param listingId Listing to purchase
     */
    function buy(uint256 listingId) external nonReentrant {
        Listing storage listing = _listings[listingId];

        if (!listing.active) revert ListingNotActive();

        // Mark inactive before external calls (checks-effects-interactions)
        listing.active = false;

        address buyer = msg.sender;
        address seller = listing.seller;
        uint256 price = listing.price;

        // Transfer USDC from buyer to seller (buyer must have approved USDC beforehand)
        // OpenZeppelin ERC20 will revert on failure with detailed error message
        USDC.transferFrom(buyer, seller, price);

        // Transfer token from marketplace to buyer
        if (listing.tokenType == TokenType.ERC721) {
            IERC721(listing.tokenAddress).safeTransferFrom(address(this), buyer, listing.tokenId);
        } else {
            IERC1155(listing.tokenAddress).safeTransferFrom(address(this), buyer, listing.tokenId, 1, "");
        }

        emit Bought(listingId, buyer, seller, price);
    }

    /**
     * @notice Get details of a specific listing
     * @param listingId Listing ID
     * @return Listing struct
     */
    function getListing(uint256 listingId) external view returns (Listing memory) {
        return _listings[listingId];
    }

    /**
     * @notice Get all listings (active and inactive)
     * @dev Not scalable for production but acceptable for demo
     * @return Array of all listings
     */
    function getAllListings() external view returns (Listing[] memory) {
        Listing[] memory allListings = new Listing[](_nextListingId);
        for (uint256 i = 0; i < _nextListingId; i++) {
            allListings[i] = _listings[i];
        }
        return allListings;
    }

    /**
     * @notice ERC-721 receiver callback
     * @dev Required to accept ERC-721 tokens via safeTransferFrom
     */
    function onERC721Received(address, address, uint256, bytes calldata) external pure override returns (bytes4) {
        return this.onERC721Received.selector;
    }

    /**
     * @notice ERC-1155 receiver callback
     * @dev Required to accept ERC-1155 tokens via safeTransferFrom
     */
    function onERC1155Received(address, address, uint256, uint256, bytes calldata)
        external
        pure
        override
        returns (bytes4)
    {
        return this.onERC1155Received.selector;
    }

    /**
     * @notice ERC-1155 batch receiver callback
     * @dev Not used (marketplace only supports single-token sales) but required by interface
     */
    function onERC1155BatchReceived(address, address, uint256[] calldata, uint256[] calldata, bytes calldata)
        external
        pure
        override
        returns (bytes4)
    {
        return this.onERC1155BatchReceived.selector;
    }

    /**
     * @notice ERC-165 support check
     * @dev Required by ERC-1155 receiver interface
     */
    function supportsInterface(bytes4 interfaceId) external pure override returns (bool) {
        return interfaceId == type(IERC721Receiver).interfaceId || interfaceId == type(IERC1155Receiver).interfaceId
            || interfaceId == type(IERC165).interfaceId;
    }
}
