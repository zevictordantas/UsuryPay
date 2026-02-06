'use client';

import { useState } from 'react';
import {
  useAccount,
  useChainId,
  usePublicClient,
  useReadContract,
  useWriteContract,
} from 'wagmi';
import { erc20Abi, formatUnits } from 'viem';
import {
  marketplaceAddress,
  useReadMarketplaceUsdc,
  useWriteMarketplaceBuy,
} from '@/generated';
import { MarketplaceToken } from './MarketplaceListings';

interface ECTokenCardProps {
  token: MarketplaceToken;
}

export function ECTokenCard({ token }: ECTokenCardProps) {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const publicClient = usePublicClient();
  const marketplace = marketplaceAddress[chainId];
  const { data: usdcAddress } = useReadMarketplaceUsdc({
    query: { enabled: Boolean(marketplace) },
  });
  const { writeContractAsync: writeUsdc } = useWriteContract();
  const { writeContractAsync: buyListing } = useWriteMarketplaceBuy();
  const { refetch: refetchAllowance } = useReadContract({
    address: usdcAddress,
    abi: erc20Abi,
    functionName: 'allowance',
    args: address && marketplace ? [address, marketplace] : undefined,
    query: {
      enabled: Boolean(usdcAddress && address && marketplace),
    },
  });
  const { refetch: refetchBalance } = useReadContract({
    address: usdcAddress,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(usdcAddress && address),
    },
  });

  const handlePurchase = async () => {
    setIsPurchasing(true);
    try {
      if (!isConnected || !address) {
        alert('Please connect your wallet first.');
        return;
      }
      if (!marketplace || !usdcAddress) {
        alert('Marketplace is not available on this network.');
        return;
      }
      if (!publicClient) {
        alert('Wallet client not ready.');
        return;
      }

      const balanceResult = await refetchBalance();
      const balance = (balanceResult.data ?? 0n) as bigint;
      if (balance < token.askPriceRaw) {
        const formattedBalance = formatUnits(balance, 6);
        alert(`Insufficient USDC balance (${formattedBalance}).`);
        return;
      }

      const allowanceResult = await refetchAllowance();
      const allowance = (allowanceResult.data ?? 0n) as bigint;
      if (allowance < token.askPriceRaw) {
        const approveHash = await writeUsdc({
          address: usdcAddress,
          abi: erc20Abi,
          functionName: 'approve',
          args: [marketplace, token.askPriceRaw],
        });
        await publicClient.waitForTransactionReceipt({ hash: approveHash });
      }

      const buyHash = await buyListing({
        args: [token.listingIdRaw],
      });
      await publicClient.waitForTransactionReceipt({ hash: buyHash });

      alert('Purchase successful! Token transferred to your wallet.');
      window.location.reload();
    } catch (error) {
      console.error('Purchase failed:', error);
      alert('Purchase failed. Please try again.');
    } finally {
      setIsPurchasing(false);
    }
  };

  const getTokenTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      payroll: 'PAYROLL',
      rental: 'RENTAL',
      subscription: 'SUBSCRIPTION',
      dividend: 'DIVIDEND',
      other: 'OTHER',
      erc721: 'ERC-721',
      erc1155: 'ERC-1155',
    };
    return labels[type] || 'UNKNOWN';
  };

  const getTokenTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      payroll: 'bg-blue-100 text-blue-800',
      rental: 'bg-purple-100 text-purple-800',
      subscription: 'bg-green-100 text-green-800',
      dividend: 'bg-yellow-100 text-yellow-800',
      other: 'bg-gray-100 text-gray-800',
      erc721: 'bg-gray-100 text-gray-800',
      erc1155: 'bg-gray-100 text-gray-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getRiskColor = (risk: string) => {
    const colors: Record<string, string> = {
      low: 'text-green-600',
      medium: 'text-yellow-600',
      high: 'text-red-600',
    };
    return colors[risk] || 'text-gray-600';
  };

  const getCreditScoreColor = (score: number) => {
    if (score >= 750) return 'text-green-600';
    if (score >= 650) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatAddress = (address: string) => {
    if (address.length <= 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const calculateAPR = () => {
    if (token.durationDays <= 0 || token.askPrice <= 0) return '0.0';
    const totalReturn =
      ((token.futureValue - token.askPrice) / token.askPrice) * 100;
    const annualizedReturn = (totalReturn * 365) / token.durationDays;
    return annualizedReturn.toFixed(1);
  };

  const getTimeRemaining = () => {
    const remainingSeconds = token.endTime - Date.now() / 1000;
    const remainingDays = Math.ceil(remainingSeconds / 86400);
    return Math.max(remainingDays, 0);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex flex-wrap gap-2">
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${getTokenTypeColor(token.tokenType)}`}
          >
            {getTokenTypeLabel(token.tokenType)}
          </span>
          {token.defaultCount > 0 && (
            <span className="inline-flex rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800">
              {token.defaultCount} Default{token.defaultCount > 1 ? 's' : ''}
            </span>
          )}
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase ${getRiskColor(token.riskLevel)}`}
          >
            {token.riskLevel} Risk
          </span>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600">Seller: {token.sellerName}</p>
        <p className="text-xs text-gray-500">
          Vault: {formatAddress(token.vaultAddress)}
        </p>
      </div>

      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-bold text-gray-900">
            ${(token.askPrice / 1000).toFixed(1)}k
          </p>
          <p className="text-sm text-gray-500 line-through">
            ${(token.futureValue / 1000).toFixed(1)}k
          </p>
          <span className="inline-flex rounded bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800">
            {token.discountPercent}% off
          </span>
        </div>
        <p className="mt-1 text-sm font-medium text-green-600">
          {calculateAPR()}% APR
        </p>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-gray-600">Future Value</p>
          <p className="font-semibold text-gray-900">
            ${token.futureValue.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-gray-600">Duration</p>
          <p className="font-semibold text-gray-900">
            {getTimeRemaining()} days
          </p>
        </div>
        <div>
          <p className="text-gray-600">Credit Score</p>
          <p
            className={`font-semibold ${getCreditScoreColor(token.creditScore)}`}
          >
            {token.creditScore}
          </p>
        </div>
        <div>
          <p className="text-gray-600">Progress</p>
          <p className="font-semibold text-gray-900">
            {Math.round((token.claimed / token.totalAmount) * 100)}%
          </p>
        </div>
      </div>

      <button
        onClick={() => setShowDetails(!showDetails)}
        className="mb-3 w-full text-center text-sm font-medium text-blue-600 hover:text-blue-800"
      >
        {showDetails ? 'Hide Details' : 'View Details'}
      </button>

      {showDetails && (
        <div className="mb-4 rounded-md bg-gray-50 p-3 text-xs">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Token ID:</span>
              <span className="font-mono text-gray-900">
                {formatAddress(token.tokenId)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Amount:</span>
              <span className="font-medium text-gray-900">
                ${token.totalAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Already Claimed:</span>
              <span className="text-gray-900">
                ${token.claimed.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Remaining:</span>
              <span className="font-medium text-green-600">
                ${token.futureValue.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Listed:</span>
              <span className="text-gray-900">
                {Math.ceil(
                  (Date.now() - token.listedAt) / (1000 * 60 * 60 * 24)
                )}{' '}
                days ago
              </span>
            </div>
          </div>

          <div className="mt-3 border-t border-gray-200 pt-3">
            <p className="mb-2 font-medium text-gray-900">
              Default History
            </p>
            {token.defaultCount === 0 ? (
              <p className="text-green-600">No defaults recorded</p>
            ) : (
              <p className="text-red-600">
                {token.defaultCount} default event
                {token.defaultCount > 1 ? 's' : ''} on record
              </p>
            )}
          </div>
        </div>
      )}

      <button
        onClick={handlePurchase}
        disabled={isPurchasing}
        className="w-full rounded-md bg-black px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        {isPurchasing ? 'Processing...' : 'Buy Token'}
      </button>

      <p className="mt-2 text-center text-xs text-gray-500">
        This is an asset sale, not a loan
      </p>
    </div>
  );
}
