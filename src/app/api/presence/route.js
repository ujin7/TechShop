import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const ACTIVE_WINDOW_MINUTES = 5;
const STALE_WINDOW_MINUTES = 30;

function getActiveThreshold() {
  return new Date(Date.now() - ACTIVE_WINDOW_MINUTES * 60 * 1000);
}

function getStaleThreshold() {
  return new Date(Date.now() - STALE_WINDOW_MINUTES * 60 * 1000);
}

async function getActiveCount() {
  return prisma.presenceSession.count({
    where: {
      lastSeenAt: {
        gte: getActiveThreshold(),
      },
    },
  });
}

export async function GET() {
  try {
    const count = await getActiveCount();

    return NextResponse.json({
      count,
      activeWindowMinutes: ACTIVE_WINDOW_MINUTES,
    });
  } catch (error) {
    console.error('Presence GET failed:', error);
    return NextResponse.json(
      { count: null, error: 'presence_fetch_failed' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const sessionId = typeof body?.sessionId === 'string' ? body.sessionId.trim() : '';
    const path = typeof body?.path === 'string' && body.path ? body.path : '/';

    if (!sessionId) {
      return NextResponse.json(
        { error: 'session_id_required' },
        { status: 400 }
      );
    }

    const now = new Date();

    await prisma.presenceSession.upsert({
      where: { id: sessionId },
      update: {
        path,
        lastSeenAt: now,
      },
      create: {
        id: sessionId,
        path,
        lastSeenAt: now,
      },
    });

    await prisma.presenceSession.deleteMany({
      where: {
        lastSeenAt: {
          lt: getStaleThreshold(),
        },
      },
    });

    const count = await getActiveCount();

    return NextResponse.json({
      ok: true,
      count,
      activeWindowMinutes: ACTIVE_WINDOW_MINUTES,
    });
  } catch (error) {
    console.error('Presence POST failed:', error);
    return NextResponse.json(
      { ok: false, error: 'presence_update_failed' },
      { status: 500 }
    );
  }
}
