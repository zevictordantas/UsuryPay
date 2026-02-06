// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {PayrollVaultFactory} from "../src/PayrollVaultFactory.sol";
import {PayrollVault} from "../src/PayrollVault.sol";
import {MockECToken} from "../src/MockECToken.sol";
import {MockUSDC} from "../src/MockUSDC.sol";

contract PayrollVaultFactoryTest is Test {
    PayrollVaultFactory factory;
    MockECToken ecToken;
    MockUSDC usdc;

    address employer = address(0x1);

    function setUp() public {
        usdc = new MockUSDC();
        ecToken = new MockECToken();
        factory = new PayrollVaultFactory(address(ecToken), address(usdc));
    }

    function testCreateVault() public {
        vm.prank(employer);
        (uint256 vaultId, address vaultAddress) = factory.createVault();

        assertEq(vaultId, 0);
        assertTrue(vaultAddress != address(0));
        assertEq(factory.vaults(vaultId), vaultAddress);
    }

    function testGetEmployerVaults() public {
        vm.startPrank(employer);
        factory.createVault();
        factory.createVault();
        vm.stopPrank();

        uint256[] memory vaults = factory.getEmployerVaults(employer);
        assertEq(vaults.length, 2);
        assertEq(vaults[0], 0);
        assertEq(vaults[1], 1);
    }

    function testVaultConfiguration() public {
        vm.prank(employer);
        (, address vaultAddress) = factory.createVault();

        PayrollVault vault = PayrollVault(vaultAddress);
        assertEq(vault.employer(), employer);
        assertEq(address(vault.asset()), address(usdc));
        assertEq(address(vault.ecToken()), address(ecToken));
    }

    function testMultipleEmployers() public {
        address employer2 = address(0x2);

        vm.prank(employer);
        (uint256 vault1Id,) = factory.createVault();

        vm.prank(employer2);
        (uint256 vault2Id,) = factory.createVault();

        assertEq(vault1Id, 0);
        assertEq(vault2Id, 1);

        uint256[] memory employer1Vaults = factory.getEmployerVaults(employer);
        uint256[] memory employer2Vaults = factory.getEmployerVaults(employer2);

        assertEq(employer1Vaults.length, 1);
        assertEq(employer2Vaults.length, 1);
    }
}
