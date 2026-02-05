'use client';

import { useState } from 'react';
import { ECVault } from '@/app/types/ec-types';

interface TreasuryCardProps {
  vault?: ECVault;
}

export function TreasuryCard({ vault }: TreasuryCardProps) {
  const [depositAmount, setDepositAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Mock vault data if not provided
  const vaultData: ECVault = vault || {
    address: '0x1234567890abcdef1234567890abcdef12345678',
    balance: 25000,
    requiredEscrow: 47000,
    creditScore: 72,
    defaultHistory: [],
  };

  const isSolvent = vaultData.balance >= vaultData.requiredEscrow;
  const shortfall = vaultData.requiredEscrow - vaultData.balance;

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
    if (!depositAmount || parseFloat(depositAmount) <= 0) return;

    setIsLoading(true);
    try {
      // TODO: Implement Web3 vault funding
      // await contract.fundVault(vaultAddress, depositAmount);
      console.log('Funding vault:', depositAmount, 'USDC');
      setDepositAmount('');
    } catch (error) {
      console.error('Vault funding failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">ECVault Treasury</h2>

      <div className="mb-6 space-y-4">
        {/* Credit Score */}
        <div className={`rounded-lg border p-4 ${getCreditScoreBgColor(vaultData.creditScore)}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Credit Score</p>
              <p className={`text-3xl font-bold ${getCreditScoreColor(vaultData.creditScore)}`}>
                {vaultData.creditScore}
              </p>
              <p className="mt-1 text-xs text-gray-600">
                {getCreditScoreLabel(vaultData.creditScore)}
              </p>
            </div>
            {vaultData.defaultHistory.length > 0 && (
              <div className="text-right">
                <p className="text-sm text-gray-600">Defaults</p>
                <p className="text-lg font-semibold text-red-600">
                  {vaultData.defaultHistory.length}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Solvency Status */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Vault Balance</p>
            <p className="text-lg font-bold text-gray-900">
              {vaultData.balance.toFixed(2)} USDC
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Required Escrow</p>
            <p className="text-lg font-semibold text-gray-900">
              {vaultData.requiredEscrow.toFixed(2)} USDC
            </p>
          </div>
          <div className="pt-2">
            {isSolvent ? (
              <div className="flex items-center gap-2 rounded-md bg-green-50 px-3 py-2">
                <span className="text-green-600">✓</span>
                <span className="text-sm font-medium text-green-800">Solvent</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-md bg-red-50 px-3 py-2">
                <span className="text-red-600">⚠</span>
                <div className="flex-1">
                  <span className="text-sm font-medium text-red-800">Underfunded</span>
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
