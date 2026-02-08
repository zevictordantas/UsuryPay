'use client';

import { useAccount } from 'wagmi';
import { useReadMockEcTokenGetAllTokensOfOwner } from '@/generated';

export function PortfolioSummaryCard() {
  const { address } = useAccount();

  // Fetch all token IDs owned by user
  const { data: ownedTokenIds, isLoading } =
    useReadMockEcTokenGetAllTokensOfOwner({
      args: address ? [address] : undefined,
      query: { enabled: !!address },
    });

  const totalTokens = ownedTokenIds?.length || 0;

  if (!address) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-zinc-900">
          Portfolio Summary
        </h2>
        <p className="text-zinc-500">Connect wallet to view portfolio</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-zinc-900">
          Portfolio Summary
        </h2>
        <p className="text-zinc-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-zinc-900">
        Portfolio Summary
      </h2>
      <div>
        <p className="text-sm text-zinc-600">EC Tokens Owned</p>
        <p className="text-2xl font-bold text-zinc-900">{totalTokens}</p>
      </div>
    </div>
  );
}
