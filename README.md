# 1Fi SDE-1 Assignment — Advanced Final

A production-style full-stack EMI marketplace inspired by the assignment reference. The catalog, variants, pricing, inventory and EMI plans are stored in PostgreSQL and served through REST APIs; the Next.js frontend consumes that data dynamically and provides product comparison, EMI calculation, smart plan recommendations, an application flow and privacy-conscious demo KYC.

## What is implemented

### Core assignment
- Dynamic PostgreSQL-backed product catalog — no product/price/EMI data is hardcoded in UI.
- 3 smartphone products, 2 variants each, with color, storage, image, price and stock.
- Multiple EMI plans per variant with monthly payment, tenure, interest, cashback and processing fee.
- Unique `/products/{slug}` URLs.
- Product listing and detail APIs.
- Variant selection updates product image, price and EMI plans.
- Single EMI plan selection with validation.
- Proceed/application flow and final application ID.
- Responsive mobile/tablet/desktop UI.

### Advanced SDE-1 features
- Search by product/brand.
- Brand filter and price sorting.
- Side-by-side product comparison.
- EMI calculator using reducing-balance formula.
- Smart EMI recommendation based on lowest monthly payment.
- Inventory validation and atomic stock reservation in a Prisma transaction.
- Application status lookup by application ID/number.
- Digital KYC flow with PAN/Aadhaar format validation.
- Privacy-first KYC storage: only masked last-four values are persisted; raw identity numbers/documents are not stored.
- KYC/application status lifecycle.
- Consistent API success/error envelopes.
- CORS configuration through environment variables.
- Database health endpoint.
- Lightweight OpenAPI endpoint at `/api/openapi`.
- Loading, error, empty and disabled/out-of-stock states.
- No payment gateway or real KYC provider is faked; the assignment uses a safe demo KYC workflow.

## Tech stack

- Frontend: Next.js 14, React 18, TypeScript
- Backend: Next.js Route Handlers / REST APIs
- Database: PostgreSQL
- ORM: Prisma 6
- Validation: Zod
- Styling: Responsive CSS
- Deployment: Vercel-compatible Next.js + managed PostgreSQL; Render/Railway-compatible Node process

## Project structure

```text
app/
  api/
    products/                 Product catalog APIs
    applications/             EMI application + KYC APIs
    health/                   Database health
    openapi/                  Lightweight OpenAPI metadata
  products/[slug]/            Dynamic product detail page
  compare/                    Product comparison
  emi-calculator/             EMI calculator
  application/                Applicant + KYC + status flow
  checkout/                   Safe assignment checkout redirect/info
components/
  ProductCard.tsx
lib/
  db.ts                       Prisma client
  api.ts                      API helpers + CORS
  emi.ts                      EMI calculations
  validation.ts               Zod request validation
prisma/
  schema.prisma               Database schema
  migrations/                 Versioned SQL migrations
  seed.ts                     Realistic local seed data
README.md
.env.example
```

## Environment variables

Copy `.env.example` to `.env`:

```env
DATABASE_URL=
NEXT_PUBLIC_API_URL=
FRONTEND_URL=
PORT=3000
```

Never commit `.env` or production credentials.

`NEXT_PUBLIC_API_URL` is available for a future split frontend/backend deployment; the current application uses same-origin routes by default. `FRONTEND_URL` controls the allowed CORS origin for API responses.

## Local setup

Requirements: Node.js 20+ and PostgreSQL 14+.

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run db:seed
npm run dev
```

Open `http://localhost:3000`.

For a production build:

```bash
npm run build
npm start
```

For a production database migration:

```bash
npx prisma migrate deploy
```

## Database

### Product
Canonical product information: slug, name, description, brand, category, MRP and base price.

### ProductVariant
A product can have many variants. Each variant stores color, storage, image URL, selling price and inventory.

### EMIPlan
EMI plans are attached to a product and variant and contain monthly payment, tenure, interest rate, cashback and processing fee.

### Application
Represents an EMI application and connects the selected product, variant and EMI plan. The application has a status lifecycle and a unique human-readable application number.

### KYCRecord
One-to-one with an application. Validates identity formats and stores only masked PAN/Aadhaar suffixes, address, DOB, consent and KYC status.

Relationships:

```text
Product 1 ─── * ProductVariant
Product 1 ─── * EMIPlan
ProductVariant 1 ─── * EMIPlan
Product 1 ─── * Application
ProductVariant 1 ─── * Application
EMIPlan 1 ─── * Application
Application 1 ─── 0..1 KYCRecord
```

