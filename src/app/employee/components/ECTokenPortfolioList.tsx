'use client';

import { useState, useEffect } from 'react';
import { ECToken, ECTokenStatus } from '@/app/types/ec-types';

interface ECTokenPortfolioListProps {
  onStatusChanged?: () => void;
}

export function ECTokenPortfolioList({}: ECTokenPortfolioListProps) {
  const [tokens, setTokens] = useState<ECToken[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTokens = async () => {
      setIsLoading(true);
      try {
        // TODO: Implement Web3 call to get EC token portfolio
        // const tokenIds = await contract.getOwnedTokens(employeeAddress);
        // const tokenData = await Promise.all(
        //   tokenIds.map(id => contract.getTokenDetails(id))
        // );

        // Mock data for demo
        const mockTokens: ECToken[] = [
          {
            tokenId: '0x1a2b3c4d5e6f7890abcd',
            vaultAddress: '0xEmployerVault001',
            totalAmount: 3000,
            startTime: Date.now() / 1000 - 86400 * 7, // 7 days ago
            endTime: Date.now() / 1000 + 86400 * 23, // 23 days from now
            ratePerSecond: 3000 / (86400 * 30),
            claimed: 700,
            owner: '0xEmployee', // Owned by employee
            creditScore: 85,
          },
          {
            tokenId: '0x7g8h9i0j1k2l3m4n5o6p',
            vaultAddress: '0xEmployerVault001',
            totalAmount: 2000,
            startTime: Date.now() / 1000 - 86400 * 14,
            endTime: Date.now() / 1000 + 86400 * 16,
            ratePerSecond: 2000 / (86400 * 30),
            claimed: 933,
            owner: '0xEmployee',
            creditScore: 85,
          },
          {
            tokenId: '0xpqrstuvwxyz123456789',
            vaultAddress: '0xEmployerVault001',
            totalAmount: 1500,
            startTime: Date.now() / 1000 - 86400 * 30,
            endTime: Date.now() / 1000 - 86400 * 5, // Ended 5 days ago
            ratePerSecond: 1500 / (86400 * 25),
            claimed: 1500,
            owner: '0xEmployee',
            creditScore: 85,
          },
          {
            tokenId: '0xdefghijklmnop987654',
            vaultAddress: '0xEmployerVault002',
            totalAmount: 5000,
            startTime: Date.now() / 1000 - 86400 * 10,
            endTime: Date.now() / 1000 + 86400 * 20,
            ratePerSecond: 5000 / (86400 * 30),
            claimed: 1200,
            owner: '0xPayrollDApp', // Sold to PayrollDApp
            creditScore: 78,
          },
        ];

        setTimeout(() => {
          setTokens(mockTokens);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to fetch EC tokens:', error);
        setIsLoading(false);
      }
    };

    fetchTokens();
  }, []);

  const calculateClaimable = (token: ECToken) => {
    const now = Date.now() / 1000;
    const elapsed = Math.min(now - token.startTime, token.endTime - token.startTime);
    const accrued = elapsed * token.ratePerSecond;
    return Math.max(0, accrued - token.claimed);
  };

  const calculateAccrualProgress = (token: ECToken) => {
    const now = Date.now() / 1000;
    const duration = token.endTime - token.startTime;
    const elapsed = Math.min(now - token.startTime, duration);
    return Math.max(0, Math.min(100, (elapsed / duration) * 100));
  };

  const getTokenStatus = (token: ECToken): ECTokenStatus => {
    const isOwned = token.owner === '0xEmployee';
    const isSold = token.owner === '0xPayrollDApp';
    const isFullyClaimed = token.claimed >= token.totalAmount;

    if (isFullyClaimed) return 'Fully Claimed';
    if (isSold) return 'Sold to PayrollDApp';
    return 'Owned';
  };

  const getStatusColor = (status: ECTokenStatus) => {
    switch (status) {
      case 'Owned':
        return 'bg-blue-100 text-blue-800';
      case 'Sold to PayrollDApp':
        return 'bg-purple-100 text-purple-800';
      case 'Fully Claimed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCreditScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getCreditScoreLabel = (score: number) => {
    if (score >= 80) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Poor';
  };

  const formatTokenId = (tokenId: string) => {
    return `${tokenId.slice(0, 6)}...${tokenId.slice(-4)}`;
  };

  const handleClaim = async (tokenId: string) => {
    // TODO: Implement Web3 claim call
    // await ecTokenContract.claim(tokenId);
    console.log('Claiming from token:', tokenId);
  };

  const handleSellToken = (tokenId: string) => {
    // This would scroll to or open the ECTokenSaleCard component
    console.log('Opening sale card for token:', tokenId);
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          EC Token Portfolio
        </h2>
        <div className="py-8 text-center">
          <p className="text-gray-500">Loading your token portfolio...</p>
        </div>
      </div>
    );
  }

  if (tokens.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          EC Token Portfolio
        </h2>
        <div className="py-8 text-center">
          <p className="text-gray-500">No EC tokens found</p>
          <p className="mt-2 text-sm text-gray-400">
            EC tokens are minted when your employer sets up payroll
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">
        EC Token Portfolio
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        {tokens.map((token) => {
          const status = getTokenStatus(token);
          const claimable = calculateClaimable(token);
          const progress = calculateAccrualProgress(token);
          const remaining = token.totalAmount - token.claimed;
          const isOwned = status === 'Owned';
          const canClaim = claimable > 0 && isOwned;

          return (
            <div
              key={token.tokenId}
              className="rounded-lg border border-gray-300 bg-gradient-to-br from-white to-gray-50 p-4 shadow-sm"
            >
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <p className="font-mono text-sm font-medium text-gray-900">
                    {formatTokenId(token.tokenId)}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    Vault: {token.vaultAddress.slice(0, 8)}...
                  </p>
                </div>
                <span
                  className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(status)}`}
                >
                  {status}
                </span>
              </div>

              <div className="mb-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-semibold text-gray-900">
                    ${token.totalAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Claimed:</span>
                  <span className="font-medium text-gray-700">
                    ${token.claimed.toFixed(2)}
                  </span>
                </div>
                {isOwned && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Claimable Now:</span>
                    <span className="font-semibold text-green-600">
                      ${claimable.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Remaining:</span>
                  <span className="font-medium text-gray-700">
                    ${remaining.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mb-3">
                <div className="mb-1 flex items-center justify-between text-xs text-gray-600">
                  <span>Accrual Progress</span>
                  <span>{progress.toFixed(0)}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-blue-600"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs text-gray-600">Vault Credit Score:</span>
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${getCreditScoreColor(token.creditScore)}`}
                >
                  {token.creditScore} ({getCreditScoreLabel(token.creditScore)})
                </span>
              </div>

              {isOwned && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleClaim(token.tokenId)}
                    disabled={!canClaim}
                    className="flex-1 rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
                  >
                    {canClaim ? `Claim $${claimable.toFixed(2)}` : 'No Claim Available'}
                  </button>
                  <button
                    onClick={() => handleSellToken(token.tokenId)}
                    disabled={remaining <= 0}
                    className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Sell Token
                  </button>
                </div>
              )}

              {status === 'Sold to PayrollDApp' && (
                <div className="rounded-md bg-purple-50 p-2 text-center">
                  <p className="text-xs text-purple-700">
                    Token sold - PayrollDApp owns future cashflows
                  </p>
                </div>
              )}

              {status === 'Fully Claimed' && (
                <div className="rounded-md bg-gray-100 p-2 text-center">
                  <p className="text-xs text-gray-600">
                    All funds claimed - Token complete
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 border-t border-gray-200 pt-4">
        <p className="text-xs text-gray-500">
          EC tokens represent your right to claim future salary. You can sell them for immediate cash or hold and claim as they accrue.
        </p>
      </div>
    </div>
  );
}
