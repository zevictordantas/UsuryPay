import { useWriteContract, useReadContract } from 'wagmi';
import { type Address, parseUnits } from 'viem';
import { payrollVaultAbi } from '@/generated';

export function useReadVaultInfo(vaultAddress: Address | undefined) {
  return useReadContract({
    address: vaultAddress,
    abi: payrollVaultAbi,
    functionName: 'getVaultInfo',
    query: {
      enabled: !!vaultAddress,
    },
  });
}

export function useReadVaultBalance(vaultAddress: Address | undefined) {
  return useReadContract({
    address: vaultAddress,
    abi: payrollVaultAbi,
    functionName: 'getBalance',
    query: {
      enabled: !!vaultAddress,
    },
  });
}

export function useReadRequiredEscrow(vaultAddress: Address | undefined) {
  return useReadContract({
    address: vaultAddress,
    abi: payrollVaultAbi,
    functionName: 'getRequiredEscrow',
    query: {
      enabled: !!vaultAddress,
    },
  });
}

export function useReadEmployerCreditScore(vaultAddress: Address | undefined) {
  return useReadContract({
    address: vaultAddress,
    abi: payrollVaultAbi,
    functionName: 'getEmployerCreditScore',
    query: {
      enabled: !!vaultAddress,
    },
  });
}

export function useReadMintedTokens(vaultAddress: Address | undefined) {
  return useReadContract({
    address: vaultAddress,
    abi: payrollVaultAbi,
    functionName: 'getMintedTokens',
    query: {
      enabled: !!vaultAddress,
    },
  });
}

export function useFundVault() {
  const { writeContractAsync, isPending, error } = useWriteContract();

  const fundVault = async (vaultAddress: Address, amount: bigint) => {
    const hash = await writeContractAsync({
      address: vaultAddress,
      abi: payrollVaultAbi,
      functionName: 'fund',
      args: [amount],
    });
    return hash;
  };

  return { fundVault, isPending, error };
}

export function useMintSalaryToken() {
  const { writeContractAsync, isPending, error } = useWriteContract();

  const mintSalaryToken = async (
    vaultAddress: Address,
    employeeAddress: Address,
    monthlyAmount: bigint,
    durationMonths: number
  ) => {
    const hash = await writeContractAsync({
      address: vaultAddress,
      abi: payrollVaultAbi,
      functionName: 'mintSalaryToken',
      args: [employeeAddress, monthlyAmount, BigInt(durationMonths)],
    });
    return hash;
  };

  return { mintSalaryToken, isPending, error };
}

export function useClaimFromVault() {
  const { writeContractAsync, isPending, error } = useWriteContract();

  const claim = async (
    vaultAddress: Address,
    tokenId: bigint,
    amount: bigint
  ) => {
    const hash = await writeContractAsync({
      address: vaultAddress,
      abi: payrollVaultAbi,
      functionName: 'claim',
      args: [tokenId, amount],
    });
    return hash;
  };

  return { claim, isPending, error };
}
