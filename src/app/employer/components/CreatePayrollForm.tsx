'use client';

import { useState } from 'react';

interface CreatePayrollFormProps {
  onSuccess?: () => void;
}

export function CreatePayrollForm({ onSuccess }: CreatePayrollFormProps) {
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

    setIsLoading(true);
    try {
      // TODO: Implement Web3 payroll creation
      // await contract.createPayroll(
      //   formData.employeeAddress,
      //   formData.amount,
      //   formData.cadenceSeconds,
      //   Math.floor(new Date(formData.startDate).getTime() / 1000),
      //   Math.floor(new Date(formData.endDate).getTime() / 1000)
      // );
      console.log('Creating payroll:', formData);

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
      console.error('Payroll creation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">
        Create Payroll
      </h2>

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
            Payment Cadence
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
              Start Date
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
              End Date
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

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md bg-black px-4 py-2 font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {isLoading ? 'Creating...' : 'Create Payroll'}
        </button>
      </form>
    </div>
  );
}
