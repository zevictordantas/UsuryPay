import { type Address } from 'viem';
import deployments from '../../deployments.json';
import deploymentsSepolia from '../../deployments-sepolia.json';

/**
 * Contract addresses per chain ID
 * Automatically loaded from deployment JSON files
 */

// ARC Testnet (Chain ID from @reown/appkit/networks)
export const ARC_TESTNET_CHAIN_ID = 1637450 as const;

// Anvil local testnet
export const ANVIL_CHAIN_ID = 31337 as const;

// Sepolia testnet
export const SEPOLIA_CHAIN_ID = 11155111 as const;

export type SupportedChainId =
  | typeof ARC_TESTNET_CHAIN_ID
  | typeof ANVIL_CHAIN_ID
  | typeof SEPOLIA_CHAIN_ID;

export interface ContractAddresses {
  usdc: Address; // MockUSDC on Anvil, Circle USDC on testnets
  mockECToken: Address;
  payrollVaultFactory: Address;
  payrollDApp: Address;
  marketplace: Address;
  rbnPrimitive: Address;
  settlementManager: Address;
  payrollVaultCCTP?: Address; // Only on chains with CCTP support (Sepolia)
}

/**
 * Contract addresses per network
 */
export const addresses: Record<SupportedChainId, ContractAddresses> = {
  // ARC Testnet - Update after deployment
  [ARC_TESTNET_CHAIN_ID]: {
    usdc: '0x0000000000000000000000000000000000000000',
    mockECToken: '0x0000000000000000000000000000000000000000',
    payrollVaultFactory: '0x0000000000000000000000000000000000000000',
    payrollDApp: '0x0000000000000000000000000000000000000000',
    marketplace: '0x0000000000000000000000000000000000000000',
    rbnPrimitive: '0x0000000000000000000000000000000000000000',
    settlementManager: '0x0000000000000000000000000000000000000000',
  },
  // Anvil local testnet - automatically loaded from deployments.json
  [ANVIL_CHAIN_ID]: {
    usdc: deployments.MockUSDC as Address,
    mockECToken: deployments.MockECToken as Address,
    payrollVaultFactory: deployments.PayrollVaultFactory as Address,
    payrollDApp: deployments.PayrollDApp as Address,
    marketplace: deployments.Marketplace as Address,
    rbnPrimitive: deployments.RBNPrimitive as Address,
    settlementManager: deployments.SettlementManager as Address,
  },
  // Sepolia testnet - loaded from deployments-sepolia.json (Circle testnet USDC)
  [SEPOLIA_CHAIN_ID]: {
    usdc: deploymentsSepolia.USDC as Address, // Circle's testnet USDC
    mockECToken: deploymentsSepolia.MockECToken as Address,
    payrollVaultFactory: deploymentsSepolia.PayrollVaultFactory as Address,
    payrollDApp: deploymentsSepolia.PayrollDApp as Address,
    marketplace: deploymentsSepolia.Marketplace as Address,
    rbnPrimitive: '0x0000000000000000000000000000000000000000', // Not deployed on Sepolia
    settlementManager: '0x0000000000000000000000000000000000000000', // Not deployed on Sepolia
    payrollVaultCCTP: deploymentsSepolia.PayrollVaultCCTP as Address,
  },
};

/**
 * Get contract addresses for a specific chain
 */
export function getContractAddresses(chainId: number): ContractAddresses | undefined {
  return addresses[chainId as SupportedChainId];
}

/**
 * Check if a chain is supported
 */
export function isSupportedChain(chainId: number): chainId is SupportedChainId {
  return chainId in addresses;
}
