// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {PayrollDApp} from "../src/PayrollDApp.sol";
import {PayrollVault} from "../src/PayrollVault.sol";
import {MockECToken} from "../src/MockECToken.sol";
import {MockUSDC} from "../src/MockUSDC.sol";
import {Marketplace} from "../src/Marketplace.sol";

contract PayrollDAppTest is Test {
    PayrollDApp dapp;
    PayrollVault vault;
    MockECToken ecToken;
    MockUSDC usdc;
    Marketplace marketplace;

    address employer = address(0x2);
    address employee = address(0x3);
    uint256 constant RESALE_PROFIT_MARGIN = 2500; // 25% (buy at 60%, sell at 75%)

    function setUp() public {
        usdc = new MockUSDC();
        ecToken = new MockECToken();
        marketplace = new Marketplace(address(usdc));
        dapp = new PayrollDApp(address(usdc), address(ecToken), address(marketplace), RESALE_PROFIT_MARGIN);

        vm.prank(employer);
        vault = new PayrollVault(address(usdc), address(ecToken), employer, 0);

        ecToken.setVault(0, address(vault));

        // Fund employer and PayrollDApp
        usdc.mint(employer, 100_000e6);
        usdc.mint(address(dapp), 1_000_000e6); // Fund PayrollDApp directly
    }

    function testSellToken() public {
        uint256 monthlyAmount = 5_000e6;
        uint256 durationMonths = 3;
        uint256 totalAmount = monthlyAmount * durationMonths;

        vm.prank(employer);
        uint256 tokenId = vault.mintSalaryToken(employee, monthlyAmount, durationMonths);

        vm.startPrank(employer);
        usdc.approve(address(vault), totalAmount);
        vault.fund(totalAmount);
        vm.stopPrank();

        // Get expected offer amount for assertions
        (, , uint256 offerAmount) = dapp.getECTokenValue(tokenId);

        vm.startPrank(employee);
        ecToken.setApprovalForAll(address(dapp), true);
        vm.stopPrank();

        uint256 employeeBalanceBefore = usdc.balanceOf(employee);

        vm.prank(employee);
        dapp.sellToken(tokenId);

        // After selling, token is listed on marketplace (transferred to marketplace for escrow)
        assertEq(ecToken.balanceOf(address(marketplace), tokenId), 1);
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

        (, uint256 futureValue, uint256 discountedValue) = dapp.getECTokenValue(tokenId);

        assertGt(futureValue, 0);
        assertLt(discountedValue, futureValue);
        assertEq(futureValue, totalAmount);
    }

    function testSellTokenEmitsEvents() public {
        uint256 monthlyAmount = 5_000e6;
        uint256 durationMonths = 3;
        uint256 totalAmount = monthlyAmount * durationMonths;

        vm.prank(employer);
        uint256 tokenId = vault.mintSalaryToken(employee, monthlyAmount, durationMonths);

        vm.startPrank(employer);
        usdc.approve(address(vault), totalAmount);
        vault.fund(totalAmount);
        vm.stopPrank();

        (, uint256 futureValue, uint256 offerAmount) = dapp.getECTokenValue(tokenId);

        vm.startPrank(employee);
        ecToken.setApprovalForAll(address(dapp), true);
        vm.stopPrank();

        // Expect TokenPurchased event
        vm.expectEmit(true, true, false, true);
        emit PayrollDApp.TokenPurchased(tokenId, employee, offerAmount, futureValue);

        vm.prank(employee);
        dapp.sellToken(tokenId);
    }

    function testClaimAfterCancellingListing() public {
        uint256 monthlyAmount = 5_000e6;
        uint256 durationMonths = 3;
        uint256 totalAmount = monthlyAmount * durationMonths;

        vm.prank(employer);
        uint256 tokenId = vault.mintSalaryToken(employee, monthlyAmount, durationMonths);

        vm.startPrank(employer);
        usdc.approve(address(vault), totalAmount);
        vault.fund(totalAmount);
        vm.stopPrank();

        vm.startPrank(employee);
        ecToken.setApprovalForAll(address(dapp), true);
        vm.stopPrank();

        vm.prank(employee);
        dapp.sellToken(tokenId);

        // Token is now listed on marketplace
        Marketplace.Listing[] memory listings = marketplace.getAllListings();
        uint256 listingId = listings[0].id;
        assertTrue(listings[0].active);

        // Warp forward in time
        vm.warp(block.timestamp + 30 days);

        // dApp decides to cancel listing and claim instead of selling
        // This would be done by the dApp owner/operator via a management function
        // For this test, we'll call marketplace.cancel directly as the dApp
        vm.prank(address(dapp));
        marketplace.cancel(listingId);

        // Now token is back with dApp
        assertEq(ecToken.balanceOf(address(dapp), tokenId), 1);

        // dApp can now claim from vault
        uint256 dappBalanceBefore = usdc.balanceOf(address(dapp));
        uint256 claimable = ecToken.getClaimable(tokenId);

        vm.prank(address(dapp));
        dapp.claimFromToken(tokenId);

        assertEq(usdc.balanceOf(address(dapp)), dappBalanceBefore + claimable);
    }

    function testAutoListOnMarketplace() public {
        uint256 monthlyAmount = 5_000e6;
        uint256 durationMonths = 3;
        uint256 totalAmount = monthlyAmount * durationMonths;

        // Employer mints token for employee
        vm.prank(employer);
        uint256 tokenId = vault.mintSalaryToken(employee, monthlyAmount, durationMonths);

        // Employer funds vault
        vm.startPrank(employer);
        usdc.approve(address(vault), totalAmount);
        vault.fund(totalAmount);
        vm.stopPrank();

        // Get expected offer amount
        (, , uint256 offerAmount) = dapp.getECTokenValue(tokenId);

        // Employee approves dApp to transfer token
        vm.startPrank(employee);
        ecToken.setApprovalForAll(address(dapp), true);
        vm.stopPrank();

        // Employee sells token
        vm.prank(employee);
        dapp.sellToken(tokenId);

        // Verify token was transferred to marketplace for escrow
        assertEq(ecToken.balanceOf(address(marketplace), tokenId), 1);
        assertEq(ecToken.balanceOf(address(dapp), tokenId), 0);
        assertEq(ecToken.balanceOf(employee, tokenId), 0);

        // Verify listing was created on marketplace
        Marketplace.Listing[] memory listings = marketplace.getAllListings();
        assertEq(listings.length, 1);
        assertEq(listings[0].tokenAddress, address(ecToken));
        assertEq(listings[0].tokenId, tokenId);
        assertTrue(listings[0].active);

        // Verify resale price includes profit margin
        uint256 expectedResalePrice = offerAmount + (offerAmount * RESALE_PROFIT_MARGIN / 10000);
        assertEq(listings[0].price, expectedResalePrice);

        // Verify resale price doesn't exceed future value
        assertLe(listings[0].price, totalAmount);
    }

    function testResalePriceCappedAtFutureValue() public {
        uint256 monthlyAmount = 1_000e6;
        uint256 durationMonths = 1;
        uint256 totalAmount = monthlyAmount * durationMonths;

        // Create scenario where discount is very high (risky employer)
        vm.prank(employer);
        uint256 tokenId = vault.mintSalaryToken(employee, monthlyAmount, durationMonths);

        // Don't fund vault fully to get lower credit score
        vm.startPrank(employer);
        usdc.approve(address(vault), totalAmount / 2);
        vault.fund(totalAmount / 2);
        vm.stopPrank();

        // Get expected offer amount
        (, , uint256 offerAmount) = dapp.getECTokenValue(tokenId);

        // Sell token
        vm.startPrank(employee);
        ecToken.setApprovalForAll(address(dapp), true);
        vm.stopPrank();

        vm.prank(employee);
        dapp.sellToken(tokenId);

        // Get listing price
        Marketplace.Listing[] memory listings = marketplace.getAllListings();
        uint256 resalePrice = listings[0].price;

        // Verify resale price doesn't exceed future value
        assertLe(resalePrice, totalAmount);
    }
}
