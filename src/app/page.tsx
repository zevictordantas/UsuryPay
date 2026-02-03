import Image from 'next/image';
import Monopoly from '@/app/assets/Monopoly.jpg';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center">
      <Image
        className="mx-auto rounded-full shadow-md"
        src={Monopoly}
        alt="Usury Pay"
        width={300}
        priority
      />

      <h1 className="text-6xl font-bold">Usury Pay</h1>
      <p className="mt-8 text-zinc-600">
        Making usury accessible to everyone. <br />
        Payroll dApp with credit lines and Open Usury
      </p>
      <div className="my-8 flex items-center gap-4">
        <Link
          className="rounded-lg bg-black px-3 py-2 font-semibold text-white hover:bg-zinc-800"
          href="/usurer"
        >
          {' '}
          I&apos;m a Usurer 🎩
        </Link>
        <Link
          className="rounded-lg bg-black px-3 py-2 font-semibold text-white hover:bg-zinc-800"
          href="/employer"
        >
          {' '}
          I&apos;m an Employer 💸
        </Link>
        <Link
          className="rounded-lg bg-black px-3 py-2 font-semibold text-white hover:bg-zinc-800"
          href="/employee"
        >
          {' '}
          I&apos;m an Employee 💳
        </Link>
      </div>
    </div>
  );
}
