// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

library PayrollLib {
    struct Payroll {
        uint256 id;
        address employer;
        address employee;
        uint256 amount;
        uint256 cadenceSeconds;
        uint256 startTime;
        uint256 endTime;
        bool active;
        uint256 lastPaymentTime;
    }

    struct Advance {
        uint256 id;
        uint256 amount;
        uint256 fee;
        uint256 totalRepayment;
        uint256 status; // 0=pending, 1=active, 2=repaid, 3=defaulted
        uint256 requestDate;
        uint256 rbnTokenId;
        uint256 repaidAmount;
    }

    // TODO: Add pagination helpers if needed for large datasets
    // TODO: Add validation helpers for dates and amounts
    // TODO: Add payment calculation helpers
}
