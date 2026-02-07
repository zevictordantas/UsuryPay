'use client';

import { useEffect, useState } from 'react';
import { type Address, formatUnits } from 'viem';
import { useChainId } from 'wagmi';
import {
  useReadPayrollVaultGetMintedTokens,
  useReadMockEcTokenGetTokenInfo,
  useReadMockEcTokenGetTokenRecipient,
} from '@/generated';
import { addresses } from '@/contracts/addresses';

interface MintedECTokensListProps {
  vaultAddress: Address;
  onVaultFunded?: () => void;
}

function TokenRow({ tokenId, ecTokenAddress }: { tokenId: bigint; ecTokenAddress: Address }) {
  const { data: tokenInfo, isLoading, error } = useReadMockEcTokenGetTokenInfo({
    args: [tokenId],
    query: { enabled: !!tokenId },
  });

  const { data: recipient } = useReadMockEcTokenGetTokenRecipient({
    args: [tokenId],
    query: { enabled: !!tokenId },
  });

  if (error) {
    console.error('Error loading token info:', error);
    return (
      <tr className="border-b border-gray-100">
        <td className="py-4" colSpan={5}>
          <div className="text-sm text-red-500">Error loading token #{tokenId.toString()}</div>
        </td>
      </tr>
    );
  }

  if (isLoading || !tokenInfo) {
    return (
      <tr className="border-b border-gray-100">
        <td className="py-4" colSpan={5}>
          <div className="text-sm text-gray-500">Loading token #{tokenId.toString()}...</div>
        </td>
      </tr>
    );
  }

  const totalAmount = Number(formatUnits(tokenInfo.schedule.totalAmount, 6));
  const claimed = Number(formatUnits(tokenInfo.claimed, 6));
  const remaining = totalAmount - claimed;

  const now = Math.floor(Date.now() / 1000);
  const duration = Number(tokenInfo.schedule.endTime) - Number(tokenInfo.schedule.startTime);
  const elapsed = Math.max(0, Math.min(now - Number(tokenInfo.schedule.startTime), duration));
  const progress = duration > 0 ? (elapsed / duration) * 100 : 0;

  return (
    <tr className="border-b border-gray-100 last:border-b-0">
      <td className="py-4">
        <div className="text-sm font-medium text-gray-900">
          #{tokenId.toString()}
        </div>
      </td>
      <td className="py-4">
        <div className="text-sm text-gray-900">
          {totalAmount.toFixed(2)} USDC
        </div>
        <div className="text-xs text-gray-500">
          {claimed.toFixed(2)} claimed
        </div>
      </td>
      <td className="py-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-green-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-gray-600">
              {progress.toFixed(0)}%
            </span>
          </div>
        </div>
      </td>
      <td className="py-4">
        <div className="text-sm text-gray-900">
          {remaining.toFixed(2)} USDC
        </div>
      </td>
      <td className="py-4">
        {recipient ? (
          <div className="text-xs font-mono text-gray-700" title={recipient}>
            {recipient.slice(0, 6)}...{recipient.slice(-4)}
          </div>
        ) : (
          <div className="text-xs text-gray-400">Unknown</div>
        )}
      </td>
    </tr>
  );
}

export function MintedECTokensList({ vaultAddress }: MintedECTokensListProps) {
  const chainId = useChainId();
  const contractAddresses = addresses[chainId as keyof typeof addresses];
  const ecTokenAddress = contractAddresses?.mockECToken;

  const { data: mintedTokens, isLoading } = useReadPayrollVaultGetMintedTokens({
    address: vaultAddress,
    query: { enabled: !!vaultAddress },
  });

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Minted Salary Tokens
        </h2>
        <div className="py-8 text-center">
          <p className="text-gray-500">Loading tokens...</p>
        </div>
      </div>
    );
  }

  if (!mintedTokens || mintedTokens.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Minted Salary Tokens
        </h2>
        <div className="py-8 text-center">
          <p className="text-gray-500">No salary tokens minted yet</p>
          <p className="mt-2 text-sm text-gray-400">
            Mint your first salary token above
          </p>
        </div>
      </div>
    );
  }

  if (!ecTokenAddress) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Minted Salary Tokens
        </h2>
        <div className="py-8 text-center">
          <p className="text-red-500">ECToken address not found for this network</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">
        Minted Salary Tokens
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="pb-3 text-sm font-medium text-gray-700">
                Token ID
              </th>
              <th className="pb-3 text-sm font-medium text-gray-700">
                Total Amount
              </th>
              <th className="pb-3 text-sm font-medium text-gray-700">
                Accrual Progress
              </th>
              <th className="pb-3 text-sm font-medium text-gray-700">
                Remaining
              </th>
              <th className="pb-3 text-sm font-medium text-gray-700">
                Employee
              </th>
            </tr>
          </thead>
          <tbody>
            {mintedTokens.map((tokenId) => (
              <TokenRow
                key={tokenId.toString()}
                tokenId={tokenId}
                ecTokenAddress={ecTokenAddress}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
