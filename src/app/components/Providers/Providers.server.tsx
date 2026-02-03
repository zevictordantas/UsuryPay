import { ReactNode } from 'react';
import { AppKitProvider } from './AppKitProvider.client';
import { headers } from 'next/headers';

/**
 * Currently we don't have Providers.client.tsx
 * When we do we will also create Provider.tsx (to export both)
 * Use as little logic here as possible
 */

export async function ServerProviders({ children }: { children: ReactNode }) {
  const headersObj = await headers();
  const cookies = headersObj.get('cookie');
  return <AppKitProvider cookies={cookies}>{children}</AppKitProvider>;
}
