// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console} from "forge-std/Test.sol";
import {RBNPrimitive} from "../src/RBNPrimitive.sol";
import {SettlementManager} from "../src/SettlementManager.sol";
import {IRBNPrimitive} from "../src/interfaces/IRBNPrimitive.sol";

/// @dev Mock ERC20 token for testing
contract MockUSDC {
    string public name = "USD Coin";
    string public symbol = "USDC";
    uint8 public decimals = 6;
    
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    
    function mint(address to, uint256 amount) external {
        balanceOf[to] += amount;
    }
    
    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        return true;
    }
    
    function transfer(address to, uint256 amount) external returns (bool) {
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        return true;
    }
    
    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        allowance[from][msg.sender] -= amount;
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        return true;
    }
}

contract SettlementManagerTest is Test {
    RBNPrimitive public rbnPrimitive;
    SettlementManager public settlementManager;
    MockUSDC public usdc;
    
    address public owner = address(this);
    address public employee = makeAddr("employee");
    address public treasury = makeAddr("treasury");
    address public recorder = makeAddr("recorder");
    
    uint256 public tokenId;
    
    function setUp() public {
        // Deploy contracts
        rbnPrimitive = new RBNPrimitive();
        settlementManager = new SettlementManager(address(rbnPrimitive));
        usdc = new MockUSDC();
        
        // Configure RBNPrimitive
        rbnPrimitive.setSettlementManager(address(settlementManager));
        
        // Authorize recorder
        settlementManager.setAuthorizedRecorder(recorder, true);
        
        // Mint a cashflow NFT
        IRBNPrimitive.Cashflow memory cashflow = IRBNPrimitive.Cashflow({
            treasury: treasury,
            beneficiary: employee,
            settlementManager: address(settlementManager),
            totalAmount: 2000e6, // 2000 USDC
            startTime: block.timestamp,
            endTime: block.timestamp + 30 days,
            currency: address(usdc),
            cashflowType: IRBNPrimitive.CashflowType.PAYROLL
        });
        
        tokenId = rbnPrimitive.mintCashflow(employee, cashflow);
        
        // Mint USDC to treasury and approve
        usdc.mint(treasury, 10000e6);
        vm.prank(treasury);
        usdc.approve(address(settlementManager), type(uint256).max);
    }
    
    function test_InitialState() public view {
        assertEq(address(settlementManager.rbnPrimitive()), address(rbnPrimitive));
        assertEq(settlementManager.owner(), owner);
        assertTrue(settlementManager.authorizedRecorders(recorder));
    }
    
    function test_SetAuthorizedRecorder() public {
        address newRecorder = makeAddr("newRecorder");
        
        settlementManager.setAuthorizedRecorder(newRecorder, true);
        assertTrue(settlementManager.authorizedRecorders(newRecorder));
        
        settlementManager.setAuthorizedRecorder(newRecorder, false);
        assertFalse(settlementManager.authorizedRecorders(newRecorder));
    }
    
    function test_LockFunds() public {
        uint256 amount = 1000e6;
        
        vm.prank(treasury);
        settlementManager.lockFunds(tokenId, amount);
        
        assertEq(settlementManager.getLockedAmount(tokenId), amount);
        assertEq(usdc.balanceOf(address(settlementManager)), amount);
    }
    
    function test_RecordAccrual_AsRecorder() public {
        // First lock funds
        vm.prank(treasury);
        settlementManager.lockFunds(tokenId, 1000e6);
        
        // Record accrual
        vm.prank(recorder);
        settlementManager.recordAccrual(tokenId, 500e6);
        
        assertEq(settlementManager.getAccruedAmount(tokenId), 500e6);
    }
    
    function test_RecordAccrual_AsOwner() public {
        // First lock funds
        vm.prank(treasury);
        settlementManager.lockFunds(tokenId, 1000e6);
        
        // Record accrual as owner
        settlementManager.recordAccrual(tokenId, 500e6);
        
        assertEq(settlementManager.getAccruedAmount(tokenId), 500e6);
    }
    
    function test_RecordAccrual_RevertIfUnauthorized() public {
        vm.prank(treasury);
        settlementManager.lockFunds(tokenId, 1000e6);
        
        vm.prank(employee);
        vm.expectRevert();
        settlementManager.recordAccrual(tokenId, 500e6);
    }
    
    function test_RecordAccrual_RevertIfExceedsLocked() public {
        vm.prank(treasury);
        settlementManager.lockFunds(tokenId, 1000e6);
        
        vm.prank(recorder);
        vm.expectRevert(SettlementManager.AccrualExceedsLocked.selector);
        settlementManager.recordAccrual(tokenId, 1001e6);
    }
    
    function test_Settle() public {
        // Lock funds
        vm.prank(treasury);
        settlementManager.lockFunds(tokenId, 1000e6);
        
        // Record accrual
        vm.prank(recorder);
        settlementManager.recordAccrual(tokenId, 500e6);
        
        // Settle
        uint256 employeeBalanceBefore = usdc.balanceOf(employee);
        settlementManager.settle(tokenId);
        
        assertEq(usdc.balanceOf(employee), employeeBalanceBefore + 500e6);
        assertEq(settlementManager.getSettledAmount(tokenId), 500e6);
        assertEq(settlementManager.getAvailableAmount(tokenId), 0);
    }
    
    function test_Settle_RevertIfNothingToSettle() public {
        vm.prank(treasury);
        settlementManager.lockFunds(tokenId, 1000e6);
        
        // No accrual recorded
        vm.expectRevert(SettlementManager.NothingToSettle.selector);
        settlementManager.settle(tokenId);
    }
    
    function test_Settle_ToNewOwnerAfterTransfer() public {
        // Lock and accrue
        vm.prank(treasury);
        settlementManager.lockFunds(tokenId, 1000e6);
        
        vm.prank(recorder);
        settlementManager.recordAccrual(tokenId, 500e6);
        
        // Transfer NFT to new owner
        address newOwner = makeAddr("newOwner");
        vm.prank(employee);
        rbnPrimitive.safeTransferFrom(employee, newOwner, tokenId, 1, "");
        
        // Settle should go to new owner
        settlementManager.settle(tokenId);
        
        assertEq(usdc.balanceOf(newOwner), 500e6);
        assertEq(usdc.balanceOf(employee), 0);
    }
    
    function test_MultipleAccrualsAndSettlements() public {
        // Lock funds
        vm.prank(treasury);
        settlementManager.lockFunds(tokenId, 1000e6);
        
        // First accrual and settlement
        vm.prank(recorder);
        settlementManager.recordAccrual(tokenId, 200e6);
        settlementManager.settle(tokenId);
        assertEq(usdc.balanceOf(employee), 200e6);
        
        // Second accrual and settlement
        vm.prank(recorder);
        settlementManager.recordAccrual(tokenId, 300e6);
        settlementManager.settle(tokenId);
        assertEq(usdc.balanceOf(employee), 500e6);
        
        // Check totals
        assertEq(settlementManager.getAccruedAmount(tokenId), 500e6);
        assertEq(settlementManager.getSettledAmount(tokenId), 500e6);
        assertEq(settlementManager.getAvailableAmount(tokenId), 0);
    }
}
