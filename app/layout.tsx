import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import './theme-pine.css';

export const metadata: Metadata = {
  title: {
    default: '1Fi — Smart EMI Marketplace',
    template: '%s | 1Fi',
  },
  description:
    'Compare smartphones, discover transparent EMI plans and complete a secure digital financing application with 1Fi.',
  keywords: [
    '1Fi',
    'smart EMI',
    'smartphone EMI',
    'mobile financing',
    'EMI calculator',
    'digital KYC',
  ],
  robots: {
    index: true,
    follow: true,
  },
};

function Logo() {
  return (
    <Link href="/" className="logo" aria-label="1Fi — Smart EMI Marketplace">
      <span className="logo-mark">1</span>
      <span className="logo-name">Fi</span>
    </Link>
  );
}

function ArrowIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3l7 3v5c0 4.8-2.9 8.3-7 10-4.1-1.7-7-5.2-7-10V6l7-3z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 12.5 9.5 18 20 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

const TRUST_ITEMS = [
  { title: 'Transparent pricing', hint: 'No hidden charges, ever' },
  { title: 'Flexible EMI', hint: 'Plans built for every budget' },
  { title: 'Secure KYC', hint: 'Privacy-first verification' },
  { title: 'Fully digital', hint: 'Apply without any paperwork' },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="theme-pine">
        <div className="site-shell">

          {/* HEADER */}
          <header className="site-header">
            <div className="wrap nav">
              <Logo />

              <nav className="desktop-nav" aria-label="Primary navigation">
                <Link href="/" className="nav-link">Products</Link>
                <Link href="/emi-calculator" className="nav-link">EMI calculator</Link>
                <Link href="/compare" className="nav-link">Compare</Link>
                <Link href="/application" className="nav-link">Application status</Link>
              </nav>

              <div className="nav-right">
                <div className="secure-badge">
                  <ShieldIcon />
                  <span>Secure financing</span>
                </div>

                <Link href="/emi-calculator" className="nav-cta">
                  Calculate EMI
                  <ArrowIcon />
                </Link>

                <button type="button" className="mobile-menu" aria-label="Open navigation menu">
                  <MenuIcon />
                </button>
              </div>
            </div>
          </header>

          {/* ANNOUNCEMENT */}
          <section className="announcement">
            <div className="wrap announcement-inner">
              <p className="announcement-message">
                Flexible EMI plans with transparent pricing, backed by a fully secure digital application.
              </p>
              <Link href="/emi-calculator" className="announcement-link">
                Check your EMI
                <ArrowIcon />
              </Link>
            </div>
          </section>

          {/* MAIN */}
          <main className="main-content">{children}</main>

          {/* TRUST STRIP */}
          <section className="global-trust">
            <div className="wrap trust-grid">
              {TRUST_ITEMS.map((item) => (
                <div className="trust-item" key={item.title}>
                  <span className="trust-icon"><CheckIcon /></span>
                  <div>
                    <strong>{item.title}</strong>
                    <span>{item.hint}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* FOOTER */}
          <footer className="site-footer">
            <div className="wrap footer-main">

              <div className="footer-brand">
                <Logo />
                <p className="footer-tagline">
                  Own the tech you want.
                  <br />
                  <strong>Pay your way.</strong>
                </p>
                <p className="footer-description">
                  A smarter way to discover smartphones, compare EMI plans and complete your financing application digitally.
                </p>
                <div className="footer-security">
                  <ShieldIcon />
                  <div>
                    <strong>Secure digital application</strong>
                    <span>Your information stays protected</span>
                  </div>
                </div>
              </div>

              <div className="footer-column">
                <h3>Explore</h3>
                <Link href="/">Products</Link>
                <Link href="/emi-calculator">EMI calculator</Link>
                <Link href="/compare">Compare products</Link>
                <Link href="/application">Application status</Link>
              </div>

              <div className="footer-column">
                <h3>Financing</h3>
                <span>Flexible EMI plans</span>
                <span>Transparent pricing</span>
                <span>Zero down payment options</span>
                <span>Smart recommendations</span>
                <span>Digital application</span>
              </div>

              <div className="footer-column">
                <h3>Security</h3>
                <span>Secure KYC flow</span>
                <span>Masked identity data</span>
                <span>Protected application</span>
                <span>Privacy-first design</span>
                <span>Secure transactions</span>
              </div>

            </div>

            <div className="footer-bottom">
              <div className="wrap footer-bottom-inner">
                <div className="copyright">© {new Date().getFullYear()} 1Fi. All rights reserved.</div>
                <div className="footer-meta">
                  <span>Smart EMI marketplace</span>
                  <span>SDE-1 assignment</span>
                  <span>Production-ready architecture</span>
                </div>
              </div>
            </div>
          </footer>

        </div>
        </div>
      </body>
    </html>
  );
}