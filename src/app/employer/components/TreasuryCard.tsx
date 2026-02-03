'use client';

import { useState } from 'react';

interface TreasuryCardProps {
  balance?: number;
}

export function TreasuryCard({ balance = 0 }: TreasuryCardProps) {
  const [depositAmount, setDepositAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) return;

    setIsLoading(true);
    try {
      // TODO: Implement Web3 deposit functionality
      // await contract.deposit(depositAmount);
      console.log('Depositing:', depositAmount, 'USDC');
      setDepositAmount('');
    } catch (error) {
      console.error('Deposit failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">Treasury</h2>

      <div className="mb-6">
        <p className="text-sm text-gray-600">Available Balance</p>
        <p className="text-2xl font-bold text-gray-900">
          {balance.toFixed(2)} USDC
        </p>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <h3 className="mb-3 text-lg font-medium text-gray-900">Deposit USDC</h3>
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
            {isLoading ? 'Depositing...' : 'Deposit'}
          </button>
        </div>
      </div>
    </div>
  );
}
