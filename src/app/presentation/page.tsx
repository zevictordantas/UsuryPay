'use client';
import { useEffect, useRef } from 'react';
import Reveal from 'reveal.js';
import './reveal-fix.css';
import 'reveal.js/dist/reveal.css';
import 'reveal.js/dist/theme/simple.css';

export default function PresentationPage() {
  const deckDivRef = useRef<HTMLDivElement>(null); // reference to deck container div
  const deckRef = useRef<Reveal.Api | null>(null); // reference to deck reveal instance

  useEffect(() => {
    // Prevents double initialization in strict mode
    if (deckRef.current) return;

    deckRef.current = new Reveal(deckDivRef.current!, {
      transition: 'slide',
      controlsTutorial: true,
      controlsLayout: 'edges',
    });

    deckRef.current.initialize().then(() => {
      // good place for event handlers and plugin setups
    });

    return () => {
      try {
        if (deckRef.current) {
          deckRef.current.destroy();
          deckRef.current = null;
        }
      } catch (e) {
        console.warn('Reveal.js destroy call failed.');
      }
    };
  }, []);

  return (
    <div className="reveal transition-all" ref={deckDivRef}>
      <div className="slides">
        {/* ── Title ── */}
        <section>
          <h2 className="font-semibold!">Usury Protocol</h2>
          <p className="text-xl opacity-75">
            A DeFi Primitive for Expected Cashflows
          </p>
        </section>

        {/* ── The Primitive ── */}
        <section>
          <h4 className="font-semibold!">
            The Primitive consist of two components:
          </h4>
          <ul className="mt-6 text-left text-xl!">
            <li className="mt-3">
              💰 <strong>ECVault:</strong> Where the <b>payer</b> deposits
              funds. It tracks defaults & solvency
            </li>
            <li className="mt-3">
              💸 <strong>ECToken (ERC-1155):</strong> Represents entitlement to
              claim future payments from the vault.
            </li>
          </ul>
          <p className="mt-8 text-sm opacity-50">
            <em>
              Yield is not guaranteed, the primitive carry default risk — and
              that&apos;s the point.
            </em>
            <br />
            <br />
            Solvent vaults represnet creditworthyness. 🏦
            <br />
            Risky EC Tokens can be bought at great discounts. 🤑
          </p>
        </section>

        {/* ── Default Risk = Incentive Engine ── */}
        <section>
          <section>
            <h3 className="font-semibold!">Risk of Default is the Feature</h3>
            <p className="mt-4 text-xl!">
              Because default exists, both sides are{' '}
              <strong>
                incentivized to operate on-chain to minimize trust.
              </strong>
            </p>
            <p className="mt-8 text-sm italic opacity-50">
              (the economy of the future is on-chain)
            </p>
            <p className="mt-2 text-5xl font-bold opacity-60">👇</p>
          </section>
          <section>
            <h4 className="text-xl font-semibold!">
              Payers want to be trusted
            </h4>
            <ul className="mt-4 text-left text-base">
              <li className="mt-3">
                If a payer&apos;s vault has <b>defaults</b>, their EC tokens
                become <b>worthless</b>
              </li>
              <li className="mt-3">
                Nobody will buy tokens from unreliable vaults
              </li>
              <li className="mt-3">
                Payers trustworthiness is now a valuable asset.
              </li>
              <li className="mt-3">
                Payers with predictable future cashflow can access present
                liquidity to increase future returns
              </li>
            </ul>
          </section>
          <section>
            <h4 className="text-xl font-semibold!">
              Investors need to assess risk
            </h4>
            <ul className="mt-4 text-left text-base">
              <li className="mt-3">
                High risk = high discount = high potential return
              </li>
              <li className="mt-3">Low risk = low discount = safer bet</li>
              <li className="mt-3">
                On-chain data is <strong>verifiable and trustless</strong>
              </li>
            </ul>
          </section>
          <section>
            <p className="text-base! opacity-50">
              Both actors incentives converge:
            </p>
            <p className="font-semibold">
              Investors value reputation,
              <br />
              Payers benefit from it.
            </p>
            <ul className="mt-6 text-base">
              <li className="mt-2">
                Credit scores{' '}
                <span className="italic opacity-50">— on-chain </span>
              </li>
              <li className="mt-2">
                Default registries{' '}
                <span className="italic opacity-50">— on-chain </span>
              </li>
              <li className="mt-2">
                Funding history{' '}
                <span className="italic opacity-50">— on-chain </span>
              </li>
            </ul>
            <p className="mt-6 text-sm italic opacity-50">
              Makes them verifiable & composable.
            </p>
          </section>
        </section>

        <section>
          {/* ── Market Fit ── */}
          <section>
            <h3 className="font-semibold!">Market Fit</h3>
            <p className="mt-4 text-base italic opacity-50">
              Any recurring and predictable payment:
            </p>
            <ul className="mt-6 text-base">
              <li className="mt-2">Employees seeking salary advances</li>
              <li className="mt-2">Landlords tokenizing rental income</li>
              <li className="mt-2">
                SaaS companies with subscription revenues
              </li>
              <li className="mt-2">B2B businesses with invoices/receivables</li>
              <li className="mt-2">Shareholders with dividend streams</li>
              <li className="mt-2">Consumers with installment payments</li>
            </ul>
            <p className="mt-6 text-sm opacity-50">
              <em>
                Each market uses the same primitive — just different ECVault
                implementations.
              </em>
            </p>
          </section>
          {/* ── Crypto Landscape ── */}
          <section>
            <h3 className="font-semibold!">Crypto Landscape</h3>
            <ul className="mt-4 text-left text-base">
              <li className="mt-3">
                <strong>Pendle</strong> — Yield trading with <em>guaranteed</em>{' '}
                returns (aTokens, stETH). No default risk.
              </li>
              <li className="mt-3">
                <strong>Aave & Morpho</strong> — Overcollateralized lending
                protocols. No default risk for lenders (liquidations protect
                capital).
              </li>
              <li className="mt-3">
                <strong>Goldfinch</strong> — Undercollateralized lending for
                real-world credit. Permissioned borrowers, governance-driven.
              </li>
              <li className="mt-3">
                <strong>Maple Finance</strong> — Undercollateralized lending
                with credit delegation. Governance-heavy, permissioned pools.
              </li>
              <li className="mt-3">
                <strong>3Jane</strong> — Money market for expected cashflows.
                Similar concept but aggregated liquidity pool reduces
                transparency and market efficiency for risk pricing.
              </li>
              <li className="mt-3">
                <strong>Levenue-Loom</strong> — Revenue-based financing
                (whitepaper). Similar concept but focused on business revenue
                streams and a different implementation.
              </li>
            </ul>
            <p className="mt-6 text-lg opacity-70">
              <em>
                Usury Protocol is permissionless, composable and enables
                transparent risk pricing.
              </em>
            </p>
          </section>
        </section>

        {/* ── Payroll & Marketplace ── */}
        <section>
          <p className="mt-4 text-base opacity-50">Our hackathon demo:</p>
          <h3 className="font-semibold!">Usury Pay & Usury Market</h3>
          <p className="mt-4 text-xl">
            <strong>Usury Pay:</strong>
            <br />A Payroll dApp that gives <i>you</i> the benefit of usury
          </p>
          <p className="mt-2! mb-1! text-base opacity-75">
            Provide instant liquidity to employees buying their EC Tokens
            (unlike other platforms)
          </p>
          <p className="my-1! text-base opacity-75">
            Bought EC Tokens accrue value over time making the business
            profitable
          </p>
          <p className="my-1! text-base opacity-75">
            Selling tokens to investors is also profitable: Keeps the app
            treasury with liquidity and mitigates risk
          </p>

          <p className="mt-4 text-xl">
            <strong>Usury Market:</strong>
            <br />A Marketplace that makes usury accessible <i>for everyone</i>
          </p>
          <p className="mt-3! mb-1! text-base opacity-75">
            Market signals how interest-rate should adjust
          </p>
          <p className="my-1! text-base opacity-75">
            Supply and demand discover real risk pricing
          </p>
          <p className="my-1! text-base opacity-75">
            P2P trading offers transparency and better offers
          </p>
        </section>
      </div>
    </div>
  );
}
