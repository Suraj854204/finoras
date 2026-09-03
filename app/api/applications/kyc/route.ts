import { db } from '@/lib/db';
import { kycSchema } from '@/lib/validation';
import { error, json, withCors } from '@/lib/api';

export async function POST(req: Request) {
  try {
    const parsed = kycSchema.safeParse(await req.json());
    if (!parsed.success) return withCors(error('Invalid KYC details', 400, parsed.error.flatten()));
    const input = parsed.data;
    const application = await db.application.findUnique({ where: { id: input.applicationId } });
    if (!application) return withCors(error('Application not found', 404));
    const dob = new Date(`${input.dateOfBirth}T00:00:00.000Z`);
    if (Number.isNaN(dob.getTime()) || dob > new Date()) return withCors(error('Invalid date of birth', 400));
    const record = await db.$transaction(async (tx) => {
      const kyc = await tx.kYCRecord.upsert({
        where: { applicationId: input.applicationId },
        update: { panLast4: input.pan.slice(-4), aadhaarLast4: input.aadhaar.slice(-4), dateOfBirth: dob, addressLine: input.addressLine, city: input.city, state: input.state, pincode: input.pincode, consent: input.consent, status: 'SUBMITTED' },
        create: { applicationId: input.applicationId, panLast4: input.pan.slice(-4), aadhaarLast4: input.aadhaar.slice(-4), dateOfBirth: dob, addressLine: input.addressLine, city: input.city, state: input.state, pincode: input.pincode, consent: input.consent },
      });
      await tx.application.update({ where: { id: input.applicationId }, data: { status: 'KYC_SUBMITTED' } });
      return kyc;
    });
    return withCors(json({ id: record.id, status: record.status, maskedPan: `XXXXXX${record.panLast4}`, maskedAadhaar: `XXXXXXXX${record.aadhaarLast4}` }, { status: 201 }));
  } catch {
    return withCors(error('Unable to submit KYC'));
  }
}
