'use client';

import { useAccount } from 'wagmi';
import {
  useReadMockEcTokenGetAllTokensOfOwner,
  useReadMockEcTokenGetTokenInfo,
  useReadMarketplaceGetAllListings,
} from '@/generated';

export function OwnedECTokensCard() {
  const { address } = useAccount();

  // Fetch owned token IDs
  const { data: ownedTokenIds, isLoading } =
    useReadMockEcTokenGetAllTokensOfOwner({
      args: address ? [address] : undefined,
      query: { enabled: !!address },
    });

  // Fetch marketplace listings to check if tokens are listed
  const { data: allListings } = useReadMarketplaceGetAllListings();

  if (!address) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Your EC Tokens
        </h2>
        <p className="text-gray-500">Connect wallet to view your tokens</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Your EC Tokens
        </h2>
        <p className="text-gray-500">Loading your tokens...</p>
      </div>
    );
  }

  if (!ownedTokenIds || ownedTokenIds.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Your EC Tokens
        </h2>
        <p className="text-gray-500">
          You don&apos;t own any EC tokens yet.{' '}
          <a href="/marketplace" className="text-blue-600 hover:underline">
            Browse marketplace
          </a>
        </p>
      </div>
    );
  }

  // Separate listed vs not listed
  const listedTokenIds = new Set(
    allListings
      ?.filter((l) => l.seller === address && l.active)
      .map((l) => l.tokenId) || []
  );

  const notListed = ownedTokenIds.filter((id) => !listedTokenIds.has(id));
  const listed = ownedTokenIds.filter((id) => listedTokenIds.has(id));

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Your EC Tokens
        </h2>
        <a
          href="/marketplace/list"
          className="text-sm text-blue-600 hover:underline"
        >
          List Token for Sale
        </a>
      </div>

      {notListed.length > 0 && (
        <section className="mb-6">
          <h3 className="mb-3 text-sm font-medium text-gray-700">
            Portfolio ({notListed.length})
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {notListed.map((tokenId) => (
              <TokenCard key={tokenId} tokenId={tokenId} isListed={false} />
            ))}
          </div>
        </section>
      )}

      {listed.length > 0 && (
        <section>
          <h3 className="mb-3 text-sm font-medium text-gray-700">
            Listed for Sale ({listed.length})
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {listed.map((tokenId) => (
              <TokenCard key={tokenId} tokenId={tokenId} isListed={true} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

interface TokenCardProps {
  tokenId: bigint;
  isListed: boolean;
}

function TokenCard({ tokenId, isListed }: TokenCardProps) {
  const { data: tokenInfo } = useReadMockEcTokenGetTokenInfo({
    args: [tokenId],
  });

  if (!tokenInfo) {
    return (
      <div className="rounded-lg border border-gray-200 p-4">
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    );
  }

  const totalAmount = Number(tokenInfo.schedule.totalAmount) / 1e6;
  const claimed = Number(tokenInfo.claimed) / 1e6;
  const remaining = totalAmount - claimed;

  return (
    <div className="rounded-lg border border-gray-200 p-4 hover:border-gray-300">
      <div className="mb-3 flex items-center justify-between">
        <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
          TOKEN #{tokenId.toString()}
        </span>
        {isListed && (
          <span className="text-xs text-green-600">Listed</span>
        )}
      </div>

      <div className="space-y-2">
        <div>
          <p className="text-xs text-gray-600">Total Value</p>
          <p className="text-lg font-semibold text-gray-900">
            ${totalAmount.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Remaining</p>
          <p className="text-sm font-medium text-gray-900">
            ${remaining.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Claimed</p>
          <p className="text-sm text-gray-600">${claimed.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
