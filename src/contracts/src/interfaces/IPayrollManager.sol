// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {PayrollLib} from "../libraries/PayrollLib.sol";

interface IPayrollManager {
    function createPayroll(address employee, uint256 amount, uint256 cadenceSeconds, uint256 startTime, uint256 endTime)
        external
        returns (uint256);

    function terminatePayroll(uint256 payrollId, uint256 newEnd) external;

    function getPayroll(uint256 payrollId) external view returns (PayrollLib.Payroll memory);

    function listPayrollsByEmployer(address employer, uint256 cursor, uint256 limit)
        external
        view
        returns (uint256[] memory payrollIds, uint256 nextCursor);

    function listPayrollsByEmployee(address employee, uint256 cursor, uint256 limit)
        external
        view
        returns (uint256[] memory payrollIds, uint256 nextCursor);

    function getActiveAdvances(address employee) external view returns (uint256[] memory advanceIds);

    function getAdvance(uint256 advanceId) external view returns (PayrollLib.Advance memory);

    function calculateAdvanceLimit(address employee) external view returns (uint256 maxAmount);

    function createMockAdvance(address employee, uint256 amount) external;
}
