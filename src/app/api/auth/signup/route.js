import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { toUserDto } from '@/lib/db-serialize';
import { SESSION_COOKIE_NAME, sessionCookieOptions, signToken } from '@/lib/auth';

export async function POST(request) {
  const { name, email, password } = await request.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: '모든 항목을 입력해주세요.' }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: '비밀번호는 8자 이상이어야 합니다.' }, { status: 400 });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: '유효한 이메일 형식이 아닙니다.' }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: '이미 사용 중인 이메일입니다.' }, { status: 409 });
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: await bcrypt.hash(password, 10),
      avatar: null,
      createdAt: new Date(),
      address: null,
    },
  });

  const dto = toUserDto(user);
  const { password: _pw, ...safeUser } = dto;
  const token = signToken(user.id);
  const res = NextResponse.json({ data: safeUser }, { status: 201 });
  res.cookies.set(SESSION_COOKIE_NAME, token, sessionCookieOptions());
  return res;
}
