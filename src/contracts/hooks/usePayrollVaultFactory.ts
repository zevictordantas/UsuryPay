import { useWriteContract, useReadContract } from 'wagmi';
import { type Address } from 'viem';
import { payrollVaultFactoryAbi } from '@/generated';

export function useCreateVault() {
  const { writeContractAsync, isPending, error } = useWriteContract();

  const createVault = async (factoryAddress: Address) => {
    const hash = await writeContractAsync({
      address: factoryAddress,
      abi: payrollVaultFactoryAbi,
      functionName: 'createVault',
    });
    return hash;
  };

  return { createVault, isPending, error };
}

export function useReadEmployerVaults(
  factoryAddress: Address,
  employerAddress: Address | undefined
) {
  return useReadContract({
    address: factoryAddress,
    abi: payrollVaultFactoryAbi,
    functionName: 'getEmployerVaults',
    args: employerAddress ? [employerAddress] : undefined,
    query: {
      enabled: !!employerAddress,
    },
  });
}

export function useReadVaultAddress(
  factoryAddress: Address,
  vaultId: bigint | undefined
) {
  return useReadContract({
    address: factoryAddress,
    abi: payrollVaultFactoryAbi,
    functionName: 'getVaultAddress',
    args: vaultId !== undefined ? [vaultId] : undefined,
    query: {
      enabled: vaultId !== undefined,
    },
  });
}
