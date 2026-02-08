'use client';

import { useState } from 'react';
import { type Address, parseUnits, formatUnits, erc20Abi } from 'viem';

import { useChainId, useConnection, useReadContract, usePublicClient } from 'wagmi';
import { useLocalEnsName } from '@/app/hooks/useLocalENS';
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
import { useToast } from '@/app/components/Toast/ToastContext';

interface TreasuryCardProps {
  vaultAddress: Address;
}

export function TreasuryCard({ vaultAddress }: TreasuryCardProps) {
  const [depositAmount, setDepositAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const { address: employerAddress } = useConnection();
  const chainId = useChainId();
  const queryClient = useQueryClient();
  const publicClient = usePublicClient();
  const contractAddresses = addresses[chainId as keyof typeof addresses];
  const usdcAddress = contractAddresses?.usdc;
  const { showToast } = useToast();

  // Read employer's USDC balance
  const { data: employerUsdcBalance } = useReadContract({
    address: usdcAddress,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: employerAddress ? [employerAddress] : undefined,
    query: {
      enabled: !!usdcAddress && !!employerAddress,
    },
  });

  // Resolve employer ENS name
  const { data: employerEnsName } = useLocalEnsName({
    address: employerAddress,
  });

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

  const { writeContractAsync: approveUsdc } = useWriteMockUsdcApprove();
  const { writeContractAsync: fundVault } = useWritePayrollVaultFund();

  const vaultBalance = balance ? Number(formatUnits(balance, 6)) : 0;
  const vaultRequiredEscrow = requiredEscrow
    ? Number(formatUnits(requiredEscrow, 6))
    : 0;
  const vaultCreditScore = creditScore ? Number(creditScore) : 0;

  const getCreditScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-700';
    if (score >= 50) return 'text-yellow-700';
    return 'text-red-700';
  };

  const getCreditScoreLabel = (score: number) => {
    if (score >= 80) return 'Good - Low discount for employees';
    if (score >= 50) return 'Fair - Medium discount';
    return 'Poor - High discount';
  };

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      showToast('Please enter a valid amount', 'error');
      return;
    }
    if (!usdcAddress || !employerAddress) {
      showToast('Wallet not connected', 'error');
      return;
    }

    try {
      const amountInWei = parseUnits(depositAmount, 6);

      // Check if user has enough USDC balance
      if (employerUsdcBalance !== undefined && employerUsdcBalance < amountInWei) {
        const balance = formatUnits(employerUsdcBalance, 6);
        showToast(
          `Insufficient USDC balance. You have ${balance} USDC but need ${depositAmount} USDC`,
          'error'
        );
        return;
      }

      if (!(chainId in mockUsdcAddress)) {
        showToast('Network not supported', 'error');
        return;
      }

      if (!publicClient) {
        showToast('Network client not ready', 'error');
        return;
      }

      setIsProcessing(true);

      // Step 1: Approve USDC
      showToast('Approving USDC...', 'info');
      const approveHash = await approveUsdc({
        chainId: chainId as keyof typeof mockUsdcAddress,
        args: [vaultAddress, amountInWei],
      });

      // Wait for approval confirmation
      await publicClient.waitForTransactionReceipt({ hash: approveHash });
      showToast('Approval confirmed. Funding vault...', 'info');

      // Step 2: Fund vault
      const fundHash = await fundVault({
        address: vaultAddress,
        args: [amountInWei],
      });

      // Wait for funding confirmation
      await publicClient.waitForTransactionReceipt({ hash: fundHash });

      setDepositAmount('');
      showToast('Vault funded successfully!', 'success');
      queryClient.invalidateQueries({ queryKey: vaultBalanceQueryKey });
    } catch (error) {
      console.error('Vault funding failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Transaction failed';
      showToast(errorMessage, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-zinc-900">
        {employerEnsName ? `${employerEnsName}'s Treasury` : 'ECVault Treasury'}
      </h2>

      <div className="mb-6 space-y-4">
        {/* Solvency Status */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-zinc-800">Vault Balance</p>
            <p className="text-lg font-bold text-zinc-900">
              {vaultBalance.toFixed(2)} USDC
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-zinc-800">Required Escrow</p>
            <p className="text-lg font-semibold text-zinc-900">
              {vaultRequiredEscrow.toFixed(2)} USDC
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-zinc-800">Credit Score</p>
            <p
              className={`flex flex-row items-center text-xl font-semibold ${getCreditScoreColor(vaultCreditScore)}`}
            >
              <span className="text-sm font-light opacity-90">
                {getCreditScoreLabel(vaultCreditScore)} |
              </span>
              {vaultCreditScore}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-200 pt-4">
        <h3 className="mb-3 text-lg font-medium text-zinc-900">Fund Vault</h3>
        <div className="flex gap-3">
          <input
            type="number"
            placeholder="Amount in USDC"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            className="flex-1 rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-500 focus:border-black focus:ring-1 focus:ring-black focus:outline-none"
            disabled={isProcessing}
          />
          <button
            onClick={handleDeposit}
            disabled={
              isProcessing || !depositAmount || parseFloat(depositAmount) <= 0
            }
            className="rounded-md bg-black px-4 py-2 font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
          >
            {isProcessing ? 'Processing...' : 'Fund'}
          </button>
        </div>
      </div>
    </div>
  );
}
