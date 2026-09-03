'use client';
import { useEffect, useState, Suspense, Fragment } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const money = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;

function IconLock(props: any) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="5" y="10.5" width="14" height="10" rx="1.5" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

const STEP_ITEMS = [
  { n: 1, label: 'Details' },
  { n: 2, label: 'KYC' },
  { n: 3, label: 'Complete' },
];

function StepsBar({ current }: { current: number }) {
  return (
    <div className="app-steps">
      {STEP_ITEMS.map((it, i) => (
        <Fragment key={it.n}>
          <div className={`app-step ${current === it.n ? 'active' : ''} ${current > it.n ? 'done' : ''}`}>
            <span>{current > it.n ? '✓' : it.n}</span>
            <small>{it.label}</small>
          </div>
          {i < STEP_ITEMS.length - 1 && <div className="step-connector" />}
        </Fragment>
      ))}
    </div>
  );
}

function LedgerStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Petrona:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

      .ledger-page {
        --stage: #E4DCC5;
        --paper: #F6F1E3;
        --paper-alt: #EFE8D4;
        --ink: #182849;
        --ink-soft: rgba(24,40,73,.62);
        --rule: #C9BB98;
        --debit: #9A3B2C;
        --brass: #8A6A2E;
        --white: #FFFDF7;
        font-family: 'IBM Plex Sans', sans-serif;
        color: var(--ink);
        background: var(--stage);
        min-height: 100vh;
        padding: clamp(20px, 4vw, 56px);
        display: flex;
        justify-content: center;
      }
      .ledger-page * { box-sizing: border-box; }
      .ledger-sheet {
        position: relative;
        width: 100%;
        max-width: 920px;
        background: var(--paper);
        padding: clamp(28px, 5vw, 52px) clamp(24px, 5vw, 52px) clamp(40px, 5vw, 56px) clamp(52px, 7vw, 76px);
      }
      .ledger-sheet.narrow { max-width: 560px; }
      .perf-rail {
        position: absolute; left: 0; top: 0; bottom: 0; width: 26px;
        background-image: radial-gradient(circle, var(--stage) 5px, transparent 5.5px);
        background-size: 100% 26px;
        background-repeat: repeat-y;
        background-position: center top;
      }
      .folio-tag {
        display: block;
        font-family: 'IBM Plex Mono', monospace;
        font-size: 12.5px;
        color: var(--ink-soft);
        margin-bottom: 14px;
      }
      h1 {
        font-family: 'Petrona', serif;
        font-weight: 500;
        font-size: clamp(1.5rem, 3vw, 2rem);
        line-height: 1.22;
        margin: 0 0 10px;
      }
      .desc { margin: 0 0 22px; font-size: 14px; line-height: 1.6; color: var(--ink-soft); max-width: 50ch; }

      /* steps */
      .app-steps { display: flex; align-items: center; margin-bottom: 30px; }
      .app-step { display: flex; align-items: center; gap: 8px; flex: none; }
      .app-step span {
        width: 24px; height: 24px;
        border-radius: 50%;
        border: 1.5px solid var(--rule);
        color: var(--ink-soft);
        font-family: 'IBM Plex Mono', monospace;
        font-size: 11.5px;
        display: flex; align-items: center; justify-content: center;
        background: var(--paper);
      }
      .app-step.active span { border-color: var(--ink); background: var(--ink); color: var(--white); }
      .app-step.done span { border-color: var(--brass); color: var(--brass); }
      .app-step small { font-size: 12.5px; color: var(--ink-soft); }
      .app-step.active small { color: var(--ink); font-weight: 500; }
      .step-connector { flex: 1 1 40px; height: 0; border-top: 1px dashed var(--rule); margin: 0 10px; }

      /* generic layout */
      .app-flow-grid {
        display: grid;
        grid-template-columns: 1fr 1.1fr;
        gap: clamp(20px, 3vw, 36px);
        align-items: start;
      }
      .panel-card { background: var(--white); border: 1px solid var(--rule); padding: clamp(20px, 3vw, 28px); }
      .panel-card h2 { font-family: 'Petrona', serif; font-weight: 500; font-size: 17px; margin: 0 0 16px; }

      .badge-tag {
        display: inline-block;
        font-family: 'IBM Plex Mono', monospace;
        font-size: 11px;
        color: var(--brass);
        border: 1px dashed var(--brass);
        padding: 4px 9px;
        margin-bottom: 16px;
      }

      .mini-product {
        display: flex;
        gap: 14px;
        align-items: center;
        padding: 14px;
        border: 1px solid var(--rule);
        margin-bottom: 18px;
      }
      .mini-product img {
        width: 60px; height: 60px;
        object-fit: contain;
        border: 1px solid var(--rule);
        background: var(--paper);
        flex: none;
      }
      .mini-product b { display: block; font-size: 14px; font-weight: 500; }
      .mini-product span { display: block; font-size: 12px; color: var(--ink-soft); margin: 2px 0 4px; }
      .mini-product strong { font-family: 'IBM Plex Mono', monospace; font-size: 14px; }

      .row {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        padding: 10px 0;
        border-top: 1px dashed var(--rule);
        font-size: 13.5px;
      }
      .row span { color: var(--ink-soft); }
      .row strong { font-family: 'IBM Plex Mono', monospace; font-weight: 500; }

      /* form fields */
      .field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 18px; font-size: 12.5px; color: var(--ink-soft); }
      .field input, .field select {
        font-family: 'IBM Plex Sans', sans-serif;
        font-size: 14px;
        color: var(--ink);
        border: none;
        border-bottom: 1px solid var(--rule);
        background: transparent;
        padding: 7px 2px;
        width: 100%;
      }
      .field input:focus, .field select:focus { outline: none; border-bottom-color: var(--ink); }
      .field-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 20px; }
      .field-grid .field.full { grid-column: 1 / -1; }

      .consent-row { display: flex; gap: 10px; align-items: flex-start; margin: 20px 0; }
      .consent-row input { accent-color: var(--ink); width: 16px; height: 16px; margin-top: 2px; flex: none; }
      .consent-row span { font-size: 12.5px; color: var(--ink-soft); line-height: 1.55; }

      .field-error {
        border-left: 2px solid var(--debit);
        padding-left: 12px;
        color: var(--debit);
        font-size: 12.5px;
        margin: 14px 0;
      }

      .app-note {
        display: flex;
        gap: 10px;
        margin-bottom: 20px;
        padding-left: 14px;
        border-left: 2px solid var(--rule);
      }
      .app-note span { flex: none; font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: var(--ink-soft); }
      .app-note p { margin: 0; font-size: 12.5px; color: var(--ink-soft); line-height: 1.6; }

      .kyc-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; margin-bottom: 20px; }
      .secure-tag {
        flex: none;
        display: flex; align-items: center; gap: 6px;
        font-size: 12px;
        color: var(--ink-soft);
        border: 1px solid var(--rule);
        padding: 6px 10px;
        white-space: nowrap;
      }

      /* buttons */
      .outline-btn, .cta-ticket {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 13.5px;
        font-weight: 500;
        text-decoration: none;
        cursor: pointer;
        border: none;
      }
      .outline-btn { padding: 9px 16px; background: transparent; border: 1px solid var(--ink); color: var(--ink); }
      .outline-btn:hover { background: var(--paper-alt); }
      .cta-ticket {
        position: relative;
        width: 100%;
        padding: 13px 20px;
        background: var(--ink);
        color: var(--white);
      }
      .cta-ticket:disabled { opacity: .55; cursor: not-allowed; }
      .cta-ticket::before, .cta-ticket::after {
        content: '';
        position: absolute;
        width: 10px; height: 10px;
        border-radius: 50%;
        background: var(--paper);
        top: 50%;
        transform: translateY(-50%);
      }
      .cta-ticket::before { left: -5px; }
      .cta-ticket::after { right: -5px; }
      .cta-ticket:focus-visible, .outline-btn:focus-visible { outline: 2px solid var(--brass); outline-offset: 3px; }

      .back-link {
        display: inline-block;
        margin-top: 16px;
        font-size: 12.5px;
        color: var(--ink-soft);
        text-decoration: none;
        padding-left: 12px;
        position: relative;
      }
      .back-link::before {
        content: '';
        position: absolute;
        left: 0; top: 4px;
        width: 6px; height: 6px;
        border-left: 1.5px solid var(--ink-soft);
        border-bottom: 1.5px solid var(--ink-soft);
        transform: rotate(45deg);
      }
      .back-link:hover { color: var(--ink); }

      /* success / status */
      .center-col { text-align: center; }
      .stamp-circle {
        width: 60px; height: 60px;
        margin: 4px auto 18px;
        border-radius: 50%;
        border: 1.5px dashed var(--brass);
        color: var(--brass);
        display: flex; align-items: center; justify-content: center;
        font-size: 22px;
      }
      .id-stub {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        background: var(--white);
        border: 1px solid var(--rule);
        padding: 18px 26px;
        margin: 8px 0 22px;
        transform: rotate(-1deg);
      }
      .id-stub small { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--ink-soft); }
      .id-stub strong { font-family: 'IBM Plex Mono', monospace; font-size: 19px; letter-spacing: .02em; }

      .status-list { text-align: left; margin: 4px 0 20px; }

      .lookup-form { display: flex; gap: 10px; margin-bottom: 8px; }
      .lookup-form .field { flex: 1; margin-bottom: 0; }

      .loading-state, .error-state {
        text-align: center;
        padding: 60px 20px;
        font-size: 14px;
        color: var(--ink-soft);
      }
      .error-state { color: var(--debit); }

      @media (max-width: 720px) {
        .app-flow-grid { grid-template-columns: 1fr; }
        .field-grid { grid-template-columns: 1fr; }
        .kyc-head { flex-direction: column; }
      }
    `}</style>
  );
}

function ApplicationFlow() {
  const q = useSearchParams();
  const productSlug = q.get('product'), variantId = q.get('variant'), planId = q.get('plan');

  const [data, setData] = useState<any>(null), [step, setStep] = useState(1), [app, setApp] = useState<any>(null), [status, setStatus] = useState<any>(null), [loading, setLoading] = useState(false), [error, setError] = useState('');
  const [form, setForm] = useState({ applicantName: '', email: '', phone: '' });
  const [kyc, setKyc] = useState({ pan: '', aadhaar: '', dateOfBirth: '', addressLine: '', city: '', state: 'Uttar Pradesh', pincode: '', consent: false });
  const [lookup, setLookup] = useState('');

  useEffect(() => {
    const id = q.get('id');
    if (id) {
      setLookup(id);
      setLoading(true);
      fetch(`/api/applications/${encodeURIComponent(id)}`)
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((x) => { setStatus(x.data); setStep(4); })
        .catch(() => setError('Application not found'))
        .finally(() => setLoading(false));
      return;
    }
    if (!productSlug || !variantId || !planId) return;
    fetch(`/api/products/${productSlug}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((x) => {
        const p = x.data, v = p.variants.find((a: any) => a.id === variantId), e = p.emiPlans.find((a: any) => a.id === planId);
        if (!v || !e) throw new Error();
        setData({ p, v, e });
      })
      .catch(() => setError('Invalid application selection. Please select a product again.'));
  }, [productSlug, variantId, planId]);

  const createApplication = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const r = await fetch('/api/applications', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, productId: data.p.id, variantId: data.v.id, emiPlanId: data.e.id }),
      });
      const x = await r.json();
      if (!r.ok) throw new Error(x.error || 'Unable to create application');
      setApp(x.data); setStep(2);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to create application');
    } finally { setLoading(false); }
  };

  const submitKyc = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const r = await fetch('/api/applications/kyc', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...kyc, applicationId: app.id }),
      });
      const x = await r.json();
      if (!r.ok) throw new Error(x.error || 'Unable to submit KYC');
      setStatus(x.data); setStep(3);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to submit KYC');
    } finally { setLoading(false); }
  };

  const lookupStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookup.trim()) return;
    setLoading(true); setError('');
    try {
      const r = await fetch(`/api/applications/${encodeURIComponent(lookup.trim())}`);
      const x = await r.json();
      if (!r.ok) throw new Error(x.error);
      setStatus(x.data); setStep(4);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Application not found');
    } finally { setLoading(false); }
  };

  // No product context — lookup form
  if (!productSlug || !variantId || !planId) {
    return (
      <main className="ledger-page">
        <LedgerStyles />
        <div className="ledger-sheet narrow">
          <div className="perf-rail" aria-hidden="true" />
          <span className="folio-tag">Application lookup</span>
          <h1>Check application status</h1>
          <p className="desc">Enter your application ID to view the latest status.</p>
          <form onSubmit={lookupStatus} className="lookup-form">
            <div className="field">
              <input placeholder="e.g. 1FI-2026-AB12C" value={lookup} onChange={(e) => setLookup(e.target.value)} />
            </div>
            <button className="cta-ticket" style={{ width: 'auto', padding: '10px 20px' }} disabled={loading}>
              {loading ? 'Checking…' : 'Check status'}
            </button>
          </form>
          {error && <div className="field-error">{error}</div>}
          <Link className="back-link" href="/">Browse products</Link>
        </div>
      </main>
    );
  }

  // Preparing / invalid selection
  if (!data) {
    return (
      <main className="ledger-page">
        <LedgerStyles />
        <div className="ledger-sheet narrow">
          <div className="perf-rail" aria-hidden="true" />
          <div className={error ? 'error-state' : 'loading-state'}>
            {error || 'Preparing your application…'}
            {error && <div style={{ marginTop: 14 }}><Link className="back-link" href="/">Back to products</Link></div>}
          </div>
        </div>
      </main>
    );
  }

  // Step 1 — applicant details
  if (step === 1) {
    return (
      <main className="ledger-page">
        <LedgerStyles />
        <div className="ledger-sheet">
          <div className="perf-rail" aria-hidden="true" />
          <span className="folio-tag">Application · Step 1 of 3</span>
          <StepsBar current={1} />
          <div className="app-flow-grid">
            <section className="panel-card">
              <span className="badge-tag">✓ Selection locked</span>
              <h2>Start your EMI application</h2>
              <p className="desc">We only use these details to create your application. No payment is processed.</p>

              <div className="mini-product">
                <img src={data.v.image} alt="" />
                <div>
                  <b>{data.p.name}</b>
                  <span>{data.v.color} · {data.v.storage}</span>
                  <strong>{money(data.v.price)}</strong>
                </div>
              </div>

              <div className="row"><span>EMI</span><strong>{money(data.e.monthlyPayment)}/month · {data.e.tenureMonths} months</strong></div>
              <div className="row"><span>Cashback</span><strong>{money(data.e.cashback)}</strong></div>
            </section>

            <form className="panel-card" onSubmit={createApplication}>
              <h2>Applicant details</h2>
              <div className="field">
                <label htmlFor="applicantName">Full name</label>
                <input id="applicantName" required value={form.applicantName} onChange={(e) => setForm({ ...form, applicantName: e.target.value })} />
              </div>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input id="email" required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="field">
                <label htmlFor="phone">Mobile number</label>
                <input id="phone" required inputMode="numeric" maxLength={10} placeholder="10-digit mobile" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, '') })} />
              </div>
              {error && <div className="field-error">{error}</div>}
              <button className="cta-ticket" disabled={loading}>{loading ? 'Creating…' : 'Continue to KYC'}</button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  // Step 2 — KYC
  if (step === 2) {
    return (
      <main className="ledger-page">
        <LedgerStyles />
        <div className="ledger-sheet">
          <div className="perf-rail" aria-hidden="true" />
          <span className="folio-tag">Application · Step 2 of 3</span>
          <StepsBar current={2} />
          <form className="panel-card" onSubmit={submitKyc}>
            <div className="kyc-head">
              <div>
                <h1 style={{ fontSize: '1.4rem' }}>Verify your identity</h1>
                <p className="desc" style={{ marginBottom: 0 }}>Demo-grade KYC flow for the assignment. Only the last four characters of PAN/Aadhaar are persisted.</p>
              </div>
              <span className="secure-tag"><IconLock /> Encrypted</span>
            </div>

            <div className="app-note">
              <span>Note</span>
              <p>For privacy, never store raw identity documents in a demo database. This implementation validates format and stores masked suffixes only.</p>
            </div>

            <div className="field-grid">
              <div className="field">
                <label htmlFor="pan">PAN</label>
                <input id="pan" required maxLength={10} placeholder="ABCDE1234F" value={kyc.pan} onChange={(e) => setKyc({ ...kyc, pan: e.target.value.toUpperCase() })} />
              </div>
              <div className="field">
                <label htmlFor="aadhaar">Aadhaar</label>
                <input id="aadhaar" required inputMode="numeric" maxLength={12} placeholder="12-digit Aadhaar" value={kyc.aadhaar} onChange={(e) => setKyc({ ...kyc, aadhaar: e.target.value.replace(/\D/g, '') })} />
              </div>
              <div className="field">
                <label htmlFor="dob">Date of birth</label>
                <input id="dob" required type="date" value={kyc.dateOfBirth} onChange={(e) => setKyc({ ...kyc, dateOfBirth: e.target.value })} />
              </div>
              <div className="field">
                <label htmlFor="pincode">Pincode</label>
                <input id="pincode" required inputMode="numeric" maxLength={6} value={kyc.pincode} onChange={(e) => setKyc({ ...kyc, pincode: e.target.value.replace(/\D/g, '') })} />
              </div>
              <div className="field">
                <label htmlFor="city">City</label>
                <input id="city" required value={kyc.city} onChange={(e) => setKyc({ ...kyc, city: e.target.value })} />
              </div>
              <div className="field">
                <label htmlFor="state">State</label>
                <input id="state" required value={kyc.state} onChange={(e) => setKyc({ ...kyc, state: e.target.value })} />
              </div>
              <div className="field full">
                <label htmlFor="address">Address</label>
                <input id="address" required value={kyc.addressLine} onChange={(e) => setKyc({ ...kyc, addressLine: e.target.value })} />
              </div>
            </div>

            <label className="consent-row">
              <input type="checkbox" checked={kyc.consent} onChange={(e) => setKyc({ ...kyc, consent: e.target.checked })} />
              <span>I consent to KYC verification and the storage of masked identity information for this application.</span>
            </label>

            {error && <div className="field-error">{error}</div>}
            <button className="cta-ticket" disabled={loading || !kyc.consent}>{loading ? 'Submitting securely…' : 'Submit KYC'}</button>
          </form>
        </div>
      </main>
    );
  }

  // Step 3 — received
  if (step === 3) {
    return (
      <main className="ledger-page">
        <LedgerStyles />
        <div className="ledger-sheet narrow">
          <div className="perf-rail" aria-hidden="true" />
          <div className="center-col">
            <span className="badge-tag">✓ KYC submitted successfully</span>
            <div className="stamp-circle">✓</div>
            <h1>Application received</h1>
            <p className="desc" style={{ margin: '0 auto 4px' }}>Your EMI application is now in the verification queue.</p>

            <div className="id-stub">
              <small>Application ID</small>
              <strong>{app.applicationNo}</strong>
              <button className="outline-btn" onClick={() => navigator.clipboard?.writeText(app.applicationNo)}>Copy ID</button>
            </div>

            <div className="status-list">
              <div className="row"><span>KYC status</span><strong>{status?.status || 'SUBMITTED'}</strong></div>
              <div className="row"><span>Masked PAN</span><strong>{status?.maskedPan}</strong></div>
              <div className="row"><span>Masked Aadhaar</span><strong>{status?.maskedAadhaar}</strong></div>
            </div>

            <Link className="cta-ticket" href={`/application?id=${app.applicationNo}`}>Check application status</Link>
          </div>
        </div>
      </main>
    );
  }

  // Status view
  return (
    <main className="ledger-page">
      <LedgerStyles />
      <div className="ledger-sheet narrow">
        <div className="perf-rail" aria-hidden="true" />
        <span className="badge-tag">Application found</span>
        <h1 style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '1.3rem' }}>{status.applicationNo}</h1>
        <p className="desc">Current status: <strong style={{ color: 'var(--ink)' }}>{status.status}</strong></p>

        <div className="status-list">
          <div className="row"><span>Product</span><strong>{status.product.name}</strong></div>
          <div className="row"><span>Variant</span><strong>{status.variant.color} · {status.variant.storage}</strong></div>
          <div className="row"><span>EMI</span><strong>{money(status.emiPlan.monthlyPayment)}/month</strong></div>
          <div className="row"><span>Created</span><strong>{new Date(status.createdAt).toLocaleString('en-IN')}</strong></div>
        </div>

        <Link className="back-link" href="/">Back to products</Link>
      </div>
    </main>
  );
}

export default function ApplicationPage() {
  return (
    <Suspense fallback={
      <main className="ledger-page" style={{ ['--stage' as any]: '#E4DCC5' }}>
        <div className="loading-state">Preparing application…</div>
      </main>
    }>
      <ApplicationFlow />
    </Suspense>
  );
}