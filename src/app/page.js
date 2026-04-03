import prisma from '@/lib/prisma';
import { toProductDto } from '@/lib/db-serialize';
import { categories } from '@/data/categories';
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

  const products = productRows.map(toProductDto);
  const countMap = Object.fromEntries(categoryCounts.map((row) => [row.category, row._count.id]));
  const categoriesWithCount = categories.map((cat) => ({
    ...cat,
    productCount: countMap[cat.slug] ?? 0,
  }));

  return (
    <HomeClientSections
      products={products}
      categories={categoriesWithCount}
      banners={BANNERS}
    />
  );
}
