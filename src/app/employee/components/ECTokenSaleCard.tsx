'use client';

import { useState, useEffect } from 'react';
import { ECToken, ECTokenSaleOffer } from '@/app/types/ec-types';

interface ECTokenSaleCardProps {
  onSuccess?: () => void;
}

export function ECTokenSaleCard({ onSuccess }: ECTokenSaleCardProps) {
  const [selectedTokenId, setSelectedTokenId] = useState('');
  const [ownedTokens, setOwnedTokens] = useState<ECToken[]>([]);
  const [currentOffer, setCurrentOffer] = useState<ECTokenSaleOffer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTokens, setIsLoadingTokens] = useState(true);
  const [isRequestingQuote, setIsRequestingQuote] = useState(false);

  useEffect(() => {
    const fetchOwnedTokens = async () => {
      setIsLoadingTokens(true);
      try {
        // TODO: Implement Web3 call to fetch owned EC tokens
        // const tokens = await contract.getOwnedTokens(employeeAddress);

        // Mock data: Employee-owned EC tokens
        const mockTokens: ECToken[] = [
          {
            tokenId: '0x1a2b3c4d5e6f',
            vaultAddress: '0xEmployerVault001',
            totalAmount: 3000,
            startTime: Date.now() / 1000 - 86400 * 7, // 7 days ago
            endTime: Date.now() / 1000 + 86400 * 23, // 23 days from now
            ratePerSecond: 3000 / (86400 * 30),
            claimed: 700,
            owner: '0xEmployee',
            creditScore: 85,
          },
          {
            tokenId: '0x7g8h9i0j1k2l',
            vaultAddress: '0xEmployerVault001',
            totalAmount: 2000,
            startTime: Date.now() / 1000 - 86400 * 14,
            endTime: Date.now() / 1000 + 86400 * 16,
            ratePerSecond: 2000 / (86400 * 30),
            claimed: 933,
            owner: '0xEmployee',
            creditScore: 85,
          },
        ];

        setTimeout(() => {
          setOwnedTokens(mockTokens);
          setIsLoadingTokens(false);
        }, 500);
      } catch (error) {
        console.error('Failed to fetch owned EC tokens:', error);
        setIsLoadingTokens(false);
      }
    };

    fetchOwnedTokens();
  }, []);

  const selectedToken = ownedTokens.find(t => t.tokenId === selectedTokenId);

  const calculateClaimable = (token: ECToken) => {
    const now = Date.now() / 1000;
    const elapsed = Math.min(now - token.startTime, token.endTime - token.startTime);
    const accrued = elapsed * token.ratePerSecond;
    return Math.max(0, accrued - token.claimed);
  };

  const handleRequestQuote = async () => {
    if (!selectedToken) return;

    setIsRequestingQuote(true);
    try {
      // TODO: Implement Web3 call to request quote from PayrollDApp
      // const offer = await payrollDAppContract.requestQuote(selectedTokenId);

      const claimable = calculateClaimable(selectedToken);
      const futureValue = selectedToken.totalAmount - selectedToken.claimed;

      // Mock offer: PayrollDApp offers based on credit score and remaining value
      const discountPercent = selectedToken.creditScore >= 80 ? 8 : 12;
      const offerAmount = futureValue * (1 - discountPercent / 100);

      const mockOffer: ECTokenSaleOffer = {
        tokenId: selectedToken.tokenId,
        futureValue,
        offerAmount,
        discountPercent,
        expiresAt: Date.now() / 1000 + 300, // 5 minutes
        creditScore: selectedToken.creditScore,
      };

      setTimeout(() => {
        setCurrentOffer(mockOffer);
        setIsRequestingQuote(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to request quote:', error);
      setIsRequestingQuote(false);
    }
  };

  const handleAcceptOffer = async () => {
    if (!currentOffer) return;

    setIsLoading(true);
    try {
      // TODO: Implement atomic swap
      // 1. Employee approves EC token transfer
      // 2. PayrollDApp executes swap (EC token IN, USDC OUT)
      // await ecTokenContract.approve(payrollDAppAddress, currentOffer.tokenId);
      // await payrollDAppContract.executeSwap(currentOffer.tokenId, currentOffer.offerAmount);

      console.log('Executing swap:', currentOffer);

      setSelectedTokenId('');
      setCurrentOffer(null);
      onSuccess?.();
    } catch (error) {
      console.error('Token sale failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTokenId = (tokenId: string) => {
    return `${tokenId.slice(0, 6)}...${tokenId.slice(-4)}`;
  };

  const getCreditScoreLabel = (score: number) => {
    if (score >= 80) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Poor';
  };

  const getOfferExpirationSeconds = () => {
    if (!currentOffer) return 0;
    return Math.max(0, Math.floor(currentOffer.expiresAt - Date.now() / 1000));
  };

  if (isLoadingTokens) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Sell EC Token
        </h2>
        <div className="py-8 text-center">
          <p className="text-gray-500">Loading your EC tokens...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">
        Sell EC Token
      </h2>

      {ownedTokens.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-gray-500">You don't own any EC tokens yet</p>
          <p className="mt-2 text-sm text-gray-400">
            EC tokens are minted by your employer when they set up payroll
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Select EC Token to Sell
            </label>
            <select
              value={selectedTokenId}
              onChange={(e) => {
                setSelectedTokenId(e.target.value);
                setCurrentOffer(null);
              }}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-black focus:ring-1 focus:ring-black focus:outline-none"
              disabled={isLoading || isRequestingQuote}
            >
              <option value="">Choose a token...</option>
              {ownedTokens.map((token) => {
                const claimable = calculateClaimable(token);
                const remaining = token.totalAmount - token.claimed;
                return (
                  <option key={token.tokenId} value={token.tokenId}>
                    {formatTokenId(token.tokenId)} - ${remaining.toFixed(2)} remaining (${claimable.toFixed(2)} claimable now)
                  </option>
                );
              })}
            </select>
          </div>

          {selectedToken && !currentOffer && (
            <>
              <div className="rounded-md bg-gray-50 p-4">
                <h4 className="text-sm font-medium text-gray-900">Token Details</h4>
                <div className="mt-2 space-y-1 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span>Token ID:</span>
                    <span className="font-mono">{formatTokenId(selectedToken.tokenId)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Amount:</span>
                    <span className="font-medium">${selectedToken.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Already Claimed:</span>
                    <span>${selectedToken.claimed.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Remaining Value:</span>
                    <span className="font-medium text-green-600">
                      ${(selectedToken.totalAmount - selectedToken.claimed).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Employer Credit Score:</span>
                    <span className={`font-medium ${selectedToken.creditScore >= 80 ? 'text-green-600' : selectedToken.creditScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {selectedToken.creditScore} ({getCreditScoreLabel(selectedToken.creditScore)})
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleRequestQuote}
                disabled={isRequestingQuote}
                className="w-full rounded-md bg-black px-4 py-2 font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {isRequestingQuote ? 'Requesting Quote...' : 'Request Quote from PayrollDApp'}
              </button>
            </>
          )}

          {currentOffer && (
            <>
              <div className="rounded-md border-2 border-green-500 bg-green-50 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="text-sm font-medium text-green-900">Offer from PayrollDApp</h4>
                  <span className="text-xs text-green-700">
                    Expires in {getOfferExpirationSeconds()}s
                  </span>
                </div>
                <div className="mb-3 rounded-md bg-white p-3">
                  <p className="text-center text-lg font-bold text-gray-900">
                    Sell ${currentOffer.futureValue.toFixed(2)} EC Token
                  </p>
                  <p className="text-center text-2xl font-bold text-green-600">
                    for ${currentOffer.offerAmount.toFixed(2)} USDC
                  </p>
                  <p className="mt-1 text-center text-sm text-gray-600">
                    ({currentOffer.discountPercent}% discount)
                  </p>
                </div>
                <div className="space-y-1 text-sm text-green-800">
                  <div className="flex justify-between">
                    <span>Future cashflow value:</span>
                    <span className="font-medium">${currentOffer.futureValue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount calculation:</span>
                    <span className="font-medium">-${(currentOffer.futureValue - currentOffer.offerAmount).toFixed(2)} ({currentOffer.discountPercent}%)</span>
                  </div>
                  <div className="flex justify-between border-t border-green-300 pt-1">
                    <span className="font-medium">You receive (USDC):</span>
                    <span className="font-bold text-green-600">${currentOffer.offerAmount.toFixed(2)}</span>
                  </div>
                  <div className="mt-2 flex justify-between">
                    <span>Employer Score:</span>
                    <span className="font-medium">
                      {currentOffer.creditScore} ({getCreditScoreLabel(currentOffer.creditScore)})
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-md bg-blue-50 p-4">
                <h4 className="text-sm font-medium text-blue-900">Transaction Details</h4>
                <ul className="mt-2 space-y-1 text-sm text-blue-700">
                  <li>• This is an ASSET SALE, not a loan</li>
                  <li>• EC token transfers to PayrollDApp immediately</li>
                  <li>• USDC transfers to you immediately (atomic swap)</li>
                  <li>• PayrollDApp assumes all default risk</li>
                  <li>• You have no future obligation</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentOffer(null)}
                  disabled={isLoading}
                  className="w-1/3 rounded-md border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Decline
                </button>
                <button
                  onClick={handleAcceptOffer}
                  disabled={isLoading}
                  className="w-2/3 rounded-md bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  {isLoading ? 'Executing Swap...' : 'Accept Offer - Sell Token'}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
