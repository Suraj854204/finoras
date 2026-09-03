CREATE TYPE "ApplicationStatus" AS ENUM ('KYC_PENDING', 'KYC_SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED');
CREATE TYPE "KYCStatus" AS ENUM ('SUBMITTED', 'VERIFIED', 'REJECTED');

CREATE TABLE "Application" (
  "id" TEXT NOT NULL,
  "applicationNo" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "variantId" TEXT NOT NULL,
  "emiPlanId" TEXT NOT NULL,
  "status" "ApplicationStatus" NOT NULL DEFAULT 'KYC_PENDING',
  "applicantName" TEXT,
  "email" TEXT,
  "phone" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Application_applicationNo_key" ON "Application"("applicationNo");
CREATE INDEX "Application_status_idx" ON "Application"("status");
CREATE INDEX "Application_createdAt_idx" ON "Application"("createdAt");

CREATE TABLE "KYCRecord" (
  "id" TEXT NOT NULL,
  "applicationId" TEXT NOT NULL,
  "panLast4" TEXT NOT NULL,
  "aadhaarLast4" TEXT NOT NULL,
  "dateOfBirth" TIMESTAMP(3) NOT NULL,
  "addressLine" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "state" TEXT NOT NULL,
  "pincode" TEXT NOT NULL,
  "documentVerified" BOOLEAN NOT NULL DEFAULT false,
  "consent" BOOLEAN NOT NULL,
  "status" "KYCStatus" NOT NULL DEFAULT 'SUBMITTED',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "KYCRecord_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "KYCRecord_applicationId_key" ON "KYCRecord"("applicationId");
CREATE INDEX "KYCRecord_status_idx" ON "KYCRecord"("status");

ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
CREATE INDEX IF NOT EXISTS "Product_basePrice_idx" ON "Product"("basePrice");
CREATE INDEX IF NOT EXISTS "ProductVariant_stock_idx" ON "ProductVariant"("stock");
CREATE INDEX IF NOT EXISTS "EMIPlan_productId_tenureMonths_idx" ON "EMIPlan"("productId", "tenureMonths");

ALTER TABLE "Application" ADD CONSTRAINT "Application_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Application" ADD CONSTRAINT "Application_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Application" ADD CONSTRAINT "Application_emiPlanId_fkey" FOREIGN KEY ("emiPlanId") REFERENCES "EMIPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "KYCRecord" ADD CONSTRAINT "KYCRecord_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;
