'use client';

import { useState, useEffect } from 'react';

export function PortfolioSummaryCard() {
  const [totalInvested, setTotalInvested] = useState(0);
  const [monthlyYield, setMonthlyYield] = useState(0);
  const [activeECTokens, setActiveECTokens] = useState(0);
  const [totalClaimableNow, setTotalClaimableNow] = useState(0);
  const [atRiskCount, setAtRiskCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      setIsLoading(true);
      try {
        // TODO: Implement Web3 call to get portfolio data
        // const tokenIds = await contract.getOwnedECTokens(usurerAddress);
        // const portfolioData = await Promise.all(
        //   tokenIds.map(id => contract.getECToken(id))
        // );

        // Mock data for demo
        const mockData = {
          totalInvested: 3500,
          monthlyYield: 87.5,
          activeECTokens: 2,
          totalClaimableNow: 245.5,
          atRiskCount: 1,
        };

        setTimeout(() => {
          setTotalInvested(mockData.totalInvested);
          setMonthlyYield(mockData.monthlyYield);
          setActiveECTokens(mockData.activeECTokens);
          setTotalClaimableNow(mockData.totalClaimableNow);
          setAtRiskCount(mockData.atRiskCount);
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
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
          <p className="text-sm text-gray-600">Active EC Tokens</p>
          <p className="text-2xl font-bold text-gray-900">{activeECTokens}</p>
        </div>

        <div>
          <p className="text-sm text-gray-600">Total Claimable Now</p>
          <p className="text-2xl font-bold text-blue-600">
            {totalClaimableNow.toFixed(2)} USDC
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-600">At Risk</p>
          <p
            className={`text-2xl font-bold ${
              atRiskCount > 0 ? 'text-red-600' : 'text-gray-900'
            }`}
          >
            {atRiskCount}
          </p>
        </div>
      </div>
    </div>
  );
}
