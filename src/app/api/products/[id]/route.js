import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { toProductDto } from '@/lib/db-serialize';

export async function GET(_request, { params }) {
  const row = await prisma.product.findUnique({ where: { id: params.id } });

  if (!row) {
    return NextResponse.json({ error: '상품을 찾을 수 없습니다.' }, { status: 404 });
  }

  const reviewStats = await prisma.review.groupBy({
    by: ['productId'],
    where: { productId: { in: [params.id] } },
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

  const product = mergeStats(toProductDto(row));

  const relatedRows = await prisma.product.findMany({
    where: {
      category: product.category,
      id: { not: product.id },
    },
    take: 4,
    orderBy: [{ isFeatured: 'desc' }, { rating: 'desc' }],
  });
  const related = relatedRows.map((p) => mergeStats(toProductDto(p)));

  return NextResponse.json({ data: product, related });
}
