import { db } from '@/lib/db';
import { error, json, withCors } from '@/lib/api';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get('search')?.trim();
    const brand = url.searchParams.get('brand')?.trim();
    const minPrice = Number(url.searchParams.get('minPrice') || 0);
    const maxPriceParam = url.searchParams.get('maxPrice');
    const maxPrice = maxPriceParam ? Number(maxPriceParam) : undefined;
    const sort = url.searchParams.get('sort') || 'newest';

    const products = await db.product.findMany({
      where: {
        ...(search ? { OR: [{ name: { contains: search, mode: 'insensitive' } }, { brand: { contains: search, mode: 'insensitive' } }] } : {}),
        ...(brand ? { brand: { equals: brand, mode: 'insensitive' } } : {}),
        basePrice: { gte: Number.isFinite(minPrice) ? minPrice : 0, ...(maxPrice && Number.isFinite(maxPrice) ? { lte: maxPrice } : {}) },
      },
      include: { variants: true, emiPlans: true },
      orderBy: sort === 'price_asc' ? { basePrice: 'asc' } : sort === 'price_desc' ? { basePrice: 'desc' } : { createdAt: 'desc' },
    });

    const response = json(products);
    return withCors(response);
  } catch {
    return withCors(error('Unable to load products'));
  }
}

export async function OPTIONS() {
  return withCors(new Response(null, { status: 204 }));
}
