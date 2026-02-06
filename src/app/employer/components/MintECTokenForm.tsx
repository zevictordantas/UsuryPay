'use client';

import { useState, useMemo } from 'react';

interface MintECTokenFormProps {
  onSuccess?: () => void;
  vaultBalance?: number;
  requiredEscrow?: number;
}

export function MintECTokenForm({
  onSuccess,
  vaultBalance = 0,
  requiredEscrow = 0
}: MintECTokenFormProps) {
  const [formData, setFormData] = useState({
    employeeAddress: '',
    amount: '',
    cadenceSeconds: '604800', // 1 week default
    customCadence: '',
    startDate: '',
    endDate: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const cadenceOptions = [
    { label: 'Weekly', value: '604800' },
    { label: 'Bi-weekly', value: '1209600' },
    { label: 'Monthly', value: '2419200' },
    { label: 'Custom (seconds)', value: 'custom' },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const calculatedValues = useMemo(() => {
    if (!formData.amount || !formData.startDate || !formData.endDate) {
      return { totalAmount: 0, ratePerSecond: 0, durationSeconds: 0 };
    }

    const startTime = new Date(formData.startDate).getTime() / 1000;
    const endTime = new Date(formData.endDate).getTime() / 1000;
    const durationSeconds = endTime - startTime;

    const cadence = formData.cadenceSeconds === 'custom'
      ? parseInt(formData.customCadence || '0')
      : parseInt(formData.cadenceSeconds);

    const numPayments = Math.floor(durationSeconds / cadence);
    const totalAmount = parseFloat(formData.amount) * numPayments;
    const ratePerSecond = totalAmount / durationSeconds;

    return { totalAmount, ratePerSecond, durationSeconds };
  }, [formData]);

  const isVaultSolvent = vaultBalance >= requiredEscrow + calculatedValues.totalAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.employeeAddress ||
      !formData.amount ||
      !formData.startDate ||
      !formData.endDate
    ) {
      return;
    }

    if (!isVaultSolvent) {
      alert('Insufficient vault balance. Please fund vault before minting EC tokens.');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement Web3 EC token minting
      // await contract.mintECToken(
      //   formData.employeeAddress,
      //   calculatedValues.totalAmount,
      //   Math.floor(new Date(formData.startDate).getTime() / 1000),
      //   Math.floor(new Date(formData.endDate).getTime() / 1000)
      // );
      console.log('Minting EC token:', formData, calculatedValues);

      setFormData({
        employeeAddress: '',
        amount: '',
        cadenceSeconds: '604800',
        customCadence: '',
        startDate: '',
        endDate: '',
      });

      onSuccess?.();
    } catch (error) {
      console.error('EC token minting failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-2 text-xl font-semibold text-gray-900">
        Mint EC Token for Employee
      </h2>
      <p className="mb-4 text-sm text-gray-600">
        This creates an EC token representing future salary payments
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
            onChange={(e) =>
              handleInputChange('employeeAddress', e.target.value)
            }
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-black focus:ring-1 focus:ring-black focus:outline-none"
            disabled={isLoading}
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Amount per Period (USDC)
          </label>
          <input
            type="number"
            placeholder="1000"
            value={formData.amount}
            onChange={(e) => handleInputChange('amount', e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-black focus:ring-1 focus:ring-black focus:outline-none"
            disabled={isLoading}
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Accrual Cadence
          </label>
          <select
            value={formData.cadenceSeconds}
            onChange={(e) =>
              handleInputChange('cadenceSeconds', e.target.value)
            }
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-black focus:ring-1 focus:ring-black focus:outline-none"
            disabled={isLoading}
          >
            {cadenceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {formData.cadenceSeconds === 'custom' && (
            <input
              type="number"
              placeholder="Seconds between payments"
              value={formData.customCadence || ''}
              onChange={(e) =>
                handleInputChange('customCadence', e.target.value)
              }
              className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-black focus:ring-1 focus:ring-black focus:outline-none"
              disabled={isLoading}
            />
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Start Time
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              min={today}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-black focus:ring-1 focus:ring-black focus:outline-none"
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              End Time
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              min={formData.startDate || today}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-black focus:ring-1 focus:ring-black focus:outline-none"
              disabled={isLoading}
              required
            />
          </div>
        </div>

        {calculatedValues.totalAmount > 0 && (
          <div className="rounded-md bg-gray-50 p-4">
            <h3 className="mb-2 text-sm font-medium text-gray-700">Calculated Values</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Total Amount:</span>
                <span className="font-medium text-gray-900">
                  {calculatedValues.totalAmount.toFixed(2)} USDC
                </span>
              </div>
              <div className="flex justify-between">
                <span>Rate per Second:</span>
                <span className="font-medium text-gray-900">
                  {calculatedValues.ratePerSecond.toFixed(8)} USDC/s
                </span>
              </div>
              <div className="flex justify-between">
                <span>Duration:</span>
                <span className="font-medium text-gray-900">
                  {Math.floor(calculatedValues.durationSeconds / 86400)} days
                </span>
              </div>
            </div>
          </div>
        )}

        {!isVaultSolvent && calculatedValues.totalAmount > 0 && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
            Vault balance insufficient. Need {calculatedValues.totalAmount.toFixed(2)} USDC more.
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !isVaultSolvent}
          className="w-full rounded-md bg-black px-4 py-2 font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {isLoading ? 'Minting...' : 'Mint EC Token'}
        </button>
      </form>
    </div>
  );
}
