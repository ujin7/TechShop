import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { toUserDto } from '@/lib/db-serialize';
import { getAuthUserId } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const userId = getAuthUserId(request);
  if (!userId) {
    return NextResponse.json({ data: null }, { status: 200 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ data: null }, { status: 200 });
  }

  const dto = toUserDto(user);
  const { password: _pw, ...safeUser } = dto;
  return NextResponse.json({ data: safeUser });
}
