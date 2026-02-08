'use client';

import { type Address, formatUnits } from 'viem';
import { useAccount } from 'wagmi';
import {
  useReadMockEcTokenGetTokenInfo,
  useReadMockEcTokenGetClaimable,
  useReadMockEcTokenGetVault,
  useReadMockEcTokenGetAllTokensOfOwner,
  useReadPayrollVaultGetEmployerCreditScore,
  useWritePayrollVaultClaim,
} from '@/generated';
import { useToast } from '@/app/components/Toast/ToastContext';

interface ECTokenPortfolioListProps {
  onStatusChanged?: () => void;
}

function TokenCard({
  tokenId,
  onClaimed,
}: {
  tokenId: bigint;
  onClaimed?: () => void;
}) {
  const { showToast } = useToast();

  const { data: tokenInfo } = useReadMockEcTokenGetTokenInfo({
    args: [tokenId],
  });
  const { data: claimable } = useReadMockEcTokenGetClaimable({
    args: [tokenId],
  });
  const { data: vaultAddress } = useReadMockEcTokenGetVault({
    args: [tokenId],
  });

  const { data: creditScore } = useReadPayrollVaultGetEmployerCreditScore({
    address: vaultAddress,
    query: { enabled: !!vaultAddress },
  });

  const { writeContractAsync: claim, isPending: isClaiming } =
    useWritePayrollVaultClaim();

  if (!tokenInfo) return null;

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
    if (score >= 80) return 'text-emerald-700';
    if (score >= 50) return 'text-yellow-700';
    return 'text-red-700';
  };

  const getCreditScoreLabel = (score: number) => {
    if (score >= 80) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Poor';
  };

  const handleClaim = async () => {
    if (!vaultAddress || claimableAmount <= 0) return;

    try {
      await claim({
        address: vaultAddress as Address,
        args: [tokenId, claimable!],
      });
      showToast('Salary claimed successfully!', 'success');
      onClaimed?.();
    } catch (error) {
      console.error('Claim failed:', error);
      showToast('Transaction failed. Check console for details.', 'error');
    }
  };

  return (
    <div className="rounded-lg border border-zinc-300 bg-gradient-to-br from-white to-zinc-50 p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <p className="font-mono text-sm font-medium text-zinc-900">
            {formatTokenId(tokenId)}
          </p>
          <p className="mt-0.5 text-xs text-zinc-500">
            Vault:{' '}
            {vaultAddress ? `${vaultAddress.slice(0, 8)}...` : 'Unknown'}
          </p>
        </div>
        <span className="inline-flex rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-zinc-800">
          Owned
        </span>
      </div>

      <div className="mb-3 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-zinc-600">Total Amount:</span>
          <span className="font-semibold text-zinc-900">
            ${totalAmount.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-zinc-600">Claimed:</span>
          <span className="font-medium text-zinc-700">
            ${claimed.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-zinc-600">Claimable Now:</span>
          <span className="font-semibold text-emerald-600">
            ${claimableAmount.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-zinc-600">Remaining:</span>
          <span className="font-medium text-zinc-700">
            ${remaining.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="mb-3">
        <div className="mb-1 flex items-center justify-between text-xs text-zinc-600">
          <span>Accrual Progress</span>
          <span>{progress.toFixed(0)}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-zinc-200">
          <div
            className="h-2 rounded-full bg-zinc-600"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs text-zinc-600">Vault Credit Score:</span>
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${getCreditScoreColor(vaultCreditScore)}`}
        >
          {vaultCreditScore} ({getCreditScoreLabel(vaultCreditScore)})
        </span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleClaim}
          disabled={claimableAmount <= 0 || isClaiming}
          className="flex-1 rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500"
        >
          {isClaiming
            ? 'Claiming...'
            : claimableAmount > 0
              ? `Claim $${claimableAmount.toFixed(2)}`
              : 'No Claim Available'}
        </button>
      </div>
    </div>
  );
}

export function ECTokenPortfolioList({
  onStatusChanged,
}: ECTokenPortfolioListProps) {
  const { address: employeeAddress } = useAccount();

  const { data: ownedTokenIds, isLoading } =
    useReadMockEcTokenGetAllTokensOfOwner({
      args: employeeAddress ? [employeeAddress] : undefined,
      query: {
        enabled: !!employeeAddress,
        refetchInterval: 5000,
      },
    });

  if (!employeeAddress) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-zinc-900">
          EC Token Portfolio
        </h2>
        <div className="py-8 text-center">
          <p className="text-zinc-500">Connect wallet to view your tokens</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-zinc-900">
          EC Token Portfolio
        </h2>
        <div className="py-8 text-center">
          <p className="text-zinc-500">Scanning for your tokens...</p>
        </div>
      </div>
    );
  }

  if (!ownedTokenIds || ownedTokenIds.length === 0) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-zinc-900">
          EC Token Portfolio
        </h2>
        <div className="py-8 text-center">
          <p className="text-zinc-500">No EC tokens found</p>
          <p className="mt-2 text-sm text-zinc-400">
            EC tokens are minted when your employer sets up payroll
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-zinc-900">
        EC Token Portfolio
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        {ownedTokenIds.map((tokenId) => (
          <TokenCard
            key={tokenId.toString()}
            tokenId={tokenId}
            onClaimed={onStatusChanged}
          />
        ))}
      </div>

      <div className="mt-4 border-t border-zinc-200 pt-4">
        <p className="text-xs text-zinc-500">
          EC tokens represent your right to claim future salary. You can sell
          them for immediate cash or hold and claim as they accrue.
        </p>
      </div>
    </div>
  );
}
