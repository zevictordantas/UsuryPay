// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "../interfaces/IEmployerTreasuryFactory.sol";
import "../core/EmployerTreasury.sol";

contract EmployerTreasuryFactory is IEmployerTreasuryFactory {
    // WARNING: In production, deploy this contract via multisig/DAO for security
    
    address public immutable usdcAddress;
    mapping(address => address) public employerToTreasury;
    
    constructor(address _usdcAddress) {
        usdcAddress = _usdcAddress;
    }
    
    function createTreasury(address employer) external returns (address treasury) {
        // Simple guard: only employer can create their own treasury
        require(msg.sender == employer, "Only employer can create treasury");
        require(employerToTreasury[employer] == address(0), "Treasury already exists");
        require(employer != address(0), "Invalid employer address");
        
        treasury = address(new EmployerTreasury(usdcAddress, employer));
        employerToTreasury[employer] = treasury;
        
        emit TreasuryCreated(employer, treasury);
    }
    
    function getTreasury(address employer) external view returns (address treasury) {
        return employerToTreasury[employer];
    }
}