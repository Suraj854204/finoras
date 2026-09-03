import Link from 'next/link';

function IconPhone() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="7" y="2.5" width="10" height="19" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <line x1="11" y1="18" x2="13" y2="18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconLock() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="10.5" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3l7 3v5c0 4.8-2.9 8.3-7 10-4.1-1.7-7-5.2-7-10V6l7-3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 12.5 9.5 18 20 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconInfo() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
      <line x1="12" y1="10.5" x2="12" y2="16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="7.7" r="0.9" fill="currentColor" />
    </svg>
  );
}

function IconRupee() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 5h10M7 9h10M7 5c4.5 0 7 1.6 7 4s-2.5 4-7 4h-.5L15 19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconBolt() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const PROGRESS_STEPS = [
  { n: '1', label: 'Selection', hint: 'Product & EMI', status: 'active' },
  { n: '2', label: 'Applicant details', hint: 'Basic information', status: '' },
  { n: '3', label: 'KYC', hint: 'Identity verification', status: '' },
  { n: '4', label: 'Review', hint: 'Submit application', status: '' },
];

export default function CheckoutPage() {
  return (
    <main className="wrap application-page">
      <div className="application-shell">

        {/* Breadcrumb */}
        <div className="application-breadcrumb">
          <Link href="/">Products</Link>
          <span>›</span>
          <span>EMI application</span>
        </div>

        {/* Header */}
        <section className="application-header">
          <div>
            <h1>Complete your EMI application.</h1>
            <p className="desc">
              Your selected product and EMI plan carry over automatically, so this next part only takes a few minutes.
            </p>
          </div>

          <div className="application-hero">
            <div className="hero-label">Estimated repayment</div>
            <div className="hero-amount">
              ₹2,499<span>/month</span>
            </div>
            <div className="hero-sub">12 month plan, selected on the product page</div>
          </div>
        </section>

        {/* Progress */}
        <section className="application-progress">
          <div className="progress-track">
            <div className="progress-fill" style={{ width: '13%' }} />
          </div>

          <div className="steps-row">
            {PROGRESS_STEPS.map((step, i) => (
              <div key={step.n} style={{ display: 'contents' }}>
                <div className={`progress-step ${step.status}`}>
                  <span>{step.n}</span>
                  <div>
                    <strong>{step.label}</strong>
                    <small>{step.hint}</small>
                  </div>
                </div>
                {i < PROGRESS_STEPS.length - 1 && <div className="progress-line" />}
              </div>
            ))}
          </div>
        </section>

        {/* Main content */}
        <section className="application-grid">

          {/* Left */}
          <div className="application-main">

            <div className="application-card">
              <div className="card-heading">
                <div>
                  <span className="section-number">01</span>
                  <h2>Application overview</h2>
                  <p>Review your selection before continuing.</p>
                </div>
                <span className="verified-badge">Ready</span>
              </div>

              <div className="selection-placeholder">
                <div className="placeholder-icon"><IconPhone /></div>
                <div>
                  <strong>Product &amp; EMI selection</strong>
                  <p>Your selected product, variant and EMI plan will appear here when you continue from a product page.</p>
                </div>
              </div>

              <div className="application-note">
                <span><IconInfo /></span>
                <p>No payment is processed on this page. This assignment implements a digital EMI application flow instead of a live payment gateway.</p>
              </div>
            </div>

            {/* Applicant */}
            <div className="application-card">
              <div className="card-heading">
                <div>
                  <span className="section-number">02</span>
                  <h2>Applicant details</h2>
                  <p>Basic information required for your financing application.</p>
                </div>
              </div>

              <div className="locked-section">
                <div className="locked-icon"><IconLock /></div>
                <div>
                  <strong>Applicant information</strong>
                  <p>Continue to the application form to securely provide your details.</p>
                </div>
              </div>
            </div>

            {/* KYC */}
            <div className="application-card">
              <div className="card-heading">
                <div>
                  <span className="section-number">03</span>
                  <h2>Digital KYC</h2>
                  <p>Identity verification is completed securely during the application process.</p>
                </div>
              </div>

              <div className="kyc-features">
                <div className="kyc-feature">
                  <span><IconCheck /></span>
                  <div>
                    <strong>Secure verification</strong>
                    <small>Identity data handled securely</small>
                  </div>
                </div>

                <div className="kyc-feature">
                  <span><IconCheck /></span>
                  <div>
                    <strong>Privacy-first</strong>
                    <small>Sensitive information is protected</small>
                  </div>
                </div>

                <div className="kyc-feature">
                  <span><IconCheck /></span>
                  <div>
                    <strong>Application tracking</strong>
                    <small>Track your application status</small>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right summary */}
          <aside className="application-sidebar">

            <div className="application-summary">
              <div className="summary-header">
                <span>Application</span>
                <span className="summary-status">Draft</span>
              </div>

              <div className="summary-row">
                <span>Product</span>
                <strong>Selected product</strong>
              </div>

              <div className="summary-row">
                <span>Variant</span>
                <strong>Selected variant</strong>
              </div>

              <div className="summary-row">
                <span>EMI plan</span>
                <strong>Selected plan</strong>
              </div>

              <div className="summary-divider" />

              <div className="summary-protection">
                <div><span><IconCheck /></span> Secure application</div>
                <div><span><IconCheck /></span> Transparent pricing</div>
                <div><span><IconCheck /></span> Digital KYC</div>
              </div>

              <Link href="/application" className="proceed application-proceed">
                Continue application
                <span>→</span>
              </Link>

              <Link href="/" className="back-products">
                ← Back to products
              </Link>
            </div>

            {/* Help */}
            <div className="application-help">
              <span className="help-icon">?</span>
              <div>
                <strong>Need help?</strong>
                <p>Review your product and EMI selection before starting the application.</p>
              </div>
            </div>

          </aside>
        </section>

        {/* Bottom trust */}
        <section className="application-trust">
          <div>
            <IconShield />
            <div>
              <strong>Secure</strong>
              <small>Protected application flow</small>
            </div>
          </div>

          <div>
            <IconRupee />
            <div>
              <strong>Transparent</strong>
              <small>No hidden EMI pricing</small>
            </div>
          </div>

          <div>
            <IconCheck />
            <div>
              <strong>Digital</strong>
              <small>Paperless application process</small>
            </div>
          </div>

          <div>
            <IconBolt />
            <div>
              <strong>Simple</strong>
              <small>Fast application experience</small>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}