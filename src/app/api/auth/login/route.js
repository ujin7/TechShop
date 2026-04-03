import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { toUserDto } from '@/lib/db-serialize';
import { SESSION_COOKIE_NAME, sessionCookieOptions, signToken } from '@/lib/auth';

export async function POST(request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: '이메일과 비밀번호를 입력해주세요.' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' }, { status: 401 });
  }
  const isHashed = user.password.startsWith('$2a$') || user.password.startsWith('$2b$') || user.password.startsWith('$2y$');
  const valid = isHashed ? await bcrypt.compare(password, user.password) : user.password === password;
  if (!valid) {
    return NextResponse.json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' }, { status: 401 });
  }

  // Legacy plaintext user migration: upgrade to bcrypt hash after successful login.
  if (!isHashed) {
    await prisma.user.update({
      where: { id: user.id },
      data: { password: await bcrypt.hash(password, 10) },
    });
  }

  const dto = toUserDto(user);
  const { password: _pw, ...safeUser } = dto;
  const token = signToken(user.id);
  const res = NextResponse.json({ data: safeUser });
  res.cookies.set(SESSION_COOKIE_NAME, token, sessionCookieOptions());
  return res;
}
