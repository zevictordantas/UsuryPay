// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./interfaces/IECVault.sol";
import "./MockECToken.sol";

/**
 * @title PayrollVault
 * @notice Employer's escrow vault that holds funds and manages salary token minting/claims
 */
contract PayrollVault is IECVault, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public immutable asset;
    MockECToken public immutable ecToken;
    address public immutable employer;
    uint256 public immutable vaultId;

    uint256[] private _mintedTokens;
    mapping(uint256 => DefaultEvent[]) private _defaults;

    uint256 public totalFunded;
    uint256 public defaultCount;
    uint256 public startTime;
    uint256 public endTime;

    constructor(address _asset, address _ecToken, address _employer, uint256 _vaultId) {
        asset = IERC20(_asset);
        ecToken = MockECToken(_ecToken);
        employer = _employer;
        vaultId = _vaultId;
        startTime = block.timestamp;
        endTime = block.timestamp + 365 days;
    }

    modifier onlyEmployer() {
        require(msg.sender == employer, "Only employer");
        _;
    }

    function mintSalaryToken(address employee, uint256 monthlyAmount, uint256 durationMonths)
        external
        onlyEmployer
        returns (uint256 tokenId)
    {
        require(employee != address(0), "Invalid employee");
        require(monthlyAmount > 0, "Invalid amount");
        require(durationMonths > 0, "Invalid duration");

        uint256 totalAmount = monthlyAmount * durationMonths;
        uint256 durationSeconds = durationMonths * 30 days;
        uint256 ratePerSecond = totalAmount / durationSeconds;

        MockECToken.PaymentSchedule memory schedule = MockECToken.PaymentSchedule({
            totalAmount: totalAmount,
            startTime: block.timestamp,
            endTime: block.timestamp + durationSeconds,
            ratePerSecond: ratePerSecond,
            customParams: ""
        });

        tokenId = ecToken.mint(employee, vaultId, schedule, "");
        _mintedTokens.push(tokenId);

        if (endTime < block.timestamp + durationSeconds) {
            endTime = block.timestamp + durationSeconds;
        }
    }

    function fund(uint256 amount) external payable onlyEmployer nonReentrant {
        require(amount > 0, "Amount must be positive");
        asset.safeTransferFrom(msg.sender, address(this), amount);
        totalFunded += amount;
        emit Funded(msg.sender, amount, block.timestamp);
    }

    function claim(uint256 tokenId, uint256 amount)
        external
        nonReentrant
        returns (uint256 claimed, bool defaultOccurred)
    {
        require(_isTokenFromThisVault(tokenId), "Token not from this vault");
        require(ecToken.balanceOf(msg.sender, tokenId) == 1, "Not token owner");

        uint256 claimable = ecToken.getClaimable(tokenId);
        require(claimable >= amount, "Amount exceeds claimable");

        uint256 balance = asset.balanceOf(address(this));

        if (balance >= amount) {
            asset.safeTransfer(msg.sender, amount);
            ecToken.updateClaimed(tokenId, amount);
            claimed = amount;
            defaultOccurred = false;
            emit Claimed(tokenId, msg.sender, amount, block.timestamp);
        } else {
            if (balance > 0) {
                asset.safeTransfer(msg.sender, balance);
                ecToken.updateClaimed(tokenId, balance);
                claimed = balance;
            }

            uint256 shortfall = amount - balance;
            defaultOccurred = true;
            defaultCount++;

            _defaults[tokenId].push(DefaultEvent({timestamp: block.timestamp, shortfall: shortfall, settlementData: ""}));

            emit DefaultDetected(tokenId, shortfall, block.timestamp);
            emit Claimed(tokenId, msg.sender, claimed, block.timestamp);
        }
    }

    function amendDefault(uint256 tokenId, uint256 defaultIndex, bytes calldata settlementData)
        external
        onlyEmployer
    {
        require(_isTokenFromThisVault(tokenId), "Token not from this vault");
        require(defaultIndex < _defaults[tokenId].length, "Invalid default index");

        _defaults[tokenId][defaultIndex].settlementData = settlementData;
        emit DefaultAmended(tokenId, defaultIndex, settlementData);
    }

    function onDefaultDetected(uint256 tokenId, uint256 shortfall) external {
        require(msg.sender == address(ecToken), "Only token contract");
        defaultCount++;
        _defaults[tokenId].push(DefaultEvent({timestamp: block.timestamp, shortfall: shortfall, settlementData: ""}));
        emit DefaultDetected(tokenId, shortfall, block.timestamp);
    }

    function getEmployerCreditScore() external view returns (uint256 score) {
        uint256 required = getRequiredEscrow();
        if (required == 0) return 100;

        uint256 fundingRatio = (totalFunded * 100) / required;

        if (fundingRatio >= 100) {
            score = 100;
        } else if (fundingRatio >= 80) {
            score = 80 + ((fundingRatio - 80) * 20) / 20;
        } else if (fundingRatio >= 50) {
            score = 50 + ((fundingRatio - 50) * 30) / 30;
        } else {
            score = (fundingRatio * 50) / 50;
        }

        if (defaultCount > 0) {
            uint256 penalty = defaultCount * 10;
            if (penalty > score) {
                score = 0;
            } else {
                score -= penalty;
            }
        }
    }

    function getVaultInfo() external view returns (VaultInfo memory) {
        return VaultInfo({
            asset: address(asset),
            startTime: startTime,
            endTime: endTime,
            payer: employer,
            metadata: ""
        });
    }

    function getBalance() external view returns (uint256) {
        return asset.balanceOf(address(this));
    }

    function getRequiredEscrow() public view returns (uint256 required) {
        for (uint256 i = 0; i < _mintedTokens.length; i++) {
            uint256 tokenId = _mintedTokens[i];
            MockECToken.TokenInfo memory info = ecToken.getTokenInfo(tokenId);
            required += (info.schedule.totalAmount - info.claimed);
        }
    }

    function getDefaults(uint256 tokenId) external view returns (DefaultEvent[] memory) {
        return _defaults[tokenId];
    }

    function checkSolvency() external view returns (bool isSolvent, uint256 shortfall) {
        uint256 required = getRequiredEscrow();
        uint256 balance = asset.balanceOf(address(this));

        if (balance >= required) {
            isSolvent = true;
            shortfall = 0;
        } else {
            isSolvent = false;
            shortfall = required - balance;
        }
    }

    function getMintedTokens() external view returns (uint256[] memory) {
        return _mintedTokens;
    }

    function _isTokenFromThisVault(uint256 tokenId) internal view returns (bool) {
        for (uint256 i = 0; i < _mintedTokens.length; i++) {
            if (_mintedTokens[i] == tokenId) return true;
        }
        return false;
    }
}
