'use client';

import { useCallback, useEffect, useState } from 'react';
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import { useAuth } from '@/hooks/useAuth';

export function useWishlist() {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState(new Set());
  const [loading, setLoading] = useState(false);

  /* 로그인 시 서버에서 찜 목록 로드 */
  useEffect(() => {
    if (!user) { setWishlist(new Set()); return; }
    fetchWithAuth('/api/wishlist')
      .then((r) => r.ok ? r.json() : { data: [] })
      .then(({ data }) => setWishlist(new Set((data ?? []).map((d) => d.productId))));
  }, [user]);

  const toggle = useCallback(async (productId) => {
    if (!user) return { needLogin: true };

    const isWished = wishlist.has(productId);

    /* 낙관적 업데이트 */
    setWishlist((prev) => {
      const next = new Set(prev);
      if (isWished) next.delete(productId); else next.add(productId);
      return next;
    });

    setLoading(true);
    try {
      if (isWished) {
        await fetchWithAuth(`/api/wishlist?productId=${productId}`, { method: 'DELETE' });
      } else {
        await fetchWithAuth('/api/wishlist', { method: 'POST', body: JSON.stringify({ productId }) });
      }
      return { success: true, wished: !isWished };
    } catch {
      /* 실패 시 롤백 */
      setWishlist((prev) => {
        const next = new Set(prev);
        if (isWished) next.add(productId); else next.delete(productId);
        return next;
      });
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, [user, wishlist]);

  return {
    wishlist,
    isWished: (productId) => wishlist.has(productId),
    toggle,
    loading,
  };
}
