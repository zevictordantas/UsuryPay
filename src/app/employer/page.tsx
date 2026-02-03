'use client';

import { useState } from 'react';
import { TreasuryCard } from './components/TreasuryCard';
import { CreatePayrollForm } from './components/CreatePayrollForm';
import { PayrollList } from './components/PayrollList';

export default function EmployerPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handlePayrollCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handlePaymentMade = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="mx-auto w-full max-w-3xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          💸 Employer Dashboard
        </h1>
        <p className="mt-2 text-gray-600">Manage your payroll and treasury</p>
      </div>

      <div className="grid gap-6">
        <TreasuryCard />

        <CreatePayrollForm onSuccess={handlePayrollCreated} />

        <PayrollList key={refreshKey} onPaymentMade={handlePaymentMade} />
      </div>
    </div>
  );
}
