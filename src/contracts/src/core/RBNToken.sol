// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../interfaces/IRBNToken.sol";

contract RBNToken is ERC721, IRBNToken {
    uint256 private _nextTokenId;
    address public daoAddress;

    constructor(address _daoAddress) ERC721("Revenue-Backed Note", "RBN") {
        daoAddress = _daoAddress;
    }

    // TODO: Replace with proper RBN minting logic
    // TODO: Add credit terms binding to token metadata
    // TODO: Add underwriting provenance tracking
    // TODO: Add risk model versioning
    function mintToDao(string memory metadataUri) external returns (uint256) {
        // require(msg.sender == daoAddress, "Only DAO can mint"); @todo use Owner or smth else
        // Mock: sequential IDs
        // TODO: Add proper metadata handling
        // TODO: Store metadata URI on token
        uint256 tokenId = _nextTokenId++;
        _safeMint(daoAddress, tokenId);
        return tokenId;
    }

    // TODO: Add function to get DAO-owned RBNs
    // function getDaoOwnedRBNs() external view returns (uint256[] memory) {
    //     // Implement when RBN logic is ready
    //     // Need to track DAO ownership efficiently
    // }

    // TODO: Add tokenURI implementation for metadata
    // function tokenURI(uint256 tokenId) public view override returns (string memory) {
    //     // Return metadata URI for RBN details
    // }
}
