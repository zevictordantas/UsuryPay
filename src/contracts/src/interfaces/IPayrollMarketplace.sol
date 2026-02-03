// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

interface IPayrollMarketplace {
    function buy(uint256 rbnId, uint256 price) external;
}