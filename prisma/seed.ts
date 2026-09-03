import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Stable, generic smartphone stock photography (Unsplash), cycled across products.
// These are placeholder images for a demo catalog, not brand-official photos.
const IMAGES = [
  'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1603921326210-6edd2d60ca68?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1567581935884-3349723552ca?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1520923642038-b4259acecbd7?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1533228100845-08145b01de14?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=900&q=85',
];

const COLOR_PAIRS: [string, string][] = [
  ['Midnight Black', 'Arctic Silver'],
  ['Titanium Gray', 'Titanium Blue'],
  ['Obsidian', 'Porcelain'],
  ['Phantom Violet', 'Phantom Black'],
  ['Aqua Green', 'Starlight'],
  ['Graphite', 'Cream'],
];

const STORAGE_PAIRS: [string, string][] = [
  ['128GB', '256GB'],
  ['256GB', '512GB'],
  ['256GB', '1TB'],
];

type Def = { brand: string; model: string; tier: 'flagship' | 'premium' | 'mid'; mrp: number };

// 51 realistic current-generation smartphone entries across the required brands.
const DEFS: Def[] = [
  { brand: 'Apple', model: 'iPhone 17 Pro Max', tier: 'flagship', mrp: 179999 },
  { brand: 'Apple', model: 'iPhone 17 Pro', tier: 'flagship', mrp: 149999 },
  { brand: 'Apple', model: 'iPhone 17', tier: 'premium', mrp: 89999 },
  { brand: 'Apple', model: 'iPhone 16e', tier: 'mid', mrp: 59999 },
  { brand: 'Apple', model: 'iPhone 15', tier: 'mid', mrp: 64999 },
  { brand: 'Samsung', model: 'Galaxy S25 Ultra', tier: 'flagship', mrp: 149999 },
  { brand: 'Samsung', model: 'Galaxy S25+', tier: 'flagship', mrp: 109999 },
  { brand: 'Samsung', model: 'Galaxy S25', tier: 'premium', mrp: 84999 },
  { brand: 'Samsung', model: 'Galaxy Z Fold 6', tier: 'flagship', mrp: 169999 },
  { brand: 'Samsung', model: 'Galaxy Z Flip 6', tier: 'premium', mrp: 109999 },
  { brand: 'Samsung', model: 'Galaxy A56', tier: 'mid', mrp: 39999 },
  { brand: 'Samsung', model: 'Galaxy A36', tier: 'mid', mrp: 29999 },
  { brand: 'Google', model: 'Pixel 10 Pro XL', tier: 'flagship', mrp: 139999 },
  { brand: 'Google', model: 'Pixel 10 Pro', tier: 'flagship', mrp: 119999 },
  { brand: 'Google', model: 'Pixel 10', tier: 'premium', mrp: 79999 },
  { brand: 'Google', model: 'Pixel 9a', tier: 'mid', mrp: 49999 },
  { brand: 'OnePlus', model: '13 Pro', tier: 'flagship', mrp: 84999 },
  { brand: 'OnePlus', model: '13', tier: 'flagship', mrp: 69999 },
  { brand: 'OnePlus', model: '13R', tier: 'premium', mrp: 44999 },
  { brand: 'OnePlus', model: 'Nord 5', tier: 'mid', mrp: 32999 },
  { brand: 'OnePlus', model: 'Nord CE 5', tier: 'mid', mrp: 24999 },
  { brand: 'Xiaomi', model: '15 Ultra', tier: 'flagship', mrp: 99999 },
  { brand: 'Xiaomi', model: '15 Pro', tier: 'premium', mrp: 74999 },
  { brand: 'Xiaomi', model: '15', tier: 'premium', mrp: 54999 },
  { brand: 'Xiaomi', model: 'Redmi Note 14 Pro+', tier: 'mid', mrp: 29999 },
  { brand: 'Xiaomi', model: 'Redmi Note 14', tier: 'mid', mrp: 18999 },
  { brand: 'Nothing', model: 'Phone (3)', tier: 'premium', mrp: 59999 },
  { brand: 'Nothing', model: 'Phone (3a) Pro', tier: 'mid', mrp: 32999 },
  { brand: 'Nothing', model: 'Phone (3a)', tier: 'mid', mrp: 24999 },
  { brand: 'Motorola', model: 'Edge 60 Pro', tier: 'premium', mrp: 39999 },
  { brand: 'Motorola', model: 'Edge 60', tier: 'mid', mrp: 27999 },
  { brand: 'Motorola', model: 'Razr 60 Ultra', tier: 'flagship', mrp: 99999 },
  { brand: 'Motorola', model: 'Moto G96', tier: 'mid', mrp: 17999 },
  { brand: 'Vivo', model: 'X200 Pro', tier: 'flagship', mrp: 94999 },
  { brand: 'Vivo', model: 'X200', tier: 'premium', mrp: 64999 },
  { brand: 'Vivo', model: 'V40 Pro', tier: 'mid', mrp: 42999 },
  { brand: 'Vivo', model: 'Y300 Pro', tier: 'mid', mrp: 22999 },
  { brand: 'Oppo', model: 'Find X8 Pro', tier: 'flagship', mrp: 89999 },
  { brand: 'Oppo', model: 'Find X8', tier: 'premium', mrp: 64999 },
  { brand: 'Oppo', model: 'Reno 13 Pro', tier: 'mid', mrp: 39999 },
  { brand: 'Oppo', model: 'Reno 13', tier: 'mid', mrp: 29999 },
  { brand: 'Realme', model: 'GT 7 Pro', tier: 'premium', mrp: 54999 },
  { brand: 'Realme', model: 'GT 7', tier: 'mid', mrp: 39999 },
  { brand: 'Realme', model: '14 Pro+', tier: 'mid', mrp: 26999 },
  { brand: 'Realme', model: '14x', tier: 'mid', mrp: 14999 },
  { brand: 'Asus', model: 'ROG Phone 9 Pro', tier: 'flagship', mrp: 109999 },
  { brand: 'Asus', model: 'ROG Phone 9', tier: 'flagship', mrp: 79999 },
  { brand: 'Asus', model: 'Zenfone 12 Ultra', tier: 'premium', mrp: 69999 },
  { brand: 'Sony', model: 'Xperia 1 VII', tier: 'flagship', mrp: 134999 },
  { brand: 'Sony', model: 'Xperia 10 VI', tier: 'mid', mrp: 44999 },
  { brand: 'Sony', model: 'Xperia 5 VI', tier: 'premium', mrp: 74999 },
];

