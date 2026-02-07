'use client';

import { useState, useEffect } from 'react';
import { type Address, formatUnits } from 'viem';
import { useAccount, useChainId, useReadContracts } from 'wagmi';
import { addresses } from '@/contracts/addresses';
import { mockEcTokenAbi } from '@/generated';

export function PayrollSummaryCard() {
  const { address: employeeAddress } = useAccount();
  const chainId = useChainId();
  const contractAddresses = addresses[chainId as keyof typeof addresses];
  const ecTokenAddress = contractAddresses?.mockECToken;

  const [totalClaimable, setTotalClaimable] = useState(0);
  const [tokenCount, setTokenCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Scan for owned tokens (same logic as portfolio)
  const tokenIdsToCheck = Array.from({ length: 100 }, (_, i) => BigInt(i + 1));

  const balanceChecks = useReadContracts({
    contracts: tokenIdsToCheck.map((tokenId) => ({
      address: ecTokenAddress,
      abi: mockEcTokenAbi,
      functionName: 'balanceOf',
      args: [employeeAddress, tokenId],
    })),
    query: {
      enabled: !!ecTokenAddress && !!employeeAddress,
    },
  });

  const claimableChecks = useReadContracts({
    contracts: tokenIdsToCheck.map((tokenId) => ({
      address: ecTokenAddress,
      abi: mockEcTokenAbi,
      functionName: 'getClaimable',
      args: [tokenId],
    })),
    query: {
      enabled: !!ecTokenAddress,
    },
  });

  useEffect(() => {
    if (balanceChecks.data && claimableChecks.data) {
      let total = 0;
      let count = 0;

      tokenIdsToCheck.forEach((tokenId, index) => {
        const balanceResult = balanceChecks.data?.[index] as any;
        const claimableResult = claimableChecks.data?.[index] as any;

        if (
          balanceResult?.status === 'success' &&
          claimableResult?.status === 'success'
        ) {
          const balance = balanceResult.result as bigint;
          const claimable = claimableResult.result as bigint;

          if (balance && Number(balance) > 0) {
            count++;
            if (claimable) {
              total += Number(formatUnits(claimable, 6));
            }
          }
        }
      });

      setTotalClaimable(total);
      setTokenCount(count);
      setIsLoading(false);
    }
  }, [balanceChecks.data, claimableChecks.data]);

  if (!employeeAddress) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Payroll Summary
        </h2>
        <div className="py-8 text-center">
          <p className="text-gray-500">Connect wallet to view summary</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Payroll Summary
        </h2>
        <div className="py-8 text-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">
        Payroll Summary
      </h2>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <p className="text-sm text-gray-600">Total Claimable Now</p>
          <p className="text-3xl font-bold text-green-600">
            ${totalClaimable.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500">Across all owned EC tokens</p>
        </div>

        <div>
          <p className="text-sm text-gray-600">Active Salary Tokens</p>
          <p className="text-3xl font-bold text-gray-900">{tokenCount}</p>
          <p className="text-xs text-gray-500">
            {tokenCount === 0
              ? 'No tokens yet'
              : tokenCount === 1
                ? '1 employer'
                : `From ${tokenCount} token${tokenCount > 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      {tokenCount === 0 && (
        <div className="mt-4 rounded-md bg-blue-50 p-4 text-sm text-blue-700">
          <p className="font-medium">How it works:</p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>Your employer mints salary tokens for you</li>
            <li>Tokens accrue value over time (linear vesting)</li>
            <li>You can claim when ready or sell for immediate cash</li>
          </ul>
        </div>
      )}
    </div>
  );
}
