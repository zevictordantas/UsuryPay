import { useWriteContract, useReadContract } from 'wagmi';
import { type Address, type Hex } from 'viem';
import { payrollDAppAbi } from '@/generated';

export function useRequestQuote() {
  const { writeContractAsync, isPending, error } = useWriteContract();

  const requestQuote = async (dappAddress: Address, tokenId: bigint) => {
    const hash = await writeContractAsync({
      address: dappAddress,
      abi: payrollDAppAbi,
      functionName: 'requestQuote',
      args: [tokenId],
    });
    return hash;
  };

  return { requestQuote, isPending, error };
}

export function useAcceptOffer() {
  const { writeContractAsync, isPending, error } = useWriteContract();

  const acceptOffer = async (dappAddress: Address, offerHash: Hex) => {
    const hash = await writeContractAsync({
      address: dappAddress,
      abi: payrollDAppAbi,
      functionName: 'acceptOffer',
      args: [offerHash],
    });
    return hash;
  };

  return { acceptOffer, isPending, error };
}

export function useReadECTokenValue(
  dappAddress: Address,
  tokenId: bigint | undefined
) {
  return useReadContract({
    address: dappAddress,
    abi: payrollDAppAbi,
    functionName: 'getECTokenValue',
    args: tokenId !== undefined ? [tokenId] : undefined,
    query: {
      enabled: tokenId !== undefined,
    },
  });
}

export function useReadOffer(
  dappAddress: Address,
  offerHash: Hex | undefined
) {
  return useReadContract({
    address: dappAddress,
    abi: payrollDAppAbi,
    functionName: 'getOffer',
    args: offerHash ? [offerHash] : undefined,
    query: {
      enabled: !!offerHash,
    },
  });
}

export function useClaimFromToken() {
  const { writeContractAsync, isPending, error } = useWriteContract();

  const claimFromToken = async (dappAddress: Address, tokenId: bigint) => {
    const hash = await writeContractAsync({
      address: dappAddress,
      abi: payrollDAppAbi,
      functionName: 'claimFromToken',
      args: [tokenId],
    });
    return hash;
  };

  return { claimFromToken, isPending, error };
}
