import { db } from '@/lib/db';
import { error, json, withCors } from '@/lib/api';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const application = await db.application.findFirst({ where: { OR: [{ id: params.id }, { applicationNo: params.id }] }, include: { product: true, variant: true, emiPlan: true, kyc: true } });
    if (!application) return withCors(error('Application not found', 404));
    return withCors(json(application));
  } catch {
    return withCors(error('Unable to load application'));
  }
}
