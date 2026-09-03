'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import './productPage.css';

type Variant = {
  id: string;
  name?: string;
  color: string;
  storage: string;
  image: string;
  price: number;
  stock: number;
};

type Plan = {
  id: string;
  monthlyPayment: number;
  tenureMonths: number;
  interestRate: string | number;
  cashback: number;
  processingFee: number;
};

type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  brand: string;
  category: string;
  mrp: number;
  basePrice: number;
  variants: Variant[];
};

const money = (value: number) =>
  `₹${Number(value || 0).toLocaleString('en-IN')}`;

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();

  const [p, setP] = useState<Product | null>(null);
  const [v, setV] = useState<Variant | null>(null);

  const [plans, setPlans] = useState<Plan[]>([]);
  const [plan, setPlan] = useState<Plan | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  /*
   * =========================================
   * LOAD PRODUCT
   * =========================================
   */

  useEffect(() => {
    if (!slug) return;

    setLoading(true);
    setError(false);

    fetch(`/api/products/${encodeURIComponent(slug)}`)
      .then((r) => {
        if (!r.ok) {
          throw new Error('Product request failed');
        }

        return r.json();
      })
      .then((x) => {
        const product = x.data as Product;

        setP(product);
        setV(product?.variants?.[0] || null);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  /*
   * =========================================
   * LOAD EMI PLANS
   * =========================================
   */

  useEffect(() => {
    if (!v || !slug) return;

    fetch(
      `/api/products/${encodeURIComponent(
        slug
      )}/emi-plans?variantId=${encodeURIComponent(v.id)}`
    )
      .then((r) => {
        if (!r.ok) {
          throw new Error('EMI request failed');
        }

        return r.json();
      })
      .then((x) => {
        setPlans(x.data || []);
        setPlan(null);
      })
      .catch(() => {
        setPlans([]);
        setPlan(null);
      });
  }, [v, slug]);

  /*
   * =========================================
   * PRICE / DISCOUNT
   * =========================================
   */

  const currentPrice = useMemo(() => {
    if (!p || !v) return 0;

    return Number(v.price || p.basePrice || 0);
  }, [p, v]);

  const discount = useMemo(() => {
    if (!p || !v || !p.mrp || !v.price) {
      return 0;
    }

    return Math.max(
      0,
      Math.round((1 - v.price / p.mrp) * 100)
    );
  }, [p, v]);

  /*
   * =========================================
   * RECOMMENDED PLAN
   * =========================================
   */

  const recommended = useMemo(() => {
    if (!plans.length) return null;

    return plans.reduce((a, b) =>
      Number(a.monthlyPayment) <
      Number(b.monthlyPayment)
        ? a
        : b
    );
  }, [plans]);

  /*
   * =========================================
   * LOADING
   * =========================================
   */

  if (loading) {
    return (
      <main className="product-detail-page">
        <div className="product-loading">
          <span className="loading-spinner" />
          <span>Loading product...</span>
        </div>
      </main>
    );
  }

  /*
   * =========================================
   * ERROR
   * =========================================
   */

  if (error || !p) {
    return (
      <main className="product-detail-page">
        <div className="product-error">
          <div className="error-icon">!</div>

          <h1>Product unavailable</h1>

          <p>
            We couldn't load this product right now.
            Please try again or return to products.
          </p>

          <Link
            href="/"
            className="back-home-btn"
          >
            ← Back to products
          </Link>
        </div>
      </main>
    );
  }

  const image =
    v?.image ||
    p.variants?.[0]?.image ||
    '/placeholder-phone.png';

  const inStock = Boolean(v && v.stock > 0);

  return (
    <main className="product-detail-page">
      <div className="product-detail-container">

        {/* =====================================
            BREADCRUMB
        ====================================== */}

        <div className="product-breadcrumb">
          <Link href="/">Products</Link>

          <span>/</span>

          {p.category && (
            <>
              <span>{p.category}</span>
              <span>/</span>
            </>
          )}

          <strong>{p.name}</strong>
        </div>

        {/* =====================================
            50 / 50 MAIN LAYOUT
        ====================================== */}

        <div className="product-detail-shell">

          {/* ===================================
              LEFT SIDE
          ==================================== */}

          <section className="product-visual-section">

            {/* IMAGE FRAME */}

            <div className="product-image-frame">

              <div className="image-topbar">

                <span className="premium-label">
                  PREMIUM DEVICE
                </span>

                {discount > 0 && (
                  <span className="image-discount">
                    {discount}% OFF
                  </span>
                )}

              </div>

              <div className="product-image-stage">
                <img
                  src={image}
                  alt={p.name}
                  className="product-main-image"
                />
              </div>

              <div className="image-footer">

                <div className="image-footer-item">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>

                  <span>
                    Secure marketplace
                  </span>
                </div>

                <div className="image-footer-item">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="m5 12 4 4L19 6" />
                  </svg>

                  <span>
                    Verified product
                  </span>
                </div>

              </div>
            </div>

            {/* STOCK */}

            <div className="product-stock-bar">

              <div className="stock-main">

                <span
                  className={`stock-dot ${
                    inStock
                      ? 'in-stock'
                      : 'out-stock'
                  }`}
                />

                <div>
                  <strong>
                    {inStock
                      ? 'In stock'
                      : 'Out of stock'}
                  </strong>

                  <small>
                    {inStock
                      ? `${v?.stock || 0} units available`
                      : 'Currently unavailable'}
                  </small>
                </div>

              </div>

              {inStock && (
                <span className="stock-ready">
                  Ready to apply
                </span>
              )}

            </div>

            {/* PRODUCT BIO */}

            <div className="product-bio">

              <div className="bio-brand">
                <span>{p.brand}</span>

                <span>·</span>

                <span>{p.category}</span>
              </div>

              <h1>{p.name}</h1>

              <p>
                {p.description ||
                  'Premium device with flexible financing options.'}
              </p>

              <div className="bio-features">

                <div>
                  <span>✓</span>

                  <div>
                    <strong>Secure KYC</strong>
                    <small>
                      Fast digital verification
                    </small>
                  </div>
                </div>

                <div>
                  <span>₹</span>

                  <div>
                    <strong>Flexible EMI</strong>
                    <small>
                      Multiple repayment options
                    </small>
                  </div>
                </div>

                <div>
                  <span>↗</span>

                  <div>
                    <strong>Digital application</strong>
                    <small>
                      Simple online process
                    </small>
                  </div>
                </div>

              </div>
            </div>

          </section>

          {/* ===================================
              RIGHT SIDE
          ==================================== */}

          <section className="product-purchase-section">

            {/* HEADER */}

            <div className="purchase-header">

              <div className="purchase-kicker">
                EMI FINANCING
              </div>

              <h2>
                Choose your payment plan.
              </h2>

              <p>
                Select your preferred variant and
                EMI option to continue with the
                application.
              </p>

            </div>

            {/* PRICE */}

            <div className="product-price-box">

              <div>

                <span className="price-label">
                  Current price
                </span>

                <div className="price-line">

                  <strong>
                    {money(currentPrice)}
                  </strong>

                  {p.mrp > currentPrice && (
                    <span className="old-price">
                      {money(p.mrp)}
                    </span>
                  )}

                </div>

              </div>

              {discount > 0 && (
                <span className="save-badge">
                  Save {discount}%
                </span>
              )}

            </div>

            {/* =================================
                VARIANT SELECTION
            ================================== */}

            <div className="selection-section">

              <div className="selection-heading">

                <div>

                  <span>01</span>

                  <div>
                    <strong>
                      Select variant
                    </strong>

                    <small>
                      Choose storage and colour
                    </small>
                  </div>

                </div>

                {v && (
                  <b>
                    {v.color} · {v.storage}
                  </b>
                )}

              </div>

              <div className="variant-options">

                {p.variants.map((item) => {

                  const selected =
                    v?.id === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      disabled={item.stock < 1}
                      className={`variant-option ${
                        selected
                          ? 'selected'
                          : ''
                      }`}
                      onClick={() =>
                        setV(item)
                      }
                    >

                      <div className="variant-option-main">

                        <span
                          className={`variant-radio ${
                            selected
                              ? 'checked'
                              : ''
                          }`}
                        >
                          {selected && '✓'}
                        </span>

                        <div>
                          <strong>
                            {item.color}
                          </strong>

                          <small>
                            {item.storage}
                          </small>
                        </div>

                      </div>

                      <div className="variant-option-price">

                        <strong>
                          {money(item.price)}
                        </strong>

                        <small>
                          {item.stock > 0
                            ? `${item.stock} available`
                            : 'Out of stock'}
                        </small>

                      </div>

                    </button>
                  );
                })}

              </div>
            </div>

            {/* =================================
                EMI SELECTION
            ================================== */}

            <div className="selection-section emi-section">

              <div className="selection-heading">

                <div>

                  <span>02</span>

                  <div>
                    <strong>
                      Select EMI plan
                    </strong>

                    <small>
                      Compare monthly repayments
                    </small>
                  </div>

                </div>

                <Link
                  href="/emi-calculator"
                  className="emi-help"
                >
                  EMI calculator →
                </Link>

              </div>

              {plans.length > 0 ? (

                <div className="emi-plans">

                  {plans.map((item) => {

                    const selected =
                      plan?.id === item.id;

                    const isRecommended =
                      recommended?.id === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        className={`emi-plan ${
                          selected
                            ? 'selected'
                            : ''
                        }`}
                        onClick={() =>
                          setPlan(item)
                        }
                      >

                        <div className="emi-plan-left">

                          <span
                            className={`emi-radio ${
                              selected
                                ? 'checked'
                                : ''
                            }`}
                          >
                            {selected && '✓'}
                          </span>

                          <div>

                            <div className="emi-monthly">
                              {money(
                                Number(
                                  item.monthlyPayment
                                )
                              )}

                              <span>
                                /month
                              </span>
                            </div>

                            <div className="emi-meta">

                              <span>
                                {item.tenureMonths}{' '}
                                months
                              </span>

                              <span>•</span>

                              <span>
                                {Number(
                                  item.interestRate
                                ).toFixed(1)}
                                % interest
                              </span>

                              {Number(
                                item.processingFee
                              ) > 0 && (
                                <>
                                  <span>•</span>
                                  <span>
                                    Fee{' '}
                                    {money(
                                      item.processingFee
                                    )}
                                  </span>
                                </>
                              )}

                            </div>

                          </div>

                        </div>

                        <div className="emi-plan-right">

                          {isRecommended && (
                            <span className="recommended-badge">
                              Recommended
                            </span>
                          )}

                          {Number(
                            item.cashback || 0
                          ) > 0 && (
                            <span className="cashback-mini">
                              ✦{' '}
                              {money(
                                item.cashback
                              )}{' '}
                              cashback
                            </span>
                          )}

                        </div>

                      </button>
                    );
                  })}

                </div>

              ) : (

                <div className="plans-empty">
                  <strong>
                    EMI plans unavailable
                  </strong>

                  <span>
                    No financing plans are
                    available for this variant.
                  </span>
                </div>

              )}

              {/* SELECTED PLAN */}

              {plan && (
                <div className="selected-plan-box">

                  <div className="selected-plan-icon">
                    ✓
                  </div>

                  <div>

                    <strong>
                      Plan selected
                    </strong>

                    <p>
                      {money(
                        plan.monthlyPayment
                      )}
                      /month for{' '}
                      {plan.tenureMonths}{' '}
                      months ·{' '}
                      {Number(
                        plan.interestRate
                      ).toFixed(1)}
                      % interest rate.
                    </p>

                  </div>

                </div>
              )}

              {/* CASHBACK */}

              {plan &&
                Number(plan.cashback || 0) > 0 && (
                  <div className="cashback-banner">

                    <span className="cashback-symbol">
                      ✦
                    </span>

                    <div>
                      <strong>
                        Get{' '}
                        {money(plan.cashback)}{' '}
                        cashback
                      </strong>

                      <small>
                        Cashback applied with
                        selected EMI plan.
                      </small>
                    </div>

                  </div>
                )}

              {/* PROCEED */}

              <button
                type="button"
                className="proceed-product-btn"
                disabled={
                  !v ||
                  !plan ||
                  v.stock < 1
                }
                onClick={() => {

                  if (!v || !plan) return;

                  router.push(
                    `/application?product=${encodeURIComponent(
                      p.slug
                    )}&variant=${encodeURIComponent(
                      v.id
                    )}&plan=${encodeURIComponent(
                      plan.id
                    )}`
                  );

                }}
              >

                <span>
                  Proceed with this plan
                </span>

                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14" />
                  <path d="m13 6 6 6-6 6" />
                </svg>

              </button>

              <div className="proceed-note">

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>

                Secure application · No hidden
                charges

              </div>

              <Link
                href="/"
                className="back-products"
              >
                ← Back to all products
              </Link>

            </div>
          </section>
        </div>

        {/* =====================================
            TRUST STRIP
        ====================================== */}

        <div className="product-trust-strip">

          <div>
            <span>✓</span>

            <div>
              <strong>
                Secure KYC
              </strong>

              <small>
                Protected verification
              </small>
            </div>
          </div>

          <div>
            <span>₹</span>

            <div>
              <strong>
                Flexible EMI
              </strong>

              <small>
                Choose your tenure
              </small>
            </div>
          </div>

          <div>
            <span>⚡</span>

            <div>
              <strong>
                Quick approval
              </strong>

              <small>
                Fast digital process
              </small>
            </div>
          </div>

          <div>
            <span>◆</span>

            <div>
              <strong>
                Verified product
              </strong>

              <small>
                Trusted marketplace
              </small>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}