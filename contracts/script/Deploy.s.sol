// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Script, console} from "forge-std/Script.sol";
import {Marketplace} from "../src/Marketplace.sol";
import {MockUSDC} from "../src/MockUSDC.sol";
import {MockECToken} from "../src/MockECToken.sol";

contract Deploy is Script {
    function run() external {
        address usdc;
        MockECToken ecToken;

        if (block.chainid == 31337) {
            vm.startBroadcast();
            usdc = address(new MockUSDC());
        } else {
            usdc = vm.envAddress("USDC_ADDRESS");
            vm.startBroadcast();
        }

        new Marketplace(usdc);
        ecToken = new MockECToken();

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

        vm.stopBroadcast();
    }
}
