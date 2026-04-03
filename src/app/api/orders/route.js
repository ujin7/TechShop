import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { toOrderDto } from '@/lib/db-serialize';
import { getAuthUserId } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const authUserId = getAuthUserId(request);
  if (!authUserId) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('orderId');

  if (orderId) {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return NextResponse.json({ error: '주문을 찾을 수 없습니다.' }, { status: 404 });
    }
    if (order.userId !== authUserId) {
      return NextResponse.json({ error: '접근 권한이 없습니다.' }, { status: 403 });
    }
    return NextResponse.json({ data: toOrderDto(order) });
  }

  const data = await prisma.order.findMany({
    where: { userId: authUserId },
    orderBy: { orderedAt: 'desc' },
  });

  return NextResponse.json({ data: data.map(toOrderDto) });
}

export async function POST(request) {
  const authUserId = getAuthUserId(request);
  if (!authUserId) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }

  const body = await request.json();
  const { items, shipping, paymentMethod, subtotal, shippingFee, total } = body;

  if (!items?.length || !shipping || !paymentMethod) {
    return NextResponse.json({ error: '필수 항목이 누락되었습니다.' }, { status: 400 });
  }

  const productIds = items.map((i) => i.productId);
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });

  // 재고 확인
  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product) {
      return NextResponse.json({ error: `상품을 찾을 수 없습니다: ${item.productId}` }, { status: 404 });
    }
    if (product.stock < item.quantity) {
      return NextResponse.json({ error: `재고가 부족합니다: ${product.name} (잔여 ${product.stock}개)` }, { status: 409 });
    }
  }

  const order = await prisma.$transaction(async (tx) => {
    // 재고 차감 (각 상품 개별 업데이트)
    for (const item of items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return tx.order.create({
      data: {
        id: `ord_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        userId: authUserId,
        status: 'pending',
        items: JSON.stringify(items),
        shipping: JSON.stringify(shipping),
        paymentMethod,
        subtotal,
        shippingFee,
        total,
        orderedAt: new Date(),
        deliveredAt: null,
      },
    });
  });

  return NextResponse.json({ data: toOrderDto(order) }, { status: 201 });
}

/** PATCH /api/orders — 주문 취소 (status: pending → cancelled, 재고 복구) */
export async function PATCH(request) {
  const authUserId = getAuthUserId(request);
  if (!authUserId) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }

  const { orderId } = await request.json();
  if (!orderId) {
    return NextResponse.json({ error: 'orderId가 필요합니다.' }, { status: 400 });
  }

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) {
    return NextResponse.json({ error: '주문을 찾을 수 없습니다.' }, { status: 404 });
  }
  if (order.userId !== authUserId) {
    return NextResponse.json({ error: '접근 권한이 없습니다.' }, { status: 403 });
  }
  if (order.status !== 'pending') {
    return NextResponse.json({ error: '취소할 수 없는 주문 상태입니다.' }, { status: 409 });
  }

  const items = JSON.parse(order.items);

  const cancelled = await prisma.$transaction(async (tx) => {
    for (const item of items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { increment: item.quantity } },
      });
    }
    return tx.order.update({
      where: { id: orderId },
      data: { status: 'cancelled' },
    });
  });

  return NextResponse.json({ data: toOrderDto(cancelled) });
}
