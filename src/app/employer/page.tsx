'use client';

import { useState, useEffect } from 'react';
import { useConnection, useWaitForTransactionReceipt } from 'wagmi';
import { type Address } from 'viem';
import { TreasuryCard } from './components/TreasuryCard';
import { MintECTokenForm } from './components/MintECTokenForm';
import { MintedECTokensList } from './components/MintedECTokensList';
import {
  useReadPayrollVaultFactoryGetEmployerVaults,
  useReadPayrollVaultFactoryGetVaultAddress,
  useWritePayrollVaultFactoryCreateVault,
} from '@/generated';
import { useLocalEnsName } from '../hooks/useLocalENS';

export default function EmployerPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const { address: employerAddress, isConnected } = useConnection();

  // Get employer's ENS name for personalization
  const { data: employerEnsName } = useLocalEnsName({
    address: employerAddress,
  });

  // 1. Fetch employer's vault IDs from factory
  const {
    data: vaultIds,
    isLoading: isLoadingVaults,
    refetch: refetchVaults,
  } = useReadPayrollVaultFactoryGetEmployerVaults({
    args: employerAddress ? [employerAddress] : undefined,
    query: { enabled: !!employerAddress },
  });

  const firstVaultId = vaultIds?.[0];

  // 2. Resolve vault ID -> vault contract address
  const { data: vaultAddress, isLoading: isLoadingAddress } =
    useReadPayrollVaultFactoryGetVaultAddress({
      args: firstVaultId !== undefined ? [firstVaultId] : undefined,
      query: { enabled: firstVaultId !== undefined },
    });

  // 3. Create vault write hook
  const {
    writeContract: createVault,
    data: createTxHash,
    isPending: isCreating,
  } = useWritePayrollVaultFactoryCreateVault();

  // 4. Wait for create tx confirmation
  const { isLoading: isWaitingForTx, isSuccess: txConfirmed } =
    useWaitForTransactionReceipt({
      hash: createTxHash,
    });

  // 5. Refetch vaults once tx is confirmed
  useEffect(() => {
    if (txConfirmed) {
      refetchVaults();
    }
  }, [txConfirmed, refetchVaults]);

  const handleCreateVault = () => {
    createVault({});
  };

  const handleRefresh = () => setRefreshKey((prev) => prev + 1);

  const isLoading = isLoadingVaults || isLoadingAddress;
  const hasVault =
    vaultAddress &&
    vaultAddress !== '0x0000000000000000000000000000000000000000';

  // --- Render ---

  if (!isConnected) {
    return (
      <div className="mx-auto w-full max-w-3xl py-8">
        <PageHeader />
        <Card>
          <p className="text-gray-600">
            Please connect your wallet to continue
          </p>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-3xl py-8">
        <PageHeader />
        <Card>
          <p className="text-gray-600">
            {employerEnsName
              ? `Loading ${employerEnsName}'s vaults...`
              : 'Loading your vaults...'}
          </p>
        </Card>
      </div>
    );
  }

  if (!hasVault) {
    return (
      <div className="mx-auto w-full max-w-3xl py-8">
        <PageHeader />
        <Card>
          <p className="mb-4 text-gray-600">
            {employerEnsName ? (
              <>
                {employerEnsName}, you don&apos;t have a payroll vault yet.
                <br />
                Create one to start managing employee salaries.
              </>
            ) : (
              <>
                You don&apos;t have a payroll vault yet. Create one to start
                managing employee salaries.
              </>
            )}
          </p>
          <button
            onClick={handleCreateVault}
            disabled={isCreating || isWaitingForTx}
            className="rounded-md bg-black px-6 py-2 font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {isCreating || isWaitingForTx
              ? 'Creating Vault...'
              : 'Create Vault'}
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl py-8">
      <PageHeader />
      <div className="grid gap-6">
        <TreasuryCard vaultAddress={vaultAddress as Address} key={refreshKey} />
        <MintECTokenForm
          vaultAddress={vaultAddress as Address}
          onSuccess={handleRefresh}
        />
        <MintedECTokensList
          vaultAddress={vaultAddress as Address}
          key={`tokens-${refreshKey}`}
          onVaultFunded={handleRefresh}
        />
      </div>
    </div>
  );
}

function PageHeader() {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900">Employer Dashboard</h1>
      <p className="mt-2 text-gray-600">Manage EC tokens and vault treasury</p>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
      {children}
    </div>
  );
}
