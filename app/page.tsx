'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';

type Variant = {
  id: string;
  image: string;
};

type EmiPlan = {
  id?: string;
  monthlyPayment: number;
};

type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  mrp: number;
  basePrice: number;
  variants: Variant[];
  emiPlans: EmiPlan[];
};

type ApiResponse = {
  data?: Product[];
};

export default function Home() {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(false);

  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState('All');
  const [sort, setSort] = useState('newest');

  const [compare, setCompare] = useState<string[]>([]);

  const load = async () => {
    try {
      setLoading(true);
      setErr(false);

      const q = new URLSearchParams();

      if (search.trim()) {
        q.set('search', search.trim());
      }

      if (brand !== 'All') {
        q.set('brand', brand);
      }

      q.set('sort', sort);

      const response = await fetch(`/api/products?${q.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to load products');
      }

      const result: ApiResponse = await response.json();

      setData(result.data ?? []);
    } catch (error) {
      console.error('Products loading error:', error);
      setErr(true);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      void load();
    }, 250);

    return () => clearTimeout(timer);
  }, [search, brand, sort]);

  const brands = [
    'All',
    ...Array.from(new Set(data.map((product) => product.brand))),
  ];

  const toggleCompare = (productId: string) => {
    setCompare((current) => {
      if (current.includes(productId)) {
        return current.filter((id) => id !== productId);
      }

      if (current.length >= 3) {
        return current;
      }

      return [...current, productId];
    });
  };

  const clearFilters = () => {
    setSearch('');
    setBrand('All');
  };

  return (
    <main className="wrap">
      {/* Hero */}
      <section className="hero">
        <div>
          <div className="eyebrow">Smart EMI marketplace</div>

          <h1>
            Own the tech you want.
            <br />
            <span>Pay your way.</span>
          </h1>

          <p>
            Compare flagship smartphones, choose a variant and get a
            transparent EMI plan backed by trusted mutual-fund financing and a
            secure digital application flow.
          </p>

          <div className="hero-actions">
            <Link className="proceed hero-btn" href="#products">
              Explore products
            </Link>

            <Link
              className="outline-btn hero-btn"
              href="/emi-calculator"
            >
              Calculate EMI
            </Link>
          </div>
        </div>

        <div className="hero-art">
          <div className="hero-phone">📱</div>

          <div className="hero-chip">
            Low interest
            <br />
            <strong>Flexible EMI</strong>
          </div>
        </div>
      </section>

      {/* Products toolbar */}
      <section id="products" className="toolbar">
        <div>
          <h2>Popular smartphones</h2>
          <p>Live catalog from PostgreSQL</p>
        </div>

        <div className="filters">
          <input
            aria-label="Search products"
            placeholder="Search brand or product…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select
            aria-label="Filter by brand"
            value={brand}
            onChange={(event) => setBrand(event.target.value)}
          >
            {brands.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            aria-label="Sort products"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: low to high</option>
            <option value="price_desc">Price: high to low</option>
          </select>
        </div>
      </section>

      {/* Compare bar */}
      {compare.length > 0 && (
        <div className="compare-bar">
          <span>
            <strong>{compare.length}</strong>{' '}
            product{compare.length > 1 ? 's' : ''} selected
          </span>

          <Link
            className="proceed small-btn"
            href={`/compare?ids=${compare.join(',')}`}
          >
            Compare now
          </Link>

          <button
            type="button"
            className="text-btn"
            onClick={() => setCompare([])}
          >
            Clear
          </button>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="skeleton-grid">
          {[1, 2, 3].map((item) => (
            <div className="skeleton" key={item} />
          ))}
        </div>
      ) : err ? (
        /* Error */
        <div className="error">
          Unable to load products. Please try again.

          <button type="button" onClick={() => void load()}>
            Retry
          </button>
        </div>
      ) : data.length === 0 ? (
        /* Empty */
        <div className="empty">
          <p>No products available.</p>

          <button type="button" onClick={clearFilters}>
            Clear filters
          </button>
        </div>
      ) : (
        /* Products */
        <section className="grid">
          {data.map((product) => (
            <ProductCard
              key={product.id}
              p={product}
              selected={compare.includes(product.id)}
              onCompare={() => toggleCompare(product.id)}
            />
          ))}
        </section>
      )}

      {/* Trust section */}
      <section className="trust">
        <div>
          <b>0 Down Payment</b>
          <small>Flexible options</small>
        </div>

        <div>
          <b>Quick Approval</b>
          <small>Digital application</small>
        </div>

        <div>
          <b>Secure KYC</b>
          <small>Masked identity data</small>
        </div>

        <div>
          <b>Smart Recommendation</b>
          <small>Plan insights</small>
        </div>
      </section>
    </main>
  );
}