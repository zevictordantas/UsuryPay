// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../interfaces/IPayrollMarketplace.sol";
import "../interfaces/IRBNToken.sol";
import "../core/RBNToken.sol";

contract PayrollMarketplace is IPayrollMarketplace {
    IERC20 public usdc;
    RBNToken public rbnToken;
    address public daoTreasury;
    
    struct Listing {
        uint256 rbnId;
        uint256 price;
        bool active;
    }
    
    mapping(uint256 => Listing) public listings;
    uint256[] public activeListings;
    
    constructor(
        address _usdcAddress,
        address _rbnTokenAddress,
        address _daoTreasury
    ) {
        usdc = IERC20(_usdcAddress);
        rbnToken = RBNToken(_rbnTokenAddress);
        daoTreasury = _daoTreasury;
    }
    
    function buy(uint256 rbnId, uint256 price) external override {
        Listing memory listing = listings[rbnId];
        require(listing.active, "Not for sale");
        require(listing.price == price, "Price mismatch");
        require(price > 0, "Price must be > 0");
        
        // TODO: Validate seller is DAO (rbnToken.ownerOf(rbnId) == daoTreasury)
        require(rbnToken.ownerOf(rbnId) == daoTreasury, "Not DAO-owned");
        // TODO: Add proper token transfer safety
        
        // Check buyer has sufficient USDC
        require(usdc.balanceOf(msg.sender) >= price, "Insufficient USDC");
        require(usdc.allowance(msg.sender, address(this)) >= price, "USDC not approved");
        
        // Transfer USDC to DAO
        uint256 daoBalanceBefore = usdc.balanceOf(daoTreasury);
        usdc.transferFrom(msg.sender, daoTreasury, price);
        require(usdc.balanceOf(daoTreasury) == daoBalanceBefore + price, "USDC transfer failed");
        
        // Transfer RBN to buyer
        rbnToken.transferFrom(daoTreasury, msg.sender, rbnId);
        
        // Deactivate listing
        listings[rbnId].active = false;
        
        // Remove from active listings array
        removeFromActiveListings(rbnId);
        
        emit RBNSold(rbnId, msg.sender, price);
    }
    
    // TODO: Add listing creation function (DAO only)
    // function createListing(uint256 rbnId, uint256 price) external {
    //     require(msg.sender == daoOwner, "DAO only");
    // }
    
    // Simple function for testing - creates mock listings
    function createTestListing(uint256 rbnId, uint256 price) external {
        // TODO: Add access control - only DAO should create listings
        require(rbnToken.ownerOf(rbnId) == daoTreasury, "Not DAO-owned");
        require(!listings[rbnId].active, "Already listed");
        
        listings[rbnId] = Listing({
            rbnId: rbnId,
            price: price,
            active: true
        });
        
        activeListings.push(rbnId);
        
        emit ListingCreated(rbnId, price);
    }
    
    function getActiveListings() external view returns (uint256[] memory) {
        return activeListings;
    }
    
    function getListing(uint256 rbnId) external view returns (Listing memory) {
        return listings[rbnId];
    }
    
    // TODO: Add function to get available DAO RBNs
    // This will need custom RBNToken logic
    // function getAvailableRBNs() external view returns (uint256[] memory) {
    //     // TODO: Implement when RBNToken logic is ready
    //     // Need custom function to get DAO-owned tokens
    // }
    
    function removeFromActiveListings(uint256 rbnId) internal {
        for (uint256 i = 0; i < activeListings.length; i++) {
            if (activeListings[i] == rbnId) {
                activeListings[i] = activeListings[activeListings.length - 1];
                activeListings.pop();
                break;
            }
        }
    }
    
    event ListingCreated(uint256 indexed rbnId, uint256 price);
    event RBNSold(uint256 indexed rbnId, address indexed buyer, uint256 price);
}