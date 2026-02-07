import { type Address } from 'viem';
import deployments from '../../deployments.json';

/**
 * Contract addresses per chain ID
 * Automatically loaded from deployments.json
 */

// ARC Testnet (Chain ID from @reown/appkit/networks)
export const ARC_TESTNET_CHAIN_ID = 1637450 as const;

// Anvil local testnet
export const ANVIL_CHAIN_ID = 31337 as const;

export type SupportedChainId = typeof ARC_TESTNET_CHAIN_ID | typeof ANVIL_CHAIN_ID;

export interface ContractAddresses {
  mockUSDC: Address;
  mockECToken: Address;
  payrollVaultFactory: Address;
  payrollDApp: Address;
  marketplace: Address;
  rbnPrimitive: Address;
  settlementManager: Address;
}

/**
 * Contract addresses per network
 */
export const addresses: Record<SupportedChainId, ContractAddresses> = {
  // ARC Testnet - Update after deployment
  [ARC_TESTNET_CHAIN_ID]: {
    mockUSDC: '0x0000000000000000000000000000000000000000',
    mockECToken: '0x0000000000000000000000000000000000000000',
    payrollVaultFactory: '0x0000000000000000000000000000000000000000',
    payrollDApp: '0x0000000000000000000000000000000000000000',
    marketplace: '0x0000000000000000000000000000000000000000',
    rbnPrimitive: '0x0000000000000000000000000000000000000000',
    settlementManager: '0x0000000000000000000000000000000000000000',
  },
  // Anvil local testnet - automatically loaded from deployments.json
  [ANVIL_CHAIN_ID]: {
    mockUSDC: deployments.MockUSDC as Address,
    mockECToken: deployments.MockECToken as Address,
    payrollVaultFactory: deployments.PayrollVaultFactory as Address,
    payrollDApp: deployments.PayrollDApp as Address,
    marketplace: deployments.Marketplace as Address,
    rbnPrimitive: deployments.RBNPrimitive as Address,
    settlementManager: deployments.SettlementManager as Address,
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
