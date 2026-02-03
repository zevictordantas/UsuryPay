'use client';

import { wagmiAdapter, projectId } from '@/app/WagmiConfig';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createAppKit } from '@reown/appkit/react';
import { arcTestnet } from '@reown/appkit/networks'; // @TODO change this (use env variables to divide dev from prod)
import React, { type ReactNode } from 'react';
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi';

/**
 * This is mostly a copy of https://docs.reown.com/appkit/next/core/installation
 *
 * AppKit provider includes
 *   WagmiProvider
 *   QueryClientProvider
 */

// Set up queryClient
const queryClient = new QueryClient();

if (!projectId) {
  throw new Error('Project ID is not defined');
}

// Set up metadata
const metadata = {
  name: 'Usury Pay',
  description: 'Crypto Payroll dp with credit lines !',
  url: 'http://localhost:3000/', // @TODO change this
  icons: ['https://avatars.githubusercontent.com/u/179229932'], // @TODO change this
};

// Create the modal
const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [arcTestnet],
  defaultNetwork: arcTestnet,
  metadata: metadata,
  features: {
    analytics: false, // Optional - defaults to your Cloud configuration
    connectMethodsOrder: [/* "social", "email",*/ 'wallet'],
  },
  allowUnsupportedChain: false,
  enableReconnect: true,
});

export function AppKitProvider({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies: string | null;
}) {
  const initialState = cookieToInitialState(
    wagmiAdapter.wagmiConfig as Config,
    cookies
  );

  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig as Config}
      initialState={initialState}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
