// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Script, console} from "forge-std/Script.sol";
import {Marketplace} from "../src/Marketplace.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockUSDC is ERC20 {
    constructor() ERC20("USD Coin", "USDC") {}

    function decimals() public pure override returns (uint8) {
        return 6;
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

contract Deploy is Script {
    function run() external {
        address usdc;

        if (block.chainid == 31337) {
            vm.startBroadcast();
            usdc = address(new MockUSDC());
        } else {
            usdc = vm.envAddress("USDC_ADDRESS");
            vm.startBroadcast();
        }

        new Marketplace(usdc);

        vm.stopBroadcast();
    }
}
