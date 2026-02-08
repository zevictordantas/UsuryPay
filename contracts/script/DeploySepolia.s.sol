// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {Marketplace} from "../src/Marketplace.sol";
import {MockECToken} from "../src/MockECToken.sol";
import {PayrollVaultFactory} from "../src/PayrollVaultFactory.sol";
import {PayrollDApp} from "../src/PayrollDApp.sol";
import {PayrollVaultCCTP} from "../src/PayrollVaultCCTP.sol";
import {CCTPDomains} from "../src/CCTPDomains.sol";

/**
 * @title DeploySepolia
 * @notice Deploy script for Sepolia testnet with CCTP integration
 * @dev Uses real CCTP contracts and Circle's testnet USDC
 *
 * Environment variables required:
 * - PRIVATE_KEY: Deployer's private key
 *
 * Run with:
 * forge script script/DeploySepolia.s.sol:DeploySepolia --rpc-url sepolia --broadcast --verify
 */
contract DeploySepolia is Script {
    // Sepolia CCTP addresses from CCTPDomains library
    address constant USDC = CCTPDomains.SEPOLIA_USDC;
    address constant TOKEN_MESSENGER = CCTPDomains.SEPOLIA_TOKEN_MESSENGER;
    address constant MESSAGE_TRANSMITTER = CCTPDomains.SEPOLIA_MESSAGE_TRANSMITTER;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        console.log("Deploying to Sepolia with account:", deployer);
        console.log("Using USDC:", USDC);
        console.log("Using CCTP TokenMessenger:", TOKEN_MESSENGER);
        console.log("Using CCTP MessageTransmitter:", MESSAGE_TRANSMITTER);

        vm.startBroadcast(deployerPrivateKey);

        // Deploy core contracts
        MockECToken ecToken = new MockECToken();
        console.log("MockECToken deployed at:", address(ecToken));

        Marketplace marketplace = new Marketplace(USDC);
        console.log("Marketplace deployed at:", address(marketplace));

        // Deploy PayrollVaultFactory (will need modification to create CCTP vaults)
        PayrollVaultFactory vaultFactory = new PayrollVaultFactory(address(ecToken), USDC);
        console.log("PayrollVaultFactory deployed at:", address(vaultFactory));

        // Deploy PayrollDApp (25% resale margin)
        PayrollDApp payrollDApp = new PayrollDApp(USDC, address(ecToken), address(marketplace), 2500);
        console.log("PayrollDApp deployed at:", address(payrollDApp));

        // Deploy a demo CCTP-enabled vault
        PayrollVaultCCTP demoVault = new PayrollVaultCCTP(
            USDC,
            address(ecToken),
            deployer, // employer
            0, // vaultId
            TOKEN_MESSENGER,
            MESSAGE_TRANSMITTER
        );
        console.log("Demo PayrollVaultCCTP deployed at:", address(demoVault));

        // Register vault with ECToken
        ecToken.setVault(0, address(demoVault));

        vm.stopBroadcast();

        // Log deployment summary
        console.log("\n========== Sepolia Deployment Summary ==========");
        console.log("Chain ID:              ", block.chainid);
        console.log("USDC (Circle):         ", USDC);
        console.log("CCTP TokenMessenger:   ", TOKEN_MESSENGER);
        console.log("CCTP MessageTransmitter:", MESSAGE_TRANSMITTER);
        console.log("------------------------------------------------");
        console.log("MockECToken:           ", address(ecToken));
        console.log("Marketplace:           ", address(marketplace));
        console.log("PayrollVaultFactory:   ", address(vaultFactory));
        console.log("PayrollDApp:           ", address(payrollDApp));
        console.log("Demo PayrollVaultCCTP: ", address(demoVault));
        console.log("================================================\n");
    }
}
