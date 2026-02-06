'use client';

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { type Address } from 'viem';
import { rbnPrimitiveAbi } from '../generated';
import { getContractAddresses } from '../addresses';
import { useChainId } from 'wagmi';

/**
 * Cashflow type enum matching the Solidity contract
 */
export enum CashflowType {
  PAYROLL = 0,
  DIVIDEND = 1,
}

/**
 * Cashflow data structure
 */
export interface Cashflow {
  treasury: Address;
  beneficiary: Address;
  settlementManager: Address;
  totalAmount: bigint;
  startTime: bigint;
  endTime: bigint;
  currency: Address;
  cashflowType: CashflowType;
}

/**
 * Hook to get the RBNPrimitive contract address for the current chain
 */
export function useRBNPrimitiveAddress(): Address | undefined {
  const chainId = useChainId();
  const addresses = getContractAddresses(chainId);
  return addresses?.rbnPrimitive;
}

/**
 * Hook to read cashflow data for a given token ID
 */
export function useReadCashflow(tokenId: bigint | undefined) {
  const address = useRBNPrimitiveAddress();

  return useReadContract({
    address,
    abi: rbnPrimitiveAbi,
    functionName: 'getCashflow',
    args: tokenId !== undefined ? [tokenId] : undefined,
    query: {
      enabled: !!address && tokenId !== undefined,
    },
  });
}

/**
 * Hook to read the owner of a cashflow NFT
 */
export function useReadCashflowOwner(tokenId: bigint | undefined) {
  const address = useRBNPrimitiveAddress();

  return useReadContract({
    address,
    abi: rbnPrimitiveAbi,
    functionName: 'ownerOf',
    args: tokenId !== undefined ? [tokenId] : undefined,
    query: {
      enabled: !!address && tokenId !== undefined,
    },
  });
}

/**
 * Hook to read the balance of a specific token for an owner
 */
export function useReadCashflowBalance(owner: Address | undefined, tokenId: bigint | undefined) {
  const address = useRBNPrimitiveAddress();

  return useReadContract({
    address,
    abi: rbnPrimitiveAbi,
    functionName: 'balanceOf',
    args: owner && tokenId !== undefined ? [owner, tokenId] : undefined,
    query: {
      enabled: !!address && !!owner && tokenId !== undefined,
    },
  });
}

/**
 * Hook to read the settlement manager address
 */
export function useReadSettlementManagerAddress() {
  const address = useRBNPrimitiveAddress();

  return useReadContract({
    address,
    abi: rbnPrimitiveAbi,
    functionName: 'settlementManager',
    query: {
      enabled: !!address,
    },
  });
}

/**
 * Hook to mint a new cashflow NFT
 */
export function useMintCashflow() {
  const address = useRBNPrimitiveAddress();
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const mintCashflow = (recipient: Address, cashflow: Cashflow) => {
    if (!address) {
      throw new Error('Contract address not available for current chain');
    }

    writeContract({
      address,
      abi: rbnPrimitiveAbi,
      functionName: 'mintCashflow',
      args: [recipient, cashflow],
    });
  };

  return {
    mintCashflow,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Hook to transfer a cashflow NFT
 */
export function useTransferCashflow() {
  const address = useRBNPrimitiveAddress();
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const transferCashflow = (
    from: Address,
    to: Address,
    tokenId: bigint,
    amount: bigint = BigInt(1),
    data: `0x${string}` = '0x'
  ) => {
    if (!address) {
      throw new Error('Contract address not available for current chain');
    }

    writeContract({
      address,
      abi: rbnPrimitiveAbi,
      functionName: 'safeTransferFrom',
      args: [from, to, tokenId, amount, data],
    });
  };

  return {
    transferCashflow,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}
