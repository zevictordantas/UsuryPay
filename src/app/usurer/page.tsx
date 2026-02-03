'use client';

import { useState } from 'react';
import { PortfolioSummaryCard } from './components/PortfolioSummaryCard';
import { AvailableRBNCards } from './components/AvailableRBNCards';

export default function UsurerPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRBNPurchased = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="mx-auto w-full max-w-3xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          🎩 Usurer Dashboard
        </h1>
        <p className="mt-2 text-gray-600">
          Browse and invest in Revenue-Backed Notes
        </p>
      </div>

      <div className="grid gap-6">
        <PortfolioSummaryCard />

        <AvailableRBNCards key={refreshKey} onPurchased={handleRBNPurchased} />
      </div>
    </div>
  );
}
