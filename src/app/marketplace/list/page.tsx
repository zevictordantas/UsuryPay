'use client';

import { useState } from 'react';
import { ListECTokenForm } from './components/ListECTokenForm';
import { UserListings } from './components/UserListings';

export default function ListPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTokenListed = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleListingCancelled = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="mx-auto w-full max-w-3xl py-8">
      <div className="mb-4">
        <a
          href="/marketplace"
          className="inline-flex items-center text-sm font-medium text-zinc-600 hover:text-zinc-900"
        >
          ← Back to Marketplace
        </a>
      </div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900">List EC Token</h1>
        <p className="mt-2 text-zinc-600">
          List your EC tokens for sale on the marketplace
        </p>
      </div>

      <div className="grid gap-6">
        <ListECTokenForm onSuccess={handleTokenListed} />

        <UserListings key={refreshKey} onCancelled={handleListingCancelled} />
      </div>
    </div>
  );
}
