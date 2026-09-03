import { db } from '@/lib/db';
import { applicationSchema } from '@/lib/validation';
import { error, json, withCors } from '@/lib/api';

function applicationNo() {
  return `1FI-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

export async function POST(req: Request) {
  try {
    const parsed = applicationSchema.safeParse(await req.json());
    if (!parsed.success) return withCors(error('Invalid application details', 400, parsed.error.flatten()));
    const input = parsed.data;

    const result = await db.$transaction(async (tx) => {
      const variant = await tx.productVariant.findFirst({ where: { id: input.variantId, productId: input.productId } });
      if (!variant) throw new Error('VARIANT_NOT_FOUND');
      if (variant.stock < 1) throw new Error('OUT_OF_STOCK');
      const plan = await tx.eMIPlan.findFirst({ where: { id: input.emiPlanId, productId: input.productId, OR: [{ variantId: input.variantId }, { variantId: null }] } });
      if (!plan) throw new Error('PLAN_NOT_FOUND');
      const product = await tx.product.findUnique({ where: { id: input.productId }, select: { id: true } });
      if (!product) throw new Error('PRODUCT_NOT_FOUND');
      const reserved = await tx.productVariant.updateMany({ where: { id: variant.id, stock: { gt: 0 } }, data: { stock: { decrement: 1 } } });
      if (reserved.count !== 1) throw new Error('OUT_OF_STOCK');
      return tx.application.create({ data: { applicationNo: applicationNo(), productId: input.productId, variantId: input.variantId, emiPlanId: input.emiPlanId, applicantName: input.applicantName, email: input.email, phone: input.phone } });
    });
    return withCors(json(result, { status: 201 }));
  } catch (e) {
    const message = e instanceof Error ? e.message : '';
    if (message === 'OUT_OF_STOCK') return withCors(error('This variant is out of stock', 409));
    if (message === 'VARIANT_NOT_FOUND') return withCors(error('Invalid product variant', 400));
    if (message === 'PLAN_NOT_FOUND') return withCors(error('Invalid EMI plan', 400));
    return withCors(error('Unable to create application'));
  }
}
