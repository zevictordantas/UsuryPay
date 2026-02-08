'use client';

import { AppKitButton } from './AppKitButton';
import Monopoly from '@/app/assets/Monopoly.jpg';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Header() {
  const pathname = usePathname();

  const getHeaderTitle = () => {
    // Usury Protocol - homepage and presentation
    if (pathname === '/' || pathname === '/presentation') {
      return 'Usury Protocol';
    }
    // Usury Market - marketplace, usurer, and marketplace-related views
    if (
      pathname?.startsWith('/marketplace') ||
      pathname?.startsWith('/usurer')
    ) {
      return 'Usury Market';
    }
    // Usury Pay - employer and employee views
    if (pathname?.startsWith('/employer') || pathname?.startsWith('/employee')) {
      return 'Usury Pay';
    }
    // Default fallback
    return 'Usury Protocol';
  };

  return (
    <nav className="sticky top-0 w-full shrink-0 bg-black py-2 text-center text-white">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between">
        <Link href="/" className="hover:opacity-85">
          <h3 className="text-2xl font-bold">
            <Image
              className="mr-2 inline-block invert-100"
              src={Monopoly}
              alt=""
              width={40}
              priority
            />
            {getHeaderTitle()}
          </h3>
        </Link>
        <AppKitButton />
      </div>
    </nav>
  );
}
