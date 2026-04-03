import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET;
if (!SECRET) throw new Error('JWT_SECRET environment variable is not set');
export const SESSION_COOKIE_NAME = 'techshop_session';
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

export function signToken(userId) {
  return jwt.sign({ sub: userId }, SECRET, { expiresIn: `${SESSION_MAX_AGE_SECONDS}s` });
}

export function verifyToken(token) {
  try {
    const payload = jwt.verify(token, SECRET);
    return payload.sub;
  } catch {
    return null;
  }
}

export function getAuthUserId(request) {
  const cookieToken = request.cookies?.get(SESSION_COOKIE_NAME)?.value ?? null;
  if (!cookieToken) return null;
  return verifyToken(cookieToken);
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}
