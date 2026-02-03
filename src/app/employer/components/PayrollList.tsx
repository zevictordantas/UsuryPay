'use client';

import { useState, useEffect } from 'react';

interface Payroll {
  id: number;
  employeeAddress: string;
  amount: string;
  cadenceSeconds: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  nextPaymentDate?: string;
}

interface PayrollListProps {
  onPaymentMade?: () => void;
}

export function PayrollList({ onPaymentMade }: PayrollListProps) {
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState<number | null>(
    null
  );

  // Mock data for MVP - replace with actual Web3 calls
  useEffect(() => {
    const fetchPayrolls = async () => {
      setIsLoading(true);
      try {
        // TODO: Implement Web3 call to list payrolls
        // const payrollIds = await contract.listPayrollsByEmployer(employerAddress, 0, 10);
        // const payrollData = await Promise.all(
        //   payrollIds.map(id => contract.getPayroll(id))
        // );

        setTimeout(() => {
          setPayrolls(mockPayrolls);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to fetch payrolls:', error);
        setIsLoading(false);
      }
    };

    fetchPayrolls();
  }, []);

  const handlePayment = async (payrollId: number) => {
    setProcessingPayment(payrollId);
    try {
      // TODO: Implement Web3 payment
      // await contract.pay(payrollId, recipientAddress, amount);
      console.log('Processing payment for payroll:', payrollId);

      onPaymentMade?.();
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setProcessingPayment(null);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getCadenceLabel = (seconds: number) => {
    switch (seconds) {
      case 604800:
        return 'Weekly';
      case 1209600:
        return 'Bi-weekly';
      case 2419200:
        return 'Monthly';
      default:
        return `${Math.floor(seconds / 86400)} days`;
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Active Payrolls
        </h2>
        <div className="py-8 text-center">
          <p className="text-gray-500">Loading payrolls...</p>
        </div>
      </div>
    );
  }

  if (payrolls.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Active Payrolls
        </h2>
        <div className="py-8 text-center">
          <p className="text-gray-500">No active payrolls found</p>
          <p className="mt-2 text-sm text-gray-400">
            Create your first payroll above
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">
        Active Payrolls
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="pb-3 text-sm font-medium text-gray-700">
                Employee
              </th>
              <th className="pb-3 text-sm font-medium text-gray-700">Amount</th>
              <th className="pb-3 text-sm font-medium text-gray-700">
                Cadence
              </th>
              <th className="pb-3 text-sm font-medium text-gray-700">
                Next Payment
              </th>
              <th className="pb-3 text-sm font-medium text-gray-700">Status</th>
              <th className="pb-3 text-right text-sm font-medium text-gray-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {payrolls.map((payroll) => (
              <tr
                key={payroll.id}
                className="border-b border-gray-100 last:border-b-0"
              >
                <td className="py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {formatAddress(payroll.employeeAddress)}
                  </div>
                </td>
                <td className="py-4">
                  <div className="text-sm text-gray-900">
                    {payroll.amount} USDC
                  </div>
                </td>
                <td className="py-4">
                  <div className="text-sm text-gray-900">
                    {getCadenceLabel(payroll.cadenceSeconds)}
                  </div>
                </td>
                <td className="py-4">
                  <div className="text-sm text-gray-900">
                    {payroll.nextPaymentDate || 'N/A'}
                  </div>
                </td>
                <td className="py-4">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                      payroll.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {payroll.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-4 text-right">
                  <button
                    onClick={() => handlePayment(payroll.id)}
                    disabled={
                      processingPayment === payroll.id || !payroll.isActive
                    }
                    className="rounded-md bg-black px-3 py-1 text-xs font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
                  >
                    {processingPayment === payroll.id
                      ? 'Processing...'
                      : 'Pay Now'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Mock data for demo
const mockPayrolls: Payroll[] = [
  {
    id: 1,
    employeeAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    amount: '1500.00',
    cadenceSeconds: 604800, // 1 week
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    isActive: true,
    nextPaymentDate: '2024-02-07',
  },
  {
    id: 2,
    employeeAddress: '0x8ba1f109551bD432803012645Hac136c22C57B',
    amount: '2000.00',
    cadenceSeconds: 1209600, // 2 weeks
    startDate: '2024-01-15',
    endDate: '2024-06-30',
    isActive: true,
    nextPaymentDate: '2024-02-12',
  },
];
