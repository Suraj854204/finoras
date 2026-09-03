'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import ProductCard from '@/components/ProductCard';

type ApiVariant = {
  id?: string | number;
  name?: string | null;
  color?: string | null;
  storage?: string | null;
  image?: string | null;
  price?: number | string | null;
  mrp?: number | string | null;
  stock?: number | string | null;
};

type ApiEmiPlan = {
  id?: string | number;
  monthlyPayment?: number | string | null;
  monthlyAmount?: number | string | null;
  tenureMonths?: number | string | null;
  interestRate?: number | string | null;
  cashback?: number | string | null;
  processingFee?: number | string | null;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  description?: string;
  mrp: number;
  basePrice: number;
  variants: {
    id: string;
    name: string;
    color?: string;
    storage?: string;
    image: string;
    price: number;
    mrp: number;
    stock: number;
  }[];
  emiPlans: {
    id: string;
    monthlyPayment: number;
    tenureMonths: number;
    interestRate: number;
    cashback: number;
    processingFee?: number;
  }[];
};

type ApiResponse = {
  success?: boolean;
  data?: unknown;
  error?: string;
};

function toNumber(value: unknown, fallback = 0): number {
  const numberValue = Number(value);

  return Number.isFinite(numberValue) ? numberValue : fallback;
}

function toStringValue(value: unknown, fallback = ''): string {
  if (value === null || value === undefined) {
    return fallback;
  }

  return String(value);
}

function normalizeVariant(
  variant: ApiVariant,
  product: Record<string, unknown>,
  index: number
) {
  const color = variant?.color
    ? toStringValue(variant.color)
    : undefined;

  const storage = variant?.storage
    ? toStringValue(variant.storage)
    : undefined;

  const generatedName =
    [color, storage].filter(Boolean).join(' / ') || 'Standard';

  const productBasePrice = toNumber(product?.basePrice, 0);
  const productMrp = toNumber(product?.mrp, productBasePrice);

  return {
    id: toStringValue(variant?.id, `variant-${index}`),

    name: toStringValue(
      variant?.name,
      generatedName
    ),

    color,

    storage,

    image: toStringValue(variant?.image, ''),

    price: toNumber(
      variant?.price,
      productBasePrice
    ),

    mrp: toNumber(
      variant?.mrp,
      productMrp
    ),

    stock: toNumber(
      variant?.stock,
      0
    ),
  };
}

function normalizeEmiPlan(
  plan: ApiEmiPlan,
  index: number
) {
  const monthlyPayment = toNumber(
    plan?.monthlyPayment ?? plan?.monthlyAmount,
    0
  );

  return {
    id: toStringValue(
      plan?.id,
      `emi-${index}`
    ),

    monthlyPayment,

    tenureMonths: toNumber(
      plan?.tenureMonths,
      0
    ),

    interestRate: toNumber(
      plan?.interestRate,
      0
    ),

    cashback: toNumber(
      plan?.cashback,
      0
    ),

    processingFee: toNumber(
      plan?.processingFee,
      0
    ),
  };
}

function normalizeProduct(
  item: unknown,
  index: number
): Product | null {
  if (!item || typeof item !== 'object') {
    return null;
  }

  const raw = item as Record<string, any>;

  const basePrice = toNumber(
    raw?.basePrice ?? raw?.price,
    0
  );

  const mrp = toNumber(
    raw?.mrp,
    basePrice
  );

  const rawVariants = Array.isArray(raw?.variants)
    ? raw.variants
    : [];

  const rawEmiPlans = Array.isArray(raw?.emiPlans)
    ? raw.emiPlans
    : [];

  const variants = rawVariants.map(
    (variant: ApiVariant, variantIndex: number) =>
      normalizeVariant(
        variant,
        raw,
        variantIndex
      )
  );

  const emiPlans = rawEmiPlans.map(
    (plan: ApiEmiPlan, emiIndex: number) =>
      normalizeEmiPlan(
        plan,
        emiIndex
      )
  );

  return {
    id: toStringValue(
      raw?.id,
      `product-${index}`
    ),

    slug: toStringValue(
      raw?.slug,
      ''
    ),

    name: toStringValue(
      raw?.name,
      'Unnamed Product'
    ),

    brand: toStringValue(
      raw?.brand,
      'Unknown Brand'
    ),

    description: toStringValue(
      raw?.description,
      ''
    ),

    mrp,

    basePrice,

    variants,

    emiPlans,
  };
}

