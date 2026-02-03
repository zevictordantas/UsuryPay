// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

interface IRBNToken {
    function mintToDao(string memory metadataUri) external returns (uint256);
    
    // Note: ownerOf and transferFrom are already defined in ERC721, no need to redeclare
    
    // TODO: Add functions needed for employee advance flow
    // function mintForAdvance(address employee, uint256 amount, uint256 payrollId, string memory metadata) external returns (uint256);
    // function getAdvanceMetadata(uint256 tokenId) external view returns (AdvanceMetadata memory);
    // function getEmployeeAdvances(address employee) external view returns (uint256[] memory);
}