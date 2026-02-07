// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {PayrollVault} from "../src/PayrollVault.sol";
import {MockECToken} from "../src/MockECToken.sol";
import {MockUSDC} from "../src/MockUSDC.sol";
import {IECVault} from "../src/interfaces/IECVault.sol";

contract PayrollVaultTest is Test {
    PayrollVault vault;
    MockECToken ecToken;
    MockUSDC usdc;

    address employer = address(0x1);
    address employee = address(0x2);

    function setUp() public {
        usdc = new MockUSDC();
        ecToken = new MockECToken();

        vm.prank(employer);
        vault = new PayrollVault(address(usdc), address(ecToken), employer, 0);

        ecToken.setVault(0, address(vault));

        usdc.mint(employer, 100_000e6);
    }

    function testMintSalaryToken() public {
        uint256 monthlyAmount = 5_000e6;
        uint256 durationMonths = 12;

        vm.prank(employer);
        uint256 tokenId = vault.mintSalaryToken(employee, monthlyAmount, durationMonths);

        assertEq(tokenId, 1);
        assertEq(ecToken.balanceOf(employee, tokenId), 1);
    }

    function testFundVault() public {
        uint256 fundAmount = 50_000e6;

        vm.startPrank(employer);
        usdc.approve(address(vault), fundAmount);
        vault.fund(fundAmount);
        vm.stopPrank();

        assertEq(vault.getBalance(), fundAmount);
        assertEq(vault.totalFunded(), fundAmount);
    }

    function testClaimFromToken() public {
        uint256 monthlyAmount = 5_000e6;
        uint256 durationMonths = 1;

        vm.prank(employer);
        uint256 tokenId = vault.mintSalaryToken(employee, monthlyAmount, durationMonths);

        uint256 fundAmount = 10_000e6;
        vm.startPrank(employer);
        usdc.approve(address(vault), fundAmount);
        vault.fund(fundAmount);
        vm.stopPrank();

        vm.warp(block.timestamp + 15 days);

        uint256 claimable = ecToken.getClaimable(tokenId);
        assertGt(claimable, 0);

        vm.prank(employee);
        (uint256 claimed, bool defaultOccurred) = vault.claim(tokenId, claimable);

        assertEq(claimed, claimable);
        assertFalse(defaultOccurred);
        assertEq(usdc.balanceOf(employee), claimable);
    }

    function testDefaultDetection() public {
        uint256 monthlyAmount = 5_000e6;
        uint256 durationMonths = 1;

        vm.prank(employer);
        uint256 tokenId = vault.mintSalaryToken(employee, monthlyAmount, durationMonths);

        vm.warp(block.timestamp + 15 days);

        uint256 claimable = ecToken.getClaimable(tokenId);

        vm.prank(employee);
        (uint256 claimed, bool defaultOccurred) = vault.claim(tokenId, claimable);

        assertEq(claimed, 0);
        assertTrue(defaultOccurred);
        assertEq(vault.defaultCount(), 1);
    }

    function testCreditScore() public {
        uint256 monthlyAmount = 5_000e6;
        uint256 durationMonths = 1;

        vm.prank(employer);
        vault.mintSalaryToken(employee, monthlyAmount, durationMonths);

        uint256 required = vault.getRequiredEscrow();

        vm.startPrank(employer);
        usdc.approve(address(vault), required);
        vault.fund(required);
        vm.stopPrank();

        uint256 score = vault.getEmployerCreditScore();
        assertEq(score, 100);
    }

    function testGetVaultInfo() public {
        IECVault.VaultInfo memory info = vault.getVaultInfo();
        assertEq(info.asset, address(usdc));
        assertEq(info.payer, employer);
    }

    function testGetAllTokensOfOwner() public {
        // Mint tokens to employee
        vm.startPrank(employer);
        uint256 tokenId1 = vault.mintSalaryToken(employee, 1000e6, 1);
        uint256 tokenId2 = vault.mintSalaryToken(employee, 2000e6, 2);
        vm.stopPrank();

        // Check employee owns both
        uint256[] memory employeeTokens = ecToken.getAllTokensOfOwner(employee);
        assertEq(employeeTokens.length, 2);
        assertEq(employeeTokens[0], tokenId1);
        assertEq(employeeTokens[1], tokenId2);

        // Transfer one token to employer
        vm.prank(employee);
        ecToken.safeTransferFrom(employee, employer, tokenId1, 1, "");

        // Check updated ownership
        employeeTokens = ecToken.getAllTokensOfOwner(employee);
        assertEq(employeeTokens.length, 1);
        assertEq(employeeTokens[0], tokenId2);

        uint256[] memory employerTokens = ecToken.getAllTokensOfOwner(employer);
        assertEq(employerTokens.length, 1);
        assertEq(employerTokens[0], tokenId1);
    }

    function testGetAllTokensOfOwner_EmptyArray() public {
        uint256[] memory tokens = ecToken.getAllTokensOfOwner(address(0x999));
        assertEq(tokens.length, 0);
    }
}
