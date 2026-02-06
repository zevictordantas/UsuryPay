// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

/**
 * @title MockECToken
 * @notice Minimal ERC-1155 mock for local EC marketplace flows.
 * @dev Implements core IECToken-style view functions for demo use.
 */
contract MockECToken is ERC1155 {
    struct PaymentSchedule {
        uint256 totalAmount;
        uint256 startTime;
        uint256 endTime;
        uint256 ratePerSecond;
        bytes customParams;
    }

    struct TokenInfo {
        uint256 vaultId;
        PaymentSchedule schedule;
        uint256 claimed;
        bytes metadata;
    }

    event TokenMinted(uint256 indexed tokenId, uint256 indexed vaultId, address indexed recipient);
    event Claimed(uint256 indexed tokenId, uint256 amount, uint256 newClaimedTotal);

    uint256 private _nextTokenId;
    mapping(uint256 => TokenInfo) private _tokenInfo;
    mapping(uint256 => address) private _vaults;

    constructor() ERC1155("") {}

    function setVault(uint256 vaultId, address vault) external {
        _vaults[vaultId] = vault;
    }

    function getTokenInfo(uint256 tokenId) external view returns (TokenInfo memory) {
        return _tokenInfo[tokenId];
    }

    function getVault(uint256 tokenId) external view returns (address) {
        return _vaults[_tokenInfo[tokenId].vaultId];
    }

    function calculateEntitled(uint256 tokenId, uint256 timestamp) public view returns (uint256 entitled) {
        PaymentSchedule memory schedule = _tokenInfo[tokenId].schedule;
        if (timestamp <= schedule.startTime) return 0;
        uint256 elapsed = timestamp - schedule.startTime;
        uint256 duration = schedule.endTime - schedule.startTime;
        if (elapsed > duration) elapsed = duration;
        entitled = schedule.ratePerSecond * elapsed;
        if (entitled > schedule.totalAmount) {
            entitled = schedule.totalAmount;
        }
    }

    function getClaimable(uint256 tokenId) external view returns (uint256 claimable) {
        uint256 entitled = calculateEntitled(tokenId, block.timestamp);
        uint256 claimed = _tokenInfo[tokenId].claimed;
        if (entitled <= claimed) return 0;
        return entitled - claimed;
    }

    function getEffectiveClaimable(uint256 tokenId)
        external
        view
        returns (uint256 effectiveClaimable, uint256 shortfall)
    {
        effectiveClaimable = this.getClaimable(tokenId);
        shortfall = 0;
    }

    function mint(address recipient, uint256 vaultId, PaymentSchedule calldata schedule, bytes calldata metadata)
        external
        returns (uint256 tokenId)
    {
        tokenId = ++_nextTokenId;
        _tokenInfo[tokenId] = TokenInfo({vaultId: vaultId, schedule: schedule, claimed: 0, metadata: metadata});
        _mint(recipient, tokenId, 1, "");
        emit TokenMinted(tokenId, vaultId, recipient);
    }

    function claim(uint256 tokenId, uint256 amount) external {
        require(balanceOf(msg.sender, tokenId) == 1, "Not token owner");
        uint256 entitled = calculateEntitled(tokenId, block.timestamp);
        uint256 claimed = _tokenInfo[tokenId].claimed;
        require(entitled > claimed, "Nothing claimable");
        uint256 claimable = entitled - claimed;
        require(amount <= claimable, "Amount exceeds claimable");
        _tokenInfo[tokenId].claimed = claimed + amount;
        emit Claimed(tokenId, amount, claimed + amount);
    }
}
