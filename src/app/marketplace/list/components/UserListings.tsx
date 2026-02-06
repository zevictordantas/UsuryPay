'use client';

import { useMemo, useState } from 'react';
import { useAccount, useChainId, usePublicClient } from 'wagmi';
import { formatUnits } from 'viem';
import {
  marketplaceAddress,
  useReadMarketplaceGetAllListings,
  useWriteMarketplaceCancel,
} from '@/generated';

interface UserListing {
  listingId: string;
  tokenId: string;
  tokenAddress: string;
  tokenType: 'ERC721' | 'ERC1155';
  price: number;
  listedAt: number;
  active: boolean;
}

interface UserListingsProps {
  onCancelled: () => void;
}

export function UserListings({ onCancelled }: UserListingsProps) {
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const publicClient = usePublicClient();
  const hasMarketplace = Boolean(marketplaceAddress[chainId as keyof typeof marketplaceAddress]);
  const {
    data: allListings,
    isLoading,
    isError,
    refetch,
  } = useReadMarketplaceGetAllListings({
    query: {
      enabled: isConnected && hasMarketplace,
    },
  });
  const { writeContractAsync: cancelListing } = useWriteMarketplaceCancel();

  const listings = useMemo(() => {
    if (!allListings || !address) return [];
    return allListings
      .filter((listing) => listing.active && listing.seller === address)
      .map((listing) => {
        return {
          listingId: listing.id.toString(),
          tokenId: listing.tokenId.toString(),
          tokenAddress: listing.tokenAddress,
          tokenType: listing.tokenType === 0 ? 'ERC721' : 'ERC1155',
          price: Number(formatUnits(listing.price, 6)),
          listedAt: Date.now(),
          active: listing.active,
        } satisfies UserListing;
      });
  }, [allListings, address]);

  const handleCancel = async (listingId: string) => {
    setCancellingId(listingId);
    try {
      if (!publicClient) {
        alert('Wallet client not ready.');
        return;
      }
      const cancelHash = await cancelListing({
        args: [BigInt(listingId)],
      });
      await publicClient.waitForTransactionReceipt({ hash: cancelHash });

      alert('Listing cancelled successfully! Token returned to your wallet.');
      await refetch();
      onCancelled();
    } catch (error) {
      console.error('Failed to cancel listing:', error);
      alert('Failed to cancel listing. Please try again.');
    } finally {
      setCancellingId(null);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getTimeSinceListing = (timestamp: number) => {
    const days = Math.floor((Date.now() - timestamp) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
  };

  if (!isConnected) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Your Active Listings
        </h2>
        <div className="py-8 text-center">
          <p className="text-sm text-gray-500">
            Connect your wallet to view your listings.
          </p>
        </div>
      </div>
    );
  }

  if (!hasMarketplace) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Your Active Listings
        </h2>
        <div className="py-8 text-center">
          <p className="text-sm text-gray-500">
            Marketplace is not deployed on this network.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Your Active Listings
        </h2>
        <div className="py-8 text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>
          <p className="text-sm text-gray-500">Loading your listings...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Your Active Listings
        </h2>
        <div className="py-8 text-center">
          <p className="text-sm text-gray-500">
            Failed to load your listings. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">
        Your Active Listings
      </h2>

      {listings.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-gray-600">No active listings</p>
          <p className="mt-1 text-sm text-gray-500">
            List your EC tokens above to get started
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {listings.map((listing) => (
            <div
              key={listing.listingId}
              className="rounded-md border border-gray-200 p-4"
            >
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900">
                      Token #{listing.tokenId}
                    </p>
                    <span className="inline-flex rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800">
                      {listing.tokenType}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {formatAddress(listing.tokenAddress)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">
                    ${(listing.price / 1000).toFixed(1)}k
                  </p>
                  <p className="text-xs text-gray-500">USDC</p>
                </div>
              </div>

              <div className="mb-3 flex items-center justify-between text-sm">
                <div>
                  <p className="text-gray-600">Listing ID</p>
                  <p className="font-mono font-medium text-gray-900">
                    #{listing.listingId}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-gray-600">Listed</p>
                  <p className="font-medium text-gray-900">
                    {getTimeSinceListing(listing.listedAt)}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleCancel(listing.listingId)}
                disabled={cancellingId === listing.listingId}
                className="w-full rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
              >
                {cancellingId === listing.listingId
                  ? 'Cancelling...'
                  : 'Cancel Listing'}
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 rounded-md bg-gray-50 p-3">
        <p className="text-xs text-gray-700">
          <strong>Note:</strong> Cancelling a listing will return the token to
          your wallet. This action cannot be undone.
        </p>
      </div>
    </div>
  );
}
