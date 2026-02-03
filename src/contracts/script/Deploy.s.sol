// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/core/PayrollManager.sol";
import "../src/core/EmployerTreasury.sol";
import "../src/core/EmployerTreasuryFactory.sol";
import "../src/core/PayrollMarketplace.sol";
import "../src/core/RBNToken.sol";
import "../src/mocks/MockUSDC.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        // WARNING: In production, deploy factory via multisig/DAO for security
        
        // Deploy MockUSDC for testing
        MockUSDC mockUSDC = new MockUSDC();
        console.log("MockUSDC deployed to:", address(mockUSDC));

        // Deploy DAO address (using deployer for now)
        address daoAddress = msg.sender;
        console.log("DAO address:", daoAddress);

        // Deploy core contracts
        RBNToken rbnToken = new RBNToken(daoAddress);
        console.log("RBNToken deployed to:", address(rbnToken));

        EmployerTreasuryFactory factory = new EmployerTreasuryFactory(address(mockUSDC));
        console.log("EmployerTreasuryFactory deployed to:", address(factory));

        PayrollManager payrollManager = new PayrollManager();
        console.log("PayrollManager deployed to:", address(payrollManager));

        PayrollMarketplace marketplace = new PayrollMarketplace(address(mockUSDC), address(rbnToken), daoAddress);
        console.log("PayrollMarketplace deployed to:", address(marketplace));

        // Mint some test RBNs to DAO
        uint256 rbnId1 = rbnToken.mintToDao("ipfs://test-metadata-1");
        uint256 rbnId2 = rbnToken.mintToDao("ipfs://test-metadata-2");
        console.log("Test RBNs minted:", rbnId1, rbnId2);

        // Create test listings
        marketplace.createTestListing(rbnId1, 1000 * 10 ** 6); // 1000 USDC
        marketplace.createTestListing(rbnId2, 1500 * 10 ** 6); // 1500 USDC
        console.log("Test listings created");

        // Give deployer some USDC for testing
        mockUSDC.mint(msg.sender, 10000 * 10 ** 6); // 10,000 USDC
        console.log("Test USDC minted to deployer");

        vm.stopBroadcast();

        console.log("\n=== Deployment Summary ===");
        console.log("MockUSDC:", address(mockUSDC));
        console.log("RBNToken:", address(rbnToken));
        console.log("EmployerTreasuryFactory:", address(factory));
        console.log("PayrollManager:", address(payrollManager));
        console.log("PayrollMarketplace:", address(marketplace));
        console.log("DAO Address:", daoAddress);
    }
}
