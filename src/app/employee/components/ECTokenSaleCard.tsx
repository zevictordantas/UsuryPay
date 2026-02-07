'use client';

import { useState, useEffect } from 'react';
import { type Address, type Hex, formatUnits } from 'viem';
import { useAccount, useChainId, useReadContracts } from 'wagmi';
import {
  useReadMockEcTokenGetTokenInfo,
  useReadMockEcTokenGetClaimable,
  useWriteMockEcTokenSetApprovalForAll,
  useWritePayrollDAppSellToken,
  useReadPayrollDAppGetEcTokenValue,
  useReadPayrollDAppCheckBalance,
  mockEcTokenAbi,
} from '@/generated';
import { addresses } from '@/contracts/addresses';

interface ECTokenSaleCardProps {
  onSuccess?: () => void;
}

export function ECTokenSaleCard({ onSuccess }: ECTokenSaleCardProps) {
  const [selectedTokenId, setSelectedTokenId] = useState('');
  const [isApproved, setIsApproved] = useState(false);

  const { address: employeeAddress } = useAccount();
  const chainId = useChainId();
  const contractAddresses = addresses[chainId as keyof typeof addresses];
  const ecTokenAddress = contractAddresses?.mockECToken;
  const dappAddress = contractAddresses?.payrollDApp;

  const [ownedTokenIds, setOwnedTokenIds] = useState<bigint[]>([]);
  const [isScanning, setIsScanning] = useState(true);

  // Scan for owned tokens (same logic as portfolio)
  const tokenIdsToCheck = Array.from({ length: 100 }, (_, i) => BigInt(i + 1));

  const balanceChecks = useReadContracts({
    contracts: tokenIdsToCheck.map((tokenId) => ({
      address: ecTokenAddress,
      abi: mockEcTokenAbi,
      functionName: 'balanceOf',
      args: [employeeAddress, tokenId],
    })),
    query: {
      enabled: !!ecTokenAddress && !!employeeAddress,
    },
  });

  useEffect(() => {
    if (balanceChecks.data) {
      const owned = tokenIdsToCheck.filter((tokenId, index) => {
        const result = balanceChecks.data?.[index] as any;
        if (!result || result.status !== 'success') return false;
        const balance = result.result as bigint;
        return balance && Number(balance) > 0;
      });
      setOwnedTokenIds(owned);
      setIsScanning(false);
    }
  }, [balanceChecks.data]);

  const selectedTokenIdBigInt = selectedTokenId ? BigInt(selectedTokenId) : undefined;

  const { data: tokenInfo } = useReadMockEcTokenGetTokenInfo({
    args: selectedTokenIdBigInt !== undefined ? [selectedTokenIdBigInt] : undefined,
    query: { enabled: selectedTokenIdBigInt !== undefined },
  });
  const { data: claimable } = useReadMockEcTokenGetClaimable({
    args: selectedTokenIdBigInt !== undefined ? [selectedTokenIdBigInt] : undefined,
    query: { enabled: selectedTokenIdBigInt !== undefined },
  });
  const { data: ecTokenValue } = useReadPayrollDAppGetEcTokenValue({
    args: selectedTokenIdBigInt !== undefined ? [selectedTokenIdBigInt] : undefined,
    query: { enabled: selectedTokenIdBigInt !== undefined && !!dappAddress },
  });

  const { data: balanceCheck } = useReadPayrollDAppCheckBalance({
    args: selectedTokenIdBigInt !== undefined ? [selectedTokenIdBigInt] : undefined,
    query: { enabled: selectedTokenIdBigInt !== undefined && !!dappAddress },
  });

  const { writeContractAsync: sellToken, isPending: isSellingToken } = useWritePayrollDAppSellToken();
  const { writeContractAsync: setApprovalForAll, isPending: isApproving } = useWriteMockEcTokenSetApprovalForAll();

  const handleApprove = async () => {
    if (!dappAddress || !ecTokenAddress) return;

    try {
      console.log('Approving PayrollDApp to transfer EC tokens...');
      await setApprovalForAll({
        args: [dappAddress, true],
      });
      setIsApproved(true);
      alert('Approval successful! Now you can sell your token.');
    } catch (error) {
      console.error('Approval failed:', error);
      alert('Approval failed. Check console for details.');
    }
  };

  const handleSellToken = async () => {
    if (!selectedTokenIdBigInt || !dappAddress || !ecTokenAddress) return;

    try {
      console.log('Selling token:', selectedTokenIdBigInt.toString());
      await sellToken({
        args: [selectedTokenIdBigInt],
      });

      alert('Token sold successfully! USDC has been transferred to your wallet.');
      setSelectedTokenId('');
      setIsApproved(false);
      onSuccess?.();
    } catch (error) {
      console.error('Token sale failed:', error);
      alert('Transaction failed. Check console for details.');
    }
  };

  const formatTokenId = (id: string) => {
    if (id.length <= 10) return `#${id}`;
    return `#${id.slice(0, 6)}...${id.slice(-4)}`;
  };

  const getCreditScoreLabel = (score: number) => {
    if (score >= 80) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Poor';
  };

  if (!employeeAddress) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Sell EC Token</h2>
        <div className="py-8 text-center">
          <p className="text-gray-500">Connect wallet to sell your tokens</p>
        </div>
      </div>
    );
  }

  if (isScanning) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Sell EC Token</h2>
        <div className="py-8 text-center">
          <p className="text-gray-500">Loading your EC tokens...</p>
        </div>
      </div>
    );
  }

  if (ownedTokenIds.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Sell EC Token</h2>
        <div className="py-8 text-center">
          <p className="text-gray-500">You don't own any EC tokens yet</p>
          <p className="mt-2 text-sm text-gray-400">
            EC tokens are minted by your employer when they set up payroll
          </p>
        </div>
      </div>
    );
  }

  const selectedToken = tokenInfo;
  const totalAmount = selectedToken ? Number(formatUnits(selectedToken.schedule.totalAmount, 6)) : 0;
  const claimed = selectedToken ? Number(formatUnits(selectedToken.claimed, 6)) : 0;
  const remaining = totalAmount - claimed;

  const [currentValue, futureValue, discountedValue] = ecTokenValue || [BigInt(0), BigInt(0), BigInt(0)];
  const futureValueUSD = Number(formatUnits(futureValue, 6));
  const discountedValueUSD = Number(formatUnits(discountedValue, 6));
  const discountPercent = futureValueUSD > 0 ? ((futureValueUSD - discountedValueUSD) / futureValueUSD * 100) : 0;

  const [hasBalance, currentBalance, neededAmount] = balanceCheck || [false, BigInt(0), BigInt(0)];
  const dappHasBalance = hasBalance as boolean;

  const isLoading = isApproving || isSellingToken;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">Sell EC Token</h2>

      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Select EC Token to Sell
          </label>
          <select
            value={selectedTokenId}
            onChange={(e) => {
              setSelectedTokenId(e.target.value);
              setIsApproved(false);
            }}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-black focus:ring-1 focus:ring-black focus:outline-none"
            disabled={isLoading}
          >
            <option value="">Choose a token...</option>
            {ownedTokenIds.map((tokenId) => (
              <option key={tokenId.toString()} value={tokenId.toString()}>
                {formatTokenId(tokenId.toString())}
              </option>
            ))}
          </select>
        </div>

        {selectedToken && (
          <>
            <div className="rounded-md bg-gray-50 p-4">
              <h4 className="text-sm font-medium text-gray-900">Token Details</h4>
              <div className="mt-2 space-y-1 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Token ID:</span>
                  <span className="font-mono">{formatTokenId(selectedTokenId)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Amount:</span>
                  <span className="font-medium">${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Already Claimed:</span>
                  <span>${claimed.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Remaining Value:</span>
                  <span className="font-medium text-green-600">${remaining.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {!dappHasBalance && futureValueUSD > 0 && (
              <div className="rounded-md border-2 border-red-500 bg-red-50 p-4">
                <h4 className="mb-2 text-sm font-medium text-red-900">
                  ⚠️ PayrollDApp Insufficient Funds
                </h4>
                <p className="text-sm text-red-700">
                  The PayrollDApp doesn't have enough USDC to buy this token.
                  Current balance: ${Number(formatUnits(currentBalance, 6)).toFixed(2)}
                  Needed: ${Number(formatUnits(neededAmount, 6)).toFixed(2)}
                </p>
                <p className="mt-2 text-xs text-red-600">
                  Please contact the administrator to fund the PayrollDApp.
                </p>
              </div>
            )}

            {dappHasBalance && futureValueUSD > 0 && (
              <>
                <div className="rounded-md border-2 border-green-500 bg-green-50 p-4">
                  <h4 className="mb-2 text-sm font-medium text-green-900">
                    Instant Cash Offer
                  </h4>
                  <div className="rounded-md bg-white p-4">
                    <p className="text-center text-lg font-bold text-gray-900">
                      Sell ${futureValueUSD.toFixed(2)} EC Token
                    </p>
                    <p className="text-center text-3xl font-bold text-green-600">
                      for ${discountedValueUSD.toFixed(2)} USDC
                    </p>
                    <p className="mt-1 text-center text-sm text-gray-600">
                      ({discountPercent.toFixed(1)}% discount)
                    </p>
                  </div>
                  <div className="mt-3 space-y-1 text-xs text-green-700">
                    <div className="flex justify-between">
                      <span>Future Value:</span>
                      <span className="font-medium">${futureValueUSD.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>You Receive Now:</span>
                      <span className="font-bold text-green-900">${discountedValueUSD.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-md bg-blue-50 p-4">
                  <h4 className="text-sm font-medium text-blue-900">How It Works</h4>
                  <ul className="mt-2 space-y-1 text-sm text-blue-700">
                    <li>• This is an ASSET SALE, not a loan</li>
                    <li>• Single transaction - approve & sell</li>
                    <li>• USDC transfers to you immediately</li>
                    <li>• PayrollDApp assumes all default risk</li>
                    <li>• You have no future obligation</li>
                  </ul>
                </div>

                {!isApproved ? (
                  <button
                    onClick={handleApprove}
                    disabled={isLoading || !dappHasBalance}
                    className="w-full rounded-md bg-black px-4 py-2 font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
                  >
                    {isApproving ? 'Approving...' : 'Step 1: Approve PayrollDApp'}
                  </button>
                ) : (
                  <button
                    onClick={handleSellToken}
                    disabled={isLoading || !dappHasBalance}
                    className="w-full rounded-md bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                  >
                    {isSellingToken ? 'Selling...' : `Step 2: Sell Token for $${discountedValueUSD.toFixed(2)}`}
                  </button>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
