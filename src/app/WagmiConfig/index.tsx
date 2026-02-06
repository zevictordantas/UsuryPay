import { createStorage, cookieStorage } from 'wagmi';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { anvil, arcTestnet, sepolia, type AppKitNetwork } from '@reown/appkit/networks';

/**
 * This is mostly a copy of https://docs.reown.com/appkit/next/core/installation
 */

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) {
  throw new Error('Project ID is not defined');
}

const ENV = process.env.NEXT_PUBLIC_ENV ?? 'dev';

const CHAIN_MAP: Record<string, AppKitNetwork> = {
  anvil,
  sepolia,
  arcTestnet,
};

function parseChains(envValue: string | undefined) {
  if (!envValue) return null;
  const names = envValue
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean);
  const networks = names
    .map((name) => CHAIN_MAP[name])
    .filter(Boolean) as AppKitNetwork[];
  return networks.length > 0 ? networks : null;
}

const ENV_NETWORKS: Record<string, AppKitNetwork[]> = {
  dev: parseChains(process.env.NEXT_PUBLIC_DEV_CHAINS) ?? [anvil],
  stage: parseChains(process.env.NEXT_PUBLIC_STAGE_CHAINS) ?? [sepolia],
  prod: parseChains(process.env.NEXT_PUBLIC_PROD_CHAINS) ?? [arcTestnet],
};

export const networks = ENV_NETWORKS[ENV] ?? [anvil];
export const defaultNetwork = networks[0];

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
