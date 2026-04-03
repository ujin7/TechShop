import prisma from '@/lib/prisma';
import { toProductDto } from '@/lib/db-serialize';
import { categories } from '@/data/categories';
import { products as localProducts } from '@/data/products';
import HomeClientSections from '@/components/home/HomeClientSections';

export const dynamic = 'force-dynamic';

const BANNERS = [
  {
    id: 1,
    title: '2026 Galaxy S25 Ultra flagship AI camera phone',
    subtitle: 'NEW ARRIVAL',
    ctaText: 'Buy now',
    ctaHref: '/products/prod_001',
    bgColor: '#1a1a2e',
    accentColor: '#66fcf1',
  },
  {
    id: 2,
    title: 'MacBook Pro M4 Max for creators and pros',
    subtitle: 'APPLE SILICON',
    ctaText: 'See details',
    ctaHref: '/products/prod_007',
    bgColor: '#0d0d1a',
    accentColor: '#a855f7',
  },
  {
    id: 3,
    title: 'Up to 30% off premium audio devices',
    subtitle: 'SPECIAL DEAL',
    ctaText: 'View audio deals',
    ctaHref: '/categories/audio',
    bgColor: '#0a1628',
    accentColor: '#3b82f6',
  },
];

export default async function Home() {
  let products = [];
  let categoriesWithCount = categories.map((cat) => ({ ...cat, productCount: 0 }));

  try {
    const [productRows, categoryCounts] = await Promise.all([
      prisma.product.findMany({
        orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
        take: 8,
      }),
      prisma.product.groupBy({
        by: ['category'],
        _count: { id: true },
      }),
    ]);

    products = productRows.map(toProductDto);
    const countMap = Object.fromEntries(categoryCounts.map((row) => [row.category, row._count.id]));
    categoriesWithCount = categories.map((cat) => ({
      ...cat,
      productCount: countMap[cat.slug] ?? 0,
    }));
  } catch (error) {
    console.error('Home fallback to local products:', error);
    products = localProducts.slice(0, 8);
    const countMap = localProducts.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] ?? 0) + 1;
      return acc;
    }, {});
    categoriesWithCount = categories.map((cat) => ({
      ...cat,
      productCount: countMap[cat.slug] ?? 0,
    }));
  }

  return (
    <HomeClientSections
      products={products}
      categories={categoriesWithCount}
      banners={BANNERS}
    />
  );
}
