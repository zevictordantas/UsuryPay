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
  // Anvil local testnet
  [ANVIL_CHAIN_ID]: {
    mockUSDC: '0xb7f8bc63bbcad18155201308c8f3540b07f84f5e',
    mockECToken: '0x0dcd1bf9a1b36ce34237eeafef220932846bcd82',
    payrollVaultFactory: '0x9a676e781a523b5d0c0e43731313a708cb607508',
    payrollDApp: '0x0b306bf915c4d645ff596e518faf3f9669b97016',
    marketplace: '0xa51c1fc2f0d1a1b8494ed1fe312d7c3a78ed91c0',
    rbnPrimitive: '0x3aa5ebb10dc797cac828524e59a333d0a371443c',
    settlementManager: '0xc6e7df5e7b4f2a278906862b61205850344d4e7d',
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
