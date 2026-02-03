import { AppKitButton } from './AppKitButton';
import Monopoly from '@/app/assets/Monopoly.jpg';
import Image from 'next/image';
import Link from 'next/link';

export function Header() {
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
            Usury Pay
          </h3>
        </Link>
        <AppKitButton />
      </div>
    </nav>
  );
}
