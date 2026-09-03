'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

type EMIPlan = {
  id?: string | number;
  tenureMonths?: number;
  monthlyPayment?: number;
  monthlyAmount?: number;
  interestRate?: number;
  cashback?: number;
};

type Variant = {
  id?: string | number;
  name?: string;
  storage?: string;
  image?: string;
  price?: number;
  mrp?: number;
};

type Product = {
  id: string | number;
  slug: string;
  name: string;
  brand: string;
  mrp?: number;
  basePrice?: number;
  description?: string;
  variants?: Variant[];
  emiPlans?: EMIPlan[];
};

const money = (value: number | undefined | null) => {
  const amount = Number(value ?? 0);

  if (!Number.isFinite(amount)) {
    return '₹0';
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

const getProductPrice = (product: Product) => {
  if (typeof product.basePrice === 'number') {
    return product.basePrice;
  }

  const prices =
    product.variants
      ?.map((variant) => Number(variant.price))
      .filter((price) => Number.isFinite(price) && price > 0) ?? [];

  return prices.length ? Math.min(...prices) : 0;
};

const getProductMrp = (product: Product) => {
  if (typeof product.mrp === 'number') {
    return product.mrp;
  }

  const mrps =
    product.variants
      ?.map((variant) => Number(variant.mrp))
      .filter((mrp) => Number.isFinite(mrp) && mrp > 0) ?? [];

  return mrps.length ? Math.max(...mrps) : 0;
};

const getPlans = (product: Product) => {
  return Array.isArray(product.emiPlans)
    ? product.emiPlans.filter(Boolean)
    : [];
};

const getMonthlyPayment = (plan: EMIPlan) => {
  return Number(plan.monthlyPayment ?? plan.monthlyAmount ?? 0);
};

const getBestPlan = (product: Product) => {
  const plans = getPlans(product);
  if (!plans.length) return null;

  const validPlans = plans.filter((plan) => {
    const amount = getMonthlyPayment(plan);
    return Number.isFinite(amount) && amount > 0;
  });

  if (!validPlans.length) return null;

  return validPlans.reduce((best, current) =>
    getMonthlyPayment(current) < getMonthlyPayment(best) ? current : best
  );
};

const getStartingEMI = (product: Product) => {
  const plans = getPlans(product);
  const payments = plans
    .map(getMonthlyPayment)
    .filter((payment) => Number.isFinite(payment) && payment > 0);

  return payments.length ? Math.min(...payments) : null;
};

const getDiscount = (product: Product) => {
  const mrp = getProductMrp(product);
  const price = getProductPrice(product);
  if (!mrp || !price || mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
};

const FEATURE_ROWS: {
  label: string;
  render: (p: Product) => React.ReactNode;
}[] = [
  { label: 'Brand', render: (p) => p.brand },
  {
    label: 'Selling price',
    render: (p) => <b>{money(getProductPrice(p))}</b>,
  },
  { label: 'MRP', render: (p) => money(getProductMrp(p)) },
  {
    label: 'Discount',
    render: (p) => (getDiscount(p) > 0 ? `${getDiscount(p)}%` : '—'),
  },
  {
    label: 'Starting EMI',
    render: (p) => {
      const emi = getStartingEMI(p);
      return emi !== null ? `${money(emi)}/month` : 'Not available';
    },
  },
  {
    label: 'EMI plans',
    render: (p) => `${getPlans(p).length} options`,
  },
  {
    label: 'Best EMI plan',
    render: (p) => {
      const plan = getBestPlan(p);
      return plan ? (
        <>
          <b>{money(getMonthlyPayment(plan))}</b>
          <small> × {plan.tenureMonths ?? '—'} months</small>
        </>
      ) : (
        '—'
      );
    },
  },
  {
    label: 'Interest rate',
    render: (p) => {
      const plan = getBestPlan(p);
      return plan?.interestRate !== undefined
        ? `${Number(plan.interestRate).toFixed(1)}%`
        : '—';
    },
  },
  {
    label: 'Cashback',
    render: (p) => {
      const cashback = Number(getBestPlan(p)?.cashback ?? 0);
      return cashback > 0 ? money(cashback) : '—';
    },
  },
  {
    label: 'Variants',
    render: (p) => `${p.variants?.length ?? 0} options`,
  },
  {
    label: 'Storage',
    render: (p) =>
      p.variants
        ?.map((v) => v.storage || v.name)
        .filter(Boolean)
        .join(' · ') || '—',
  },
];

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
        padding: clamp(20px, 4vw, 56px);
        display: flex;
        justify-content: center;
      }
      .ledger-page * { box-sizing: border-box; }
      .ledger-sheet {
        position: relative;
        width: 100%;
        max-width: 1080px;
        background: var(--paper);
        padding: clamp(28px, 5vw, 52px) clamp(24px, 5vw, 52px) clamp(40px, 5vw, 64px) clamp(52px, 7vw, 76px);
      }
      .perf-rail {
        position: absolute; left: 0; top: 0; bottom: 0; width: 26px;
        background-image: radial-gradient(circle, var(--stage) 5px, transparent 5.5px);
        background-size: 100% 26px;
        background-repeat: repeat-y;
        background-position: center top;
      }
      .folio-tag {
        font-family: 'IBM Plex Mono', monospace;
        font-size: 12.5px;
        color: var(--ink-soft);
        margin-bottom: 18px;
      }

      /* heading */
      .page-heading {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        gap: 24px;
        flex-wrap: wrap;
        padding-bottom: 26px;
        border-bottom: 1px solid var(--rule);
        margin-bottom: 30px;
      }
      .page-heading h1 {
        font-family: 'Petrona', serif;
        font-weight: 500;
        font-size: clamp(1.7rem, 3.4vw, 2.4rem);
        line-height: 1.2;
        margin: 0 0 12px;
      }
      .page-heading p {
        margin: 0;
        font-size: 14.5px;
        line-height: 1.6;
        color: var(--ink-soft);
        max-width: 48ch;
      }
      .heading-actions {
        display: flex;
        align-items: center;
        gap: 16px;
      }
      .compare-count {
        font-family: 'IBM Plex Mono', monospace;
        font-size: 12.5px;
        color: var(--ink-soft);
      }
      .back-link {
        font-size: 13.5px;
        color: var(--ink);
        text-decoration: none;
        padding-left: 12px;
        position: relative;
      }
      .back-link::before {
        content: '';
        position: absolute;
        left: 0; top: 4px;
        width: 6px; height: 6px;
        border-left: 1.5px solid var(--ink);
        border-bottom: 1.5px solid var(--ink);
        transform: rotate(45deg);
      }
      .back-link:hover { text-decoration: underline; }

      /* buttons */
      .outline-btn, .cta-ticket, .proceed {
        display: inline-flex;
        align-items: center;
        font-size: 13.5px;
        font-weight: 500;
        text-decoration: none;
        cursor: pointer;
        border: none;
      }
      .outline-btn {
        padding: 10px 18px;
        background: transparent;
        border: 1px solid var(--ink);
        color: var(--ink);
      }
      .outline-btn:hover { background: var(--paper-alt); }
      .cta-ticket, .proceed {
        position: relative;
        padding: 11px 20px;
        background: var(--ink);
        color: var(--white);
      }
      .cta-ticket::before, .cta-ticket::after,
      .proceed::before, .proceed::after {
        content: '';
        position: absolute;
        width: 10px; height: 10px;
        border-radius: 50%;
        background: var(--paper);
        top: 50%;
        transform: translateY(-50%);
      }
      .cta-ticket::before, .proceed::before { left: -5px; }
      .cta-ticket::after, .proceed::after { right: -5px; }
      .outline-btn:focus-visible, .cta-ticket:focus-visible, .proceed:focus-visible {
        outline: 2px solid var(--brass);
        outline-offset: 3px;
      }

      /* loading skeleton */
      .compare-loading-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
      }
      .compare-skeleton {
        border: 1px solid var(--rule);
        padding: 16px;
      }
      .skeleton-image {
        height: 140px;
        background: var(--paper-alt);
        margin-bottom: 14px;
        animation: pulse 1.6s ease-in-out infinite;
      }
      .skeleton-line {
        height: 10px;
        background: var(--paper-alt);
        margin-bottom: 8px;
        animation: pulse 1.6s ease-in-out infinite;
      }
      .skeleton-line.large { width: 70%; height: 14px; }
      .skeleton-line.short { width: 40%; }
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: .45; }
      }
      @media (prefers-reduced-motion: reduce) {
        .skeleton-image, .skeleton-line { animation: none; }
      }

      /* empty / error state */
      .empty-state {
        text-align: center;
        padding: 60px 20px;
        border: 1px dashed var(--rule);
      }
      .empty-icon {
        width: 48px; height: 48px;
        margin: 0 auto 18px;
        border: 1.5px solid var(--ink);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'IBM Plex Mono', monospace;
        font-size: 18px;
      }
      .empty-state h1, .empty-state h2 {
        font-family: 'Petrona', serif;
        font-weight: 500;
        font-size: 1.4rem;
        margin: 0 0 10px;
      }
      .empty-state p {
        color: var(--ink-soft);
        font-size: 14px;
        margin: 0 auto 22px;
        max-width: 40ch;
      }
      .empty-actions {
        display: flex;
        gap: 12px;
        justify-content: center;
        flex-wrap: wrap;
      }

      /* insights */
      .compare-insights {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1px;
        background: var(--rule);
        border: 1px solid var(--rule);
        margin-bottom: 34px;
      }
      .insight-card {
        display: flex;
        gap: 12px;
        align-items: flex-start;
        background: var(--paper);
        padding: 16px 18px;
      }
      .insight-icon {
        flex: none;
        width: 26px; height: 26px;
        border: 1.5px solid var(--brass);
        color: var(--brass);
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'IBM Plex Mono', monospace;
        font-size: 10.5px;
      }
      .insight-card small {
        display: block;
        color: var(--ink-soft);
        font-size: 12px;
        margin-bottom: 3px;
      }
      .insight-card strong {
        display: block;
        font-weight: 500;
        font-size: 14px;
      }
      .insight-card > div > span {
        display: block;
        margin-top: 2px;
        font-family: 'IBM Plex Mono', monospace;
        font-size: 12.5px;
        color: var(--ink-soft);
      }

      /* product columns + table share a grid so columns line up */
      .compare-scroll { overflow-x: auto; }
      .compare-products {
        display: grid;
        gap: 14px;
        margin-bottom: 0;
        min-width: 560px;
      }
      .compare-feature-label {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        padding-bottom: 10px;
        position: sticky;
        left: 0;
      }
      .compare-feature-label span {
        font-family: 'IBM Plex Mono', monospace;
        font-size: 11px;
        color: var(--ink-soft);
        margin-bottom: 4px;
      }
      .compare-feature-label strong {
        font-family: 'Petrona', serif;
        font-weight: 500;
        font-size: 16px;
      }

      .compare-product-card {
        position: relative;
        background: var(--white);
        border: 1px solid var(--rule);
        padding: 16px;
        transition: opacity 200ms ease;
      }
      .compare-product-card.removing { opacity: 0; }
      .remove-product {
        position: absolute;
        top: 10px; right: 10px;
        width: 22px; height: 22px;
        border: 1px solid var(--rule);
        border-radius: 50%;
        background: var(--white);
        color: var(--ink-soft);
        font-size: 13px;
        line-height: 1;
        cursor: pointer;
      }
      .remove-product:hover { border-color: var(--debit); color: var(--debit); }

      .compare-image {
        position: relative;
        height: 150px;
        border: 1px solid var(--rule);
        background: var(--paper);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 14px;
        overflow: hidden;
      }
      .compare-image img {
        max-width: 82%;
        max-height: 82%;
        object-fit: contain;
      }
      .no-image {
        font-size: 12px;
        color: var(--ink-soft);
        font-family: 'IBM Plex Mono', monospace;
      }
      .discount-badge {
        position: absolute;
        top: 8px; left: 8px;
        border: 1px dashed var(--brass);
        color: var(--brass);
        font-family: 'IBM Plex Mono', monospace;
        font-size: 10.5px;
        padding: 3px 7px;
        background: var(--paper);
        transform: rotate(-4deg);
      }

      .product-brand {
        display: block;
        font-size: 11.5px;
        color: var(--ink-soft);
        margin-bottom: 3px;
      }
      .compare-product-info h2 {
        font-family: 'Petrona', serif;
        font-weight: 500;
        font-size: 16.5px;
        margin: 0 0 10px;
        line-height: 1.3;
      }
      .price-block {
        display: flex;
        align-items: baseline;
        gap: 8px;
        font-family: 'IBM Plex Mono', monospace;
      }
      .price-block strong { font-size: 16px; font-weight: 500; }
      .price-block del { font-size: 12px; color: var(--ink-soft); }

      .emi-highlight {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px dashed var(--rule);
        font-size: 12.5px;
      }
      .emi-highlight span { color: var(--ink-soft); }
      .emi-highlight strong {
        font-family: 'IBM Plex Mono', monospace;
        font-weight: 500;
        font-size: 13.5px;
      }
      .emi-highlight strong small { font-weight: 400; color: var(--ink-soft); }

      .product-link {
        display: block;
        margin-top: 12px;
        font-size: 13px;
        color: var(--ink);
        text-decoration: underline;
        text-decoration-color: var(--rule);
        text-underline-offset: 3px;
      }

      /* detailed table */
      .comparison-section { margin-top: 40px; }
      .section-title {
        padding-bottom: 16px;
        margin-bottom: 4px;
        border-bottom: 1px solid var(--rule);
      }
      .section-title h2 {
        font-family: 'Petrona', serif;
        font-weight: 500;
        font-size: 1.3rem;
        margin: 6px 0 0;
      }

      .compare-table { min-width: 560px; }
      .compare-row {
        display: grid;
        border-bottom: 1px solid var(--rule);
      }
      .compare-row:nth-of-type(even) { background: var(--paper-alt); }
      .compare-row.compare-header {
        border-bottom: 2px solid var(--ink);
        background: transparent;
      }
      .compare-row > div, .feature-cell {
        padding: 11px 14px;
        font-size: 13.5px;
        display: flex;
        align-items: center;
        font-variant-numeric: tabular-nums;
      }
      .feature-cell {
        color: var(--ink-soft);
        position: sticky;
        left: 0;
        background: inherit;
      }
      .product-header-cell {
        font-family: 'Petrona', serif;
        font-weight: 500;
        font-size: 14px;
      }
      .compare-row b { font-weight: 500; }
      .compare-row small { color: var(--ink-soft); }
      .final-row { border-bottom: none; padding-top: 4px; }
      .compare-action {
        font-size: 13px;
        color: var(--ink);
        text-decoration: underline;
        text-decoration-color: var(--rule);
        text-underline-offset: 3px;
      }

      /* closing CTA */
      .compare-cta {
        margin-top: 44px;
        padding-top: 30px;
        border-top: 1px solid var(--rule);
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 24px;
        flex-wrap: wrap;
      }
      .compare-cta h2 {
        font-family: 'Petrona', serif;
        font-weight: 500;
        font-size: 1.5rem;
        margin: 4px 0 8px;
      }
      .compare-cta p {
        color: var(--ink-soft);
        font-size: 14px;
        margin: 0;
        max-width: 42ch;
      }
      .cta-actions { display: flex; gap: 12px; }

      @media (max-width: 720px) {
        .page-heading { align-items: flex-start; }
        .compare-insights { grid-template-columns: 1fr; }
        .compare-cta { flex-direction: column; align-items: flex-start; }
      }
    `}</style>
  );
}

export default function ComparePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [removingId, setRemovingId] = useState<string | number | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadProducts() {
      try {
        setLoading(true);
        setError('');

        const params = new URLSearchParams(window.location.search);
        const requestedIds =
          params
            .get('ids')
            ?.split(',')
            .map((id) => id.trim())
            .filter(Boolean) ?? [];

        const response = await fetch('/api/products?sort=newest', {
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error(`API returned ${response.status}`);
        }

        const result = await response.json();
        const allProducts: Product[] = Array.isArray(result?.data)
          ? result.data
          : [];

        if (!mounted) return;

        if (requestedIds.length) {
          setProducts(
            allProducts.filter((product) =>
              requestedIds.includes(String(product.id))
            )
          );
        } else {
          setProducts(allProducts.slice(0, 4));
        }
      } catch (err) {
        console.error('Compare products error:', err);
        if (mounted) {
          setError('Unable to load comparison data. Please try again.');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadProducts();
    return () => {
      mounted = false;
    };
  }, []);

  const removeProduct = (id: string | number) => {
    setRemovingId(id);
    const nextProducts = products.filter(
      (product) => String(product.id) !== String(id)
    );
    setProducts(nextProducts);

    const ids = nextProducts.map((product) => product.id);
    const url = ids.length > 0 ? `/compare?ids=${ids.join(',')}` : '/compare';
    window.history.replaceState({}, '', url);

    setTimeout(() => setRemovingId(null), 200);
  };

  const cheapestProduct = useMemo(() => {
    if (!products.length) return null;
    return products.reduce((best, product) =>
      getProductPrice(product) < getProductPrice(best) ? product : best
    );
  }, [products]);

  const lowestEMIProduct = useMemo(() => {
    const validProducts = products.filter((p) => getStartingEMI(p) !== null);
    if (!validProducts.length) return null;
    return validProducts.reduce((best, product) =>
      (getStartingEMI(product) ?? Infinity) < (getStartingEMI(best) ?? Infinity)
        ? product
        : best
    );
  }, [products]);

  const cols = products.length || 1;
  const gridCols = `180px repeat(${cols}, minmax(190px, 1fr))`;

  if (loading) {
    return (
      <main className="ledger-page">
        <LedgerStyles />
        <div className="ledger-sheet">
          <div className="perf-rail" aria-hidden="true" />
          <div className="folio-tag">Comparison sheet</div>
          <section className="page-heading">
            <div>
              <h1>Compare smartphones side by side.</h1>
              <p>Loading live pricing and EMI data…</p>
            </div>
          </section>
          <section className="compare-loading-grid">
            {[1, 2, 3].map((item) => (
              <div className="compare-skeleton" key={item}>
                <div className="skeleton-image" />
                <div className="skeleton-line large" />
                <div className="skeleton-line" />
                <div className="skeleton-line short" />
              </div>
            ))}
          </section>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="ledger-page">
        <LedgerStyles />
        <div className="ledger-sheet">
          <div className="perf-rail" aria-hidden="true" />
          <div className="folio-tag">Comparison sheet</div>
          <section className="empty-state">
            <div className="empty-icon">!</div>
            <h1>Comparison unavailable</h1>
            <p>{error}</p>
            <div className="empty-actions">
              <button className="proceed" onClick={() => window.location.reload()}>
                Try again
              </button>
              <Link href="/" className="outline-btn">
                Browse products
              </Link>
            </div>
          </section>
        </div>
      </main>
    );
  }

  if (!products.length) {
    return (
      <main className="ledger-page">
        <LedgerStyles />
        <div className="ledger-sheet">
          <div className="perf-rail" aria-hidden="true" />
          <div className="folio-tag">Comparison sheet</div>
          <section className="page-heading">
            <div>
              <h1>Compare smartphones side by side.</h1>
              <p>
                Select up to three smartphones from the product catalog to
                compare pricing, variants and EMI plans.
              </p>
            </div>
            <Link href="/" className="back-link">
              Browse products
            </Link>
          </section>
          <section className="empty-state">
            <div className="empty-icon">⇄</div>
            <h2>No products selected</h2>
            <p>Add products from the marketplace and compare them here.</p>
            <Link href="/#products" className="proceed">
              Explore smartphones
            </Link>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="ledger-page">
      <LedgerStyles />
      <div className="ledger-sheet">
        <div className="perf-rail" aria-hidden="true" />
        <div className="folio-tag">Comparison sheet</div>

        <section className="page-heading">
          <div>
            <h1>Compare smartphones side by side.</h1>
            <p>
              Compare live pricing, variants and EMI plans before starting
              your application.
            </p>
          </div>
          <div className="heading-actions">
            <span className="compare-count">{products.length} of 3 selected</span>
            <Link href="/" className="back-link">
              Products
            </Link>
          </div>
        </section>

        <section className="compare-insights">
          <div className="insight-card">
            <span className="insight-icon">₹</span>
            <div>
              <small>Lowest price</small>
              <strong>{cheapestProduct?.name ?? '—'}</strong>
              {cheapestProduct && <span>{money(getProductPrice(cheapestProduct))}</span>}
            </div>
          </div>
          <div className="insight-card">
            <span className="insight-icon">EMI</span>
            <div>
              <small>Lowest starting EMI</small>
              <strong>{lowestEMIProduct?.name ?? '—'}</strong>
              {lowestEMIProduct && (
                <span>{money(getStartingEMI(lowestEMIProduct) ?? 0)}/month</span>
              )}
            </div>
          </div>
          <div className="insight-card">
            <span className="insight-icon">✓</span>
            <div>
              <small>Financing ready</small>
              <strong>Digital application</strong>
              <span>Secure KYC flow</span>
            </div>
          </div>
        </section>

        <div className="compare-scroll">
          <section className="compare-products" style={{ gridTemplateColumns: gridCols }}>
            <div className="compare-feature-label">
              <span>Compare</span>
              <strong>Product overview</strong>
            </div>

            {products.map((product) => {
              const price = getProductPrice(product);
              const mrp = getProductMrp(product);
              const emi = getStartingEMI(product);
              const discount = getDiscount(product);
              const image = product.variants?.[0]?.image;

              return (
                <article
                  className={`compare-product-card ${removingId === product.id ? 'removing' : ''}`}
                  key={product.id}
                >
                  <button
                    type="button"
                    className="remove-product"
                    aria-label={`Remove ${product.name}`}
                    onClick={() => removeProduct(product.id)}
                  >
                    ×
                  </button>

                  <div className="compare-image">
                    {image ? (
                      <img src={image} alt={product.name} loading="lazy" />
                    ) : (
                      <div className="no-image">No image</div>
                    )}
                    {discount > 0 && <span className="discount-badge">{discount}% off</span>}
                  </div>

                  <div className="compare-product-info">
                    <span className="product-brand">{product.brand}</span>
                    <h2>{product.name}</h2>
                    <div className="price-block">
                      <strong>{money(price)}</strong>
                      {mrp > price && <del>{money(mrp)}</del>}
                    </div>
                    {emi !== null && (
                      <div className="emi-highlight">
                        <span>Starting EMI</span>
                        <strong>
                          {money(emi)}
                          <small>/month</small>
                        </strong>
                      </div>
                    )}
                    <Link href={`/products/${product.slug}`} className="product-link">
                      View product
                    </Link>
                  </div>
                </article>
              );
            })}
          </section>

          <section className="comparison-section">
            <div className="section-title">
              <div className="folio-tag" style={{ marginBottom: 0 }}>Detailed comparison</div>
              <h2>Everything that matters.</h2>
            </div>

            <div className="compare-table">
              <div className="compare-row compare-header" style={{ gridTemplateColumns: gridCols }}>
                <div className="feature-cell">Feature</div>
                {products.map((product) => (
                  <div className="product-header-cell" key={product.id}>
                    {product.name}
                  </div>
                ))}
              </div>

              {FEATURE_ROWS.map((row) => (
                <div className="compare-row" style={{ gridTemplateColumns: gridCols }} key={row.label}>
                  <div className="feature-cell">{row.label}</div>
                  {products.map((product) => (
                    <div key={product.id}>{row.render(product)}</div>
                  ))}
                </div>
              ))}

              <div className="compare-row final-row" style={{ gridTemplateColumns: gridCols, border: 'none' }}>
                <div className="feature-cell">Action</div>
                {products.map((product) => (
                  <div key={product.id}>
                    <Link href={`/products/${product.slug}`} className="compare-action">
                      Choose this phone
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <section className="compare-cta">
          <div>
            <div className="folio-tag" style={{ marginBottom: 4 }}>Ready to apply</div>
            <h2>Found your phone?</h2>
            <p>Continue with a secure digital application and complete KYC when required.</p>
          </div>
          <div className="cta-actions">
            <Link href="/" className="outline-btn">
              Continue browsing
            </Link>
            <Link href="/application" className="proceed">
              Start application
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}