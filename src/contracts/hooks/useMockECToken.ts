import { useReadContract, useWriteContract } from 'wagmi';
import { type Address } from 'viem';
import { mockEcTokenAbi } from '@/generated';

export function useReadTokenInfo(
  tokenAddress: Address,
  tokenId: bigint | undefined
) {
  return useReadContract({
    address: tokenAddress,
    abi: mockEcTokenAbi,
    functionName: 'getTokenInfo',
    args: tokenId !== undefined ? [tokenId] : undefined,
    query: {
      enabled: tokenId !== undefined,
    },
  });
}

export function useReadClaimable(
  tokenAddress: Address,
  tokenId: bigint | undefined
) {
  return useReadContract({
    address: tokenAddress,
    abi: mockEcTokenAbi,
    functionName: 'getClaimable',
    args: tokenId !== undefined ? [tokenId] : undefined,
    query: {
      enabled: tokenId !== undefined,
    },
  });
}

export function useReadTokenVault(
  tokenAddress: Address,
  tokenId: bigint | undefined
) {
  return useReadContract({
    address: tokenAddress,
    abi: mockEcTokenAbi,
    functionName: 'getVault',
    args: tokenId !== undefined ? [tokenId] : undefined,
    query: {
      enabled: tokenId !== undefined,
    },
  });
}

export function useReadTokenBalance(
  tokenAddress: Address,
  account: Address | undefined,
  tokenId: bigint | undefined
) {
  return useReadContract({
    address: tokenAddress,
    abi: mockEcTokenAbi,
    functionName: 'balanceOf',
    args: account && tokenId !== undefined ? [account, tokenId] : undefined,
    query: {
      enabled: !!account && tokenId !== undefined,
    },
  });
}

export function useApproveToken() {
  const { writeContractAsync, isPending, error } = useWriteContract();

  const setApprovalForAll = async (
    tokenAddress: Address,
    operator: Address,
    approved: boolean
  ) => {
    const hash = await writeContractAsync({
      address: tokenAddress,
      abi: mockEcTokenAbi,
      functionName: 'setApprovalForAll',
      args: [operator, approved],
    });
    return hash;
  };

  return { setApprovalForAll, isPending, error };
}