function slugify(brand: string, model: string) {
  return `${brand}-${model}`
    .toLowerCase()
    .replace(/\+/g, '-plus') // preserve "+" as a distinguishing token (e.g. "S25+" vs "S25")
    .replace(/[()]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function descriptionFor(brand: string, model: string, tier: Def['tier']) {
  const byTier = {
    flagship:
      'A flagship-tier smartphone with a top-of-line camera system, premium build and the fastest chipset in the lineup.',
    premium:
      'A well-rounded premium smartphone balancing a strong camera, smooth performance and all-day battery life.',
    mid: 'A value-focused smartphone offering dependable performance and a capable camera for everyday use.',
  } as const;
  return `${brand} ${model}. ${byTier[tier]}`;
}

function buildVariants(def: Def, index: number) {
  const colors = COLOR_PAIRS[index % COLOR_PAIRS.length];
  const storages = STORAGE_PAIRS[index % STORAGE_PAIRS.length];
  const img1 = IMAGES[index % IMAGES.length];
  const img2 = IMAGES[(index + 5) % IMAGES.length];

  // Higher-storage variant costs a defined step more than the base price.
  const storageStepMap: Record<string, number> = {
    '128GB': 0,
    '256GB': 8000,
    '512GB': 16000,
    '1TB': 28000,
  };

  return [
    {
      color: colors[0],
      storage: storages[0],
      image: img1,
      price: def.mrp - Math.round(def.mrp * 0.06) + storageStepMap[storages[0]],
      stock: 3 + (index % 9), // deliberately includes some low-stock (<=5) variants
    },
    {
      color: colors[1],
      storage: storages[1],
      image: img2,
      price: def.mrp - Math.round(def.mrp * 0.06) + storageStepMap[storages[1]],
      stock: 10 + (index % 20),
    },
  ];
}

function buildEmiPlans(price: number) {
  return [
    {
      monthlyPayment: Math.round((price / 12) * 1.0),
      tenureMonths: 12,
      interestRate: 0,
      cashback: 500,
      processingFee: 0,
    },
    {
      monthlyPayment: Math.round((price / 24) * 1.105),
      tenureMonths: 24,
      interestRate: 10.5,
      cashback: 2000,
      processingFee: 499,
    },
    {
      monthlyPayment: Math.round((price / 36) * 1.12),
      tenureMonths: 36,
      interestRate: 12,
      cashback: 3000,
      processingFee: 699,
    },
  ];
}

async function main() {
  console.log(`Seeding ${DEFS.length} products...`);

  // Clean in FK-safe order; idempotent for repeated `prisma db seed` runs.
  await prisma.kYCRecord.deleteMany();
  await prisma.application.deleteMany();
  await prisma.eMIPlan.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();

  let variantCount = 0;
  let planCount = 0;

  for (let i = 0; i < DEFS.length; i++) {
    const def = DEFS[i];
    const slug = slugify(def.brand, def.model);
    const basePrice = def.mrp - Math.round(def.mrp * 0.06);
    const variantDefs = buildVariants(def, i);

    const created = await prisma.product.create({
      data: {
        slug,
        name: `${def.brand} ${def.model}`,
        brand: def.brand,
        category: 'Smartphones',
        description: descriptionFor(def.brand, def.model, def.tier),
        mrp: def.mrp,
        basePrice,
        variants: {
          create: variantDefs.map((v) => ({
            name: `${v.color} / ${v.storage}`,
            color: v.color,
            storage: v.storage,
            image: v.image,
            price: v.price,
            stock: v.stock,
          })),
        },
      },
      include: { variants: true },
    });

    variantCount += created.variants.length;

    for (const variant of created.variants) {
      const plans = buildEmiPlans(variant.price);
      for (const plan of plans) {
        await prisma.eMIPlan.create({
          data: { productId: created.id, variantId: variant.id, ...plan },
        });
        planCount += 1;
      }
    }
  }

  console.log(`Done: ${DEFS.length} products, ${variantCount} variants, ${planCount} EMI plans.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());