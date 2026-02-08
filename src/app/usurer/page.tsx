'use client';

import { useAccount } from 'wagmi';
import { PortfolioSummaryCard } from './components/PortfolioSummaryCard';
import { OwnedECTokensCard } from './components/OwnedECTokensCard';
import { useLocalEnsName } from '@/app/hooks/useLocalENS';

export default function UsurerPage() {
  const { address } = useAccount();
  const { data: userEnsName } = useLocalEnsName({ address });

  return (
    <div className="mx-auto w-full max-w-3xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">🎩 Usury Dashboard</h1>
        <p className="mt-2 text-gray-600">
          {userEnsName
            ? `Manage ${userEnsName}'s Expected Cashflow (EC) Token portfolio`
            : 'Manage your Expected Cashflow (EC) Token portfolio'}
        </p>
      </div>

      <div className="grid gap-6">
        <PortfolioSummaryCard />

        <OwnedECTokensCard />
      </div>
    </div>
  );
}
