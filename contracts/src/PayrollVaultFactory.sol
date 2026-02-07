// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./PayrollVault.sol";
import "./MockECToken.sol";

/**
 * @title PayrollVaultFactory
 * @notice Factory for creating employer PayrollVault instances
 */
contract PayrollVaultFactory {
    MockECToken public immutable ecToken;
    IERC20 public immutable asset;
    uint256 private _nextVaultId;

    mapping(uint256 => address) public vaults;
    mapping(address => uint256[]) public employerVaults;

    event VaultCreated(uint256 indexed vaultId, address vault, address indexed employer);

    constructor(address _ecToken, address _asset) {
        ecToken = MockECToken(_ecToken);
        asset = IERC20(_asset);
    }

    function createVault() external returns (uint256 vaultId, address vault) {
        vaultId = _nextVaultId++;

        vault = address(new PayrollVault(address(asset), address(ecToken), msg.sender, vaultId));

        vaults[vaultId] = vault;
        employerVaults[msg.sender].push(vaultId);

        ecToken.setVault(vaultId, vault);

        emit VaultCreated(vaultId, vault, msg.sender);
    }

    function getEmployerVaults(address employer) external view returns (uint256[] memory) {
        return employerVaults[employer];
    }

    function getVaultAddress(uint256 vaultId) external view returns (address) {
        return vaults[vaultId];
    }
}
