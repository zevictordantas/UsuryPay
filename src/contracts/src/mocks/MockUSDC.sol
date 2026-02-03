// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockUSDC is ERC20 {
    constructor() ERC20("Mock USDC", "USDC") {
        // Mint initial supply for testing
        _mint(msg.sender, 1000000 * 10**6); // 1M USDC with 6 decimals
    }
    
    function mint(address to, uint256 amount) external {
        // For testing purposes - anyone can mint
        _mint(to, amount);
    }
    
    function decimals() public view virtual override returns (uint8) {
        return 6;
    }
}