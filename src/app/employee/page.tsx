'use client';

import { useState } from 'react';
import { PayrollSummaryCard } from './components/PayrollSummaryCard';
import { AdvanceRequestCard } from './components/AdvanceRequestCard';
import { AdvanceHistoryList } from './components/AdvanceHistoryList';

export default function EmployeePage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAdvanceRequested = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleAdvanceStatusChanged = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="mx-auto w-full max-w-3xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          💳 Employee Dashboard
        </h1>
        <p className="mt-2 text-gray-600">
          Manage your payroll and advance requests
        </p>
      </div>

      <div className="grid gap-6">
        <PayrollSummaryCard />

        <AdvanceRequestCard onSuccess={handleAdvanceRequested} />

        <AdvanceHistoryList
          key={refreshKey}
          onStatusChanged={handleAdvanceStatusChanged}
        />
      </div>
    </div>
  );
}
