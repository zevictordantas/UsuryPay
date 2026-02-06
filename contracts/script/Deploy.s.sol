// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {RBNPrimitive} from "../src/RBNPrimitive.sol";
import {SettlementManager} from "../src/SettlementManager.sol";

/**
 * @title Deploy
 * @notice Deployment script for RBNPrimitive and SettlementManager contracts
 * @dev Run with: forge script script/Deploy.s.sol --rpc-url <RPC_URL> --broadcast
 */
contract Deploy is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy RBNPrimitive first (with address(0) as initial settlement manager)
        RBNPrimitive rbnPrimitive = new RBNPrimitive();
        console.log("RBNPrimitive deployed at:", address(rbnPrimitive));
        
        // Deploy SettlementManager with RBNPrimitive address
        SettlementManager settlementManager = new SettlementManager(address(rbnPrimitive));
        console.log("SettlementManager deployed at:", address(settlementManager));
        
        // Configure RBNPrimitive with SettlementManager address
        rbnPrimitive.setSettlementManager(address(settlementManager));
        console.log("RBNPrimitive configured with SettlementManager");
        
        vm.stopBroadcast();
        
        // Log deployment summary
        console.log("\n========== Deployment Summary ==========");
        console.log("RBNPrimitive:      ", address(rbnPrimitive));
        console.log("SettlementManager: ", address(settlementManager));
        console.log("=========================================\n");
    }
}
