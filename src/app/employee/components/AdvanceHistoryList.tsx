'use client';

import { useState, useEffect } from 'react';

interface Advance {
  id: number;
  amount: string;
  fee: string;
  totalRepayment: string;
  status: 'pending' | 'active' | 'repaid' | 'defaulted';
  requestDate: string;
  rbnTokenId?: string;
  repaymentProgress?: {
    repaid: string;
    remaining: string;
  };
}

interface AdvanceHistoryListProps {
  onStatusChanged?: () => void;
}

export function AdvanceHistoryList({}: AdvanceHistoryListProps) {
  const [advances, setAdvances] = useState<Advance[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAdvances = async () => {
      setIsLoading(true);
      try {
        // TODO: Implement Web3 call to get advance history
        // const advanceIds = await contract.getAdvanceHistory(employeeAddress);
        // const advanceData = await Promise.all(
        //   advanceIds.map(id => contract.getAdvance(id))
        // );

        // Mock data for demo
        const mockAdvances: Advance[] = [
          {
            id: 1,
            amount: '1000.00',
            fee: '50.00',
            totalRepayment: '1050.00',
            status: 'active',
            requestDate: '2024-01-15',
            rbnTokenId: '0x1234...5678',
            repaymentProgress: {
              repaid: '262.50',
              remaining: '787.50',
            },
          },
          {
            id: 2,
            amount: '500.00',
            fee: '25.00',
            totalRepayment: '525.00',
            status: 'repaid',
            requestDate: '2024-01-01',
            rbnTokenId: '0xabcd...efgh',
          },
          {
            id: 3,
            amount: '1500.00',
            fee: '75.00',
            totalRepayment: '1575.00',
            status: 'pending',
            requestDate: '2024-02-01',
          },
        ];

        setTimeout(() => {
          setAdvances(mockAdvances);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to fetch advances:', error);
        setIsLoading(false);
      }
    };

    fetchAdvances();
  }, []);

  const getStatusColor = (status: Advance['status']) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'repaid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'defaulted':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTokenId = (tokenId?: string) => {
    if (!tokenId) return 'N/A';
    return `${tokenId.slice(0, 6)}...${tokenId.slice(-4)}`;
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Advance History
        </h2>
        <div className="py-8 text-center">
          <p className="text-gray-500">Loading advance history...</p>
        </div>
      </div>
    );
  }

  if (advances.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Advance History
        </h2>
        <div className="py-8 text-center">
          <p className="text-gray-500">No advance requests found</p>
          <p className="mt-2 text-sm text-gray-400">
            Request your first advance above
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">
        Advance History
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="pb-3 text-sm font-medium text-gray-700">Amount</th>
              <th className="pb-3 text-sm font-medium text-gray-700">Status</th>
              <th className="pb-3 text-sm font-medium text-gray-700">
                Request Date
              </th>
              <th className="pb-3 text-sm font-medium text-gray-700">
                RBN Token
              </th>
              <th className="pb-3 text-sm font-medium text-gray-700">
                Repayment Progress
              </th>
            </tr>
          </thead>
          <tbody>
            {advances.map((advance) => (
              <tr
                key={advance.id}
                className="border-b border-gray-100 last:border-b-0"
              >
                <td className="py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {advance.amount} USDC
                    </div>
                    <div className="text-xs text-gray-500">
                      Fee: {advance.fee} USDC
                    </div>
                  </div>
                </td>
                <td className="py-4">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                      advance.status
                    )}`}
                  >
                    {advance.status.charAt(0).toUpperCase() +
                      advance.status.slice(1)}
                  </span>
                </td>
                <td className="py-4">
                  <div className="text-sm text-gray-900">
                    {advance.requestDate}
                  </div>
                </td>
                <td className="py-4">
                  <div className="font-mono text-sm text-gray-900">
                    {formatTokenId(advance.rbnTokenId)}
                  </div>
                </td>
                <td className="py-4">
                  {advance.repaymentProgress ? (
                    <div>
                      <div className="text-sm text-gray-900">
                        {advance.repaymentProgress.repaid} /{' '}
                        {advance.totalRepayment} USDC
                      </div>
                      <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-green-600"
                          style={{
                            width: `${(
                              (parseFloat(advance.repaymentProgress.repaid) /
                                parseFloat(advance.totalRepayment)) *
                              100
                            ).toFixed(0)}%`,
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">
                      {advance.status === 'repaid'
                        ? 'Fully Repaid'
                        : advance.status === 'pending'
                          ? 'Awaiting Approval'
                          : 'N/A'}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 border-t border-gray-200 pt-4">
        <p className="text-xs text-gray-500">
          RBN (Revenue-Backed Notes) represent your advance obligation and can
          be traded on the marketplace.
        </p>
      </div>
    </div>
  );
}
