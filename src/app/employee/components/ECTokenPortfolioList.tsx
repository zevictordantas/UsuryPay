'use client';

import { useState, useEffect } from 'react';
import { type Address, formatUnits } from 'viem';
import { useAccount, useChainId, useReadContracts } from 'wagmi';
import {
  useReadMockEcTokenGetTokenInfo,
  useReadMockEcTokenGetClaimable,
  useReadMockEcTokenBalanceOf,
  useReadPayrollVaultGetEmployerCreditScore,
  useReadPayrollVaultEmployer,
  useWritePayrollVaultClaim,
  mockEcTokenAbi,
} from '@/generated';
import { addresses } from '@/contracts/addresses';
import { useLocalEnsName } from '@/app/hooks/useLocalENS';

interface ECTokenPortfolioListProps {
  onStatusChanged?: () => void;
}

function TokenCard({
  tokenId,
  ecTokenAddress,
  onClaimed,
}: {
  tokenId: bigint;
  ecTokenAddress: Address;
  onClaimed?: () => void;
}) {
  const { address: employeeAddress } = useAccount();

  const { data: tokenInfo } = useReadMockEcTokenGetTokenInfo({
    args: [tokenId],
    query: { enabled: !!tokenId },
  });
  const { data: claimable } = useReadMockEcTokenGetClaimable({
    args: [tokenId],
    query: { enabled: !!tokenId },
  });
  const { data: balance } = useReadMockEcTokenBalanceOf({
    args: employeeAddress && tokenId ? [employeeAddress, tokenId] : undefined,
    query: { enabled: !!employeeAddress && !!tokenId },
  });

  const vaultAddress = tokenInfo ? (tokenInfo as any)[1] : undefined; // Get vault from tokenInfo
  const { data: creditScore } = useReadPayrollVaultGetEmployerCreditScore({
    address: vaultAddress as Address,
    query: { enabled: !!vaultAddress },
  });
  const { data: employerAddress } = useReadPayrollVaultEmployer({
    address: vaultAddress as Address,
    query: { enabled: !!vaultAddress },
  });

  const { data: vaultName } = useLocalEnsName({
    address: vaultAddress as Address,
  });
  const { data: employerName } = useLocalEnsName({
    address: employerAddress as Address,
  });

  const { writeContractAsync: claim, isPending: isClaiming } =
    useWritePayrollVaultClaim();

  if (!tokenInfo || !balance || Number(balance) === 0) {
    return null;
  }

  const totalAmount = Number(formatUnits(tokenInfo.schedule.totalAmount, 6));
  const claimed = Number(formatUnits(tokenInfo.claimed, 6));
  const claimableAmount = claimable ? Number(formatUnits(claimable, 6)) : 0;
  const remaining = totalAmount - claimed;

  const now = Math.floor(Date.now() / 1000);
  const duration =
    Number(tokenInfo.schedule.endTime) - Number(tokenInfo.schedule.startTime);
  const elapsed = Math.max(
    0,
    Math.min(now - Number(tokenInfo.schedule.startTime), duration)
  );
  const progress = duration > 0 ? (elapsed / duration) * 100 : 0;

  const vaultCreditScore = creditScore ? Number(creditScore) : 0;

  const formatTokenId = (id: bigint) => {
    const idStr = id.toString();
    if (idStr.length <= 10) return `#${idStr}`;
    return `#${idStr.slice(0, 6)}...${idStr.slice(-4)}`;
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

  const handleClaim = async () => {
    if (!vaultAddress || claimableAmount <= 0) return;

    try {
      await claim({
        address: vaultAddress as Address,
        args: [tokenId, claimable!],
      });
      alert('Salary claimed successfully!');
      onClaimed?.();
    } catch (error) {
      console.error('Claim failed:', error);
      alert('Transaction failed. Check console for details.');
    }
  };

  const canClaim = claimableAmount > 0;
  const isOwned = Number(balance) > 0;

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="rounded-lg border border-gray-300 bg-gradient-to-br from-white to-gray-50 p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <p className="font-mono text-sm font-medium text-gray-900">
            {formatTokenId(tokenId)}
          </p>
          {employerAddress && (
            <p className="mt-0.5 text-xs text-gray-500">
              Employer:{' '}
              {employerName ? (
                <span>
                  {employerName} ({formatAddress(employerAddress as string)})
                </span>
              ) : (
                formatAddress(employerAddress as string)
              )}
            </p>
          )}
          <p className="mt-0.5 text-xs text-gray-500">
            Vault:{' '}
            {vaultAddress ? (
              vaultName ? (
                <span>
                  {vaultName} ({formatAddress(vaultAddress as string)})
                </span>
              ) : (
                formatAddress(vaultAddress as string)
              )
            ) : (
              'Unknown'
            )}
          </p>
        </div>
        <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
          Owned
        </span>
      </div>

      <div className="mb-3 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Total Amount:</span>
          <span className="font-semibold text-gray-900">
            ${totalAmount.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Claimed:</span>
          <span className="font-medium text-gray-700">
            ${claimed.toFixed(2)}
          </span>
        </div>
        {isOwned && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Claimable Now:</span>
            <span className="font-semibold text-green-600">
              ${claimableAmount.toFixed(2)}
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
          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${getCreditScoreColor(vaultCreditScore)}`}
        >
          {vaultCreditScore} ({getCreditScoreLabel(vaultCreditScore)})
        </span>
      </div>

      {isOwned && (
        <div className="flex gap-2">
          <button
            onClick={handleClaim}
            disabled={!canClaim || isClaiming}
            className="flex-1 rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
          >
            {isClaiming
              ? 'Claiming...'
              : canClaim
                ? `Claim $${claimableAmount.toFixed(2)}`
                : 'No Claim Available'}
          </button>
        </div>
      )}
    </div>
  );
}

export function ECTokenPortfolioList({
  onStatusChanged,
}: ECTokenPortfolioListProps) {
  const { address: employeeAddress } = useAccount();
  const chainId = useChainId();
  const contractAddresses = addresses[chainId as keyof typeof addresses];
  const ecTokenAddress = contractAddresses?.mockECToken;

  const [ownedTokenIds, setOwnedTokenIds] = useState<bigint[]>([]);
  const [isScanning, setIsScanning] = useState(true);

  // Get user's ENS name for personalized greeting
  const { data: userEnsName } = useLocalEnsName({ address: employeeAddress });

  // Query balances for token IDs 1-100
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
      refetchInterval: 5000, // Refetch every 5 seconds
    },
  });

  useEffect(() => {
    if (balanceChecks.data) {
      console.log('Balance checks data:', balanceChecks.data);
      console.log('Employee address:', employeeAddress);
      console.log('ECToken address:', ecTokenAddress);

      const owned = tokenIdsToCheck.filter((tokenId, index) => {
        const result = balanceChecks.data?.[index] as any;
        if (!result || result.status !== 'success') {
          if (result?.status === 'failure') {
            console.log(`Token ${tokenId} check failed:`, result.error);
          }
          return false;
        }
        const balance = result.result as bigint;
        const hasBalance = balance && Number(balance) > 0;
        if (hasBalance) {
          console.log(`Employee owns token ${tokenId} with balance ${balance}`);
        }
        return hasBalance;
      });

      console.log('Owned token IDs:', owned);
      setOwnedTokenIds(owned);
      setIsScanning(false);
    }
  }, [balanceChecks.data, employeeAddress, ecTokenAddress]);

  if (!employeeAddress) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          EC Token Portfolio
        </h2>
        <div className="py-8 text-center">
          <p className="text-gray-500">Connect wallet to view your tokens</p>
        </div>
      </div>
    );
  }

  if (!ecTokenAddress) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Your payrolls (EC Tokens)
        </h2>
        <div className="py-8 text-center">
          <p className="text-red-500">
            ECToken address not found for this network
          </p>
        </div>
      </div>
    );
  }

  if (isScanning) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Your payrolls (EC Tokens)
        </h2>
        <div className="py-8 text-center">
          <p className="text-gray-500">Scanning for your tokens...</p>
        </div>
      </div>
    );
  }

  if (ownedTokenIds.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Your payrolls (EC Tokens)
        </h2>
        <div className="py-8 text-center">
          <p className="text-gray-500">
            {userEnsName ? `Sorry ${userEnsName}, it` : 'It'} seems you
            don&apos;t own any EC tokens yet.
          </p>
          <p className="mt-2 text-sm text-gray-400">
            EC tokens are minted when{' '}
            {userEnsName ? `${userEnsName}'s` : 'your'} employer sets up payroll
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
        {ownedTokenIds.map((tokenId) => (
          <TokenCard
            key={tokenId.toString()}
            tokenId={tokenId}
            ecTokenAddress={ecTokenAddress}
            onClaimed={onStatusChanged}
          />
        ))}
      </div>

      <div className="mt-4 border-t border-gray-200 pt-4">
        <p className="text-xs text-gray-500">
          EC tokens represent {userEnsName ? `${userEnsName}'s` : 'your'} right
          to claim future salary. {userEnsName ? `${userEnsName}, you` : 'You'}{' '}
          can sell them for immediate cash or hold and claim as they accrue.
        </p>
      </div>
    </div>
  );
}
