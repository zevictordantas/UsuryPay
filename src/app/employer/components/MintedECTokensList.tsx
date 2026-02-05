'use client';

import { useState, useEffect } from 'react';
import { ECToken, ECTokenStatus } from '@/app/types/ec-types';

interface MintedECToken extends ECToken {
  ownershipStatus: ECTokenStatus;
  accrualProgress: number;
}

interface MintedECTokensListProps {
  onVaultFunded?: () => void;
}

export function MintedECTokensList({ onVaultFunded }: MintedECTokensListProps) {
  const [tokens, setTokens] = useState<MintedECToken[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingFunding, setProcessingFunding] = useState<string | null>(
    null
  );

  // Mock data for MVP - replace with actual Web3 calls
  useEffect(() => {
    const fetchECTokens = async () => {
      setIsLoading(true);
      try {
        // TODO: Implement Web3 call to list EC tokens
        // const tokenIds = await contract.listTokensByVault(vaultAddress);
        // const tokenData = await Promise.all(
        //   tokenIds.map(id => contract.getECToken(id))
        // );

        setTimeout(() => {
          setTokens(mockECTokens);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to fetch EC tokens:', error);
        setIsLoading(false);
      }
    };

    fetchECTokens();
  }, []);

  const handleFundVault = async (tokenId: string) => {
    setProcessingFunding(tokenId);
    try {
      // TODO: Implement Web3 vault funding
      // await contract.fundVault(vaultAddress, amount);
      console.log('Funding vault for token:', tokenId);

      onVaultFunded?.();
    } catch (error) {
      console.error('Vault funding failed:', error);
    } finally {
      setProcessingFunding(null);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getOwnershipLabel = (status: ECTokenStatus) => {
    switch (status) {
      case 'Owned':
        return { text: 'Employee', color: 'bg-blue-100 text-blue-800' };
      case 'Sold to PayrollDApp':
        return { text: 'PayrollDApp (Sold)', color: 'bg-purple-100 text-purple-800' };
      case 'Fully Claimed':
        return { text: 'Claimed', color: 'bg-gray-100 text-gray-800' };
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Minted EC Tokens
        </h2>
        <div className="py-8 text-center">
          <p className="text-gray-500">Loading EC tokens...</p>
        </div>
      </div>
    );
  }

  if (tokens.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Minted EC Tokens
        </h2>
        <div className="py-8 text-center">
          <p className="text-gray-500">No EC tokens minted yet</p>
          <p className="mt-2 text-sm text-gray-400">
            Mint your first EC token above
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">
        Minted EC Tokens
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="pb-3 text-sm font-medium text-gray-700">
                Token ID
              </th>
              <th className="pb-3 text-sm font-medium text-gray-700">Owner</th>
              <th className="pb-3 text-sm font-medium text-gray-700">
                Total Amount
              </th>
              <th className="pb-3 text-sm font-medium text-gray-700">
                Accrual Progress
              </th>
              <th className="pb-3 text-sm font-medium text-gray-700">
                Ownership
              </th>
              <th className="pb-3 text-right text-sm font-medium text-gray-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {tokens.map((token) => {
              const ownershipInfo = getOwnershipLabel(token.ownershipStatus);
              return (
                <tr
                  key={token.tokenId}
                  className="border-b border-gray-100 last:border-b-0"
                >
                  <td className="py-4">
                    <div className="text-sm font-medium text-gray-900">
                      #{token.tokenId}
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="text-sm text-gray-900">
                      {formatAddress(token.owner)}
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="text-sm text-gray-900">
                      {token.totalAmount.toFixed(2)} USDC
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200">
                          <div
                            className="h-full bg-green-500"
                            style={{ width: `${token.accrualProgress}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600">
                          {token.accrualProgress}%
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {token.claimed.toFixed(2)} / {token.totalAmount.toFixed(2)} USDC
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${ownershipInfo.color}`}
                    >
                      {ownershipInfo.text}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <button
                      onClick={() => handleFundVault(token.tokenId)}
                      disabled={
                        processingFunding === token.tokenId ||
                        token.ownershipStatus === 'Fully Claimed'
                      }
                      className="rounded-md bg-black px-3 py-1 text-xs font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
                    >
                      {processingFunding === token.tokenId
                        ? 'Processing...'
                        : 'Fund Vault'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Mock data for demo
const mockECTokens: MintedECToken[] = [
  {
    tokenId: '1',
    vaultAddress: '0x1234567890abcdef1234567890abcdef12345678',
    totalAmount: 15000,
    startTime: Math.floor(new Date('2024-01-01').getTime() / 1000),
    endTime: Math.floor(new Date('2024-12-31').getTime() / 1000),
    ratePerSecond: 0.00047564,
    claimed: 3500,
    owner: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    creditScore: 85,
    ownershipStatus: 'Owned',
    accrualProgress: 23,
  },
  {
    tokenId: '2',
    vaultAddress: '0x1234567890abcdef1234567890abcdef12345678',
    totalAmount: 24000,
    startTime: Math.floor(new Date('2024-01-15').getTime() / 1000),
    endTime: Math.floor(new Date('2024-06-30').getTime() / 1000),
    ratePerSecond: 0.00155902,
    claimed: 12000,
    owner: '0xPayrollDAppAddress123456789012345678901234',
    creditScore: 85,
    ownershipStatus: 'Sold to PayrollDApp',
    accrualProgress: 50,
  },
  {
    tokenId: '3',
    vaultAddress: '0x1234567890abcdef1234567890abcdef12345678',
    totalAmount: 8000,
    startTime: Math.floor(new Date('2023-06-01').getTime() / 1000),
    endTime: Math.floor(new Date('2023-12-31').getTime() / 1000),
    ratePerSecond: 0.00044150,
    claimed: 8000,
    owner: '0x8ba1f109551bD432803012645Hac136c22C57B',
    creditScore: 85,
    ownershipStatus: 'Fully Claimed',
    accrualProgress: 100,
  },
];
