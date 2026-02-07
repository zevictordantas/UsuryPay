'use client';

import { useState } from 'react';
import { type Address, parseUnits, formatUnits } from 'viem';

import { useChainId, useConnection, useWaitForTransactionReceipt } from 'wagmi';
import {
  useReadPayrollVaultGetBalance,
  useReadPayrollVaultGetRequiredEscrow,
  useReadPayrollVaultGetEmployerCreditScore,
  useWritePayrollVaultFund,
  useWriteMockUsdcApprove,
  mockUsdcAddress,
} from '@/generated';
import { addresses } from '@/contracts/addresses';
import { useQueryClient } from '@tanstack/react-query';

interface TreasuryCardProps {
  vaultAddress: Address;
}

export function TreasuryCard({ vaultAddress }: TreasuryCardProps) {
  const [depositAmount, setDepositAmount] = useState('');
  const [isApproving, setIsApproving] = useState(false);
  const [approveTxHash, setApproveTxHash] = useState<Address | undefined>();

  const { address: employerAddress } = useConnection();
  const chainId = useChainId();
  const queryClient = useQueryClient();
  const contractAddresses = addresses[chainId as keyof typeof addresses];
  const usdcAddress = contractAddresses?.mockUSDC;

  const { data: balance, queryKey: vaultBalanceQueryKey } =
    useReadPayrollVaultGetBalance({
      address: vaultAddress,
      query: { enabled: !!vaultAddress },
    });
  const { data: requiredEscrow } = useReadPayrollVaultGetRequiredEscrow({
    address: vaultAddress,
    query: { enabled: !!vaultAddress },
  });
  const { data: creditScore } = useReadPayrollVaultGetEmployerCreditScore({
    address: vaultAddress,
    query: { enabled: !!vaultAddress },
  });

  const writeMockUsdcApprove = useWriteMockUsdcApprove();
  const { writeContractAsync: fundVault, isPending: isFunding } = useWritePayrollVaultFund();

  const {
    isLoading: isWaitingForTxReceiptOfApproval,
    refetch: refetchForTxReceiptOfApproval,
  } = useWaitForTransactionReceipt({
    hash: approveTxHash,
  });

  const vaultBalance = balance ? Number(formatUnits(balance, 6)) : 0;
  const vaultRequiredEscrow = requiredEscrow
    ? Number(formatUnits(requiredEscrow, 6))
    : 0;
  const vaultCreditScore = creditScore ? Number(creditScore) : 0;

  const isSolvent = vaultBalance >= vaultRequiredEscrow;
  const shortfall = vaultRequiredEscrow - vaultBalance;

  const getCreditScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCreditScoreLabel = (score: number) => {
    if (score >= 80) return 'Good - Low discount for employees';
    if (score >= 50) return 'Fair - Medium discount';
    return 'Poor - High discount';
  };

  const getCreditScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 50) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const handleDeposit = async () => {
    console.log('Treasury Card handleDepostit 1');
    if (!depositAmount || parseFloat(depositAmount) <= 0) return;
    if (!usdcAddress || !employerAddress) return;
    console.log('Treasury Card handleDepostit 2');

    try {
      const amountInWei = parseUnits(depositAmount, 6);

      setIsApproving(true);
      console.log('Approving USDC...');

      if (!(chainId in mockUsdcAddress)) return;
      await writeMockUsdcApprove.mutateAsync({
        chainId: chainId as keyof typeof mockUsdcAddress,
        args: [vaultAddress, amountInWei],
      });

      const result = await refetchForTxReceiptOfApproval();
      console.log('result', result);
      console.log('Funding vault...');
      await fundVault({
        address: vaultAddress,
        args: [amountInWei],
      });

      setDepositAmount('');
      console.log('Vault funded successfully!');
    } catch (error) {
      console.error('Vault funding failed:', error);
      alert('Transaction failed. Check console for details.');
    } finally {
      setIsApproving(false);
      setApproveTxHash(undefined);
      queryClient.invalidateQueries({ queryKey: vaultBalanceQueryKey });
    }
  };
  const isLoading = isApproving || isWaitingForTxReceiptOfApproval || isFunding;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">
        ECVault Treasury
      </h2>

      <div className="mb-6 space-y-4">
        {/* Credit Score */}
        <div
          className={`rounded-lg border p-4 ${getCreditScoreBgColor(vaultCreditScore)}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Credit Score</p>
              <p
                className={`text-3xl font-bold ${getCreditScoreColor(vaultCreditScore)}`}
              >
                {vaultCreditScore}
              </p>
              <p className="mt-1 text-xs text-gray-600">
                {getCreditScoreLabel(vaultCreditScore)}
              </p>
            </div>
          </div>
        </div>

        {/* Solvency Status */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Vault Balance</p>
            <p className="text-lg font-bold text-gray-900">
              {vaultBalance.toFixed(2)} USDC
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Required Escrow</p>
            <p className="text-lg font-semibold text-gray-900">
              {vaultRequiredEscrow.toFixed(2)} USDC
            </p>
          </div>
          <div className="pt-2">
            {isSolvent ? (
              <div className="flex items-center gap-2 rounded-md bg-green-50 px-3 py-2">
                <span className="text-green-600">✓</span>
                <span className="text-sm font-medium text-green-800">
                  Solvent
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-md bg-red-50 px-3 py-2">
                <span className="text-red-600">⚠</span>
                <div className="flex-1">
                  <span className="text-sm font-medium text-red-800">
                    Underfunded
                  </span>
                  <p className="text-xs text-red-600">
                    Need {shortfall.toFixed(2)} USDC more
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <h3 className="mb-3 text-lg font-medium text-gray-900">Fund Vault</h3>
        <div className="flex gap-3">
          <input
            type="number"
            placeholder="Amount in USDC"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-black focus:ring-1 focus:ring-black focus:outline-none"
            disabled={isLoading}
          />
          <button
            onClick={handleDeposit}
            disabled={
              isLoading || !depositAmount || parseFloat(depositAmount) <= 0
            }
            className="rounded-md bg-black px-4 py-2 font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {isLoading ? 'Funding...' : 'Fund'}
          </button>
        </div>
      </div>
    </div>
  );
}
