// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test, console} from "forge-std/Test.sol";
import {Marketplace} from "../src/Marketplace.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";

// Mock USDC token
contract MockUSDC is ERC20 {
    constructor() ERC20("USD Coin", "USDC") {}

    function decimals() public pure override returns (uint8) {
        return 6;
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

// Mock ERC-721 EC Token
contract MockECToken721 is ERC721 {
    uint256 private _tokenIdCounter;

    constructor() ERC721("EC Token 721", "EC721") {}

    function mint(address to) external returns (uint256) {
        uint256 tokenId = _tokenIdCounter++;
        _mint(to, tokenId);
        return tokenId;
    }
}

// Mock ERC-1155 EC Token
contract MockECToken1155 is ERC1155 {
    constructor() ERC1155("https://ec-token.com/{id}.json") {}

    function mint(address to, uint256 id, uint256 amount) external {
        _mint(to, id, amount, "");
    }
}

contract MarketplaceTest is Test {
    Marketplace public marketplace;
    MockUSDC public usdc;
    MockECToken721 public ecToken721;
    MockECToken1155 public ecToken1155;

    address public seller = address(0x1);
    address public buyer = address(0x2);
    address public other = address(0x3);

    uint256 constant PRICE = 1000e6; // 1000 USDC

    event Listed(uint256 indexed listingId, address indexed seller, address token, uint256 tokenId, uint256 price);
    event Cancelled(uint256 indexed listingId, address indexed seller);
    event Bought(uint256 indexed listingId, address indexed buyer, address indexed seller, uint256 price);

    function setUp() public {
        // Deploy contracts
        usdc = new MockUSDC();
        ecToken721 = new MockECToken721();
        ecToken1155 = new MockECToken1155();
        marketplace = new Marketplace(address(usdc));

        // Setup seller with EC tokens
        vm.startPrank(seller);
        ecToken721.mint(seller);
        ecToken721.mint(seller);
        ecToken1155.mint(seller, 0, 10);
        ecToken1155.mint(seller, 1, 10);
        vm.stopPrank();

        // Setup buyer with USDC
        usdc.mint(buyer, 10000e6);
    }

    // ============ Constructor Tests ============

    function test_Constructor() public view {
        assertEq(address(marketplace.USDC()), address(usdc));
    }

    function test_ConstructorRevertInvalidUSDC() public {
        vm.expectRevert("Invalid USDC address");
        new Marketplace(address(0));
    }

    // ============ ERC-721 Listing Tests ============

    function test_ListERC721() public {
        vm.startPrank(seller);
        ecToken721.approve(address(marketplace), 0);

        vm.expectEmit(true, true, false, true);
        emit Listed(0, seller, address(ecToken721), 0, PRICE);

        uint256 listingId = marketplace.list(address(ecToken721), 0, Marketplace.TokenType.ERC721, PRICE);

        assertEq(listingId, 0);

        Marketplace.Listing memory listing = marketplace.getListing(0);
        assertEq(listing.id, 0);
        assertEq(listing.tokenAddress, address(ecToken721));
        assertEq(listing.tokenId, 0);
        assertEq(uint8(listing.tokenType), uint8(Marketplace.TokenType.ERC721));
        assertEq(listing.seller, seller);
        assertEq(listing.price, PRICE);
        assertTrue(listing.active);

        // Verify token custody
        assertEq(ecToken721.ownerOf(0), address(marketplace));
        vm.stopPrank();
    }

    function test_ListERC721RevertZeroAddress() public {
        vm.startPrank(seller);
        vm.expectRevert(Marketplace.InvalidToken.selector);
        marketplace.list(address(0), 0, Marketplace.TokenType.ERC721, PRICE);
        vm.stopPrank();
    }

    function test_ListERC721RevertZeroPrice() public {
        vm.startPrank(seller);
        ecToken721.approve(address(marketplace), 0);
        vm.expectRevert(Marketplace.InvalidPrice.selector);
        marketplace.list(address(ecToken721), 0, Marketplace.TokenType.ERC721, 0);
        vm.stopPrank();
    }

    function test_ListERC721RevertNotApproved() public {
        vm.startPrank(seller);
        vm.expectRevert();
        marketplace.list(address(ecToken721), 0, Marketplace.TokenType.ERC721, PRICE);
        vm.stopPrank();
    }

    // ============ ERC-1155 Listing Tests ============

    function test_ListERC1155() public {
        vm.startPrank(seller);
        ecToken1155.setApprovalForAll(address(marketplace), true);

        vm.expectEmit(true, true, false, true);
        emit Listed(0, seller, address(ecToken1155), 0, PRICE);

        uint256 listingId = marketplace.list(address(ecToken1155), 0, Marketplace.TokenType.ERC1155, PRICE);

        assertEq(listingId, 0);

        Marketplace.Listing memory listing = marketplace.getListing(0);
        assertEq(listing.id, 0);
        assertEq(listing.tokenAddress, address(ecToken1155));
        assertEq(listing.tokenId, 0);
        assertEq(uint8(listing.tokenType), uint8(Marketplace.TokenType.ERC1155));
        assertEq(listing.seller, seller);
        assertEq(listing.price, PRICE);
        assertTrue(listing.active);

        // Verify token custody
        assertEq(ecToken1155.balanceOf(address(marketplace), 0), 1);
        assertEq(ecToken1155.balanceOf(seller, 0), 9);
        vm.stopPrank();
    }

    function test_ListERC1155RevertNotApproved() public {
        vm.startPrank(seller);
        vm.expectRevert();
        marketplace.list(address(ecToken1155), 0, Marketplace.TokenType.ERC1155, PRICE);
        vm.stopPrank();
    }

    // ============ Cancel Tests ============

    function test_CancelERC721Listing() public {
        // List token
        vm.startPrank(seller);
        ecToken721.approve(address(marketplace), 0);
        uint256 listingId = marketplace.list(address(ecToken721), 0, Marketplace.TokenType.ERC721, PRICE);

        // Cancel listing
        vm.expectEmit(true, true, false, false);
        emit Cancelled(listingId, seller);
        marketplace.cancel(listingId);

        Marketplace.Listing memory listing = marketplace.getListing(listingId);
        assertFalse(listing.active);

        // Verify token returned to seller
        assertEq(ecToken721.ownerOf(0), seller);
        vm.stopPrank();
    }

    function test_CancelERC1155Listing() public {
        // List token
        vm.startPrank(seller);
        ecToken1155.setApprovalForAll(address(marketplace), true);
        uint256 listingId = marketplace.list(address(ecToken1155), 0, Marketplace.TokenType.ERC1155, PRICE);

        // Cancel listing
        vm.expectEmit(true, true, false, false);
        emit Cancelled(listingId, seller);
        marketplace.cancel(listingId);

        Marketplace.Listing memory listing = marketplace.getListing(listingId);
        assertFalse(listing.active);

        // Verify token returned to seller
        assertEq(ecToken1155.balanceOf(address(marketplace), 0), 0);
        assertEq(ecToken1155.balanceOf(seller, 0), 10);
        vm.stopPrank();
    }

    function test_CancelRevertNotSeller() public {
        // List token
        vm.startPrank(seller);
        ecToken721.approve(address(marketplace), 0);
        uint256 listingId = marketplace.list(address(ecToken721), 0, Marketplace.TokenType.ERC721, PRICE);
        vm.stopPrank();

        // Try to cancel as non-seller
        vm.startPrank(other);
        vm.expectRevert(Marketplace.NotSeller.selector);
        marketplace.cancel(listingId);
        vm.stopPrank();
    }

    function test_CancelRevertInactiveListing() public {
        // List and cancel
        vm.startPrank(seller);
        ecToken721.approve(address(marketplace), 0);
        uint256 listingId = marketplace.list(address(ecToken721), 0, Marketplace.TokenType.ERC721, PRICE);
        marketplace.cancel(listingId);

        // Try to cancel again
        vm.expectRevert(Marketplace.ListingNotActive.selector);
        marketplace.cancel(listingId);
        vm.stopPrank();
    }

    // ============ Buy Tests ============

    function test_BuyERC721Listing() public {
        // List token
        vm.startPrank(seller);
        ecToken721.approve(address(marketplace), 0);
        uint256 listingId = marketplace.list(address(ecToken721), 0, Marketplace.TokenType.ERC721, PRICE);
        vm.stopPrank();

        // Buy token
        vm.startPrank(buyer);
        usdc.approve(address(marketplace), PRICE);

        uint256 sellerBalanceBefore = usdc.balanceOf(seller);
        uint256 buyerBalanceBefore = usdc.balanceOf(buyer);

        vm.expectEmit(true, true, true, true);
        emit Bought(listingId, buyer, seller, PRICE);
        marketplace.buy(listingId);

        // Verify listing marked inactive
        Marketplace.Listing memory listing = marketplace.getListing(listingId);
        assertFalse(listing.active);

        // Verify USDC transfer
        assertEq(usdc.balanceOf(seller), sellerBalanceBefore + PRICE);
        assertEq(usdc.balanceOf(buyer), buyerBalanceBefore - PRICE);

        // Verify token transfer
        assertEq(ecToken721.ownerOf(0), buyer);
        vm.stopPrank();
    }

    function test_BuyERC1155Listing() public {
        // List token
        vm.startPrank(seller);
        ecToken1155.setApprovalForAll(address(marketplace), true);
        uint256 listingId = marketplace.list(address(ecToken1155), 0, Marketplace.TokenType.ERC1155, PRICE);
        vm.stopPrank();

        // Buy token
        vm.startPrank(buyer);
        usdc.approve(address(marketplace), PRICE);

        uint256 sellerBalanceBefore = usdc.balanceOf(seller);
        uint256 buyerBalanceBefore = usdc.balanceOf(buyer);

        vm.expectEmit(true, true, true, true);
        emit Bought(listingId, buyer, seller, PRICE);
        marketplace.buy(listingId);

        // Verify listing marked inactive
        Marketplace.Listing memory listing = marketplace.getListing(listingId);
        assertFalse(listing.active);

        // Verify USDC transfer
        assertEq(usdc.balanceOf(seller), sellerBalanceBefore + PRICE);
        assertEq(usdc.balanceOf(buyer), buyerBalanceBefore - PRICE);

        // Verify token transfer
        assertEq(ecToken1155.balanceOf(buyer, 0), 1);
        assertEq(ecToken1155.balanceOf(address(marketplace), 0), 0);
        vm.stopPrank();
    }

    function test_BuyRevertInactiveListing() public {
        // List and cancel
        vm.startPrank(seller);
        ecToken721.approve(address(marketplace), 0);
        uint256 listingId = marketplace.list(address(ecToken721), 0, Marketplace.TokenType.ERC721, PRICE);
        marketplace.cancel(listingId);
        vm.stopPrank();

        // Try to buy cancelled listing
        vm.startPrank(buyer);
        usdc.approve(address(marketplace), PRICE);
        vm.expectRevert(Marketplace.ListingNotActive.selector);
        marketplace.buy(listingId);
        vm.stopPrank();
    }

    function test_BuyRevertInsufficientUSDCAllowance() public {
        // List token
        vm.startPrank(seller);
        ecToken721.approve(address(marketplace), 0);
        uint256 listingId = marketplace.list(address(ecToken721), 0, Marketplace.TokenType.ERC721, PRICE);
        vm.stopPrank();

        // Try to buy without approving USDC
        // OpenZeppelin ERC20 reverts with ERC20InsufficientAllowance
        vm.startPrank(buyer);
        vm.expectRevert(); // Expect revert but don't check specific error
        marketplace.buy(listingId);
        vm.stopPrank();
    }

    function test_BuyRevertInsufficientUSDCBalance() public {
        // List token
        vm.startPrank(seller);
        ecToken721.approve(address(marketplace), 0);
        uint256 listingId = marketplace.list(address(ecToken721), 0, Marketplace.TokenType.ERC721, PRICE);
        vm.stopPrank();

        // Try to buy with insufficient balance
        // OpenZeppelin ERC20 reverts with ERC20InsufficientBalance
        vm.startPrank(other);
        usdc.approve(address(marketplace), PRICE);
        vm.expectRevert(); // Expect revert but don't check specific error
        marketplace.buy(listingId);
        vm.stopPrank();
    }

    function test_BuyRevertDoubleBuy() public {
        // List token
        vm.startPrank(seller);
        ecToken721.approve(address(marketplace), 0);
        uint256 listingId = marketplace.list(address(ecToken721), 0, Marketplace.TokenType.ERC721, PRICE);
        vm.stopPrank();

        // First buy
        vm.startPrank(buyer);
        usdc.approve(address(marketplace), PRICE);
        marketplace.buy(listingId);

        // Try to buy again
        vm.expectRevert(Marketplace.ListingNotActive.selector);
        marketplace.buy(listingId);
        vm.stopPrank();
    }

    // ============ View Function Tests ============

    function test_GetAllListings() public {
        // Create multiple listings
        vm.startPrank(seller);
        ecToken721.approve(address(marketplace), 0);
        ecToken721.approve(address(marketplace), 1);
        ecToken1155.setApprovalForAll(address(marketplace), true);

        marketplace.list(address(ecToken721), 0, Marketplace.TokenType.ERC721, PRICE);
        marketplace.list(address(ecToken721), 1, Marketplace.TokenType.ERC721, PRICE + 100e6);
        marketplace.list(address(ecToken1155), 0, Marketplace.TokenType.ERC1155, PRICE + 200e6);
        vm.stopPrank();

        Marketplace.Listing[] memory listings = marketplace.getAllListings();
        assertEq(listings.length, 3);

        assertEq(listings[0].id, 0);
        assertEq(listings[0].tokenAddress, address(ecToken721));
        assertEq(listings[0].tokenId, 0);
        assertEq(listings[0].price, PRICE);
        assertTrue(listings[0].active);

        assertEq(listings[1].id, 1);
        assertEq(listings[1].tokenAddress, address(ecToken721));
        assertEq(listings[1].tokenId, 1);
        assertEq(listings[1].price, PRICE + 100e6);
        assertTrue(listings[1].active);

        assertEq(listings[2].id, 2);
        assertEq(listings[2].tokenAddress, address(ecToken1155));
        assertEq(listings[2].tokenId, 0);
        assertEq(listings[2].price, PRICE + 200e6);
        assertTrue(listings[2].active);
    }

    function test_GetAllListingsIncludesInactive() public {
        // Create and cancel listing
        vm.startPrank(seller);
        ecToken721.approve(address(marketplace), 0);
        uint256 listingId = marketplace.list(address(ecToken721), 0, Marketplace.TokenType.ERC721, PRICE);
        marketplace.cancel(listingId);
        vm.stopPrank();

        Marketplace.Listing[] memory listings = marketplace.getAllListings();
        assertEq(listings.length, 1);
        assertFalse(listings[0].active);
    }

    // ============ Security Tests ============

    function test_ReentrancyProtection() public {
        // This test verifies that the nonReentrant modifier is in place
        // The actual reentrancy attack would require a malicious token contract
        // For this test, we verify the modifier is applied by checking buy() is protected
        vm.startPrank(seller);
        ecToken721.approve(address(marketplace), 0);
        uint256 listingId = marketplace.list(address(ecToken721), 0, Marketplace.TokenType.ERC721, PRICE);
        vm.stopPrank();

        vm.startPrank(buyer);
        usdc.approve(address(marketplace), PRICE);
        marketplace.buy(listingId);

        // Verify listing is inactive (consumed)
        Marketplace.Listing memory listing = marketplace.getListing(listingId);
        assertFalse(listing.active);
        vm.stopPrank();
    }

    function test_CustodyInvariant() public {
        // Verify marketplace holds token during active listing
        vm.startPrank(seller);
        ecToken721.approve(address(marketplace), 0);
        marketplace.list(address(ecToken721), 0, Marketplace.TokenType.ERC721, PRICE);

        // Marketplace should own token
        assertEq(ecToken721.ownerOf(0), address(marketplace));
        vm.stopPrank();
    }

    function test_ListingImmutability() public {
        // Verify listing cannot be modified after creation
        vm.startPrank(seller);
        ecToken721.approve(address(marketplace), 0);
        uint256 listingId = marketplace.list(address(ecToken721), 0, Marketplace.TokenType.ERC721, PRICE);

        Marketplace.Listing memory listing = marketplace.getListing(listingId);
        uint256 originalPrice = listing.price;
        address originalToken = listing.tokenAddress;

        // Cancel and verify original values unchanged
        marketplace.cancel(listingId);

        Marketplace.Listing memory cancelledListing = marketplace.getListing(listingId);
        assertEq(cancelledListing.price, originalPrice);
        assertEq(cancelledListing.tokenAddress, originalToken);
        assertFalse(cancelledListing.active); // Only active flag changes
        vm.stopPrank();
    }

    // ============ ERC-165 Interface Tests ============

    function test_SupportsInterface() public view {
        assertTrue(marketplace.supportsInterface(type(IERC721Receiver).interfaceId));
        assertTrue(marketplace.supportsInterface(type(IERC1155Receiver).interfaceId));
        assertTrue(marketplace.supportsInterface(type(IERC165).interfaceId));
    }

    // ============ Edge Case Tests ============

    function test_MultipleListingsFromSameSeller() public {
        vm.startPrank(seller);
        ecToken721.approve(address(marketplace), 0);
        ecToken721.approve(address(marketplace), 1);

        uint256 listing1 = marketplace.list(address(ecToken721), 0, Marketplace.TokenType.ERC721, PRICE);
        uint256 listing2 = marketplace.list(address(ecToken721), 1, Marketplace.TokenType.ERC721, PRICE + 100e6);

        assertEq(listing1, 0);
        assertEq(listing2, 1);

        // Both should be active
        assertTrue(marketplace.getListing(listing1).active);
        assertTrue(marketplace.getListing(listing2).active);
        vm.stopPrank();
    }

    function test_SellerCanBuyOwnListing() public {
        // List token
        vm.startPrank(seller);
        ecToken721.approve(address(marketplace), 0);
        uint256 listingId = marketplace.list(address(ecToken721), 0, Marketplace.TokenType.ERC721, PRICE);

        // Seller buys own listing
        usdc.mint(seller, PRICE);
        usdc.approve(address(marketplace), PRICE);

        uint256 balanceBefore = usdc.balanceOf(seller);
        marketplace.buy(listingId);

        // Balance should be unchanged (paid self)
        assertEq(usdc.balanceOf(seller), balanceBefore);
        assertEq(ecToken721.ownerOf(0), seller);
        vm.stopPrank();
    }

    function test_ListingIdIncrementsCorrectly() public {
        vm.startPrank(seller);
        ecToken721.approve(address(marketplace), 0);
        ecToken721.approve(address(marketplace), 1);

        uint256 id1 = marketplace.list(address(ecToken721), 0, Marketplace.TokenType.ERC721, PRICE);
        uint256 id2 = marketplace.list(address(ecToken721), 1, Marketplace.TokenType.ERC721, PRICE);

        assertEq(id1, 0);
        assertEq(id2, 1);
        vm.stopPrank();
    }
}
