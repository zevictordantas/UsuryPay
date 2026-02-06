import { type Address } from 'viem';

/**
 * Contract addresses per chain ID
 * Update these after deploying to each network
 */

// ARC Testnet (Chain ID from @reown/appkit/networks)
export const ARC_TESTNET_CHAIN_ID = 1637450 as const;

// Anvil local testnet
export const ANVIL_CHAIN_ID = 31337 as const;

export type SupportedChainId = typeof ARC_TESTNET_CHAIN_ID | typeof ANVIL_CHAIN_ID;

export interface ContractAddresses {
  rbnPrimitive: Address;
  settlementManager: Address;
}

/**
 * Contract addresses per network
 * TODO: Update with actual deployed addresses after deployment
 */
export const addresses: Record<SupportedChainId, ContractAddresses> = {
  // ARC Testnet - Update after deployment
  [ARC_TESTNET_CHAIN_ID]: {
    rbnPrimitive: '0x0000000000000000000000000000000000000000',
    settlementManager: '0x0000000000000000000000000000000000000000',
  },
  // Anvil local testnet - Update after local deployment
  [ANVIL_CHAIN_ID]: {
    rbnPrimitive: '0x0000000000000000000000000000000000000000',
    settlementManager: '0x0000000000000000000000000000000000000000',
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
