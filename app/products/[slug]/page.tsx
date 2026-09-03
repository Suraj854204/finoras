import Link from 'next/link';

function IconPhone(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="7" y="2.5" width="10" height="19" rx="1.5" />
      <line x1="11" y1="18" x2="13" y2="18" />
    </svg>
  );
}

function IconLock(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="5" y="10.5" width="14" height="10" rx="1.5" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function IconCheck(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 12.5 9.5 18 20 6" />
    </svg>
  );
}

function IconShield(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3 5 6v5.2c0 4.4 3 7.9 7 8.8 4-.9 7-4.4 7-8.8V6l-7-3Z" />
      <path d="m9.2 12 2 2 3.6-4" />
    </svg>
  );
}

const PROGRESS_STEPS = [
  { n: '01', label: 'Selection', status: 'done' },
  { n: '02', label: 'Applicant details', status: 'active' },
  { n: '03', label: 'KYC', status: 'upcoming' },
  { n: '04', label: 'Review', status: 'upcoming' },
];

const OVERVIEW_CARDS = [
  {
    n: '01',
    icon: <IconPhone />,
    title: 'Product & EMI selection',
    body: 'Your selected product, variant and EMI plan will appear here when you continue from a product page.',
  },
  {
    n: '02',
    icon: <IconLock />,
    title: 'Applicant information',
    body: 'Continue to the application form to securely provide the details we need for financing.',
  },
  {
    n: '03',
    icon: <IconShield />,
    title: 'Digital KYC',
    body: 'Identity verification is completed securely as part of the application, no paperwork required.',
  },
];

const TRUST_ITEMS = [
  { title: 'Encrypted end to end', hint: 'Every field is protected in transit' },
  { title: 'No hidden charges', hint: 'The EMI shown is the EMI you pay' },
  { title: 'Fully paperless', hint: 'Sign and verify from your phone' },
  { title: 'Track anytime', hint: 'Follow your status after you apply' },
];

function CheckoutStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,440;9..144,500;9..144,600&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');

      .cf-page {
        --paper: #EEEDE6;
        --surface: #FFFFFF;
        --ink: #171712;
        --ink-soft: rgba(23, 23, 18, .60);
        --ink-faint: rgba(23, 23, 18, .38);
        --pine: #163B2C;
        --pine-dim: #1E4E39;
        --pine-tint: #E3EEE6;
        --line: #DAD6C9;
        --line-strong: #C6C0AE;
        font-family: 'Inter', sans-serif;
        color: var(--ink);
        background: var(--paper);
        padding: clamp(20px, 4vw, 56px);
        display: flex;
        justify-content: center;
      }
      .cf-page * { box-sizing: border-box; }

      .cf-shell { width: 100%; max-width: 1120px; }

      /* utility bar */
      .cf-utility {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        margin-bottom: 28px;
        font-size: 13px;
      }
      .cf-back {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        color: var(--ink-soft);
        text-decoration: none;
      }
      .cf-back:hover { color: var(--ink); }
      .cf-back svg { width: 14px; height: 14px; transform: rotate(180deg); }
      .cf-utility-right {
        display: flex;
        align-items: center;
        gap: 14px;
        color: var(--ink-soft);
      }
      .cf-step-count {
        font-family: 'IBM Plex Mono', monospace;
        font-size: 12.5px;
      }
      .cf-secure-pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 5px 12px 5px 8px;
        border: 1px solid var(--line-strong);
        border-radius: 999px;
        color: var(--pine);
        font-size: 12.5px;
        font-weight: 500;
        background: var(--surface);
      }
      .cf-secure-pill svg { width: 14px; height: 14px; }

      /* header + hero */
      .cf-header {
        display: grid;
        grid-template-columns: 1.5fr 1fr;
        gap: clamp(20px, 4vw, 40px);
        align-items: end;
        margin-bottom: 34px;
      }
      .cf-header h1 {
        font-family: 'Fraunces', serif;
        font-weight: 500;
        font-size: clamp(2rem, 4vw, 2.9rem);
        line-height: 1.08;
        letter-spacing: -0.01em;
        margin: 0 0 14px;
      }
      .cf-header p {
        margin: 0;
        font-size: 15px;
        line-height: 1.6;
        color: var(--ink-soft);
        max-width: 42ch;
      }

      .cf-hero {
        background: var(--pine);
        color: #F2F1EA;
        padding: 22px 24px;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .cf-hero-label {
        font-size: 12.5px;
        color: rgba(242,241,234,.65);
      }
      .cf-hero-amount {
        display: flex;
        align-items: baseline;
        gap: 6px;
        font-family: 'Fraunces', serif;
        font-weight: 500;
        font-size: clamp(2rem, 3.4vw, 2.6rem);
        line-height: 1;
      }
      .cf-hero-amount span {
        font-family: 'Inter', sans-serif;
        font-size: 14px;
        font-weight: 500;
        color: rgba(242,241,234,.75);
      }
      .cf-hero-sub {
        margin-top: 10px;
        font-size: 12.5px;
        color: rgba(242,241,234,.7);
      }

      /* progress */
      .cf-progress {
        margin-bottom: 40px;
      }
      .cf-progress-track {
        display: flex;
        height: 3px;
        background: var(--line);
        margin-bottom: 12px;
        overflow: hidden;
      }
      .cf-progress-fill {
        height: 100%;
        background: var(--pine);
      }
      .cf-progress-labels {
        display: flex;
        justify-content: space-between;
      }
      .cf-progress-item {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
        color: var(--ink-faint);
      }
      .cf-progress-item.is-done,
      .cf-progress-item.is-active { color: var(--ink); }
      .cf-progress-item b {
        font-family: 'IBM Plex Mono', monospace;
        font-weight: 500;
        font-size: 11.5px;
        color: var(--ink-faint);
      }
      .cf-progress-item.is-done b,
      .cf-progress-item.is-active b { color: var(--pine); }

      /* grid */
      .cf-grid {
        display: grid;
        grid-template-columns: 1.55fr 1fr;
        gap: clamp(18px, 3vw, 32px);
        align-items: start;
      }

      .cf-card {
        background: var(--surface);
        border: 1px solid var(--line);
        border-left: 3px solid var(--pine);
        padding: 22px clamp(18px, 3vw, 26px);
        display: flex;
        gap: 18px;
      }
      .cf-card + .cf-card { margin-top: 14px; }
      .cf-card-index {
        flex: none;
        font-family: 'IBM Plex Mono', monospace;
        font-size: 12px;
        color: var(--ink-faint);
        padding-top: 2px;
      }
      .cf-card-icon {
        flex: none;
        width: 38px; height: 38px;
        border-radius: 50%;
        background: var(--pine-tint);
        color: var(--pine);
        display: flex; align-items: center; justify-content: center;
      }
      .cf-card-body h2 {
        font-family: 'Fraunces', serif;
        font-weight: 500;
        font-size: 17px;
        margin: 0 0 6px;
      }
      .cf-card-body p {
        margin: 0;
        font-size: 13.5px;
        line-height: 1.6;
        color: var(--ink-soft);
        max-width: 52ch;
      }

      .cf-note {
        margin-top: 18px;
        padding: 14px 18px;
        background: var(--pine-tint);
        font-size: 12.5px;
        line-height: 1.6;
        color: var(--pine-dim);
      }
      .cf-note strong { font-weight: 600; }

      /* KYC list inside card 3 */
      .cf-kyc-list { display: flex; flex-direction: column; gap: 10px; margin-top: 4px; }
      .cf-kyc-list div { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--ink-soft); }
      .cf-kyc-list svg { flex: none; color: var(--pine); }

      /* sidebar */
      .cf-sidebar { position: sticky; top: 24px; }
      .cf-summary {
        background: var(--surface);
        border: 1px solid var(--line);
      }
      .cf-summary-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 18px 22px;
        border-bottom: 1px solid var(--line);
      }
      .cf-summary-head h3 {
        font-family: 'Fraunces', serif;
        font-weight: 500;
        font-size: 16px;
        margin: 0;
      }
      .cf-summary-status {
        font-family: 'IBM Plex Mono', monospace;
        font-size: 11px;
        color: var(--ink-soft);
        border: 1px solid var(--line-strong);
        padding: 2px 9px;
      }
      .cf-summary-rows { padding: 6px 22px; }
      .cf-summary-row {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        padding: 11px 0;
        border-bottom: 1px solid var(--line);
        font-size: 13.5px;
      }
      .cf-summary-row:last-child { border-bottom: none; }
      .cf-summary-row span { color: var(--ink-soft); }
      .cf-summary-row strong { font-weight: 500; text-align: right; }

      .cf-summary-total {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        padding: 16px 22px;
        background: var(--pine-tint);
        font-family: 'Fraunces', serif;
      }
      .cf-summary-total span {
        font-family: 'Inter', sans-serif;
        font-size: 13px;
        color: var(--pine-dim);
      }
      .cf-summary-total strong { font-size: 20px; font-weight: 500; color: var(--pine); }

      .cf-cta {
        display: block;
        text-align: center;
        margin: 18px 22px 0;
        padding: 14px 20px;
        background: var(--ink);
        color: var(--surface);
        font-size: 14px;
        font-weight: 600;
        text-decoration: none;
      }
      .cf-cta:hover { background: var(--pine); }
      .cf-cta:focus-visible { outline: 2px solid var(--pine); outline-offset: 3px; }

      .cf-back-link {
        display: block;
        text-align: center;
        margin: 12px 22px 22px;
        font-size: 12.5px;
        color: var(--ink-soft);
        text-decoration: none;
      }
      .cf-back-link:hover { color: var(--ink); }

      .cf-help {
        display: flex;
        gap: 12px;
        margin-top: 16px;
        padding: 16px 18px;
        border: 1px solid var(--line);
        font-size: 12.5px;
        color: var(--ink-soft);
        line-height: 1.55;
      }
      .cf-help strong { display: block; color: var(--ink); font-weight: 500; margin-bottom: 3px; font-size: 13px; }

      /* trust strip */
      .cf-trust {
        margin-top: 44px;
        padding-top: 22px;
        border-top: 1px solid var(--line-strong);
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 20px;
      }
      .cf-trust-item { display: flex; align-items: flex-start; gap: 10px; }
      .cf-trust-item svg { flex: none; color: var(--pine); margin-top: 1px; }
      .cf-trust-item strong { display: block; font-size: 13px; font-weight: 600; }
      .cf-trust-item small { display: block; color: var(--ink-soft); font-size: 12px; margin-top: 2px; line-height: 1.4; }

      @media (max-width: 860px) {
        .cf-header { grid-template-columns: 1fr; }
        .cf-grid { grid-template-columns: 1fr; }
        .cf-sidebar { position: static; }
        .cf-trust { grid-template-columns: repeat(2, 1fr); }
      }
      @media (max-width: 560px) {
        .cf-progress-labels span:not(.cf-progress-item b) {}
        .cf-progress-item span.cf-progress-label-text { display: none; }
        .cf-trust { grid-template-columns: 1fr; }
      }
    `}</style>
  );
}

export default function CheckoutPage() {
  const activeIndex = PROGRESS_STEPS.findIndex((s) => s.status === 'active');
  const fillPercent = ((activeIndex + 0.5) / PROGRESS_STEPS.length) * 100;

  return (
    <main className="cf-page">
      <CheckoutStyles />
      <div className="cf-shell">

        <div className="cf-utility">
          <Link href="/" className="cf-back">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m9 6 6 6-6 6" /></svg>
            Products
          </Link>
          <div className="cf-utility-right">
            <span className="cf-step-count">Step {activeIndex + 1} of {PROGRESS_STEPS.length}</span>
            <span className="cf-secure-pill"><IconShield /> Secure application</span>
          </div>
        </div>

        <section className="cf-header">
          <div>
            <h1>Complete your EMI application.</h1>
            <p>Your selected product and EMI plan carry over automatically, so this next part only takes a few minutes.</p>
          </div>
          <div className="cf-hero">
            <span className="cf-hero-label">Estimated repayment</span>
            <div className="cf-hero-amount">₹2,499<span>/month</span></div>
            <div className="cf-hero-sub">12 month plan, selected on the product page</div>
          </div>
        </section>

        <section className="cf-progress">
          <div className="cf-progress-track">
            <div className="cf-progress-fill" style={{ width: `${fillPercent}%` }} />
          </div>
          <div className="cf-progress-labels">
            {PROGRESS_STEPS.map((step) => (
              <div className={`cf-progress-item is-${step.status}`} key={step.n}>
                <b>{step.n}</b>
                <span className="cf-progress-label-text">{step.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="cf-grid">
          <div className="cf-main">
            {OVERVIEW_CARDS.map((card, i) => (
              <div className="cf-card" key={card.n}>
                <span className="cf-card-index">{card.n}</span>
                <span className="cf-card-icon">{card.icon}</span>
                <div className="cf-card-body">
                  <h2>{card.title}</h2>
                  <p>{card.body}</p>
                  {i === 2 && (
                    <div className="cf-kyc-list">
                      <div><IconCheck /> Identity verified against government ID</div>
                      <div><IconCheck /> Your data stays encrypted throughout</div>
                      <div><IconCheck /> Status updates as you progress</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div className="cf-note">
              <strong>No payment happens on this page.</strong> This flow walks through a digital EMI application instead of a live payment gateway.
            </div>
          </div>

          <aside className="cf-sidebar">
            <div className="cf-summary">
              <div className="cf-summary-head">
                <h3>Application summary</h3>
                <span className="cf-summary-status">Draft</span>
              </div>
              <div className="cf-summary-rows">
                <div className="cf-summary-row"><span>Product</span><strong>Selected product</strong></div>
                <div className="cf-summary-row"><span>Variant</span><strong>Selected variant</strong></div>
                <div className="cf-summary-row"><span>EMI plan</span><strong>12 months</strong></div>
              </div>
              <div className="cf-summary-total">
                <span>Monthly EMI</span>
                <strong>₹2,499</strong>
              </div>
              <Link href="/application" className="cf-cta">Continue application</Link>
              <Link href="/" className="cf-back-link">Back to products</Link>
            </div>

            <div className="cf-help">
              <div>
                <strong>Need help?</strong>
                Double-check your product and EMI selection before you start the application, it carries through automatically from here.
              </div>
            </div>
          </aside>
        </section>

        <section className="cf-trust">
          {TRUST_ITEMS.map((item) => (
            <div className="cf-trust-item" key={item.title}>
              <IconCheck />
              <div>
                <strong>{item.title}</strong>
                <small>{item.hint}</small>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}