export default function Home() {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(false);

  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState('All');
  const [sort, setSort] = useState('newest');

  const [compare, setCompare] = useState<string[]>([]);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setErr(false);

      const query = new URLSearchParams();

      if (search.trim()) {
        query.set(
          'search',
          search.trim()
        );
      }

      if (brand !== 'All') {
        query.set(
          'brand',
          brand
        );
      }

      query.set(
        'sort',
        sort
      );

      const response = await fetch(
        `/api/products?${query.toString()}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
          cache: 'no-store',
        }
      );

      if (!response.ok) {
        throw new Error(
          `Products API failed: ${response.status}`
        );
      }

      const json: ApiResponse =
        await response.json();

      if (
        json?.success === false
      ) {
        throw new Error(
          json?.error ||
            'Unable to load products'
        );
      }

      const rawData = Array.isArray(
        json?.data
      )
        ? json.data
        : [];

      const normalizedProducts =
        rawData
          .map((item, index) =>
            normalizeProduct(
              item,
              index
            )
          )
          .filter(
            (product): product is Product =>
              product !== null
          );

      setData(
        normalizedProducts
      );
    } catch (error) {
      console.error(
        'Product loading failed:',
        error
      );

      setData([]);
      setErr(true);
    } finally {
      setLoading(false);
    }
  }, [
    search,
    brand,
    sort,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      load();
    }, 250);

    return () => {
      clearTimeout(timer);
    };
  }, [load]);

  const brands = useMemo(() => {
    const uniqueBrands =
      Array.from(
        new Set(
          data
            .map(
              (product) =>
                product.brand
            )
            .filter(Boolean)
        )
      );

    return [
      'All',
      ...uniqueBrands,
    ];
  }, [data]);

  const toggleCompare = (
    productId: string
  ) => {
    setCompare((current) => {
      if (
        current.includes(productId)
      ) {
        return current.filter(
          (id) =>
            id !== productId
        );
      }

      if (current.length >= 3) {
        return current;
      }

      return [
        ...current,
        productId,
      ];
    });
  };

  const clearFilters = () => {
    setSearch('');
    setBrand('All');
    setSort('newest');
  };

  return (
    <main className="wrap">
      {/* HERO */}

      <section className="hero">
        <div className="hero-content">
          <div className="eyebrow">
            Smart EMI Marketplace
          </div>

          <h1>
            Own the tech you want.
            <br />

            <span>
              Pay your way.
            </span>
          </h1>

          <p>
            Compare flagship smartphones,
            choose your perfect variant and
            get a transparent EMI plan with
            a secure digital application flow.
          </p>

          <div className="hero-actions">
            <Link
              href="#products"
              className="proceed hero-btn"
            >
              Explore products
            </Link>

            <Link
              href="/emi-calculator"
              className="outline-btn hero-btn"
            >
              Calculate EMI
            </Link>
          </div>

          <div className="hero-stats">
            <div>
              <strong>
                0%
              </strong>

              <span>
                Flexible plans
              </span>
            </div>

            <div>
              <strong>
                3+
              </strong>

              <span>
                Premium brands
              </span>
            </div>

            <div>
              <strong>
                100%
              </strong>

              <span>
                Digital process
              </span>
            </div>
          </div>
        </div>

        <div className="hero-art">
          <div className="hero-glow" />

          <div className="hero-phone">
            <div className="phone-camera">
              <span />
              <span />
              <span />
            </div>

            <div className="phone-screen">
              <div className="screen-notch" />

              <div className="screen-content">
                <small>
                  SMART EMI
                </small>

                <strong>
                  ₹5,999
                </strong>

                <span>
                  / month
                </span>
              </div>
            </div>
          </div>

          <div className="hero-chip">
            <span>
              ✦
            </span>

            <div>
              <small>
                Smart financing
              </small>

              <strong>
                Flexible EMI
              </strong>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCT SECTION */}

      <section
        id="products"
        className="products-section"
      >
        <div className="toolbar">
          <div>
            <div className="section-label">
              Premium collection
            </div>

            <h2>
              Popular smartphones
            </h2>

            <p>
              Live catalog powered by
              PostgreSQL
            </p>
          </div>

          <div className="filters">
            <div className="search-box">
              <span>
                🔍
              </span>

              <input
                aria-label="Search products"
                placeholder="Search brand or product..."
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
              />

              {search && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() =>
                    setSearch('')
                  }
                >
                  ×
                </button>
              )}
            </div>

            <select
              aria-label="Filter by brand"
              value={brand}
              onChange={(event) =>
                setBrand(
                  event.target.value
                )
              }
            >
              {brands.map(
                (brandName) => (
                  <option
                    key={brandName}
                    value={brandName}
                  >
                    {brandName}
                  </option>
                )
              )}
            </select>

            <select
              aria-label="Sort products"
              value={sort}
              onChange={(event) =>
                setSort(
                  event.target.value
                )
              }
            >
              <option value="newest">
                Newest
              </option>

              <option value="price_asc">
                Price: low to high
              </option>

              <option value="price_desc">
                Price: high to low
              </option>
            </select>
          </div>
        </div>

        {/* COMPARE BAR */}

        {compare.length > 0 && (
          <div className="compare-bar">
            <div>
              <span className="compare-icon">
                ⇄
              </span>

              <span>
                <strong>
                  {compare.length}
                </strong>{' '}
                product
                {compare.length > 1
                  ? 's'
                  : ''}{' '}
                selected
              </span>
            </div>

            <div className="compare-actions">
              <Link
                href={`/compare?ids=${compare.join(
                  ','
                )}`}
                className="proceed small-btn"
              >
                Compare now
              </Link>

              <button
                type="button"
                className="text-btn"
                onClick={() =>
                  setCompare([])
                }
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* LOADING */}

        {loading && (
          <div className="grid">
            {[
              1,
              2,
              3,
              4,
            ].map((item) => (
              <div
                className="product-skeleton"
                key={item}
              >
                <div className="skeleton-image" />

                <div className="skeleton-line short" />

                <div className="skeleton-line" />

                <div className="skeleton-line price" />

                <div className="skeleton-button" />
              </div>
            ))}
          </div>
        )}

        {/* ERROR */}

        {!loading && err && (
          <div className="state-card error">
            <div className="state-icon">
              ⚠
            </div>

            <h3>
              Unable to load products
            </h3>

            <p>
              Please check your backend
              connection and try again.
            </p>

            <button
              type="button"
              className="proceed"
              onClick={load}
            >
              Try again
            </button>
          </div>
        )}

        {/* EMPTY */}

        {!loading &&
          !err &&
          data.length === 0 && (
            <div className="state-card empty">
              <div className="state-icon">
                📦
              </div>

              <h3>
                No products available
              </h3>

              <p>
                No products matched your
                current filters.
              </p>

              <button
                type="button"
                className="proceed"
                onClick={
                  clearFilters
                }
              >
                Clear filters
              </button>
            </div>
          )}

        {/* PRODUCTS */}

        {!loading &&
          !err &&
          data.length > 0 && (
            <section className="grid">
              {data.map(
                (product) => (
                  <ProductCard
                    key={
                      product.id
                    }
                    p={product}
                    selected={compare.includes(
                      product.id
                    )}
                    onCompare={() =>
                      toggleCompare(
                        product.id
                      )
                    }
                  />
                )
              )}
            </section>
          )}
      </section>

      {/* TRUST FEATURES */}

      <section className="trust">
        <div className="trust-card">
          <span className="trust-icon">
            ₹
          </span>

          <div>
            <b>
              0 Down Payment
            </b>

            <small>
              Flexible options
            </small>
          </div>
        </div>

        <div className="trust-card">
          <span className="trust-icon">
            ⚡
          </span>

          <div>
            <b>
              Quick Approval
            </b>

            <small>
              Digital application
            </small>
          </div>
        </div>

        <div className="trust-card">
          <span className="trust-icon">
            ✓
          </span>

          <div>
            <b>
              Secure KYC
            </b>

            <small>
              Protected identity data
            </small>
          </div>
        </div>

        <div className="trust-card">
          <span className="trust-icon">
            ✦
          </span>

          <div>
            <b>
              Smart Recommendation
            </b>

            <small>
              Personalized plan insights
            </small>
          </div>
        </div>
      </section>
    </main>
  );
}