## Seed data

The seed creates:

1. Apple iPhone 17 Pro — Silver 256GB, Black 512GB
2. Samsung Galaxy S24 Ultra — Titanium Gray 256GB, Titanium Black 512GB
3. Google Pixel 10 Pro — Obsidian 256GB, Porcelain 512GB

Every variant has three financing choices (12, 24 and 36 months) with different interest/cashback/processing-fee combinations.

## API documentation

All API responses use `{ success: true, data }` on success and `{ success: false, error }` on failure.

### GET `/api/products`

Optional query parameters:

- `search=iphone`
- `brand=Apple`
- `minPrice=50000`
- `maxPrice=150000`
- `sort=newest|price_asc|price_desc`

Example:

```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "slug": "iphone-17-pro",
      "name": "Apple iPhone 17 Pro",
      "mrp": 149999,
      "basePrice": 139999,
      "variants": [],
      "emiPlans": []
    }
  ]
}
```

### GET `/api/products/:id`

Looks up by database ID or slug and returns complete product, variants and EMI plans.

Example:

```text
GET /api/products/iphone-17-pro
```

### GET `/api/products/:id/emi-plans?variantId=:variantId`

Returns only valid EMI plans for the selected product/variant. The API verifies that the variant belongs to the requested product.

### POST `/api/applications`

Creates an EMI application after validating the product, variant and EMI plan. The stock reservation and application creation happen in a single database transaction.

Request:

```json
{
  "productId": "...",
  "variantId": "...",
  "emiPlanId": "...",
  "applicantName": "Demo User",
  "email": "demo@example.com",
  "phone": "9876543210"
}
```

### GET `/api/applications/:id`

Fetches application details by internal application ID or public application number.

### POST `/api/applications/kyc`

Validates PAN, Aadhaar, DOB, address, pincode and consent. Only masked identity suffixes are stored.

### GET `/api/health`

Checks PostgreSQL connectivity.

Example:

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "database": "connected"
  }
}
```

### GET `/api/openapi`

Returns lightweight OpenAPI metadata for the implemented REST surface.

## KYC security approach

This assignment does not pretend to be a production KYC provider. The UI demonstrates the complete application/KYC UX while avoiding unnecessary handling of sensitive documents. PAN and Aadhaar formats are validated at the API boundary, but only their final four characters are persisted. No uploaded identity document is stored, and no external KYC/payment provider is called.

For production, the KYC layer should be replaced with a compliant provider, encrypted storage, audit logs, access controls, retention policies and legal/compliance review.

## Deployment

### Vercel
1. Import the repository.
2. Create a managed PostgreSQL database.
3. Set `DATABASE_URL` in project environment variables.
4. Build with `npm run build`.
5. Run `npx prisma migrate deploy` against the production database.
6. Seed production only when intentionally required.

### Render / Railway
- Build: `npm install && npx prisma generate && npm run build`
- Start: `npm start`
- Environment: `DATABASE_URL`, `FRONTEND_URL`, `PORT`
- Release/migration command: `npx prisma migrate deploy`

Do not hardcode localhost or credentials into source code.

## Quality checks

Run before submission:

```bash
npm run typecheck
npm run lint
npm run build
```

Then manually verify:

- Product listing and API
- Search/filter/sort
- Product slug URL
- Variant image/price changes
- EMI plans and selection
- Compare flow
- EMI calculator
- Out-of-stock handling
- Application creation
- KYC validation and submission
- Application ID/status lookup
- Mobile responsiveness
- Database health

## Assignment deliverables

The assessment also asks for a 2–5 minute demo video, a GitHub repository and a deployed demo URL. The source repository includes the code/schema/seed/README required for the GitHub deliverable; add the final deployed URL and public demo-video URL after deployment.

## Submission checklist

- [x] Dynamic database-backed data
- [x] Backend APIs
- [x] Product details
- [x] Product variants
- [x] At least 3 products
- [x] At least 2 variants per product
- [x] Product images
- [x] MRP
- [x] Selling price
- [x] EMI monthly payment
- [x] EMI tenure
- [x] Interest rate
- [x] Cashback
- [x] EMI selection
- [x] Proceed button
- [x] Unique product URLs
- [x] Responsive UI
- [x] Database schema
- [x] Seed data
- [x] README/API documentation
- [x] Environment example
- [x] KYC/application flow
- [x] Product comparison
- [x] EMI calculator
- [x] Inventory transaction
- [x] Production migration command
- [x] OpenAPI metadata endpoint
