import { z } from 'zod';

export const applicationSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().min(1),
  emiPlanId: z.string().min(1),
  applicantName: z.string().min(2).max(80),
  email: z.string().email(),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
});

export const kycSchema = z.object({
  applicationId: z.string().min(1),
  pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, 'Invalid PAN format'),
  aadhaar: z.string().regex(/^\d{12}$/, 'Aadhaar must contain 12 digits'),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  addressLine: z.string().min(5).max(160),
  city: z.string().min(2).max(60),
  state: z.string().min(2).max(60),
  pincode: z.string().regex(/^\d{6}$/),
  consent: z.literal(true),
});
