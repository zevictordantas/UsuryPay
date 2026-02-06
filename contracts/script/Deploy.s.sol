// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {RBNPrimitive} from "../src/RBNPrimitive.sol";
import {SettlementManager} from "../src/SettlementManager.sol";
import {Marketplace} from "../src/Marketplace.sol";
import {MockUSDC} from "../src/MockUSDC.sol";
import {MockECToken} from "../src/MockECToken.sol";

contract Deploy is Script {
    function run() external {
        address usdc;
        MockECToken ecToken;
        Marketplace marketplace;
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        if (block.chainid == 31337) {
            vm.startBroadcast(deployerPrivateKey);
            usdc = address(new MockUSDC());
        } else {
            usdc = vm.envAddress("USDC_ADDRESS");
            vm.startBroadcast();
        }

        marketplace = new Marketplace(usdc);
        console.log("Marketplace deployed at:", address(marketplace));
        ecToken = new MockECToken(); // TODO: we need to use the ECToken (Currently RBNPRimitive)
        console.log("MockECToken deployed at:", address(ecToken));

        if (block.chainid == 31337) {
            uint256 startTime = block.timestamp - 1 days;
            uint256 endTime = block.timestamp + 30 days;
            uint256 totalAmount = 1_000e6;
            uint256 ratePerSecond = totalAmount / (endTime - startTime);
            MockECToken.PaymentSchedule memory schedule = MockECToken.PaymentSchedule({
                totalAmount: totalAmount,
                startTime: startTime,
                endTime: endTime,
                ratePerSecond: ratePerSecond,
                customParams: ""
            });
            ecToken.mint(msg.sender, 0, schedule, "");
        }

        // Deploy RBNPrimitive first (with address(0) as initial settlement manager)
        RBNPrimitive rbnPrimitive = new RBNPrimitive(); // TODO: we need to rename RBNPRimitive to ECToken (and update contract or docs)
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
        console.log("MockECToken: ", address(ecToken));
        console.log("Marketplace: ", address(marketplace));
        console.log("=========================================\n");
    }
}
