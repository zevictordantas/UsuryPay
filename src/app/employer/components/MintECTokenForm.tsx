'use client';
import { useToast } from '@/app/components/Toast/ToastContext';

import { useState } from 'react';
import { type Address, parseUnits, formatUnits } from 'viem';
import { useChainId } from 'wagmi';
import { AddressInput } from '@/app/components/AddressInput';
import {
  useWritePayrollVaultMintSalaryToken,
  useReadPayrollVaultGetBalance,
  useReadPayrollVaultGetRequiredEscrow,
} from '@/generated';

interface MintECTokenFormProps {
  vaultAddress: Address;
  onSuccess?: () => void;
}

export function MintECTokenForm({
  vaultAddress,
  onSuccess,
}: MintECTokenFormProps) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    employeeAddress: '',
    monthlyAmount: '',
    durationMonths: '',
  });
  const [resolvedAddress, setResolvedAddress] = useState<Address | undefined>();

  const chainId = useChainId();
  const { writeContractAsync: mintSalaryToken, isPending } =
    useWritePayrollVaultMintSalaryToken();
  const { data: balance } = useReadPayrollVaultGetBalance({
    address: vaultAddress,
    query: { enabled: !!vaultAddress },
  });
  const { data: requiredEscrow } = useReadPayrollVaultGetRequiredEscrow({
    address: vaultAddress,
    query: { enabled: !!vaultAddress },
  });

  const vaultBalance = balance ? Number(formatUnits(balance, 6)) : 0;
  const vaultRequiredEscrow = requiredEscrow
    ? Number(formatUnits(requiredEscrow, 6))
    : 0;

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (value: string, resolved?: Address) => {
    setFormData((prev) => ({ ...prev, employeeAddress: value }));
    setResolvedAddress(resolved);
  };

  const monthlyAmount = parseFloat(formData.monthlyAmount) || 0;
  const durationMonths = parseInt(formData.durationMonths) || 0;
  const totalAmount = monthlyAmount * durationMonths;

  const isVaultSolvent = vaultBalance >= vaultRequiredEscrow + totalAmount;
  const isValidAddress = !!resolvedAddress;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidAddress || monthlyAmount <= 0 || durationMonths <= 0) {
      showToast('Please fill all fields with valid values', 'info');
      return;
    }

    if (!isVaultSolvent) {
      showToast('Insufficient vault balance. Please fund vault before minting EC tokens.', 'info');
      return;
    }

    try {
      const monthlyAmountInWei = parseUnits(formData.monthlyAmount, 6);

      console.log('Minting salary token:', {
        employee: formData.employeeAddress,
        monthlyAmount: monthlyAmountInWei.toString(),
        duration: durationMonths,
      });

      if (!resolvedAddress) {
        alert('Could not resolve employee address');
        return;
      }

      await mintSalaryToken({
        address: vaultAddress,
        args: [resolvedAddress, monthlyAmountInWei, BigInt(durationMonths)],
      });

      showToast('EC Token minted successfully!', 'info');

      setFormData({
        employeeAddress: '',
        monthlyAmount: '',
        durationMonths: '',
      });

      onSuccess?.();
    } catch (error) {
      console.error('EC token minting failed:', error);
      showToast('Transaction failed. Check console for details.', 'info');
    }
  };

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="mb-2 text-xl font-semibold text-zinc-900">
        Mint Salary Token for Employee
      </h2>
      <p className="mb-4 text-sm text-zinc-600">
        Create an EC token representing future monthly salary payments
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <AddressInput
          label="Employee Wallet Address or ENS"
          value={formData.employeeAddress}
          onChange={handleAddressChange}
          placeholder="0x... or employee.usury.eth"
          disabled={isPending}
          required
        />

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">
            Monthly Salary (USDC)
          </label>
          <input
            type="number"
            placeholder="5000"
            step="0.01"
            value={formData.monthlyAmount}
            onChange={(e) => handleInputChange('monthlyAmount', e.target.value)}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-500 focus:border-black focus:ring-1 focus:ring-black focus:outline-none"
            disabled={isPending}
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">
            Duration (Months)
          </label>
          <input
            type="number"
            placeholder="12"
            min="1"
            step="1"
            value={formData.durationMonths}
            onChange={(e) =>
              handleInputChange('durationMonths', e.target.value)
            }
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-500 focus:border-black focus:ring-1 focus:ring-black focus:outline-none"
            disabled={isPending}
            required
          />
        </div>

        {totalAmount > 0 && (
          <div className="rounded-md bg-zinc-50 p-4">
            <h3 className="mb-2 text-sm font-medium text-zinc-700">
              Calculated Values
            </h3>
            <div className="space-y-1 text-sm text-zinc-600">
              <div className="flex justify-between">
                <span>Total Amount:</span>
                <span className="font-medium text-zinc-900">
                  {totalAmount.toFixed(2)} USDC
                </span>
              </div>
              <div className="flex justify-between">
                <span>Duration:</span>
                <span className="font-medium text-zinc-900">
                  {durationMonths} months ({durationMonths * 30} days)
                </span>
              </div>
            </div>
          </div>
        )}

        {!isVaultSolvent && totalAmount > 0 && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
            ⚠ Vault balance insufficient. Need{' '}
            {(totalAmount - (vaultBalance - vaultRequiredEscrow)).toFixed(2)}{' '}
            USDC more.
          </div>
        )}

        <button
          type="submit"
          disabled={isPending || !isVaultSolvent || !isValidAddress}
          className="w-full rounded-md bg-black px-4 py-2 font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
        >
          {isPending ? 'Minting...' : 'Mint Salary Token'}
        </button>
      </form>
    </div>
  );
}
