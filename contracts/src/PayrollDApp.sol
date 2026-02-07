// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "./MockECToken.sol";
import "./PayrollVault.sol";
import "./Marketplace.sol";

/**
 * @title PayrollDApp
 * @notice Treasury contract that buys EC tokens from employees at risk-adjusted discounts
 *         and automatically lists them on the marketplace for resale
 */
contract PayrollDApp is ReentrancyGuard, ERC165, IERC1155Receiver {
    using SafeERC20 for IERC20;

    IERC20 public immutable paymentToken;
    MockECToken public immutable ecToken;
    Marketplace public immutable marketplace;
    uint256 public resaleProfitMargin; // Basis points (e.g., 500 = 5%)

    mapping(uint256 => bool) public ownedTokens;

    event TokenPurchased(uint256 indexed tokenId, address indexed seller, uint256 amount, uint256 futureValue);
    event TokenClaimed(uint256 indexed tokenId, uint256 amount);
    event TokenListedOnMarketplace(uint256 indexed tokenId, uint256 indexed listingId, uint256 resalePrice);

    constructor(address _paymentToken, address _ecToken, address _marketplace, uint256 _resaleProfitMargin) {
        paymentToken = IERC20(_paymentToken);
        ecToken = MockECToken(_ecToken);
        marketplace = Marketplace(_marketplace);
        resaleProfitMargin = _resaleProfitMargin;

        // Approve marketplace to transfer EC tokens (for listing)
        ecToken.setApprovalForAll(address(marketplace), true);
    }

    /**
     * @notice Sell EC token to PayrollDApp for immediate liquidity
     * @param tokenId EC token ID to sell
     */
    function sellToken(uint256 tokenId) external nonReentrant {
        require(ecToken.balanceOf(msg.sender, tokenId) == 1, "Not token owner");

        // Calculate offer amount using risk-adjusted pricing
        (, uint256 futureValue, uint256 offerAmount) = getECTokenValue(tokenId);

        ownedTokens[tokenId] = true;

        // Transfer EC token from employee to this contract
        ecToken.safeTransferFrom(msg.sender, address(this), tokenId, 1, "");

        // Pay employee immediately from PayrollDApp's own balance
        paymentToken.safeTransfer(msg.sender, offerAmount);

        emit TokenPurchased(tokenId, msg.sender, offerAmount, futureValue);

        // Auto-list on marketplace for resale
        _listOnMarketplace(tokenId, offerAmount, futureValue);
    }

    function claimFromToken(uint256 tokenId) external nonReentrant {
        require(ownedTokens[tokenId], "Not owned by dApp");

        address vault = ecToken.getVault(tokenId);
        uint256 claimable = ecToken.getClaimable(tokenId);

        require(claimable > 0, "Nothing to claim");

        PayrollVault(vault).claim(tokenId, claimable);

        emit TokenClaimed(tokenId, claimable);
    }

    function getECTokenValue(uint256 tokenId)
        public
        view
        returns (uint256 currentValue, uint256 futureValue, uint256 discountedValue)
    {
        MockECToken.TokenInfo memory info = ecToken.getTokenInfo(tokenId);

        currentValue = ecToken.getClaimable(tokenId);

        futureValue = info.schedule.totalAmount - info.claimed;

        address vault = ecToken.getVault(tokenId);
        uint256 creditScore = PayrollVault(vault).getEmployerCreditScore();

        uint256 baseRate = 60; // Base rate: 60% of future value

        uint256 creditAdj;
        if (creditScore >= 80) {
            creditAdj = 100;
        } else if (creditScore >= 50) {
            creditAdj = 95;
        } else {
            creditAdj = 85;
        }

        uint256 timeRemaining = info.schedule.endTime > block.timestamp
            ? info.schedule.endTime - block.timestamp
            : 0;

        uint256 timeAdj;
        if (timeRemaining <= 90 days) {
            timeAdj = 100;
        } else if (timeRemaining <= 180 days) {
            timeAdj = 98;
        } else {
            timeAdj = 95;
        }

        discountedValue = (futureValue * baseRate * creditAdj * timeAdj) / (100 * 100 * 100);
    }

    function getEmployerCreditScore(address vault) external view returns (uint256) {
        return PayrollVault(vault).getEmployerCreditScore();
    }

    /**
     * @notice Check if PayrollDApp has enough USDC balance to buy a token
     * @param tokenId EC token ID to check
     * @return hasBalance Whether PayrollDApp has enough USDC
     * @return currentBalance PayrollDApp's current USDC balance
     * @return neededAmount Amount needed for this token
     */
    function checkBalance(uint256 tokenId) external view returns (
        bool hasBalance,
        uint256 currentBalance,
        uint256 neededAmount
    ) {
        (, , uint256 offerAmount) = getECTokenValue(tokenId);
        currentBalance = paymentToken.balanceOf(address(this));
        neededAmount = offerAmount;
        hasBalance = currentBalance >= neededAmount;
    }

    /**
     * @notice Get PayrollDApp's current USDC balance
     * @return Current USDC balance
     */
    function getBalance() external view returns (uint256) {
        return paymentToken.balanceOf(address(this));
    }

    function onERC1155Received(address, address, uint256, uint256, bytes calldata)
        external
        pure
        override
        returns (bytes4)
    {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(address, address, uint256[] calldata, uint256[] calldata, bytes calldata)
        external
        pure
        override
        returns (bytes4)
    {
        return this.onERC1155BatchReceived.selector;
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, IERC165) returns (bool) {
        return interfaceId == type(IERC1155Receiver).interfaceId || super.supportsInterface(interfaceId);
    }

    /**
     * @notice Internal function to list purchased EC token on marketplace
     * @param tokenId EC token ID to list
     * @param purchasePrice What PayrollDApp paid for the token
     * @param futureValue Future value of the token
     */
    function _listOnMarketplace(uint256 tokenId, uint256 purchasePrice, uint256 futureValue) internal {
        // Calculate resale price: purchase price + profit margin
        // Example: if we paid 9000 USDC and resaleProfitMargin is 500 (5%),
        // resale = 9000 + (9000 * 500 / 10000) = 9450 USDC
        uint256 resalePrice = purchasePrice + (purchasePrice * resaleProfitMargin / 10000);

        // Cap resale price at future value (don't list above what it's worth)
        if (resalePrice > futureValue) {
            resalePrice = futureValue;
        }

        // List on marketplace (marketplace already has approval via setApprovalForAll in constructor)
        uint256 listingId = marketplace.list(
            address(ecToken),
            tokenId,
            Marketplace.TokenType.ERC1155,
            resalePrice
        );

        emit TokenListedOnMarketplace(tokenId, listingId, resalePrice);
    }
}
