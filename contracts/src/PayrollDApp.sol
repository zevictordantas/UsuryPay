// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "./MockECToken.sol";
import "./PayrollVault.sol";

/**
 * @title PayrollDApp
 * @notice Treasury contract that buys EC tokens from employees at risk-adjusted discounts
 */
contract PayrollDApp is ReentrancyGuard, ERC165, IERC1155Receiver {
    using SafeERC20 for IERC20;

    IERC20 public immutable paymentToken;
    MockECToken public immutable ecToken;
    address public treasury;

    struct PurchaseOffer {
        uint256 tokenId;
        uint256 offerAmount;
        uint256 futureValue;
        uint256 expiresAt;
        address seller;
        bool isActive;
    }

    mapping(bytes32 => PurchaseOffer) public offers;
    mapping(uint256 => bool) public ownedTokens;

    event OfferCreated(bytes32 indexed offerHash, uint256 indexed tokenId, address indexed seller, uint256 offerAmount, uint256 expiresAt);
    event OfferAccepted(bytes32 indexed offerHash, uint256 indexed tokenId, address seller, uint256 amount);
    event TokenClaimed(uint256 indexed tokenId, uint256 amount);

    constructor(address _paymentToken, address _ecToken, address _treasury) {
        paymentToken = IERC20(_paymentToken);
        ecToken = MockECToken(_ecToken);
        treasury = _treasury;
    }

    function requestQuote(uint256 tokenId)
        external
        returns (bytes32 offerHash, uint256 offerAmount, uint256 expiresAt)
    {
        require(ecToken.balanceOf(msg.sender, tokenId) == 1, "Not token owner");

        (, uint256 futureValue, uint256 discountedValue) = getECTokenValue(tokenId);

        offerAmount = discountedValue;
        expiresAt = block.timestamp + 24 hours;

        offerHash = keccak256(abi.encodePacked(tokenId, msg.sender, offerAmount, expiresAt, block.timestamp));

        offers[offerHash] = PurchaseOffer({
            tokenId: tokenId,
            offerAmount: offerAmount,
            futureValue: futureValue,
            expiresAt: expiresAt,
            seller: msg.sender,
            isActive: true
        });

        emit OfferCreated(offerHash, tokenId, msg.sender, offerAmount, expiresAt);
    }

    function acceptOffer(bytes32 offerHash) external nonReentrant {
        PurchaseOffer storage offer = offers[offerHash];

        require(offer.isActive, "Offer not active");
        require(block.timestamp <= offer.expiresAt, "Offer expired");
        require(msg.sender == offer.seller, "Not the seller");
        require(ecToken.balanceOf(msg.sender, offer.tokenId) == 1, "Not token owner");

        offer.isActive = false;
        ownedTokens[offer.tokenId] = true;

        ecToken.safeTransferFrom(msg.sender, address(this), offer.tokenId, 1, "");

        paymentToken.safeTransferFrom(treasury, msg.sender, offer.offerAmount);

        emit OfferAccepted(offerHash, offer.tokenId, msg.sender, offer.offerAmount);
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

        uint256 baseRate = 90;

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

    function getOffer(bytes32 offerHash) external view returns (PurchaseOffer memory) {
        return offers[offerHash];
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
}
