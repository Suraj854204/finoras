'use client';

import { useMemo, useState, type CSSProperties } from 'react';

type SliderStyle = CSSProperties & {
  '--fill'?: string;
};

type Step = {
  no: string;
  text: string;
};

/* =========================================
   EMI CALCULATION
========================================= */

function emi(
  p: number,
  r: number,
  n: number
): number {
  if (!p || !n) return 0;

  // 0% interest
  if (!r) {
    return p / n;
  }

  const m = r / 1200;

  return (
    (p * m * Math.pow(1 + m, n)) /
    (Math.pow(1 + m, n) - 1)
  );
}

/* =========================================
   CONSTANTS
========================================= */

const PRICE_MIN = 10000;
const PRICE_MAX = 200000;
const PRICE_STEP = 1000;

const RATE_MIN = 0;
const RATE_MAX = 24;
const RATE_STEP = 0.5;

const TENURE_MIN = 3;
const TENURE_MAX = 48;
const TENURE_STEP = 3;

/* =========================================
   HELPERS
========================================= */

function pct(
  value: number,
  min: number,
  max: number
): number {
  if (max === min) return 0;

  return ((value - min) / (max - min)) * 100;
}

function inr(n: number): string {
  return `₹${Math.round(n).toLocaleString('en-IN')}`;
}

/* =========================================
   HOW IT WORKS
========================================= */

const STEPS: Step[] = [
  {
    no: '01',
    text: 'Select your smartphone and exact variant.',
  },
  {
    no: '02',
    text: 'Compare transparent EMI plans and cashback.',
  },
  {
    no: '03',
    text: 'Apply digitally and complete KYC.',
  },
  {
    no: '04',
    text: 'Track your application using the generated ID.',
  },
];

/* =========================================
   PAGE
========================================= */

