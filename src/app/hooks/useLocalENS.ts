'use client';

import { useChainId, useEnsAddress, useEnsName } from 'wagmi';
import { type Address } from 'viem';
import { normalize } from 'viem/ens';
import {
  ANVIL_CHAIN_ID,
  addresses,
  type ContractAddresses,
} from '@/contracts/addresses';

/**
 * Detect if we're on local Anvil (chainId 31337)
 */
const isLocalAnvil = (chainId: number | undefined) => {
  return chainId === ANVIL_CHAIN_ID;
};

/**
 * Local development ENS mappings for contract names
 * Maps friendly names to contract addresses
 */
const LOCAL_NAME_TO_ADDRESS: Record<string, keyof ContractAddresses> = {
  // 'usdc.local': 'mockUSDC',
  'ectoken.local': 'mockECToken',
  'factory.local': 'payrollVaultFactory',
  'payrolldapp.local': 'payrollDApp',
  'marketplace.local': 'marketplace',
  'rbn.local': 'rbnPrimitive',
  'settlement.local': 'settlementManager',
};

/**
 * Local development EOA (Externally Owned Account) mappings
 * Maps friendly names to test account addresses (e.g., Anvil default accounts)
 */
const LOCAL_EOA_MAPPINGS: Record<string, Address> = {
  'employer.usury.eth': '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  'employee.usury.eth': '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
  // 'anvil3.eth': '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
  // 'anvil4.eth': '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
  // 'anvil5.eth': '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65',
  // 'anvil6.eth': '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc',
  // 'anvil7.eth': '0x976EA74026E726554dB657fA54763abd0C3a0aa9',
  // 'anvil8.eth': '0x14dC79964da2C08b23698B3D3cc7Ca32193d9955',
  // 'anvil9.eth': '0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f',
  // 'anvil10.eth': '0xa0Ee7A142d267C1f36714E4a8F75612F20a79720',
};

/**
 * Reverse mapping: address to name
 * Uses Anvil contract addresses (where contracts are actually deployed locally)
 * and custom EOA mappings
 */
function createAddressToNameMap(): Record<string, string> {
  const contractAddresses = addresses[ANVIL_CHAIN_ID];
  const reverseMap: Record<string, string> = {};

  // Add contract address mappings
  Object.entries(LOCAL_NAME_TO_ADDRESS).forEach(([name, contractKey]) => {
    const address = contractAddresses[contractKey];
    if (address) {
      reverseMap[address.toLowerCase()] = name;
    }
  });

  // Add EOA mappings
  Object.entries(LOCAL_EOA_MAPPINGS).forEach(([name, address]) => {
    reverseMap[address.toLowerCase()] = name;
  });

  return reverseMap;
}

interface UseLocalEnsAddressParams {
  name?: string;
}

interface UseLocalEnsAddressReturn {
  data?: Address;
  isLoading: boolean;
  error?: Error;
}

/**
 * Custom hook that resolves names to addresses
 * - On Anvil (chainId 31337): uses hardcoded contract mappings (e.g., "usdc.local" -> contract address)
 * - On other networks: delegates to wagmi's useEnsAddress
 */
export function useLocalEnsAddress({
  name,
}: UseLocalEnsAddressParams): UseLocalEnsAddressReturn {
  const chainId = useChainId();

  // Always call wagmi hook (Rules of Hooks)
  const ensResult = useEnsAddress({
    name: name && !isLocalAnvil(chainId) ? normalize(name) : undefined,
    chainId: 1, // ENS is on mainnet
  });

  // On Anvil, use local mappings instead
  if (isLocalAnvil(chainId) && name) {
    const nameLower = name.toLowerCase();

    // Check contract mappings first
    const contractKey = LOCAL_NAME_TO_ADDRESS[nameLower];
    if (contractKey) {
      const address = addresses[ANVIL_CHAIN_ID][contractKey];
      return {
        data: address,
        isLoading: false,
      };
    }

    // Check EOA mappings
    const eoaAddress = LOCAL_EOA_MAPPINGS[nameLower];
    if (eoaAddress) {
      return {
        data: eoaAddress,
        isLoading: false,
      };
    }

    // Name not found in local mappings
    return {
      data: undefined,
      isLoading: false,
      error: new Error(`Local name "${name}" not found`),
    };
  }

  // On other networks, use real ENS
  return {
    data: ensResult.data ?? undefined,
    isLoading: ensResult.isLoading,
    error: ensResult.error ?? undefined,
  };
}

interface UseLocalEnsNameParams {
  address?: Address;
}

interface UseLocalEnsNameReturn {
  data?: string;
  isLoading: boolean;
  error?: Error;
}

/**
 * Custom hook that resolves addresses to names
 * - In local dev: uses hardcoded contract mappings (contract address -> "usdc.local")
 * - In production: delegates to wagmi's useEnsName
 */
export function useLocalEnsName({
  address,
}: UseLocalEnsNameParams): UseLocalEnsNameReturn {
  const chainId = useChainId();

  // Always call wagmi hook (Rules of Hooks)
  const ensResult = useEnsName({
    address: !isLocalAnvil(chainId) ? address : undefined,
    chainId: 1, // ENS is on mainnet
  });

  // On Anvil, use local mappings instead
  if (isLocalAnvil(chainId) && address) {
    const addressToNameMap = createAddressToNameMap();
    const name = addressToNameMap[address.toLowerCase()];

    if (name) {
      return {
        data: name,
        isLoading: false,
      };
    }
    // Address not found in local mappings
    return {
      data: undefined,
      isLoading: false,
    };
  }

  // On other networks, use real ENS
  return {
    data: ensResult.data ?? undefined,
    isLoading: ensResult.isLoading,
    error: ensResult.error ?? undefined,
  };
}
