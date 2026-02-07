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
    // Your presentation is sized based on the width and height of
    // our parent element. Make sure the parent is not 0-height.
    <div className="reveal transition-all" ref={deckDivRef}>
      <div className="slides">
        <section>
          <h3 className="font-semibold!">Expected Cashflow Primitive</h3>
          <p className="text-base opacity-75">- ECTokens & ECVaults -</p>
        </section>
        <section>
          <h3 className="text-lg"> We explain a point </h3>
          <p className="text-base">
            And we can show an iFrame of the actuall app !
          </p>
          <iframe
            className="mx-auto"
            width={900}
            height={500}
            src="/employee"
          />
        </section>

        <section>
          {/* <h1>Second slide</h1>
              <p>This has multiple nested slides</p>
              */}
          <section>down 1</section>
          <section>down 2</section>
          <section>down 3</section>
        </section>
      </div>
    </div>
  );
}
