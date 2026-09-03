'use client';

import {
  Suspense,
  useEffect,
  useState,
} from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import './applicationPage.css';

const money = (n: number) =>
  `₹${Math.round(n).toLocaleString('en-IN')}`;

function IconCheck() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 12.5 9.5 18 20 6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconLock() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="5"
        y="11"
        width="14"
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M8 11V7.5a4 4 0 0 1 8 0V11"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ApplicationFlow() {
  const q = useSearchParams();

  const productSlug = q.get('product');
  const variantId = q.get('variant');
  const planId = q.get('plan');

  const [data, setData] = useState<any>(null);
  const [step, setStep] = useState(1);
  const [app, setApp] = useState<any>(null);
  const [status, setStatus] = useState<any>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  const [form, setForm] = useState({
    applicantName: '',
    email: '',
    phone: '',
  });

  const [kyc, setKyc] = useState({
    pan: '',
    aadhaar: '',
    dateOfBirth: '',
    addressLine: '',
    city: '',
    state: 'Uttar Pradesh',
    pincode: '',
    consent: false,
  });

  const [lookup, setLookup] =
    useState('');

  /*
   * ------------------------------------------------
   * LOAD APPLICATION / PRODUCT SELECTION
   * ------------------------------------------------
   */

  useEffect(() => {
    const id = q.get('id');

    if (id) {
      setLookup(id);
      setLoading(true);
      setError('');

      fetch(
        `/api/applications/${encodeURIComponent(id)}`
      )
        .then((r) =>
          r.ok
            ? r.json()
            : Promise.reject()
        )
        .then((x) => {
          setStatus(x.data);
          setStep(4);
        })
        .catch(() =>
          setError(
            'Application not found'
          )
        )
        .finally(() =>
          setLoading(false)
        );

      return;
    }

    if (
      !productSlug ||
      !variantId ||
      !planId
    ) {
      return;
    }

    setLoading(true);
    setError('');

    fetch(
      `/api/products/${encodeURIComponent(
        productSlug
      )}`
    )
      .then((r) =>
        r.ok
          ? r.json()
          : Promise.reject()
      )
      .then((x) => {
        const p = x.data;

        const v = p.variants.find(
          (a: any) =>
            a.id === variantId
        );

        const e = p.emiPlans.find(
          (a: any) =>
            a.id === planId
        );

        if (!v || !e) {
          throw new Error(
            'Invalid selection'
          );
        }

        setData({
          p,
          v,
          e,
        });
      })
      .catch(() =>
        setError(
          'Invalid application selection. Please select a product again.'
        )
      )
      .finally(() =>
        setLoading(false)
      );
  }, [
    productSlug,
    variantId,
    planId,
    q,
  ]);

  /*
   * ------------------------------------------------
   * CREATE APPLICATION
   * ------------------------------------------------
   */

  const createApplication = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!data) return;

    setLoading(true);
    setError('');

    try {
      const r = await fetch(
        '/api/applications',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            ...form,
            productId: data.p.id,
            variantId: data.v.id,
            emiPlanId: data.e.id,
          }),
        }
      );

      const x = await r.json();

      if (!r.ok) {
        throw new Error(
          x.error ||
            'Unable to create application'
        );
      }

      setApp(x.data);
      setStep(2);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'Unable to create application'
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * ------------------------------------------------
   * SUBMIT KYC
   * ------------------------------------------------
   */

  const submitKyc = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!app?.id) {
      setError(
        'Application session is missing. Please start again.'
      );
      return;
    }

    setLoading(true);
    setError('');

    try {
      const r = await fetch(
        '/api/applications/kyc',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            ...kyc,
            applicationId: app.id,
          }),
        }
      );

      const x = await r.json();

      if (!r.ok) {
        throw new Error(
          x.error ||
            'Unable to submit KYC'
        );
      }

      setStatus(x.data);
      setStep(3);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'Unable to submit KYC'
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * ------------------------------------------------
   * APPLICATION STATUS LOOKUP
   * ------------------------------------------------
   */

  const lookupStatus = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!lookup.trim()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const r = await fetch(
        `/api/applications/${encodeURIComponent(
          lookup.trim()
        )}`
      );

      const x = await r.json();

      if (!r.ok) {
        throw new Error(
          x.error ||
            'Application not found'
        );
      }

      setStatus(x.data);
      setStep(4);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'Application not found'
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * ------------------------------------------------
   * APPLICATION STATUS PAGE
   * ------------------------------------------------
   */

  if (
    !productSlug ||
    !variantId ||
    !planId
  ) {
    return (
      <main className="wrap application-page">
        <section className="summary">
          <div className="eyebrow">
            Application status
          </div>

          <h1>
            Check application status
          </h1>

          <p className="desc">
            Enter your application ID
            to view the latest status.
          </p>

          <form
            onSubmit={lookupStatus}
            className="stack"
          >
            <label>
              Application ID
              <input
                placeholder="e.g. 1FI-2026-AB12C"
                value={lookup}
                onChange={(e) =>
                  setLookup(
                    e.target.value
                  )
                }
              />
            </label>

            {error && (
              <div className="error small-error">
                {error}
              </div>
            )}

            <button
              className="proceed"
              disabled={loading}
              type="submit"
            >
              {loading
                ? 'Checking…'
                : 'Check status'}
            </button>
          </form>

          <Link
            className="cta"
            href="/"
          >
            Browse products
          </Link>
        </section>
      </main>
    );
  }

  /*
   * ------------------------------------------------
   * LOADING / ERROR
   * ------------------------------------------------
   */

  if (!data) {
    return (
      <main className="wrap application-page">
        <div
          className={
            error
              ? 'error'
              : 'loading'
          }
        >
          {error ||
            'Preparing your application…'}

          {error && (
            <div>
              <Link href="/">
                Back to products
              </Link>
            </div>
          )}
        </div>
      </main>
    );
  }

  /*
   * ------------------------------------------------
   * STEP 1 — APPLICANT DETAILS
   * ------------------------------------------------
   */

  if (step === 1) {
    return (
      <main className="wrap application-page">
        <div className="steps">
          <span className="active">
            1. Details
          </span>

          <span>
            2. KYC
          </span>

          <span>
            3. Complete
          </span>
        </div>

        <div className="application-grid">
          <section className="summary">
            <div className="success">
              <IconCheck />
              Selection locked
            </div>

            <h1>
              Start your EMI application
            </h1>

            <p className="desc">
              We only use these details
              to create your application.
              No payment is processed.
            </p>

            <div className="mini-product">
              <img
                src={data.v.image}
                alt={data.p.name}
              />

              <div>
                <b>
                  {data.p.name}
                </b>

                <span>
                  {data.v.color} ·{' '}
                  {data.v.storage}
                </span>

                <strong>
                  {money(data.v.price)}
                </strong>
              </div>
            </div>

            <div className="row">
              <span>
                EMI
              </span>

              <strong>
                {money(
                  data.e.monthlyPayment
                )}
                /month ·{' '}
                {data.e.tenureMonths}{' '}
                months
              </strong>
            </div>

            <div className="row">
              <span>
                Cashback
              </span>

              <strong>
                {money(
                  data.e.cashback
                )}
              </strong>
            </div>
          </section>

          <form
            className="summary"
            onSubmit={
              createApplication
            }
          >
            <h2>
              Applicant details
            </h2>

            <label>
              Full name

              <input
                required
                value={
                  form.applicantName
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    applicantName:
                      e.target.value,
                  })
                }
              />
            </label>

            <label>
              Email

              <input
                required
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email:
                      e.target.value,
                  })
                }
              />
            </label>

            <label>
              Mobile number

              <input
                required
                inputMode="numeric"
                maxLength={10}
                placeholder="10-digit mobile"
                value={form.phone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    phone:
                      e.target.value.replace(
                        /\D/g,
                        ''
                      ),
                  })
                }
              />
            </label>

            {error && (
              <div className="error small-error">
                {error}
              </div>
            )}

            <button
              className="proceed"
              disabled={loading}
              type="submit"
            >
              {loading
                ? 'Creating…'
                : 'Continue to KYC'}
            </button>
          </form>
        </div>
      </main>
    );
  }

  /*
   * ------------------------------------------------
   * STEP 2 — KYC
   * ------------------------------------------------
   */

  if (step === 2) {
    return (
      <main className="wrap application-page">
        <div className="steps">
          <span>
            1. Details
          </span>

          <span className="active">
            2. KYC
          </span>

          <span>
            3. Complete
          </span>
        </div>

        <form
          className="summary kyc-form"
          onSubmit={submitKyc}
        >
          <div className="kyc-head">
            <div>
              <div className="eyebrow">
                Digital KYC
              </div>

              <h1>
                Verify your identity
              </h1>

              <p className="desc">
                Demo-grade KYC flow for
                the assignment. Only the
                last four characters of
                PAN/Aadhaar are persisted.
              </p>
            </div>

            <span className="secure">
              <IconLock />
              Encrypted
            </span>
          </div>

          <div className="notice">
            For privacy, never store raw
            identity documents in a demo
            database. This implementation
            validates format and stores
            masked suffixes only.
          </div>

          <div className="form-grid">
            <label>
              PAN

              <input
                required
                maxLength={10}
                placeholder="ABCDE1234F"
                value={kyc.pan}
                onChange={(e) =>
                  setKyc({
                    ...kyc,
                    pan:
                      e.target.value.toUpperCase(),
                  })
                }
              />
            </label>

            <label>
              Aadhaar

              <input
                required
                inputMode="numeric"
                maxLength={12}
                placeholder="12-digit Aadhaar"
                value={kyc.aadhaar}
                onChange={(e) =>
                  setKyc({
                    ...kyc,
                    aadhaar:
                      e.target.value.replace(
                        /\D/g,
                        ''
                      ),
                  })
                }
              />
            </label>

            <label>
              Date of birth

              <input
                required
                type="date"
                value={
                  kyc.dateOfBirth
                }
                onChange={(e) =>
                  setKyc({
                    ...kyc,
                    dateOfBirth:
                      e.target.value,
                  })
                }
              />
            </label>

            <label>
              Pincode

              <input
                required
                inputMode="numeric"
                maxLength={6}
                value={kyc.pincode}
                onChange={(e) =>
                  setKyc({
                    ...kyc,
                    pincode:
                      e.target.value.replace(
                        /\D/g,
                        ''
                      ),
                  })
                }
              />
            </label>

            <label>
              City

              <input
                required
                value={kyc.city}
                onChange={(e) =>
                  setKyc({
                    ...kyc,
                    city:
                      e.target.value,
                  })
                }
              />
            </label>

            <label>
              State

              <input
                required
                value={kyc.state}
                onChange={(e) =>
                  setKyc({
                    ...kyc,
                    state:
                      e.target.value,
                  })
                }
              />
            </label>

            <label className="full">
              Address

              <input
                required
                value={
                  kyc.addressLine
                }
                onChange={(e) =>
                  setKyc({
                    ...kyc,
                    addressLine:
                      e.target.value,
                  })
                }
              />
            </label>
          </div>

          <label className="check">
            <input
              type="checkbox"
              checked={kyc.consent}
              onChange={(e) =>
                setKyc({
                  ...kyc,
                  consent:
                    e.target.checked,
                })
              }
            />

            <span>
              I consent to KYC
              verification and the
              storage of masked identity
              information for this
              application.
            </span>
          </label>

          {error && (
            <div className="error small-error">
              {error}
            </div>
          )}

          <button
            className="proceed"
            disabled={
              loading ||
              !kyc.consent
            }
            type="submit"
          >
            {loading
              ? 'Submitting securely…'
              : 'Submit KYC'}
          </button>
        </form>
      </main>
    );
  }

  /*
   * ------------------------------------------------
   * STEP 3 — COMPLETE
   * ------------------------------------------------
   */

  if (step === 3) {
    return (
      <main className="wrap application-page">
        <section className="summary success-page">
          <div className="success">
            <IconCheck />
            KYC submitted successfully
          </div>

          <div className="big-check">
            <IconCheck />
          </div>

          <h1>
            Application received
          </h1>

          <p className="desc">
            Your EMI application is now
            in the verification queue.
          </p>

          <div className="application-id">
            <small>
              Application ID
            </small>

            <strong>
              {app.applicationNo}
            </strong>

            <button
              type="button"
              className="outline-btn"
              onClick={() =>
                navigator.clipboard?.writeText(
                  app.applicationNo
                )
              }
            >
              Copy ID
            </button>
          </div>

          <div className="row">
            <span>
              KYC status
            </span>

            <strong>
              {status?.status ||
                'SUBMITTED'}
            </strong>
          </div>

          <div className="row">
            <span>
              Masked PAN
            </span>

            <strong>
              {status?.maskedPan}
            </strong>
          </div>

          <div className="row">
            <span>
              Masked Aadhaar
            </span>

            <strong>
              {status?.maskedAadhaar}
            </strong>
          </div>

          <Link
            className="proceed cta"
            href={`/application?id=${encodeURIComponent(
              app.applicationNo
            )}`}
          >
            Check application status
          </Link>
        </section>
      </main>
    );
  }

  /*
   * ------------------------------------------------
   * STEP 4 — APPLICATION STATUS
   * ------------------------------------------------
   */

  return (
    <main className="wrap application-page">
      <section className="summary">
        <div className="success">
          <IconCheck />
          Application found
        </div>

        <h1>
          {status.applicationNo}
        </h1>

        <p className="desc">
          Current status:{' '}
          <strong>
            {status.status}
          </strong>
        </p>

        <div className="row">
          <span>
            Product
          </span>

          <strong>
            {status.product?.name}
          </strong>
        </div>

        <div className="row">
          <span>
            Variant
          </span>

          <strong>
            {status.variant?.color} ·{' '}
            {status.variant?.storage}
          </strong>
        </div>

        <div className="row">
          <span>
            EMI
          </span>

          <strong>
            {money(
              status.emiPlan
                ?.monthlyPayment || 0
            )}
            /month
          </strong>
        </div>

        <div className="row">
          <span>
            Created
          </span>

          <strong>
            {status.createdAt
              ? new Date(
                  status.createdAt
                ).toLocaleString(
                  'en-IN'
                )
              : '—'}
          </strong>
        </div>

        <Link
          className="cta"
          href="/"
        >
          Back to products
        </Link>
      </section>
    </main>
  );
}

/*
 * ------------------------------------------------
 * PAGE EXPORT
 * ------------------------------------------------
 */

export default function ApplicationPage() {
  return (
    <Suspense
      fallback={
        <main className="wrap application-page">
          <div className="loading">
            Preparing application…
          </div>
        </main>
      }
    >
      <ApplicationFlow />
    </Suspense>
  );
}