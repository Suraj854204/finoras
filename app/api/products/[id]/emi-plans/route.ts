import { db } from '@/lib/db';
import { error, json, withCors } from '@/lib/api';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const u = new URL(req.url);
    const variantId = u.searchParams.get('variantId');
    const product = await db.product.findFirst({ where: { OR: [{ id: params.id }, { slug: params.id }] }, select: { id: true } });
    if (!product) return withCors(error('Product not found', 404));
    if (variantId) {
      const variant = await db.productVariant.findFirst({ where: { id: variantId, productId: product.id }, select: { id: true } });
      if (!variant) return withCors(error('Variant does not belong to product', 400));
    }
    const plans = await db.eMIPlan.findMany({
      where: { productId: product.id, ...(variantId ? { variantId } : {}) },
      orderBy: [{ tenureMonths: 'asc' }, { monthlyPayment: 'asc' }],
    });
    return withCors(json(plans));
  } catch {
    return withCors(error('Unable to load EMI plans'));
  }
}
