import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Usury Pay",
  description: "Payroll dApp with credit line",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <div className="bg-black text-white w-full text-center py-2 sticky top-0 shrink-0">Header (ToDo)</div>
        <main className="flex-1 flex">
        {children}
        </main>
        <div className="bg-black text-white w-full text-center py-2 shrink-0">Footer (ToDo)</div>
      </body>
    </html>
  );
}
