'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { formatUnits } from 'viem';
import { MarketplaceFilters } from '../page';
import { ECTokenCard } from './ECTokenCard';
import {
  marketplaceAddress,
  useReadMarketplaceGetAllListings,
} from '@/generated';

export interface MarketplaceToken {
  listingId: string;
  listingIdRaw: bigint;
  tokenId: string;
  tokenAddress: string;
  vaultAddress: string;
  seller: string;
  sellerName: string;
  tokenType:
    | 'payroll'
    | 'rental'
    | 'subscription'
    | 'dividend'
    | 'other'
    | 'erc721'
    | 'erc1155';
  futureValue: number;
  askPrice: number;
  askPriceRaw: bigint;
  discountPercent: number;
  totalAmount: number;
  claimed: number;
  startTime: number;
  endTime: number;
  durationDays: number;
  creditScore: number;
  defaultCount: number;
  riskLevel: 'low' | 'medium' | 'high';
  listedAt: number;
}

interface MarketplaceListingsProps {
  filters: MarketplaceFilters;
}

export function MarketplaceListings({ filters }: MarketplaceListingsProps) {
  const [now, setNow] = useState<number | null>(null);
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const hasMarketplace = Boolean(marketplaceAddress[chainId]);
  const {
    data: listings,
    isLoading,
    isError,
  } = useReadMarketplaceGetAllListings({
    query: {
      enabled: isConnected && hasMarketplace,
    },
  });

  useEffect(() => {
    const id = setTimeout(() => setNow(Date.now()), 0);
    return () => clearTimeout(id);
  }, []);

  const tokens = useMemo(() => {
    if (!listings || now === null) return [];
    return listings
      .filter((listing) => listing.active)
      .map((listing) => {
        const askPrice = Number(formatUnits(listing.price, 6));
        const tokenType = listing.tokenType === 0 ? 'erc721' : 'erc1155';
        return {
          listingId: listing.id.toString(),
          listingIdRaw: listing.id,
          tokenId: listing.tokenId.toString(),
          tokenAddress: listing.tokenAddress,
          vaultAddress: listing.tokenAddress,
          seller: listing.seller,
          sellerName: `${listing.seller.slice(0, 6)}...${listing.seller.slice(-4)}`,
          tokenType,
          futureValue: askPrice,
          askPrice,
          askPriceRaw: listing.price,
          discountPercent: 0,
          totalAmount: askPrice,
          claimed: 0,
          startTime: Math.floor(now / 1000) - 86400,
          endTime: Math.floor(now / 1000) + 86400 * 30,
          durationDays: 30,
          creditScore: 700,
          defaultCount: 0,
          riskLevel: 'low',
          listedAt: now,
        } satisfies MarketplaceToken;
      });
  }, [listings, now]);

  const filteredAndSortedTokens = tokens
    .filter((token) => {
      if (filters.showDefaultedOnly && token.defaultCount === 0) return false;
      if (token.creditScore < filters.minCreditScore) return false;
      if (
        filters.maxDuration !== null &&
        token.durationDays > filters.maxDuration
      )
        return false;
      return true;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'discount':
          return b.discountPercent - a.discountPercent;
        case 'amount':
          return b.futureValue - a.futureValue;
        case 'duration':
          return a.durationDays - b.durationDays;
        case 'creditScore':
          return b.creditScore - a.creditScore;
        default:
          return 0;
      }
    });

  if (!isConnected) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <div className="py-12 text-center">
          <p className="text-gray-500">Connect your wallet to view listings.</p>
        </div>
      </div>
    );
  }

  if (!hasMarketplace) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <div className="py-12 text-center">
          <p className="text-gray-500">
            Marketplace is not deployed on this network.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <div className="py-12 text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>
          <p className="text-gray-500">Loading marketplace listings...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <div className="py-12 text-center">
          <p className="text-gray-500">
            Failed to load listings. Please try again.
          </p>
        </div>
      </div>
    );
  }

  if (filteredAndSortedTokens.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <div className="py-12 text-center">
          <p className="text-lg text-gray-900">No tokens found</p>
          <p className="mt-2 text-sm text-gray-500">
            Try adjusting your filters to see more results
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredAndSortedTokens.length} token
          {filteredAndSortedTokens.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {filteredAndSortedTokens.map((token) => (
          <ECTokenCard key={token.tokenId} token={token} />
        ))}
      </div>
    </div>
  );
}
