'use client';

import { useState, useEffect } from 'react';
import { ECToken } from '@/app/types/ec-types';

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
  const [ownedTokens, setOwnedTokens] = useState<ECToken[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // TODO: Implement Web3 call to list payrolls and owned EC tokens
        // const payrollIds = await contract.listPayrollsByEmployee(employeeAddress, 0, 10);
        // const tokens = await contract.getOwnedTokens(employeeAddress);

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

        const mockTokens: ECToken[] = [
          {
            tokenId: '0x1a2b3c4d5e6f',
            vaultAddress: '0xEmployerVault001',
            totalAmount: 3000,
            startTime: Date.now() / 1000 - 86400 * 7,
            endTime: Date.now() / 1000 + 86400 * 23,
            ratePerSecond: 3000 / (86400 * 30),
            claimed: 700,
            owner: '0xEmployee',
            creditScore: 85,
          },
          {
            tokenId: '0x7g8h9i0j1k2l',
            vaultAddress: '0xEmployerVault001',
            totalAmount: 2000,
            startTime: Date.now() / 1000 - 86400 * 14,
            endTime: Date.now() / 1000 + 86400 * 16,
            ratePerSecond: 2000 / (86400 * 30),
            claimed: 933,
            owner: '0xEmployee',
            creditScore: 85,
          },
        ];

        setTimeout(() => {
          setPayrolls(mockPayrolls);
          setOwnedTokens(mockTokens);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateClaimable = (token: ECToken) => {
    const now = Date.now() / 1000;
    const elapsed = Math.min(now - token.startTime, token.endTime - token.startTime);
    const accrued = elapsed * token.ratePerSecond;
    return Math.max(0, accrued - token.claimed);
  };

  const totalClaimableValue = ownedTokens.reduce((sum, token) => {
    return sum + calculateClaimable(token);
  }, 0);

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
          <p className="text-sm text-gray-600">Total Claimable Value</p>
          <p className="text-2xl font-bold text-green-600">
            {totalClaimableValue.toFixed(2)} USDC
          </p>
          <p className="text-xs text-gray-500">Across all owned EC tokens</p>
        </div>

        <div>
          <p className="text-sm text-gray-600">Active Payrolls</p>
          <p className="text-2xl font-bold text-gray-900">
            {payrolls.filter((p) => p.isActive).length}
          </p>
          <p className="text-xs text-gray-500">
            Est. {totalMonthly.toFixed(0)} USDC/month
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
