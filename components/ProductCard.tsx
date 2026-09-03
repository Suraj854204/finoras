'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import './productCard.css';

type Variant = {
  id: string | number;
  name?: string;
  color?: string;
  storage?: string;
  image?: string;
  price?: number;
  mrp?: number;
  stock?: number;
};

type EMIPlan = {
  id?: string | number;
  monthlyPayment: number;
  tenureMonths?: number;
  interestRate?: number;
  cashback?: number;
  processingFee?: number;
};

type Product = {
  id: string | number;
  slug: string;
  name: string;
  brand: string;
  description?: string;
  category?: string;
  mrp?: number;
  basePrice?: number;
  variants?: Variant[];
  emiPlans?: EMIPlan[];
};

type ProductCardProps = {
  p: Product;
  selected?: boolean;
  onCompare?: () => void;
};

const money = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

export default function ProductCard({
  p,
  selected = false,
  onCompare,
}: ProductCardProps) {
  const variants = Array.isArray(p?.variants)
    ? p.variants
    : [];

  const emiPlans = Array.isArray(p?.emiPlans)
    ? p.emiPlans
    : [];

  const firstVariant = variants[0];

  const price = Number(
    firstVariant?.price ??
    p?.basePrice ??
    0
  );

  const mrp = Number(
    firstVariant?.mrp ??
    p?.mrp ??
    0
  );

  const image =
    firstVariant?.image ||
    '/placeholder-phone.png';

  const discount = useMemo(() => {
    if (!mrp || mrp <= price) return 0;

    return Math.round(
      ((mrp - price) / mrp) * 100
    );
  }, [mrp, price]);

  const startingEmi = useMemo(() => {
    const validPlans = emiPlans
      .map((plan) =>
        Number(plan.monthlyPayment)
      )
      .filter((value) => value > 0);

    return validPlans.length
      ? Math.min(...validPlans)
      : 0;
  }, [emiPlans]);

  const bestPlan = useMemo(() => {
    if (!emiPlans.length) return null;

    return [...emiPlans].sort(
      (a, b) =>
        Number(a.monthlyPayment || 0) -
        Number(b.monthlyPayment || 0)
    )[0];
  }, [emiPlans]);

  const isLowStock =
    typeof firstVariant?.stock === 'number' &&
    firstVariant.stock > 0 &&
    firstVariant.stock <= 5;

  if (!p) return null;

  /*
   * IMPORTANT:
   * Product detail URL is generated from slug.
   *
   * Example:
   * /products/iphone-15
   */
  const productUrl = `/products/${encodeURIComponent(
    p.slug
  )}`;

  return (
    <article
      className={`product-card ${selected
          ? 'product-card-selected'
          : ''
        }`}
    >
      {/* =========================
          IMAGE
      ========================== */}

      <div className="product-card-media">
        <Link
          href={productUrl}
          className="product-image-link"
          aria-label={`View ${p.name}`}
        >
          <img
            src={image}
            alt={p.name}
            className="product-card-image"
            loading="lazy"
          />
        </Link>

        <div className="product-badges">
          {discount > 0 && (
            <span className="discount-badge">
              {discount}% OFF
            </span>
          )}

          {isLowStock && (
            <span className="stock-badge">
              Only {firstVariant?.stock} left
            </span>
          )}
        </div>

        {onCompare && (
          <div className="image-actions">
            <button
              type="button"
              className={`compare-icon-btn ${selected ? 'active' : ''
                }`}
              onClick={onCompare}
              aria-label={
                selected
                  ? `Remove ${p.name} from comparison`
                  : `Compare ${p.name}`
              }
              aria-pressed={selected}
            >
              {selected ? '✓' : '⇄'}
            </button>
          </div>
        )}

        <div className="device-tag">
          <span className="device-dot" />
          Premium device
        </div>
      </div>

      {/* =========================
          CONTENT
      ========================== */}

      <div className="product-card-content">
        <div className="product-meta">
          <span className="product-brand">
            {p.brand}
          </span>

          {p.category && (
            <span className="product-category">
              {p.category}
            </span>
          )}
        </div>

        <Link
          href={productUrl}
          className="product-title-link"
        >
          <h2 className="product-title">
            {p.name}
          </h2>
        </Link>

        {p.description && (
          <p className="product-description">
            {p.description}
          </p>
        )}

        {/* =========================
            VARIANTS
        ========================== */}

        {variants.length > 0 && (
          <div className="variant-row">
            <div className="variant-count">
              <span className="variant-icon">
                ◈
              </span>

              <span>
                {variants.length}{' '}
                {variants.length === 1
                  ? 'variant'
                  : 'variants'}
              </span>
            </div>

            {firstVariant?.storage && (
              <span className="storage-pill">
                {firstVariant.storage}
              </span>
            )}

            {firstVariant?.color && (
              <span className="color-pill">
                <span
                  className="color-dot"
                  aria-hidden="true"
                />
                {firstVariant.color}
              </span>
            )}
          </div>
        )}

        {/* =========================
            PRICE
        ========================== */}

        <div className="price-section">
          <div className="price-line">
            <span className="selling-price">
              {money(price)}
            </span>

            {mrp > price && (
              <span className="original-price">
                {money(mrp)}
              </span>
            )}
          </div>

          {mrp > price && (
            <span className="save-text">
              You save{' '}
              {money(mrp - price)}
            </span>
          )}
        </div>

        {/* =========================
            EMI
        ========================== */}

        <div className="emi-highlight">
          <div className="emi-icon">
            ₹
          </div>

          <div className="emi-copy">
            <span>
              Starting EMI
            </span>

            <strong>
              {startingEmi > 0
                ? `${money(
                  startingEmi
                )}/month`
                : 'View plans'}
            </strong>
          </div>

          {bestPlan?.interestRate !==
            undefined && (
              <div className="interest-pill">
                {Number(
                  bestPlan.interestRate
                ).toFixed(1)}
                % p.a.
              </div>
            )}
        </div>

        {/* =========================
            CASHBACK
        ========================== */}

        {bestPlan &&
          Number(
            bestPlan.cashback || 0
          ) > 0 && (
            <div className="cashback-row">
              <span className="cashback-icon">
                ✦
              </span>

              <span>
                Get up to{' '}
                <strong>
                  {money(
                    Number(
                      bestPlan.cashback
                    )
                  )}
                </strong>{' '}
                cashback
              </span>
            </div>
          )}

        {/* =========================
            FEATURES
        ========================== */}

        <div className="product-features">
          <span>
            <b>✓</b> Secure KYC
          </span>

          <span>
            <b>✓</b> Flexible EMI
          </span>

          <span>
            <b>✓</b> Digital application
          </span>
        </div>

        {/* =========================
            ACTIONS
        ========================== */}

        <div className="product-actions">
          <Link
            href={productUrl}
            className="view-product-btn"
          >
            <span>
              View product
            </span>

            <span className="arrow">
              →
            </span>
          </Link>

          {onCompare && (
            <button
              type="button"
              className={`compare-btn ${selected
                  ? 'selected'
                  : ''
                }`}
              onClick={onCompare}
              aria-pressed={selected}
            >
              {selected
                ? '✓ Compared'
                : 'Compare'}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}