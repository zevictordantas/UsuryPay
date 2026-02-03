'use client';

import { useState, useEffect } from 'react';

interface PayrollSummaryCardProps {
  totalEarnings?: number;
  nextPayment?: { amount: number; date: string };
}

interface Payroll {
  id: number;
  amount: string;
  cadenceSeconds: number;
  nextPaymentDate: string;
  isActive: boolean;
}

export function PayrollSummaryCard({
  totalEarnings = 0,
  nextPayment,
}: PayrollSummaryCardProps) {
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPayrolls = async () => {
      setIsLoading(true);
      try {
        // TODO: Implement Web3 call to list payrolls by employee
        // const payrollIds = await contract.listPayrollsByEmployee(employeeAddress, 0, 10);
        // const payrollData = await Promise.all(
        //   payrollIds.map(id => contract.getPayroll(id))
        // );

        // Mock data for demo
        const mockPayrolls = [
          {
            id: 1,
            amount: '1500.00',
            cadenceSeconds: 604800, // 1 week
            nextPaymentDate: '2024-02-07',
            isActive: true,
          },
          {
            id: 2,
            amount: '2000.00',
            cadenceSeconds: 1209600, // 2 weeks
            nextPaymentDate: '2024-02-12',
            isActive: true,
          },
        ];

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

  const totalMonthly = payrolls.reduce((sum, payroll) => {
    const monthlyAmount =
      parseFloat(payroll.amount) * (604800 / payroll.cadenceSeconds);
    return sum + monthlyAmount;
  }, 0);

  const nextUpcomingPayment = payrolls
    .filter((p) => p.isActive)
    .sort(
      (a, b) =>
        new Date(a.nextPaymentDate).getTime() -
        new Date(b.nextPaymentDate).getTime()
    )[0];

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Payroll Summary
        </h2>
        <div className="py-8 text-center">
          <p className="text-gray-500">Loading payroll data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">
        Payroll Summary
      </h2>

      <div className="grid gap-6 md:grid-cols-3">
        <div>
          <p className="text-sm text-gray-600">Active Payrolls</p>
          <p className="text-2xl font-bold text-gray-900">
            {payrolls.filter((p) => p.isActive).length}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-600">Estimated Monthly</p>
          <p className="text-2xl font-bold text-gray-900">
            {totalMonthly.toFixed(2)} USDC
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-600">Next Payment</p>
          <p className="text-lg font-bold text-gray-900">
            {nextUpcomingPayment ? nextUpcomingPayment.amount : '0'} USDC
          </p>
          <p className="text-sm text-gray-500">
            {nextUpcomingPayment ? nextUpcomingPayment.nextPaymentDate : 'N/A'}
          </p>
        </div>
      </div>

      {payrolls.length > 0 && (
        <div className="mt-6 border-t border-gray-200 pt-4">
          <h3 className="mb-3 text-sm font-medium text-gray-700">
            Active Payrolls
          </h3>
          <div className="space-y-2">
            {payrolls
              .filter((p) => p.isActive)
              .map((payroll) => (
                <div key={payroll.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">Payroll #{payroll.id}</span>
                  <span className="font-medium text-gray-900">
                    {payroll.amount} USDC /{' '}
                    {payroll.cadenceSeconds === 604800
                      ? 'week'
                      : payroll.cadenceSeconds === 1209600
                        ? '2 weeks'
                        : 'month'}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
