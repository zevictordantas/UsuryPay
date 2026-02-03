// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {PayrollLib} from "../libraries/PayrollLib.sol";
import "../interfaces/IPayrollManager.sol";
import "../interfaces/IEmployerTreasuryFactory.sol";

contract PayrollManager is IPayrollManager {
    PayrollLib.Payroll[] public payrolls;
    PayrollLib.Advance[] public advances;
    mapping(address => uint256[]) public employerToPayrolls;
    mapping(address => uint256[]) public employeeToPayrolls;
    mapping(address => uint256[]) public employeeToAdvances; // @TODO: this should look for RBNs using a RBNs or DAO contract. Advancments is not part of payroll logic
    uint256 private _nextPayrollId = 1;
    uint256 private _nextAdvanceId = 1;

    // TODO: Add access control for payroll creation/termination
    
    IEmployerTreasuryFactory public factoryAddress;
    
    // Note: UI should resolve treasury addresses via factory.getTreasury(employer)
    function setTreasuryFactory(address factory) external {
        // TODO: Add access control for this function
        factoryAddress = IEmployerTreasuryFactory(factory);
    }

    function createPayroll(address employee, uint256 amount, uint256 cadenceSeconds, uint256 startTime, uint256 endTime)
        external
        override
        returns (uint256)
    {
        // TODO: Validate dates and amounts
        // TODO: Check if employee already has active payroll

        require(employee != address(0), "Invalid employee address");
        require(amount > 0, "Amount must be > 0");
        require(cadenceSeconds > 0, "Cadence must be > 0");
        require(startTime > 0, "Invalid start time");
        require(endTime > startTime, "End time must be > start time");

        PayrollLib.Payroll memory payroll = PayrollLib.Payroll({
            id: _nextPayrollId,
            employer: msg.sender,
            employee: employee,
            amount: amount,
            cadenceSeconds: cadenceSeconds,
            startTime: startTime,
            endTime: endTime,
            active: true,
            lastPaymentTime: 0
        });

        payrolls.push(payroll);
        employerToPayrolls[msg.sender].push(_nextPayrollId);
        employeeToPayrolls[employee].push(_nextPayrollId);

        emit PayrollCreated(_nextPayrollId, msg.sender, employee, amount, cadenceSeconds, startTime, endTime);

        return _nextPayrollId++;
    }

    // TODO: Implement proper termination logic
    function terminatePayroll(uint256 payrollId, uint256 newEndTime) external override {
        // Simple array scan - fix for gas optimization later
        // TODO: Validate caller is employer
        // TODO: Validate newEndTime
        require(payrollId > 0 && payrollId < _nextPayrollId, "Invalid payroll ID");
        require(newEndTime > 0, "Invalid end time");

        for (uint256 i = 0; i < payrolls.length; i++) {
            if (payrolls[i].id == payrollId) {
                require(payrolls[i].employer == msg.sender, "Not your payroll");
                require(payrolls[i].active, "Payroll already inactive");
                require(newEndTime >= payrolls[i].startTime, "End time before start");

                payrolls[i].endTime = newEndTime;
                payrolls[i].active = false;

                emit PayrollTerminated(payrollId, newEndTime);
                return;
            }
        }

        revert("Payroll not found");
    }

    function getPayroll(uint256 payrollId) external view override returns (PayrollLib.Payroll memory) {
        // Simple array scan - will be slow for many payrolls
        // TODO: Consider mapping from id to payroll for O(1) access

        for (uint256 i = 0; i < payrolls.length; i++) {
            if (payrolls[i].id == payrollId) {
                return payrolls[i];
            }
        }

        revert("Payroll not found");
    }

    // TODO: Implement proper pagination for large datasets
    function listPayrollsByEmployer(address employer, uint256 cursor, uint256 limit)
        external
        view
        override
        returns (uint256[] memory payrollIds, uint256 nextCursor)
    {
        // Simple array slice implementation
        // TODO: Add proper cursor/pagination logic

        uint256[] storage employerPayrolls = employerToPayrolls[employer];
        uint256 start = cursor;
        uint256 end = cursor + limit;

        if (end > employerPayrolls.length) {
            end = employerPayrolls.length;
        }

        uint256 resultLength = end - start;
        payrollIds = new uint256[](resultLength);

        for (uint256 i = 0; i < resultLength; i++) {
            payrollIds[i] = employerPayrolls[start + i];
        }

        nextCursor = end >= employerPayrolls.length ? 0 : end;
    }

    function listPayrollsByEmployee(address employee, uint256 cursor, uint256 limit)
        external
        view
        override
        returns (uint256[] memory payrollIds, uint256 nextCursor)
    {
        // Similar to employer listing
        // TODO: Add proper pagination

        uint256[] storage employeePayrolls = employeeToPayrolls[employee];
        uint256 start = cursor;
        uint256 end = cursor + limit;

        if (end > employeePayrolls.length) {
            end = employeePayrolls.length;
        }

        uint256 resultLength = end - start;
        payrollIds = new uint256[](resultLength);

        for (uint256 i = 0; i < resultLength; i++) {
            payrollIds[i] = employeePayrolls[start + i];
        }

        nextCursor = end >= employeePayrolls.length ? 0 : end;
    }

    function getActiveAdvances(address employee) external view override returns (uint256[] memory) {
        return employeeToAdvances[employee];
    }

    function getAdvance(uint256 advanceId) external view override returns (PayrollLib.Advance memory) {
        for (uint256 i = 0; i < advances.length; i++) {
            if (advances[i].id == advanceId) {
                return advances[i];
            }
        }
        revert("Advance not found");
    }

    function calculateAdvanceLimit(address employee) external view override returns (uint256) {
        // TODO: Implement proper risk estimator instead of fixed percentage
        // Simple 50% of next payment across all active payrolls
        uint256 totalNextPayment = 0;
        uint256[] memory payrollIds = employeeToPayrolls[employee];

        for (uint256 i = 0; i < payrollIds.length; i++) {
            uint256 payrollId = payrollIds[i];
            // Direct array lookup instead of function call to avoid recursion
            for (uint256 j = 0; j < payrolls.length; j++) {
                if (payrolls[j].id == payrollId && payrolls[j].active) {
                    totalNextPayment += payrolls[j].amount;
                    break;
                }
            }
        }

        return (totalNextPayment * 50) / 100; // 50% limit
    }

    function createMockAdvance(address employee, uint256 amount) external override {
        // TODO: Remove this in production - only for playground testing
        // Real advances should be created via DAO flow (Flow B)
        uint256 fee = (amount * 5) / 100; // 5% fee
        PayrollLib.Advance memory advance = PayrollLib.Advance({
            id: _nextAdvanceId++,
            amount: amount,
            fee: fee,
            totalRepayment: amount + fee,
            status: 1, // active
            requestDate: block.timestamp,
            rbnTokenId: 0, // TODO: Link to actual RBN when minted
            repaidAmount: 0
        });

        advances.push(advance);
        employeeToAdvances[employee].push(advance.id);
    }

    event PayrollCreated(
        uint256 indexed payrollId,
        address indexed employer,
        address indexed employee,
        uint256 amount,
        uint256 cadenceSeconds,
        uint256 startTime,
        uint256 endTime
    );

    event PayrollTerminated(uint256 indexed payrollId, uint256 newEndTime);
}
