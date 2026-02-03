'use client';

import { useState, useEffect } from 'react';

interface AdvanceRequestCardProps {
  onSuccess?: () => void;
}

export function AdvanceRequestCard({ onSuccess }: AdvanceRequestCardProps) {
  const [amount, setAmount] = useState('');
  const [availableLimit, setAvailableLimit] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isCalculating, setIsCalculating] = useState(true);

  useEffect(() => {
    const calculateAvailableLimit = async () => {
      setIsCalculating(true);
      try {
        // TODO: Implement Web3 call to calculate available advance limit
        // Based on active payrolls and existing advances
        // const payrolls = await contract.listPayrollsByEmployee(employeeAddress, 0, 10);
        // const activeAdvances = await contract.getActiveAdvances(employeeAddress);

        // Mock calculation: 50% of next 2 payments
        const mockLimit = 3500; // 50% of (1500 + 2000) from mock payrolls

        setTimeout(() => {
          setAvailableLimit(mockLimit);
          setIsCalculating(false);
        }, 500);
      } catch (error) {
        console.error('Failed to calculate advance limit:', error);
        setIsCalculating(false);
      }
    };

    calculateAvailableLimit();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !amount ||
      parseFloat(amount) <= 0 ||
      parseFloat(amount) > availableLimit
    ) {
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement Web3 advance request
      // This would call DAO backend API or directly interact with contracts
      // await requestAdvance(parseFloat(amount));
      console.log('Requesting advance:', amount, 'USDC');

      setAmount('');
      onSuccess?.();
    } catch (error) {
      console.error('Advance request failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isCalculating) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Request Advance
        </h2>
        <div className="py-8 text-center">
          <p className="text-gray-500">Calculating available limit...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">
        Request Advance
      </h2>

      <div className="mb-6">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Available Advance Limit</span>
          <span className="text-lg font-bold text-green-600">
            {availableLimit.toFixed(2)} USDC
          </span>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Based on your active payroll and advance history
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Advance Amount (USDC)
          </label>
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            max={availableLimit.toString()}
            step="0.01"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-black focus:ring-1 focus:ring-black focus:outline-none"
            disabled={isLoading}
            required
          />
          {amount && parseFloat(amount) > availableLimit && (
            <p className="mt-1 text-sm text-red-600">
              Amount exceeds available limit
            </p>
          )}
        </div>

        <div className="rounded-md bg-blue-50 p-4">
          <h4 className="text-sm font-medium text-blue-900">Advance Terms</h4>
          <ul className="mt-2 space-y-1 text-sm text-blue-700">
            <li>• Advance is repaid automatically from future payroll</li>
            <li>• Service fee: 5% of advance amount</li>
            <li>
              • RBN (Revenue-Backed Note) will be minted and can be traded
            </li>
            <li>
              • Repayment priority: Advances are paid before regular salary
            </li>
          </ul>
        </div>

        <button
          type="submit"
          disabled={
            isLoading ||
            !amount ||
            parseFloat(amount) <= 0 ||
            parseFloat(amount) > availableLimit
          }
          className="w-full rounded-md bg-black px-4 py-2 font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {isLoading ? 'Requesting...' : 'Request Advance'}
        </button>
      </form>
    </div>
  );
}
