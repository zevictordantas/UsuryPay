import { createStorage, cookieStorage } from 'wagmi';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import {
  anvil,
  mainnet,
  sepolia,
  type AppKitNetwork,
} from '@reown/appkit/networks';

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
if (!projectId) throw new Error('Project ID is not defined');

const ENV = (process.env.NEXT_PUBLIC_ENV ?? 'dev').toLowerCase();

export const networks: [AppKitNetwork, ...AppKitNetwork[]] =
  ENV === 'prod' ? [sepolia, mainnet] : [anvil, mainnet, sepolia];

export const defaultNetwork = networks[0];

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({ storage: cookieStorage }),
  ssr: true,
  projectId,
  networks,
});

export const config = wagmiAdapter.wagmiConfig;
