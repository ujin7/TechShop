import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { toProductDto } from '@/lib/db-serialize';
import { filterProducts, extractBrands, extractPriceRange } from '@/utils/filterProducts';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const category = searchParams.get('category') ?? null;
  const subcategory = searchParams.get('subcategory') ?? null;
  const brands = searchParams.get('brands')?.split(',').filter(Boolean) ?? [];
  const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : null;
  const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : null;
  const minRating = searchParams.get('minRating') ? Number(searchParams.get('minRating')) : null;
  const inStockOnly = searchParams.get('inStock') === 'true';
  const sort = searchParams.get('sort') ?? 'popular';
  const q = searchParams.get('q') ?? '';
  const page = Math.max(1, Number(searchParams.get('page') ?? 1));
  const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit') ?? 20)));
  const featured = searchParams.get('featured') === 'true';
  const isNew = searchParams.get('new') === 'true';

  const reviewStats = await prisma.review.groupBy({
    by: ['productId'],
    _count: { id: true },
    _avg: { rating: true },
  });
  const statsMap = Object.fromEntries(
    reviewStats.map((s) => [
      s.productId,
      {
        reviewCount: s._count.id,
        rating: Math.round((s._avg.rating ?? 0) * 10) / 10,
      },
    ])
  );
  const mergeStats = (p) => ({ ...p, ...(statsMap[p.id] ?? { reviewCount: 0, rating: 0 }) });

  const ids = searchParams.get('ids')?.split(',').filter(Boolean) ?? [];
  if (ids.length) {
    const rows = await prisma.product.findMany({ where: { id: { in: ids } } });
    const data = ids
      .map((id) => rows.find((p) => p.id === id))
      .filter(Boolean)
      .map((p) => mergeStats(toProductDto(p)));
    return NextResponse.json({ data, total: data.length, page: 1, limit: data.length, totalPages: 1 });
  }

  const where = {
    ...(category ? { category } : {}),
    ...(subcategory ? { subcategory } : {}),
    ...(featured ? { isFeatured: true } : {}),
    ...(isNew ? { isNew: true } : {}),
  };

  let list = (await prisma.product.findMany({ where })).map((p) => mergeStats(toProductDto(p)));
  list = filterProducts(
    list,
    { brands, priceMin: minPrice, priceMax: maxPrice, minRating, inStockOnly },
    sort,
    q
  );

  const total = list.length;
  const metaBase = (await prisma.product.findMany({
    where: category ? { category } : undefined,
  })).map((p) => mergeStats(toProductDto(p)));
  const availableBrands = extractBrands(metaBase);
  const availablePriceRange = extractPriceRange(metaBase);

  const data = list.slice((page - 1) * limit, page * limit);

  return NextResponse.json({
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    meta: { brands: availableBrands, priceRange: availablePriceRange },
  });
}
