'use client';

import { useState, useEffect } from 'react';

// @TODO: Update this interface to the WEB3 version
interface RBN {
  id: number;
  type: 'PAYROLL';
  amount: string;
  yieldPercentage: number;
  duration: string;
  isPurchasing?: boolean;
}

// Mock data for demo
const mockRBNs: RBN[] = [
  {
    id: 1,
    type: 'PAYROLL',
    amount: '1000.00',
    yieldPercentage: 8.5,
    duration: '60 days',
  },
  {
    id: 2,
    type: 'PAYROLL',
    amount: '500.00',
    yieldPercentage: 6.2,
    duration: '90 days',
  },
  {
    id: 3,
    type: 'PAYROLL',
    amount: '1500.00',
    yieldPercentage: 9.0,
    duration: '45 days',
  },
];

interface AvailableRBNCardsProps {
  onPurchased?: () => void;
}

export function AvailableRBNCards({ onPurchased }: AvailableRBNCardsProps) {
  const [rbns, setRbns] = useState<RBN[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAvailableRBNs = async () => {
      setIsLoading(true);
      try {
        // TODO: Implement Web3 call to list available RBNs
        // const rbnIds = await contract.listAvailableRBNs(0, 10);
        // const rbnData = await Promise.all(
        //   rbnIds.map(id => contract.getRBN(id))
        // );

        setTimeout(() => {
          setRbns(mockRBNs);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to fetch RBNs:', error);
        setIsLoading(false);
      }
    };

    fetchAvailableRBNs();
  }, []);

  const handlePurchase = async (rbnId: number) => {
    setRbns((prev) =>
      prev.map((rbn) =>
        rbn.id === rbnId ? { ...rbn, isPurchasing: true } : rbn
      )
    );

    try {
      // TODO: Implement Web3 purchase
      // await contract.approveUSDC(amount);
      // await contract.buyRBN(rbnId, price);
      console.log('Purchasing RBN:', rbnId);

      onPurchased?.();
    } catch (error) {
      console.error('Purchase failed:', error);
    } finally {
      setRbns((prev) =>
        prev.map((rbn) =>
          rbn.id === rbnId ? { ...rbn, isPurchasing: false } : rbn
        )
      );
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Available RBNs
        </h2>
        <div className="py-8 text-center">
          <p className="text-gray-500">Loading available RBNs...</p>
        </div>
      </div>
    );
  }

  if (rbns.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Available RBNs
        </h2>
        <div className="py-8 text-center">
          <p className="text-gray-500">No RBNs available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">
        Available RBNs
      </h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rbns.map((rbn) => (
          <div
            key={rbn.id}
            className="rounded-lg border border-gray-200 p-4 hover:border-gray-300"
          >
            <div className="mb-3">
              <span
                className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                  rbn.type === 'PAYROLL'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
                }`}
              >
                {rbn.type}
              </span>
            </div>

            <div className="mb-3">
              <p className="text-lg font-bold text-gray-900">
                {rbn.amount} USDC
              </p>
              <p className="text-sm text-gray-600">{rbn.duration}</p>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-green-600">
                {rbn.yieldPercentage}% APY
              </p>
            </div>

            <button
              onClick={() => handlePurchase(rbn.id)}
              disabled={rbn.isPurchasing}
              className="w-full rounded-md bg-black px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {rbn.isPurchasing ? 'Purchasing...' : 'Buy RBN'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
