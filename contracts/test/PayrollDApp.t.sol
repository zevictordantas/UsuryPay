// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {PayrollDApp} from "../src/PayrollDApp.sol";
import {PayrollVault} from "../src/PayrollVault.sol";
import {MockECToken} from "../src/MockECToken.sol";
import {MockUSDC} from "../src/MockUSDC.sol";

contract PayrollDAppTest is Test {
    PayrollDApp dapp;
    PayrollVault vault;
    MockECToken ecToken;
    MockUSDC usdc;

    address treasury = address(0x1);
    address employer = address(0x2);
    address employee = address(0x3);

    function setUp() public {
        usdc = new MockUSDC();
        ecToken = new MockECToken();
        dapp = new PayrollDApp(address(usdc), address(ecToken), treasury);

        vm.prank(employer);
        vault = new PayrollVault(address(usdc), address(ecToken), employer, 0);

        ecToken.setVault(0, address(vault));

        usdc.mint(employer, 100_000e6);
        usdc.mint(treasury, 100_000e6);
    }

    function testRequestQuote() public {
        uint256 monthlyAmount = 5_000e6;
        uint256 durationMonths = 3;

        vm.prank(employer);
        uint256 tokenId = vault.mintSalaryToken(employee, monthlyAmount, durationMonths);

        uint256 fundAmount = monthlyAmount * durationMonths;
        vm.startPrank(employer);
        usdc.approve(address(vault), fundAmount);
        vault.fund(fundAmount);
        vm.stopPrank();

        vm.prank(employee);
        (bytes32 offerHash, uint256 offerAmount, uint256 expiresAt) = dapp.requestQuote(tokenId);

        assertTrue(offerHash != bytes32(0));
        assertGt(offerAmount, 0);
        assertGt(expiresAt, block.timestamp);
    }

    function testAcceptOffer() public {
        uint256 monthlyAmount = 5_000e6;
        uint256 durationMonths = 3;
        uint256 totalAmount = monthlyAmount * durationMonths;

        vm.prank(employer);
        uint256 tokenId = vault.mintSalaryToken(employee, monthlyAmount, durationMonths);

        vm.startPrank(employer);
        usdc.approve(address(vault), totalAmount);
        vault.fund(totalAmount);
        vm.stopPrank();

        vm.prank(employee);
        (bytes32 offerHash, uint256 offerAmount,) = dapp.requestQuote(tokenId);

        vm.startPrank(employee);
        ecToken.setApprovalForAll(address(dapp), true);
        vm.stopPrank();

        uint256 employeeBalanceBefore = usdc.balanceOf(employee);

        vm.startPrank(treasury);
        usdc.approve(address(dapp), offerAmount);
        vm.stopPrank();

        vm.prank(employee);
        dapp.acceptOffer(offerHash);

        assertEq(ecToken.balanceOf(address(dapp), tokenId), 1);
        assertEq(usdc.balanceOf(employee), employeeBalanceBefore + offerAmount);
        assertTrue(dapp.ownedTokens(tokenId));
    }

    function testGetECTokenValue() public {
        uint256 monthlyAmount = 10_000e6;
        uint256 durationMonths = 6;
        uint256 totalAmount = monthlyAmount * durationMonths;

        vm.prank(employer);
        uint256 tokenId = vault.mintSalaryToken(employee, monthlyAmount, durationMonths);

        vm.startPrank(employer);
        usdc.approve(address(vault), totalAmount);
        vault.fund(totalAmount);
        vm.stopPrank();

        (uint256 currentValue, uint256 futureValue, uint256 discountedValue) = dapp.getECTokenValue(tokenId);

        assertGt(futureValue, 0);
        assertLt(discountedValue, futureValue);
        assertEq(futureValue, totalAmount);
    }

    function testClaimFromToken() public {
        uint256 monthlyAmount = 5_000e6;
        uint256 durationMonths = 3;
        uint256 totalAmount = monthlyAmount * durationMonths;

        vm.prank(employer);
        uint256 tokenId = vault.mintSalaryToken(employee, monthlyAmount, durationMonths);

        vm.startPrank(employer);
        usdc.approve(address(vault), totalAmount);
        vault.fund(totalAmount);
        vm.stopPrank();

        vm.prank(employee);
        (bytes32 offerHash,,) = dapp.requestQuote(tokenId);

        vm.startPrank(employee);
        ecToken.setApprovalForAll(address(dapp), true);
        vm.stopPrank();

        vm.startPrank(treasury);
        usdc.approve(address(dapp), totalAmount);
        vm.stopPrank();

        vm.prank(employee);
        dapp.acceptOffer(offerHash);

        vm.warp(block.timestamp + 30 days);

        uint256 dappBalanceBefore = usdc.balanceOf(address(dapp));
        uint256 claimable = ecToken.getClaimable(tokenId);

        dapp.claimFromToken(tokenId);

        assertEq(usdc.balanceOf(address(dapp)), dappBalanceBefore + claimable);
    }
}
