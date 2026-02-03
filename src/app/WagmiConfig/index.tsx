import { createStorage, cookieStorage } from 'wagmi';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { arcTestnet } from '@reown/appkit/networks';

/**
 * This is mostly a copy of https://docs.reown.com/appkit/next/core/installation
 */

// Get projectId from https://dashboard.reown.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) {
  throw new Error('Project ID is not defined');
}

export const networks = [arcTestnet];

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true, // AppKit doesn’t fully support the ssr flag. (as stated in docs)
  projectId,
  networks,
});

export const config = wagmiAdapter.wagmiConfig;
