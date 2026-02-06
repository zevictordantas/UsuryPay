// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {RBNPrimitive} from "../src/RBNPrimitive.sol";
import {SettlementManager} from "../src/SettlementManager.sol";
import {Marketplace} from "../src/Marketplace.sol";
import {MockUSDC} from "../src/MockUSDC.sol";
import {MockECToken} from "../src/MockECToken.sol";
import {PayrollVaultFactory} from "../src/PayrollVaultFactory.sol";
import {PayrollDApp} from "../src/PayrollDApp.sol";
import {PayrollVault} from "../src/PayrollVault.sol";

contract Deploy is Script {
    function run() external {
        address usdc;
        MockECToken ecToken;
        Marketplace marketplace;
        PayrollVaultFactory vaultFactory;
        PayrollDApp payrollDApp;
        address treasuryAddress;
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        if (block.chainid == 31337) {
            vm.startBroadcast(deployerPrivateKey);
            usdc = address(new MockUSDC());
            treasuryAddress = msg.sender;

            // Fund all anvil accounts with USDC (Play in fronted on local dev enviroment)
            address[] memory wallets = vm.getWallets();
            for (uint256 i = 0; i < wallets.length; i++) {
                MockUSDC(usdc).mint(wallets[i], 1_000_000e6); // 1M USDC each
            }
        } else {
            usdc = vm.envAddress("USDC_ADDRESS");
            treasuryAddress = vm.envAddress("TREASURY_ADDRESS");
            vm.startBroadcast();
        }

        marketplace = new Marketplace(usdc);
        console.log("Marketplace deployed at:", address(marketplace));
        ecToken = new MockECToken();
        console.log("MockECToken deployed at:", address(ecToken));

        // Deploy PayrollVaultFactory
        vaultFactory = new PayrollVaultFactory(address(ecToken), usdc);
        console.log("PayrollVaultFactory deployed at:", address(vaultFactory));

        // Deploy PayrollDApp
        payrollDApp = new PayrollDApp(usdc, address(ecToken), treasuryAddress);
        console.log("PayrollDApp deployed at:", address(payrollDApp));

        if (block.chainid == 31337) {
            // Create test vault for demo
            (uint256 vaultId, address testVault) = vaultFactory.createVault();
            console.log("Test vault created at:", testVault, "with ID:", vaultId);

            // Fund treasury with USDC for buying tokens
            MockUSDC(usdc).mint(treasuryAddress, 100_000e6);
            console.log("Treasury funded with 100,000 USDC");

            // Mint test token
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
        console.log("MockUSDC:              ", usdc);
        console.log("MockECToken:           ", address(ecToken));
        console.log("PayrollVaultFactory:   ", address(vaultFactory));
        console.log("PayrollDApp:           ", address(payrollDApp));
        console.log("Marketplace:           ", address(marketplace));
        console.log("RBNPrimitive:          ", address(rbnPrimitive));
        console.log("SettlementManager:     ", address(settlementManager));
        console.log("=========================================\n");
    }
}
