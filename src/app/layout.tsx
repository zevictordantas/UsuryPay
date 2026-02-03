import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

import { ServerProviders } from '@/app/components/Providers/Providers.server';
import { Header } from './components/Header/Header';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Usury Pay',
  description: 'Payroll dApp with credit line',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ServerProviders>
        <body
          className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
        >
          <Header />
          <main className="flex flex-1 bg-zinc-100">{children}</main>
          <div className="w-full shrink-0 bg-black py-2 text-center text-white">
            Footer (ToDo)
          </div>
        </body>
      </ServerProviders>
    </html>
  );
}
