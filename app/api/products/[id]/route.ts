import { db } from '@/lib/db';
import { error, json, withCors } from '@/lib/api';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const product = await db.product.findFirst({
      where: { OR: [{ id: params.id }, { slug: params.id }] },
      include: { variants: true, emiPlans: true },
    });
    if (!product) return withCors(error('Product not found', 404));
    return withCors(json(product));
  } catch {
    return withCors(error('Unable to load product'));
  }
}
