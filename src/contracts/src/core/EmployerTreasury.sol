// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../interfaces/IEmployerTreasury.sol";

contract EmployerTreasury is IEmployerTreasury {
    // TODO: Add ownership pattern in future iteration
    IERC20 public usdc;
    address public employer;
    
    constructor(address _usdcAddress, address _employer) {
        usdc = IERC20(_usdcAddress);
        employer = _employer;
    }
    
    function deposit(uint256 amount) external override {
        // TODO: Add reentrancy guard
        require(amount > 0, "Amount must be > 0");
        
        uint256 currentBalance = usdc.balanceOf(address(this));
        usdc.transferFrom(msg.sender, address(this), amount);
        
        // Verify transfer succeeded
        require(usdc.balanceOf(address(this)) == currentBalance + amount, "Transfer failed");
    }
    
    function pay(uint256 payrollId, address receiver, uint256 amount) external override {
        // TODO: Add access control for pay() function in future iteration
        // TODO: Add reentrancy guard
        require(receiver != address(0), "Invalid receiver");
        require(amount > 0, "Amount must be > 0");
        require(usdc.balanceOf(address(this)) >= amount, "Insufficient balance");
        
        // TODO: Handle transfer failures gracefully
        uint256 receiverBalanceBefore = usdc.balanceOf(receiver);
        usdc.transfer(receiver, amount);
        
        // Verify transfer succeeded
        require(usdc.balanceOf(receiver) == receiverBalanceBefore + amount, "Payment failed");
    }
    
    function availableBalance() external view override returns (uint256) {
        return usdc.balanceOf(address(this));
    }
}