'use client';

import { useState, useEffect } from 'react';
import { ECTokenSaleOffer, ECVault } from '@/app/types/ec-types';

interface ECTokenDisplay extends ECTokenSaleOffer {
  employerName: string;
  vaultDefaults: number;
  durationDays: number;
  baseDiscount: number;
  creditDiscount: number;
  timeDiscount: number;
  apr: number;
  isPurchasing?: boolean;
}

// Mock data for demo
const mockECTokens: ECTokenDisplay[] = [
  {
    tokenId: '1',
    futureValue: 48000,
    offerAmount: 39360,
    discountPercent: 18,
    expiresAt: Date.now() + 60 * 24 * 60 * 60 * 1000,
    creditScore: 720,
    employerName: 'TechCorp Inc',
    vaultDefaults: 0,
    durationDays: 60,
    baseDiscount: 10,
    creditDiscount: 5,
    timeDiscount: 3,
    apr: 12.4,
  },
  {
    tokenId: '2',
    futureValue: 24000,
    offerAmount: 20640,
    discountPercent: 14,
    expiresAt: Date.now() + 90 * 24 * 60 * 60 * 1000,
    creditScore: 780,
    employerName: 'FinServ LLC',
    vaultDefaults: 0,
    durationDays: 90,
    baseDiscount: 10,
    creditDiscount: 2,
    timeDiscount: 2,
    apr: 8.8,
  },
  {
    tokenId: '3',
    futureValue: 36000,
    offerAmount: 29520,
    discountPercent: 18,
    expiresAt: Date.now() + 45 * 24 * 60 * 60 * 1000,
    creditScore: 650,
    employerName: 'StartupXYZ',
    vaultDefaults: 2,
    durationDays: 45,
    baseDiscount: 10,
    creditDiscount: 6,
    timeDiscount: 2,
    apr: 15.2,
  },
];

interface AvailableECTokenCardsProps {
  onPurchased?: () => void;
}

export function AvailableECTokenCards({
  onPurchased,
}: AvailableECTokenCardsProps) {
  const [ecTokens, setECTokens] = useState<ECTokenDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAvailableECTokens = async () => {
      setIsLoading(true);
      try {
        // TODO: Implement Web3 call to list available EC Tokens for sale
        // const tokenIds = await contract.listAvailableECTokens(0, 10);
        // const tokenData = await Promise.all(
        //   tokenIds.map(id => contract.getECTokenSaleOffer(id))
        // );

        setTimeout(() => {
          setECTokens(mockECTokens);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to fetch EC Tokens:', error);
        setIsLoading(false);
      }
    };

    fetchAvailableECTokens();
  }, []);

  const handlePurchase = async (tokenId: string) => {
    setECTokens((prev) =>
      prev.map((token) =>
        token.tokenId === tokenId ? { ...token, isPurchasing: true } : token
      )
    );

    try {
      // TODO: Implement Web3 purchase
      // await contract.approveUSDC(amount);
      // await contract.buyECToken(tokenId, offerAmount);
      console.log('Purchasing EC Token:', tokenId);

      onPurchased?.();
    } catch (error) {
      console.error('Purchase failed:', error);
    } finally {
      setECTokens((prev) =>
        prev.map((token) =>
          token.tokenId === tokenId ? { ...token, isPurchasing: false } : token
        )
      );
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Available EC Tokens
        </h2>
        <div className="py-8 text-center">
          <p className="text-gray-500">Loading available EC Tokens...</p>
        </div>
      </div>
    );
  }

  if (ecTokens.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Available EC Tokens
        </h2>
        <div className="py-8 text-center">
          <p className="text-gray-500">No EC Tokens available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">
        Available EC Tokens
      </h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {ecTokens.map((token) => (
          <div
            key={token.tokenId}
            className="rounded-lg border border-gray-200 p-4 hover:border-gray-300"
          >
            <div className="mb-3">
              <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                PAYROLL
              </span>
              {token.vaultDefaults > 0 && (
                <span className="ml-2 inline-flex rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                  {token.vaultDefaults} Default{token.vaultDefaults > 1 ? 's' : ''}
                </span>
              )}
            </div>

            <div className="mb-3">
              <p className="text-sm font-medium text-gray-900">
                {token.employerName}
              </p>
              <p className="text-xs text-gray-600">
                Credit Score: {token.creditScore}
              </p>
            </div>

            <div className="mb-3">
              <p className="text-lg font-bold text-gray-900">
                Buy EC Token: ${(token.futureValue / 1000).toFixed(0)}k future
                value
              </p>
              <p className="text-sm text-gray-600">
                {token.durationDays} days
              </p>
            </div>

            <div className="mb-3 space-y-1 text-xs text-gray-600">
              <p className="font-medium">Discount Breakdown:</p>
              <p>Base {token.baseDiscount}% + Credit {token.creditDiscount}% + Time {token.timeDiscount}% = {token.discountPercent}% total</p>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-green-600">
                {token.apr}% APR
              </p>
              <p className="text-xs text-gray-600">
                Pay ${(token.offerAmount / 1000).toFixed(1)}k now
              </p>
            </div>

            <button
              onClick={() => handlePurchase(token.tokenId)}
              disabled={token.isPurchasing}
              className="w-full rounded-md bg-black px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {token.isPurchasing ? 'Purchasing...' : 'Buy EC Token'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
