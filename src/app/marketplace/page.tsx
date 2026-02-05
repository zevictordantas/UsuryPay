'use client';

import { useState } from 'react';
import { MarketplaceListings } from './components/MarketplaceListings';
import { MarketplaceFilters } from './components/MarketplaceFilters';

export interface MarketplaceFilters {
  sortBy: 'discount' | 'amount' | 'duration' | 'creditScore';
  showDefaultedOnly: boolean;
  minCreditScore: number;
  maxDuration: number | null;
}

export default function MarketplacePage() {
  const [filters, setFilters] = useState<MarketplaceFilters>({
    sortBy: 'discount',
    showDefaultedOnly: false,
    minCreditScore: 0,
    maxDuration: null,
  });

  return (
    <div className="mx-auto w-full max-w-7xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">EC Token Marketplace</h1>
        <p className="mt-2 text-gray-600">
          Browse and trade Expected Cashflow (EC) tokens from various sources
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <MarketplaceFilters filters={filters} onFiltersChange={setFilters} />
        </aside>

        <main>
          <MarketplaceListings filters={filters} />
        </main>
      </div>
    </div>
  );
}
