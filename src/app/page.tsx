import Image from 'next/image';
import Monopoly from '@/app/assets/Monopoly.jpg';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      {/* Hero Section */}
      <div className="mx-auto flex max-w-3xl items-center justify-center gap-2 py-6 text-center">
        <Image
          className="mx-auto rounded-full shadow-lg"
          src={Monopoly}
          alt="Usury Pay"
          width={200}
          priority
        />

        <div className="flex w-max flex-col rounded-2xl border border-zinc-200 bg-white p-4 shadow-lg transition-shadow hover:shadow-xl">
          {/* Dictionary Definition */}
          <div className="text-left">
            <h1 className="text-2xl font-bold text-zinc-900 italic">
              Usury
              <span className="ml-2 text-lg font-normal text-zinc-500">
                (noun) | u·su·ry | /ˈyo͞oZH(ə)rē/
              </span>
            </h1>
            <p className="mt-3 border-l-4 border-zinc-900 pl-4 text-sm text-zinc-700 italic">
              The activity of lending someone money with the agreement that they
              will pay back a very much larger amount of money later.
            </p>
          </div>
          <hr className="my-3 border-zinc-300" />
          <p className="text-sm leading-relaxed text-zinc-700">
            Tokenized{' '}
            <span className="group relative inline-block cursor-help font-semibold text-black underline decoration-dotted">
              Expected Cashflows
              <span className="pointer-events-none absolute left-full ml-2 w-max rounded bg-zinc-900 px-2 py-1 text-xs text-white opacity-0 shadow transition-opacity group-hover:opacity-100">
                Future payment streams like salaries, rent, or subscriptions.{' '}
                <br />
                With an associated risk and posibility of default.
              </span>
            </span>{' '}
            (EC) enables future cash flow holders to receive instant liquidity
            and rewards &quot;usurers&quot; for assuming the risk.
            <Link
              href="#"
              className="ml-2 rounded bg-zinc-900 px-2 py-0.5 text-white transition-colors hover:bg-zinc-700"
            >
              Learn More
            </Link>
          </p>
        </div>
      </div>

      {/* Main Sections */}
      <div className="mx-auto w-full max-w-3xl flex-1 space-y-8">
        {/* UsuryMarket Section */}
        <div className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-8 shadow-lg transition-shadow hover:shadow-xl">
          <div className="flex-1">
            <h2 className="mb-4 flex items-center text-3xl font-bold text-zinc-900">
              <span>UsuryMarket </span>
              <span className="ml-1 text-xl font-light text-zinc-500">
                — A place to speculate and become a Usurer!
              </span>
            </h2>
            <ul className="mb-8 space-y-1 text-zinc-700">
              <li className="text-zinc-700">
                ✅ Trade EC tokens from any{' '}
                <span className="group relative inline-block cursor-help font-semibold text-black underline decoration-dotted">
                  implementation
                  <span className="pointer-events-none absolute left-full ml-2 w-max rounded bg-zinc-900 px-2 py-1 text-xs text-white opacity-0 shadow transition-opacity group-hover:opacity-100">
                    Like the ones from UsuryPay 👀
                  </span>
                </span>
              </li>
              <li className="text-zinc-700">
                ✅ View token details and default history
              </li>
              <li className="text-zinc-700">
                ✅ A market for cashflow speculation
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              className="flex-1 rounded-lg bg-zinc-900 px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-zinc-700"
              href="/marketplace"
            >
              📈 Browse the Marketplace
            </Link>
            <Link
              className="flex-1 rounded-lg border border-zinc-900 px-6 py-3 text-center font-semibold transition-colors hover:bg-zinc-200"
              href="/usurer"
            >
              I&apos;m a Usurer 🎩{' '}
              <span className="font-light text-zinc-500">
                - Let me see my usury.
              </span>
            </Link>
          </div>
        </div>

        {/* UsuryPay Section */}
        <div className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-8 shadow-lg transition-shadow hover:shadow-xl">
          <div className="flex-1">
            <h2 className="mb-4 flex items-center text-3xl font-bold text-zinc-900">
              <span>UsuryPay </span>
              <span className="ml-1 text-xl font-light text-zinc-500">
                — Your payroll solution to benefit from Usury!
              </span>
            </h2>
            <ul className="mb-8 space-y-1 text-zinc-700">
              <li className="text-zinc-700">
                ✅ Employer deposits in a single treasury, all employees can
                withdraw payment from it.
              </li>
              <li className="text-zinc-700">
                ✅ Employees can be payed in advanced without the employer
                having to paying up front !
              </li>
              <li className="text-zinc-700">
                ✅ Expected Cashflow is now tokenized, trade it{' '}
                <span className="group relative inline-block cursor-help font-semibold text-black underline decoration-dotted">
                  anywhere !
                  <span className="pointer-events-none absolute left-full ml-2 w-max rounded bg-zinc-900 px-2 py-1 text-xs text-white opacity-0 shadow transition-opacity group-hover:opacity-100">
                    UsuryMarket seems like a good place 👀
                  </span>
                </span>
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              className="flex-1 rounded-lg bg-zinc-900 px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-zinc-700"
              href="/employer"
            >
              I&apos;m an Employer 💸
            </Link>
            <Link
              className="flex-1 rounded-lg border border-zinc-900 px-6 py-3 text-center font-semibold transition-colors hover:bg-zinc-200"
              href="/employee"
            >
              I&apos;m an Employee 💳
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
