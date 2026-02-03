// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

interface IEmployerTreasury {
    function deposit(uint256 amount) external;
    
    function pay(uint256 payrollId, address receiver, uint256 amount) external;
    
    function availableBalance() external view returns (uint256);
}