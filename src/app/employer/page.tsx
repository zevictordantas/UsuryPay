'use client';

import { useState } from 'react';
import { TreasuryCard } from './components/TreasuryCard';
import { MintECTokenForm } from './components/MintECTokenForm';
import { MintedECTokensList } from './components/MintedECTokensList';

export default function EmployerPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  // Mock vault data - will be replaced with Web3 calls
  const mockVault = {
    address: '0x1234567890abcdef1234567890abcdef12345678',
    balance: 25000,
    requiredEscrow: 47000,
    creditScore: 72,
    defaultHistory: [],
  };

  const handleECTokenMinted = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleVaultFunded = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="mx-auto w-full max-w-3xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Employer Dashboard
        </h1>
        <p className="mt-2 text-gray-600">
          Manage EC tokens and vault treasury
        </p>
      </div>

      <div className="grid gap-6">
        <TreasuryCard vault={mockVault} />

        <MintECTokenForm
          onSuccess={handleECTokenMinted}
          vaultBalance={mockVault.balance}
          requiredEscrow={mockVault.requiredEscrow}
        />

        <MintedECTokensList key={refreshKey} onVaultFunded={handleVaultFunded} />
      </div>
    </div>
  );
}
