'use client';

import { useState } from 'react';
import { PayrollSummaryCard } from './components/PayrollSummaryCard';
import { ECTokenSaleCard } from './components/ECTokenSaleCard';
import { ECTokenPortfolioList } from './components/ECTokenPortfolioList';

export default function EmployeePage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTokenSold = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleTokenStatusChanged = () => {
    setRefreshKey((prev) => prev + 1);
  };

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
        <PayrollSummaryCard />

        <ECTokenSaleCard onSuccess={handleTokenSold} />

        <ECTokenPortfolioList
          key={refreshKey}
          onStatusChanged={handleTokenStatusChanged}
        />
      </div>
    </div>
  );
}
