// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console} from "forge-std/Test.sol";
import {RBNPrimitive} from "../src/RBNPrimitive.sol";
import {IRBNPrimitive} from "../src/interfaces/IRBNPrimitive.sol";

contract RBNPrimitiveTest is Test {
    RBNPrimitive public rbnPrimitive;
    
    address public owner = address(this);
    address public settlementManager = makeAddr("settlementManager");
    address public employee = makeAddr("employee");
    address public treasury = makeAddr("treasury");
    address public usdc = makeAddr("usdc");
    
    function setUp() public {
        rbnPrimitive = new RBNPrimitive();
        rbnPrimitive.setSettlementManager(settlementManager);
    }
    
    function test_InitialState() public view {
        assertEq(rbnPrimitive.owner(), owner);
        assertEq(rbnPrimitive.settlementManager(), settlementManager);
    }
    
    function test_SetSettlementManager() public {
        address newManager = makeAddr("newManager");
        rbnPrimitive.setSettlementManager(newManager);
        assertEq(rbnPrimitive.settlementManager(), newManager);
    }
    
    function test_SetSettlementManager_RevertIfNotOwner() public {
        vm.prank(employee);
        vm.expectRevert();
        rbnPrimitive.setSettlementManager(employee);
    }
    
    function test_MintCashflow_AsOwner() public {
        IRBNPrimitive.Cashflow memory cashflow = _createCashflow();
        
        uint256 tokenId = rbnPrimitive.mintCashflow(employee, cashflow);
        
        assertEq(tokenId, 1);
        assertEq(rbnPrimitive.ownerOf(tokenId), employee);
        assertEq(rbnPrimitive.balanceOf(employee, tokenId), 1);
        
        IRBNPrimitive.Cashflow memory stored = rbnPrimitive.getCashflow(tokenId);
        assertEq(stored.treasury, treasury);
        assertEq(stored.beneficiary, employee);
        assertEq(stored.totalAmount, 2000e6);
    }
    
    function test_MintCashflow_AsSettlementManager() public {
        IRBNPrimitive.Cashflow memory cashflow = _createCashflow();
        
        vm.prank(settlementManager);
        uint256 tokenId = rbnPrimitive.mintCashflow(employee, cashflow);
        
        assertEq(tokenId, 1);
        assertEq(rbnPrimitive.ownerOf(tokenId), employee);
    }
    
    function test_MintCashflow_RevertIfUnauthorized() public {
        IRBNPrimitive.Cashflow memory cashflow = _createCashflow();
        
        vm.prank(employee);
        vm.expectRevert();
        rbnPrimitive.mintCashflow(employee, cashflow);
    }
    
    function test_MintMultipleCashflows() public {
        IRBNPrimitive.Cashflow memory cashflow = _createCashflow();
        
        uint256 tokenId1 = rbnPrimitive.mintCashflow(employee, cashflow);
        uint256 tokenId2 = rbnPrimitive.mintCashflow(employee, cashflow);
        uint256 tokenId3 = rbnPrimitive.mintCashflow(employee, cashflow);
        
        assertEq(tokenId1, 1);
        assertEq(tokenId2, 2);
        assertEq(tokenId3, 3);
    }
    
    function test_GetCashflow_RevertIfNotExists() public {
        vm.expectRevert(RBNPrimitive.TokenDoesNotExist.selector);
        rbnPrimitive.getCashflow(999);
    }
    
    function test_OwnerOf_RevertIfNotExists() public {
        vm.expectRevert(RBNPrimitive.TokenDoesNotExist.selector);
        rbnPrimitive.ownerOf(999);
    }
    
    function test_TransferUpdatesOwner() public {
        IRBNPrimitive.Cashflow memory cashflow = _createCashflow();
        uint256 tokenId = rbnPrimitive.mintCashflow(employee, cashflow);
        
        address newOwner = makeAddr("newOwner");
        
        vm.prank(employee);
        rbnPrimitive.safeTransferFrom(employee, newOwner, tokenId, 1, "");
        
        assertEq(rbnPrimitive.ownerOf(tokenId), newOwner);
        assertEq(rbnPrimitive.balanceOf(newOwner, tokenId), 1);
        assertEq(rbnPrimitive.balanceOf(employee, tokenId), 0);
    }
    
    function _createCashflow() internal view returns (IRBNPrimitive.Cashflow memory) {
        return IRBNPrimitive.Cashflow({
            treasury: treasury,
            beneficiary: employee,
            settlementManager: settlementManager,
            totalAmount: 2000e6, // 2000 USDC
            startTime: block.timestamp,
            endTime: block.timestamp + 30 days,
            currency: usdc,
            cashflowType: IRBNPrimitive.CashflowType.PAYROLL
        });
    }
}
