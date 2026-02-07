'use client';

import { useState } from 'react';
import { type Address, parseUnits, formatUnits, isAddress } from 'viem';
import { useChainId } from 'wagmi';
import {
  useWritePayrollVaultMintSalaryToken,
  useReadPayrollVaultGetBalance,
  useReadPayrollVaultGetRequiredEscrow,
} from '@/generated';

interface MintECTokenFormProps {
  vaultAddress: Address;
  onSuccess?: () => void;
}

export function MintECTokenForm({ vaultAddress, onSuccess }: MintECTokenFormProps) {
  const [formData, setFormData] = useState({
    employeeAddress: '',
    monthlyAmount: '',
    durationMonths: '',
  });

  const chainId = useChainId();
  const { writeContractAsync: mintSalaryToken, isPending } = useWritePayrollVaultMintSalaryToken();
  const { data: balance } = useReadPayrollVaultGetBalance({
    address: vaultAddress,
    query: { enabled: !!vaultAddress },
  });
  const { data: requiredEscrow } = useReadPayrollVaultGetRequiredEscrow({
    address: vaultAddress,
    query: { enabled: !!vaultAddress },
  });

  const vaultBalance = balance ? Number(formatUnits(balance, 6)) : 0;
  const vaultRequiredEscrow = requiredEscrow ? Number(formatUnits(requiredEscrow, 6)) : 0;

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const monthlyAmount = parseFloat(formData.monthlyAmount) || 0;
  const durationMonths = parseInt(formData.durationMonths) || 0;
  const totalAmount = monthlyAmount * durationMonths;

  const isVaultSolvent = vaultBalance >= vaultRequiredEscrow + totalAmount;
  const isValidAddress = formData.employeeAddress && isAddress(formData.employeeAddress);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidAddress || monthlyAmount <= 0 || durationMonths <= 0) {
      alert('Please fill all fields with valid values');
      return;
    }

    if (!isVaultSolvent) {
      alert('Insufficient vault balance. Please fund vault before minting EC tokens.');
      return;
    }

    try {
      const monthlyAmountInWei = parseUnits(formData.monthlyAmount, 6);

      console.log('Minting salary token:', {
        employee: formData.employeeAddress,
        monthlyAmount: monthlyAmountInWei.toString(),
        duration: durationMonths,
      });

      await mintSalaryToken({
        address: vaultAddress,
        args: [
          formData.employeeAddress as Address,
          monthlyAmountInWei,
          BigInt(durationMonths),
        ],
      });

      alert('EC Token minted successfully!');

      setFormData({
        employeeAddress: '',
        monthlyAmount: '',
        durationMonths: '',
      });

      onSuccess?.();
    } catch (error) {
      console.error('EC token minting failed:', error);
      alert('Transaction failed. Check console for details.');
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-2 text-xl font-semibold text-gray-900">
        Mint Salary Token for Employee
      </h2>
      <p className="mb-4 text-sm text-gray-600">
        Create an EC token representing future monthly salary payments
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Employee Wallet Address
          </label>
          <input
            type="text"
            placeholder="0x..."
            value={formData.employeeAddress}
            onChange={(e) => handleInputChange('employeeAddress', e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-black focus:ring-1 focus:ring-black focus:outline-none"
            disabled={isPending}
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Monthly Salary (USDC)
          </label>
          <input
            type="number"
            placeholder="5000"
            step="0.01"
            value={formData.monthlyAmount}
            onChange={(e) => handleInputChange('monthlyAmount', e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-black focus:ring-1 focus:ring-black focus:outline-none"
            disabled={isPending}
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Duration (Months)
          </label>
          <input
            type="number"
            placeholder="12"
            min="1"
            step="1"
            value={formData.durationMonths}
            onChange={(e) => handleInputChange('durationMonths', e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-black focus:ring-1 focus:ring-black focus:outline-none"
            disabled={isPending}
            required
          />
        </div>

        {totalAmount > 0 && (
          <div className="rounded-md bg-gray-50 p-4">
            <h3 className="mb-2 text-sm font-medium text-gray-700">Calculated Values</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Total Amount:</span>
                <span className="font-medium text-gray-900">
                  {totalAmount.toFixed(2)} USDC
                </span>
              </div>
              <div className="flex justify-between">
                <span>Duration:</span>
                <span className="font-medium text-gray-900">
                  {durationMonths} months ({durationMonths * 30} days)
                </span>
              </div>
            </div>
          </div>
        )}

        {!isVaultSolvent && totalAmount > 0 && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
            ⚠ Vault balance insufficient. Need {(totalAmount - (vaultBalance - vaultRequiredEscrow)).toFixed(2)} USDC more.
          </div>
        )}

        <button
          type="submit"
          disabled={isPending || !isVaultSolvent || !isValidAddress}
          className="w-full rounded-md bg-black px-4 py-2 font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {isPending ? 'Minting...' : 'Mint Salary Token'}
        </button>
      </form>
    </div>
  );
}
