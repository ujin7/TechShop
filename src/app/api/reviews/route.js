import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { toReviewDto } from '@/lib/db-serialize';
import { getAuthUserId } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('productId');
  const userId = searchParams.get('userId');
  const page = Math.max(1, Number(searchParams.get('page') ?? 1));
  const limit = Math.min(50, Number(searchParams.get('limit') ?? 10));

  const where = {
    ...(productId ? { productId } : {}),
    ...(userId ? { userId } : {}),
  };

  const [total, agg, pageRows, distRows] = await Promise.all([
    prisma.review.count({ where }),
    prisma.review.aggregate({ where, _avg: { rating: true } }),
    prisma.review.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    productId
      ? prisma.review.groupBy({ by: ['rating'], where: { productId }, _count: { id: true } })
      : Promise.resolve(null),
  ]);

  const avgRating = Math.round((agg._avg.rating ?? 0) * 10) / 10;

  const ratingDist = distRows
    ? [1, 2, 3, 4, 5].map((r) => ({
        rating: r,
        count: distRows.find((d) => d.rating === r)?._count.id ?? 0,
      }))
    : null;

  return NextResponse.json({ data: pageRows.map(toReviewDto), total, page, limit, avgRating, ratingDist });
}

export async function POST(request) {
  const authUserId = getAuthUserId(request);
  if (!authUserId) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }

  const body = await request.json();
  const { productId, userName, rating, title, content } = body;

  if (!productId || !rating || !content) {
    return NextResponse.json({ error: '필수 항목이 누락되었습니다.' }, { status: 400 });
  }
  if (rating < 1 || rating > 5) {
    return NextResponse.json({ error: '평점은 1~5 사이여야 합니다.' }, { status: 400 });
  }

  const review = await prisma.$transaction(async (tx) => {
    const created = await tx.review.create({
      data: {
        id: `rev_${Date.now()}`,
        productId,
        userId: authUserId,
        userName: userName ?? '익명',
        rating: Number(rating),
        title: title ?? '',
        content,
        helpful: 0,
        images: JSON.stringify([]),
        createdAt: new Date(),
      },
    });

    const agg = await tx.review.aggregate({
      where: { productId },
      _count: { id: true },
      _avg: { rating: true },
    });
    await tx.product.update({
      where: { id: productId },
      data: {
        reviewCount: agg._count.id,
        rating: Math.round((agg._avg.rating ?? 0) * 10) / 10,
      },
    });

    return created;
  });

  return NextResponse.json({ data: toReviewDto(review) }, { status: 201 });
}

/** PATCH /api/reviews — 리뷰 수정 */
export async function PATCH(request) {
  const authUserId = getAuthUserId(request);
  if (!authUserId) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }

  const { reviewId, rating, title, content } = await request.json();
  if (!reviewId || !rating || !content) {
    return NextResponse.json({ error: '필수 항목이 누락되었습니다.' }, { status: 400 });
  }
  if (rating < 1 || rating > 5) {
    return NextResponse.json({ error: '평점은 1~5 사이여야 합니다.' }, { status: 400 });
  }

  const existing = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!existing) {
    return NextResponse.json({ error: '리뷰를 찾을 수 없습니다.' }, { status: 404 });
  }
  if (existing.userId !== authUserId) {
    return NextResponse.json({ error: '수정 권한이 없습니다.' }, { status: 403 });
  }

  const updated = await prisma.$transaction(async (tx) => {
    const review = await tx.review.update({
      where: { id: reviewId },
      data: { rating: Number(rating), title: title ?? '', content },
    });
    const agg = await tx.review.aggregate({
      where: { productId: existing.productId },
      _count: { id: true },
      _avg: { rating: true },
    });
    await tx.product.update({
      where: { id: existing.productId },
      data: {
        reviewCount: agg._count.id,
        rating: Math.round((agg._avg.rating ?? 0) * 10) / 10,
      },
    });
    return review;
  });

  return NextResponse.json({ data: toReviewDto(updated) });
}

/** DELETE /api/reviews?reviewId=xxx — 리뷰 삭제 */
export async function DELETE(request) {
  const authUserId = getAuthUserId(request);
  if (!authUserId) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const reviewId = searchParams.get('reviewId');
  if (!reviewId) {
    return NextResponse.json({ error: 'reviewId가 필요합니다.' }, { status: 400 });
  }

  const existing = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!existing) {
    return NextResponse.json({ error: '리뷰를 찾을 수 없습니다.' }, { status: 404 });
  }
  if (existing.userId !== authUserId) {
    return NextResponse.json({ error: '삭제 권한이 없습니다.' }, { status: 403 });
  }

  await prisma.$transaction(async (tx) => {
    await tx.review.delete({ where: { id: reviewId } });
    const agg = await tx.review.aggregate({
      where: { productId: existing.productId },
      _count: { id: true },
      _avg: { rating: true },
    });
    await tx.product.update({
      where: { id: existing.productId },
      data: {
        reviewCount: agg._count.id,
        rating: Math.round((agg._avg.rating ?? 0) * 10) / 10,
      },
    });
  });

  return NextResponse.json({ success: true });
}
