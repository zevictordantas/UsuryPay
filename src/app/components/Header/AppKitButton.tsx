'use client';
import {
  AppKitButton as AppKitButtonOriginal,
  useAppKit,
} from '@reown/appkit/react';
import { useConnection } from 'wagmi';

export function AppKitButton() {
  const { open } = useAppKit();
  const { isConnected } = useConnection();

  if (isConnected) return <AppKitButtonOriginal />;

  return (
    <>
      <button
        className="font-lg rounded-md bg-white px-3 py-2 font-semibold text-black hover:bg-zinc-200"
        onClick={() => open()}
      >
        Connect Wallet
      </button>
    </>
  );
}
