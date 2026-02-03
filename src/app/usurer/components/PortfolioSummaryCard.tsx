'use client';

import { useState, useEffect } from 'react';

export function PortfolioSummaryCard() {
  const [totalInvested, setTotalInvested] = useState(0);
  const [monthlyYield, setMonthlyYield] = useState(0);
  const [activeRBNs, setActiveRBNs] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      setIsLoading(true);
      try {
        // TODO: Implement Web3 call to get portfolio data
        // const rbnIds = await contract.getOwnedRBNs(investorAddress);
        // const portfolioData = await Promise.all(
        //   rbnIds.map(id => contract.getRBN(id))
        // );

        // Mock data for demo
        const mockData = {
          totalInvested: 3500,
          monthlyYield: 87.5,
          activeRBNs: 2,
        };

        setTimeout(() => {
          setTotalInvested(mockData.totalInvested);
          setMonthlyYield(mockData.monthlyYield);
          setActiveRBNs(mockData.activeRBNs);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Failed to fetch portfolio data:', error);
        setIsLoading(false);
      }
    };

    fetchPortfolioData();
  }, []);

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Portfolio Summary
        </h2>
        <div className="py-8 text-center">
          <p className="text-gray-500">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">
        Portfolio Summary
      </h2>

      <div className="grid gap-6 md:grid-cols-3">
        <div>
          <p className="text-sm text-gray-600">Total Invested</p>
          <p className="text-2xl font-bold text-gray-900">
            {totalInvested.toFixed(2)} USDC
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-600">Monthly Yield</p>
          <p className="text-2xl font-bold text-green-600">
            {monthlyYield.toFixed(2)} USDC
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-600">Active RBNs</p>
          <p className="text-2xl font-bold text-gray-900">{activeRBNs}</p>
        </div>
      </div>
    </div>
  );
}
