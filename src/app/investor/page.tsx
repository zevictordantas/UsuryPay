'use client';

import { useState } from 'react';
import { PortfolioSummaryCard } from './components/PortfolioSummaryCard';
import { AvailableECTokenCards } from './components/AvailableECTokenCards';

export default function InvestorPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleECTokenPurchased = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="mx-auto w-full max-w-3xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Investor Dashboard
        </h1>
        <p className="mt-2 text-gray-600">
          Browse and invest in Expected Cashflow (EC) Tokens
        </p>
      </div>

      <div className="grid gap-6">
        <PortfolioSummaryCard />

        <AvailableECTokenCards
          key={refreshKey}
          onPurchased={handleECTokenPurchased}
        />
      </div>
    </div>
  );
}
