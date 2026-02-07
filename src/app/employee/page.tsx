'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { PayrollSummaryCard } from './components/PayrollSummaryCard';
import { ECTokenSaleCard } from './components/ECTokenSaleCard';
import { ECTokenPortfolioList } from './components/ECTokenPortfolioList';

export default function EmployeePage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const { isConnected } = useAccount();

  const handleTokenSold = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleTokenStatusChanged = () => {
    setRefreshKey((prev) => prev + 1);
  };

  if (!isConnected) {
    return (
      <div className="mx-auto w-full max-w-3xl py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">💳 Employee Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage your EC tokens and claim salary</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
          <p className="text-gray-600">Please connect your wallet to view your salary tokens</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          💳 Employee Dashboard
        </h1>
        <p className="mt-2 text-gray-600">
          Manage your EC tokens and claim salary
        </p>
      </div>

      <div className="grid gap-6">
        <PayrollSummaryCard key={refreshKey} />

        <ECTokenSaleCard onSuccess={handleTokenSold} key={`sale-${refreshKey}`} />

        <ECTokenPortfolioList
          key={`portfolio-${refreshKey}`}
          onStatusChanged={handleTokenStatusChanged}
        />
      </div>
    </div>
  );
}
