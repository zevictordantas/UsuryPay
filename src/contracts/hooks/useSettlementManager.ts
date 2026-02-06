'use client';

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { type Address } from 'viem';
import { settlementManagerAbi } from '../generated';
import { getContractAddresses } from '../addresses';
import { useChainId } from 'wagmi';

/**
 * Hook to get the SettlementManager contract address for the current chain
 */
export function useSettlementManagerAddress(): Address | undefined {
  const chainId = useChainId();
  const addresses = getContractAddresses(chainId);
  return addresses?.settlementManager;
}

/**
 * Hook to read the locked amount for a cashflow
 */
export function useReadLockedAmount(cashflowId: bigint | undefined) {
  const address = useSettlementManagerAddress();

  return useReadContract({
    address,
    abi: settlementManagerAbi,
    functionName: 'getLockedAmount',
    args: cashflowId !== undefined ? [cashflowId] : undefined,
    query: {
      enabled: !!address && cashflowId !== undefined,
    },
  });
}

/**
 * Hook to read the accrued amount for a cashflow
 */
export function useReadAccruedAmount(cashflowId: bigint | undefined) {
  const address = useSettlementManagerAddress();

  return useReadContract({
    address,
    abi: settlementManagerAbi,
    functionName: 'getAccruedAmount',
    args: cashflowId !== undefined ? [cashflowId] : undefined,
    query: {
      enabled: !!address && cashflowId !== undefined,
    },
  });
}

/**
 * Hook to read the settled amount for a cashflow
 */
export function useReadSettledAmount(cashflowId: bigint | undefined) {
  const address = useSettlementManagerAddress();

  return useReadContract({
    address,
    abi: settlementManagerAbi,
    functionName: 'getSettledAmount',
    args: cashflowId !== undefined ? [cashflowId] : undefined,
    query: {
      enabled: !!address && cashflowId !== undefined,
    },
  });
}

/**
 * Hook to read the available (unsettled) amount for a cashflow
 */
export function useReadAvailableAmount(cashflowId: bigint | undefined) {
  const address = useSettlementManagerAddress();

  return useReadContract({
    address,
    abi: settlementManagerAbi,
    functionName: 'getAvailableAmount',
    args: cashflowId !== undefined ? [cashflowId] : undefined,
    query: {
      enabled: !!address && cashflowId !== undefined,
    },
  });
}

/**
 * Hook to check if an address is an authorized recorder
 */
export function useReadIsAuthorizedRecorder(recorder: Address | undefined) {
  const address = useSettlementManagerAddress();

  return useReadContract({
    address,
    abi: settlementManagerAbi,
    functionName: 'authorizedRecorders',
    args: recorder ? [recorder] : undefined,
    query: {
      enabled: !!address && !!recorder,
    },
  });
}

/**
 * Hook to lock funds for a cashflow
 * Note: Caller must have approved the SettlementManager to spend their tokens
 */
export function useLockFunds() {
  const address = useSettlementManagerAddress();
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const lockFunds = (cashflowId: bigint, amount: bigint) => {
    if (!address) {
      throw new Error('Contract address not available for current chain');
    }

    writeContract({
      address,
      abi: settlementManagerAbi,
      functionName: 'lockFunds',
      args: [cashflowId, amount],
    });
  };

  return {
    lockFunds,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Hook to record an accrual for a cashflow
 * Note: Caller must be an authorized recorder or owner
 */
export function useRecordAccrual() {
  const address = useSettlementManagerAddress();
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const recordAccrual = (cashflowId: bigint, amount: bigint) => {
    if (!address) {
      throw new Error('Contract address not available for current chain');
    }

    writeContract({
      address,
      abi: settlementManagerAbi,
      functionName: 'recordAccrual',
      args: [cashflowId, amount],
    });
  };

  return {
    recordAccrual,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Hook to settle a cashflow (transfer accrued funds to NFT owner)
 */
export function useSettle() {
  const address = useSettlementManagerAddress();
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const settle = (cashflowId: bigint) => {
    if (!address) {
      throw new Error('Contract address not available for current chain');
    }

    writeContract({
      address,
      abi: settlementManagerAbi,
      functionName: 'settle',
      args: [cashflowId],
    });
  };

  return {
    settle,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Combined hook to read all settlement data for a cashflow
 */
export function useReadSettlementData(cashflowId: bigint | undefined) {
  const locked = useReadLockedAmount(cashflowId);
  const accrued = useReadAccruedAmount(cashflowId);
  const settled = useReadSettledAmount(cashflowId);
  const available = useReadAvailableAmount(cashflowId);

  const isLoading = locked.isLoading || accrued.isLoading || settled.isLoading || available.isLoading;
  const isError = locked.isError || accrued.isError || settled.isError || available.isError;

  return {
    lockedAmount: locked.data,
    accruedAmount: accrued.data,
    settledAmount: settled.data,
    availableAmount: available.data,
    isLoading,
    isError,
    refetch: () => {
      locked.refetch();
      accrued.refetch();
      settled.refetch();
      available.refetch();
    },
  };
}
