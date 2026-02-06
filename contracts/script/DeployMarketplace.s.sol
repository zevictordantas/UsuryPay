// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Script, console} from "forge-std/Script.sol";
import {Marketplace} from "../src/Marketplace.sol";

/**
 * @title DeployMarketplace
 * @notice Deployment script for Marketplace contract
 * @dev Usage:
 *      forge script script/DeployMarketplace.s.sol:DeployMarketplace --rpc-url <RPC_URL> --broadcast --verify
 *
 *      Environment variables:
 *      - USDC_ADDRESS: USDC token address (required)
 *      - PRIVATE_KEY: Deployer private key (required for --broadcast)
 */
contract DeployMarketplace is Script {
    function run() external returns (Marketplace) {
        // Get USDC address from environment
        address usdcAddress = vm.envAddress("USDC_ADDRESS");
        require(usdcAddress != address(0), "USDC_ADDRESS not set");

        console.log("Deploying Marketplace with USDC:", usdcAddress);

        vm.startBroadcast();

        Marketplace marketplace = new Marketplace(usdcAddress);

        vm.stopBroadcast();

        console.log("Marketplace deployed at:", address(marketplace));

        return marketplace;
    }
}
