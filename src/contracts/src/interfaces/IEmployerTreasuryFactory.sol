// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

interface IEmployerTreasuryFactory {
    function createTreasury(address employer) external returns (address treasury);
    function getTreasury(address employer) external view returns (address treasury);
    
    event TreasuryCreated(address indexed employer, address treasury);
}