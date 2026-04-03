import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUserId } from '@/lib/auth';

export const dynamic = 'force-dynamic';

/** GET /api/wishlist — 내 찜 목록 */
export async function GET(request) {
  const userId = getAuthUserId(request);
  if (!userId) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }

  const items = await prisma.wishlist.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: { productId: true, createdAt: true },
  });

  return NextResponse.json({ data: items });
}

/** POST /api/wishlist — 찜 추가 */
export async function POST(request) {
  const userId = getAuthUserId(request);
  if (!userId) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }

  const { productId } = await request.json();
  if (!productId) {
    return NextResponse.json({ error: 'productId가 필요합니다.' }, { status: 400 });
  }

  const item = await prisma.wishlist.upsert({
    where: { userId_productId: { userId, productId } },
    update: {},
    create: {
      userId,
      productId,
    },
  });

  return NextResponse.json({ data: item }, { status: 201 });
}

/** DELETE /api/wishlist?productId=xxx — 찜 제거 */
export async function DELETE(request) {
  const userId = getAuthUserId(request);
  if (!userId) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('productId');
  if (!productId) {
    return NextResponse.json({ error: 'productId가 필요합니다.' }, { status: 400 });
  }

  await prisma.wishlist.deleteMany({ where: { userId, productId } });

  return NextResponse.json({ success: true });
}
