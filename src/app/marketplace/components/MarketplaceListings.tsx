'use client';

import { useState, useEffect } from 'react';
import { MarketplaceFilters } from '../page';
import { ECTokenCard } from './ECTokenCard';

export interface MarketplaceToken {
  listingId: string;
  tokenId: string;
  tokenAddress: string;
  vaultAddress: string;
  seller: string;
  sellerName: string;
  tokenType: 'payroll' | 'rental' | 'subscription' | 'dividend' | 'other';
  futureValue: number;
  askPrice: number;
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

// Mock data for demo - diverse EC tokens from various sources
const mockMarketplaceTokens: MarketplaceToken[] = [
  {
    listingId: '1',
    tokenId: '0x1a2b3c',
    tokenAddress: '0xECToken001',
    vaultAddress: '0xTechCorp001',
    seller: '0xEmployee123',
    sellerName: 'Alice',
    tokenType: 'payroll',
    futureValue: 48000,
    askPrice: 39360,
    discountPercent: 18,
    totalAmount: 60000,
    claimed: 12000,
    startTime: Date.now() / 1000 - 86400 * 30,
    endTime: Date.now() / 1000 + 86400 * 60,
    durationDays: 60,
    creditScore: 720,
    defaultCount: 0,
    riskLevel: 'low',
    listedAt: Date.now() - 86400000 * 2,
  },
  {
    listingId: '2',
    tokenId: '0x4d5e6f',
    tokenAddress: '0xECToken002',
    vaultAddress: '0xStartupXYZ002',
    seller: '0xEmployee456',
    sellerName: 'Bob',
    tokenType: 'payroll',
    futureValue: 36000,
    askPrice: 29520,
    discountPercent: 18,
    totalAmount: 48000,
    claimed: 12000,
    startTime: Date.now() / 1000 - 86400 * 15,
    endTime: Date.now() / 1000 + 86400 * 45,
    durationDays: 45,
    creditScore: 650,
    defaultCount: 2,
    riskLevel: 'high',
    listedAt: Date.now() - 86400000,
  },
  {
    listingId: '3',
    tokenId: '0x7g8h9i',
    tokenAddress: '0xECToken003',
    vaultAddress: '0xRetailShop003',
    seller: '0xLandlord789',
    sellerName: 'Property LLC',
    tokenType: 'rental',
    futureValue: 120000,
    askPrice: 108000,
    discountPercent: 10,
    totalAmount: 144000,
    claimed: 24000,
    startTime: Date.now() / 1000 - 86400 * 60,
    endTime: Date.now() / 1000 + 86400 * 300,
    durationDays: 300,
    creditScore: 780,
    defaultCount: 0,
    riskLevel: 'low',
    listedAt: Date.now() - 86400000 * 5,
  },
  {
    listingId: '4',
    tokenId: '0xj0k1l2',
    tokenAddress: '0xECToken004',
    vaultAddress: '0xSaaSCompany004',
    seller: '0xFounder001',
    sellerName: 'SaaS Founder',
    tokenType: 'subscription',
    futureValue: 24000,
    askPrice: 19200,
    discountPercent: 20,
    totalAmount: 36000,
    claimed: 12000,
    startTime: Date.now() / 1000 - 86400 * 120,
    endTime: Date.now() / 1000 + 86400 * 240,
    durationDays: 240,
    creditScore: 690,
    defaultCount: 1,
    riskLevel: 'medium',
    listedAt: Date.now() - 86400000 * 3,
  },
  {
    listingId: '5',
    tokenId: '0xm3n4o5',
    tokenAddress: '0xECToken005',
    vaultAddress: '0xFinServ005',
    seller: '0xEmployee999',
    sellerName: 'Carol',
    tokenType: 'payroll',
    futureValue: 24000,
    askPrice: 20640,
    discountPercent: 14,
    totalAmount: 30000,
    claimed: 6000,
    startTime: Date.now() / 1000 - 86400 * 20,
    endTime: Date.now() / 1000 + 86400 * 90,
    durationDays: 90,
    creditScore: 780,
    defaultCount: 0,
    riskLevel: 'low',
    listedAt: Date.now() - 86400000 * 1,
  },
  {
    listingId: '6',
    tokenId: '0xp6q7r8',
    tokenAddress: '0xECToken006',
    vaultAddress: '0xDividendCorp006',
    seller: '0xInvestor123',
    sellerName: 'Investor Dave',
    tokenType: 'dividend',
    futureValue: 15000,
    askPrice: 13500,
    discountPercent: 10,
    totalAmount: 20000,
    claimed: 5000,
    startTime: Date.now() / 1000 - 86400 * 90,
    endTime: Date.now() / 1000 + 86400 * 270,
    durationDays: 270,
    creditScore: 800,
    defaultCount: 0,
    riskLevel: 'low',
    listedAt: Date.now() - 86400000 * 7,
  },
];

interface MarketplaceListingsProps {
  filters: MarketplaceFilters;
}

export function MarketplaceListings({ filters }: MarketplaceListingsProps) {
  const [tokens, setTokens] = useState<MarketplaceToken[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMarketplaceTokens = async () => {
      setIsLoading(true);
      try {
        // TODO: Web3 Integration - Replace with actual contract calls
        // const listings = await marketplaceContract.read.getAllListings();
        //
        // const tokenData = await Promise.all(
        //   listings
        //     .filter(listing => listing.active)
        //     .map(async (listing) => {
        //       // Fetch EC token details
        //       const tokenContract = getContract({
        //         address: listing.tokenAddress,
        //         abi: ECTokenABI,
        //       });
        //       const tokenInfo = await tokenContract.read.getTokenInfo([listing.tokenId]);
        //
        //       // Fetch vault info for risk assessment
        //       const vaultContract = getContract({
        //         address: tokenInfo.vaultAddress,
        //         abi: ECVaultABI,
        //       });
        //       const vaultInfo = await vaultContract.read.getVaultInfo();
        //
        //       return {
        //         listingId: listing.id,
        //         tokenId: listing.tokenId.toString(),
        //         tokenAddress: listing.tokenAddress,
        //         tokenType: listing.tokenType, // ERC721 or ERC1155
        //         seller: listing.seller,
        //         askPrice: Number(listing.price), // USDC with 6 decimals
        //         vaultAddress: tokenInfo.vaultAddress,
        //         futureValue: Number(tokenInfo.totalEntitlement),
        //         claimed: Number(tokenInfo.claimed),
        //         // Calculate discount and other metrics
        //       };
        //     })
        // );
        // setTokens(tokenData);

        setTimeout(() => {
          setTokens(mockMarketplaceTokens);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to fetch marketplace tokens:', error);
        setIsLoading(false);
      }
    };

    fetchMarketplaceTokens();
  }, []);

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
