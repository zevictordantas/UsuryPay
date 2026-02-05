/**
 * Core TypeScript interfaces for Expected Cashflow (EC) primitive
 * Based on docs/Primitive.md specification
 */

export interface ECToken {
  tokenId: string;
  vaultAddress: string;
  totalAmount: number;
  startTime: number;
  endTime: number;
  ratePerSecond: number;
  claimed: number;
  owner: string;
  creditScore: number;
}

export interface ECTokenSaleOffer {
  tokenId: string;
  futureValue: number;
  offerAmount: number;
  discountPercent: number;
  expiresAt: number;
  creditScore: number;
}

export interface ECVault {
  address: string;
  balance: number;
  requiredEscrow: number;
  creditScore: number;
  defaultHistory: DefaultEvent[];
}

export interface DefaultEvent {
  timestamp: number;
  shortfall: number;
}

export type ECTokenStatus = 'Owned' | 'Sold to PayrollDApp' | 'Fully Claimed';
