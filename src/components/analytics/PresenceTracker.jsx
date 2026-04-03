'use client';

import { useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';

const STORAGE_KEY = 'techshop_presence_session_id';
const HEARTBEAT_MS = 45000;

function getSessionId() {
  if (typeof window === 'undefined') return null;

  const existing = window.localStorage.getItem(STORAGE_KEY);
  if (existing) return existing;

  const nextId =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `presence_${Date.now()}_${Math.random().toString(36).slice(2)}`;

  window.localStorage.setItem(STORAGE_KEY, nextId);
  return nextId;
}

function broadcastCount(count) {
  window.dispatchEvent(
    new CustomEvent('techshop:presence-update', {
      detail: { count },
    })
  );
}

export default function PresenceTracker() {
  const pathname = usePathname();
  const sessionId = useMemo(() => getSessionId(), []);

  useEffect(() => {
    if (!sessionId) return undefined;

    let cancelled = false;

    const sendHeartbeat = async () => {
      try {
        const response = await fetch('/api/presence', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
          keepalive: true,
          body: JSON.stringify({
            sessionId,
            path: pathname || '/',
          }),
        });

        if (!response.ok || cancelled) return;

        const data = await response.json();
        if (typeof data?.count === 'number') {
          broadcastCount(data.count);
        }
      } catch (error) {
        console.error('Presence heartbeat failed:', error);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void sendHeartbeat();
      }
    };

    void sendHeartbeat();

    const intervalId = window.setInterval(() => {
      void sendHeartbeat();
    }, HEARTBEAT_MS);

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [pathname, sessionId]);

  return null;
}