export default function EmiCalculator() {
  const [price, setPrice] = useState<number>(100000);
  const [rate, setRate] = useState<number>(10.5);
  const [tenure, setTenure] = useState<number>(24);

  /* =========================================
     CALCULATIONS
  ========================================= */

  const monthly = useMemo<number>(() => {
    return Math.round(
      emi(price, rate, tenure)
    );
  }, [price, rate, tenure]);

  const total = monthly * tenure;

  const interest = Math.max(
    0,
    total - price
  );

  /* =========================================
     SLIDER FILLS
  ========================================= */

  const priceFill = `${pct(
    price,
    PRICE_MIN,
    PRICE_MAX
  )}%`;

  const rateFill = `${pct(
    rate,
    RATE_MIN,
    RATE_MAX
  )}%`;

  const tenureFill = `${pct(
    tenure,
    TENURE_MIN,
    TENURE_MAX
  )}%`;

  return (
    <main className="ledger">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Petrona:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

        .ledger {
          --stage: #E4DCC5;
          --paper: #F6F1E3;
          --paper-alt: #EFE8D4;
          --ink: #182849;
          --ink-soft: rgba(24,40,73,.62);
          --rule: #C9BB98;
          --debit: #9A3B2C;
          --brass: #8A6A2E;
          --white: #FFFDF7;

          min-height: 100vh;

          font-family: 'IBM Plex Sans', sans-serif;
          color: var(--ink);
          background: var(--stage);

          padding: clamp(20px, 4vw, 56px);

          display: flex;
          justify-content: center;
          align-items: flex-start;
        }

        .ledger * {
          box-sizing: border-box;
        }

        .ledger-card {
          position: relative;

          width: 100%;
          max-width: 880px;

          background: var(--paper);

          padding:
            clamp(28px, 5vw, 52px)
            clamp(24px, 5vw, 56px)
            clamp(32px, 5vw, 56px)
            clamp(52px, 7vw, 76px);

          box-shadow:
            0 1px 0 rgba(24,40,73,.08);
        }

        .perf-rail {
          position: absolute;

          left: 0;
          top: 0;
          bottom: 0;

          width: 26px;

          background-image:
            radial-gradient(
              circle,
              var(--stage) 5px,
              transparent 5.5px
            );

          background-size: 100% 26px;
          background-repeat: repeat-y;
          background-position: center top;
        }

        .folio-tag {
          font-family: 'IBM Plex Mono', monospace;

          font-size: 12.5px;

          color: var(--ink-soft);

          letter-spacing: 0.02em;

          margin-bottom: 18px;
        }

        /* =====================================
           HERO
        ===================================== */

        .hero-row {
          display: grid;

          grid-template-columns:
            minmax(0, 1.3fr)
            auto
            minmax(240px, 1fr);

          align-items: center;

          gap: clamp(20px, 4vw, 36px);

          padding-bottom: 30px;

          border-bottom: 1px solid var(--rule);
        }

        .hero-copy h1 {
          font-family: 'Petrona', serif;

          font-weight: 500;

          font-size:
            clamp(1.7rem, 3.4vw, 2.5rem);

          line-height: 1.18;

          margin: 0 0 14px;

          max-width: 15ch;
        }

        .hero-copy p {
          margin: 0;

          font-size: 15px;

          line-height: 1.6;

          color: var(--ink-soft);

          max-width: 42ch;
        }

        .tear-line {
          width: 1px;

          height: 100%;

          min-height: 120px;

          background-image:
            linear-gradient(
              var(--rule) 60%,
              transparent 0%
            );

          background-size: 2px 10px;

          background-repeat: repeat-y;

          justify-self: center;
        }

        /* =====================================
           MONTHLY EMI STUB
        ===================================== */

        .stub {
          position: relative;

          background: var(--white);

          border: 1px solid var(--rule);

          padding: 20px 22px;

          transform: rotate(-1.6deg);

          animation:
            settle 480ms
            cubic-bezier(.2,.9,.3,1.1)
            both;
        }

        @keyframes settle {
          from {
            transform:
              rotate(-6deg)
              scale(.94);

            opacity: 0;
          }

          to {
            transform:
              rotate(-1.6deg)
              scale(1);

            opacity: 1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .stub {
            animation: none;
          }
        }

        .stub small {
          display: block;

          font-family:
            'IBM Plex Mono',
            monospace;

          font-size: 11px;

          color: var(--ink-soft);

          margin-bottom: 6px;
        }

        .stub strong {
          display: block;

          font-family:
            'IBM Plex Mono',
            monospace;

          font-weight: 600;

          font-size:
            clamp(1.6rem, 3.2vw, 2.1rem);

          font-variant-numeric:
            tabular-nums;

          line-height: 1.1;
        }

        .stub span {
          display: block;

          margin-top: 4px;

          font-size: 12.5px;

          color: var(--ink-soft);
        }

        .stamp {
          position: absolute;

          top: -14px;
          right: -10px;

          width: 64px;
          height: 64px;

          border:
            1.5px dashed
            var(--brass);

          border-radius: 50%;

          color: var(--brass);

          font-family:
            'IBM Plex Mono',
            monospace;

          font-size: 9.5px;

          letter-spacing: 0.05em;

          display: flex;

          align-items: center;
          justify-content: center;

          text-align: center;

          transform: rotate(11deg);

          background: var(--paper);
        }

        /* =====================================
           PANELS
        ===================================== */

        .panels {
          display: grid;

          grid-template-columns:
            1.15fr
            1fr;

          gap: 0;

          margin-top: 8px;
        }

        .panel {
          padding: 30px 0;
        }

        .panel-entries {
          padding-right:
            clamp(20px, 4vw, 40px);

          border-right:
            1px solid var(--rule);
        }

        .panel-steps {
          padding-left:
            clamp(20px, 4vw, 40px);
        }

        /* =====================================
           SLIDER ENTRIES
        ===================================== */

        .entry-row + .entry-row {
          margin-top: 22px;
        }

        .entry-head {
          display: flex;

          justify-content: space-between;

          align-items: baseline;

          font-size: 13.5px;

          margin-bottom: 10px;
        }

        .entry-head b {
          font-weight: 500;

          color: var(--ink);
        }

        .entry-head output {
          font-family:
            'IBM Plex Mono',
            monospace;

          font-variant-numeric:
            tabular-nums;

          color: var(--ink);

          font-size: 13.5px;
        }

        input[type='range'] {
          -webkit-appearance: none;
          appearance: none;

          width: 100%;

          height: 2px;

          border-radius: 0;

          background:
            linear-gradient(
              to right,
              var(--ink) 0%,
              var(--ink) var(--fill, 50%),
              var(--rule) var(--fill, 50%),
              var(--rule) 100%
            );

          cursor: pointer;
        }

        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;

          width: 13px;
          height: 13px;

          border-radius: 50%;

          background: var(--ink);

          border:
            2px solid
            var(--paper);

          box-shadow:
            0 0 0 1px
            var(--ink);

          margin-top: -0.5px;
        }

        input[type='range']::-moz-range-thumb {
          width: 11px;
          height: 11px;

          border:
            2px solid
            var(--paper);

          border-radius: 50%;

          background: var(--ink);

          box-shadow:
            0 0 0 1px
            var(--ink);
        }

        input[type='range']:focus-visible {
          outline:
            2px solid
            var(--brass);

          outline-offset: 4px;
        }

        /* =====================================
           STAT TABLE
        ===================================== */

        .stat-table {
          margin-top: 28px;

          border-top:
            1px solid
            var(--rule);
        }

        .stat-row {
          display: flex;

          justify-content: space-between;

          align-items: center;

          gap: 20px;

          padding: 10px 0;

          border-bottom:
            1px dashed
            var(--rule);

          font-size: 13.5px;
        }

        .stat-row small {
          color: var(--ink-soft);
        }

        .stat-row b {
          font-family:
            'IBM Plex Mono',
            monospace;

          font-variant-numeric:
            tabular-nums;

          font-weight: 500;
        }

        .stat-row.debit b {
          color: var(--debit);
        }

        /* =====================================
           CTA
        ===================================== */

        .cta-ticket {
          display: inline-flex;

          align-items: center;

          justify-content: center;

          gap: 8px;

          margin-top: 24px;

          padding: 12px 22px;

          background: var(--ink);

          color: var(--white);

          font-size: 14px;

          font-weight: 500;

          text-decoration: none;

          border: none;

          position: relative;

          cursor: pointer;

          transition:
            transform 180ms ease,
            opacity 180ms ease;
        }

        .cta-ticket:hover {
          transform: translateY(-1px);
          opacity: .92;
        }

        .cta-ticket::before,
        .cta-ticket::after {
          content: '';

          position: absolute;

          width: 10px;
          height: 10px;

          border-radius: 50%;

          background: var(--paper);

          top: 50%;

          transform:
            translateY(-50%);
        }

        .cta-ticket::before {
          left: -5px;
        }

        .cta-ticket::after {
          right: -5px;
        }

        .cta-ticket:focus-visible {
          outline:
            2px solid
            var(--brass);

          outline-offset: 3px;
        }

        /* =====================================
           STEPS
        ===================================== */

        .panel-steps h2 {
          font-family:
            'Petrona',
            serif;

          font-weight: 500;

          font-size: 17px;

          margin:
            0 0 18px;
        }

        .step-row {
          display: grid;

          grid-template-columns:
            30px
            1fr;

          gap: 12px;

          padding: 12px 0;

          border-top:
            1px solid
            var(--rule);

          font-size: 13.5px;

          line-height: 1.5;
        }

        .step-row:last-of-type {
          border-bottom:
            1px solid
            var(--rule);
        }

        .step-row span {
          font-family:
            'IBM Plex Mono',
            monospace;

          color: var(--ink-soft);

          font-size: 12px;

          padding-top: 1px;
        }

        /* =====================================
           NOTICE
        ===================================== */

        .notice {
          margin-top: 20px;

          padding-left: 14px;

          border-left:
            2px solid
            var(--rule);

          font-size: 12.5px;

          line-height: 1.6;

          color: var(--ink-soft);
        }

        /* =====================================
           RESPONSIVE
        ===================================== */

        @media (max-width: 780px) {
          .ledger {
            padding: 12px;
          }

          .ledger-card {
            padding:
              28px 22px 32px 40px;
          }

          .hero-row {
            grid-template-columns: 1fr;

            gap: 24px;
          }

          .tear-line {
            display: none;
          }

          .stub {
            transform: none;

            justify-self: stretch;
          }

          .panels {
            grid-template-columns: 1fr;
          }

          .panel-entries {
            border-right: none;

            border-bottom:
              1px solid
              var(--rule);

            padding-right: 0;
          }

          .panel-steps {
            padding-left: 0;
          }
        }

        @media (max-width: 480px) {
          .ledger {
            padding: 0;
          }

          .ledger-card {
            min-height: 100vh;

            padding:
              24px 18px 30px 38px;
          }

          .perf-rail {
            width: 22px;
          }

          .folio-tag {
            font-size: 10px;
          }

          .hero-copy h1 {
            font-size: 1.8rem;
          }

          .hero-copy p {
            font-size: 13px;
          }

          .stub {
            padding: 18px;
          }

          .stub strong {
            font-size: 1.7rem;
          }

          .panel {
            padding: 24px 0;
          }

          .entry-head {
            font-size: 13px;
          }

          .entry-head output {
            font-size: 12px;
          }

          .stat-row {
            font-size: 12.5px;
          }

          .step-row {
            font-size: 13px;
          }

          .cta-ticket {
            width: 100%;
          }
        }
      `}</style>

      <div className="ledger-card">
        <div
          className="perf-rail"
          aria-hidden="true"
        />

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="folio-tag">
          Folio No. 0472 &middot; Estimate sheet
        </div>

        {/* =====================================
            HERO
        ===================================== */}

        <section className="hero-row">
          <div className="hero-copy">
            <h1>
              Know your monthly payment
              before you apply.
            </h1>

            <p>
              Uses the same reducing-balance
              formula the marketplace applies
              to your loan, so the number you
              see here is the one you'll see
              at checkout.
            </p>
          </div>

          <div
            className="tear-line"
            aria-hidden="true"
          />

          <div className="stub">
            <div className="stamp">
              estimate
            </div>

            <small>
              Monthly instalment
            </small>

            <strong>
              {inr(monthly)}
            </strong>

            <span>
              for {tenure} months
            </span>
          </div>
        </section>

        {/* =====================================
            CALCULATOR PANELS
        ===================================== */}

        <section className="panels">
          {/* ===================================
              LEFT
          =================================== */}

          <div className="panel panel-entries">
            {/* PRICE */}

            <div className="entry-row">
              <div className="entry-head">
                <b>
                  Product price
                </b>

                <output>
                  {inr(price)}
                </output>
              </div>

              <input
                type="range"
                min={PRICE_MIN}
                max={PRICE_MAX}
                step={PRICE_STEP}
                value={price}
                style={{
                  '--fill': priceFill,
                } as SliderStyle}
                onChange={(e) =>
                  setPrice(
                    Number(e.target.value)
                  )
                }
                aria-label="Product price"
              />
            </div>

            {/* RATE */}

            <div className="entry-row">
              <div className="entry-head">
                <b>
                  Interest rate
                </b>

                <output>
                  {rate}%
                </output>
              </div>

              <input
                type="range"
                min={RATE_MIN}
                max={RATE_MAX}
                step={RATE_STEP}
                value={rate}
                style={{
                  '--fill': rateFill,
                } as SliderStyle}
                onChange={(e) =>
                  setRate(
                    Number(e.target.value)
                  )
                }
                aria-label="Interest rate"
              />
            </div>

            {/* TENURE */}

            <div className="entry-row">
              <div className="entry-head">
                <b>
                  Tenure
                </b>

                <output>
                  {tenure} months
                </output>
              </div>

              <input
                type="range"
                min={TENURE_MIN}
                max={TENURE_MAX}
                step={TENURE_STEP}
                value={tenure}
                style={{
                  '--fill': tenureFill,
                } as SliderStyle}
                onChange={(e) =>
                  setTenure(
                    Number(e.target.value)
                  )
                }
                aria-label="Tenure in months"
              />
            </div>

            {/* STATISTICS */}

            <div className="stat-table">
              <div className="stat-row">
                <small>
                  Principal
                </small>

                <b>
                  {inr(price)}
                </b>
              </div>

              <div className="stat-row">
                <small>
                  Total payable
                </small>

                <b>
                  {inr(total)}
                </b>
              </div>

              <div className="stat-row debit">
                <small>
                  Total interest
                </small>

                <b>
                  {inr(interest)}
                </b>
              </div>
            </div>

            {/* CTA */}

            <a
              className="cta-ticket"
              href="/"
            >
              Browse live plans
            </a>
          </div>

          {/* ===================================
              RIGHT
          =================================== */}

          <div className="panel panel-steps">
            <h2>
              How it works
            </h2>

            {STEPS.map((s) => (
              <div
                className="step-row"
                key={s.no}
              >
                <span>
                  {s.no}
                </span>

                <p
                  style={{
                    margin: 0,
                  }}
                >
                  {s.text}
                </p>
              </div>
            ))}

            <div className="notice">
              This is an estimate. Your
              final payable amount is set
              by the EMI plan returned
              after your application is
              reviewed.
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}