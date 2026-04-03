'use client';

import { useCallback, useEffect, useState } from 'react';
import { useCompareContext, MAX_COMPARE } from '@/context/CompareContext';
import { useToast } from '@/hooks/useToast';

/** compareIds → 상품 데이터를 API에서 fetch. 비교 추가/제거 액션 제공. */
export function useCompare() {
  const { compareIds, updateIds } = useCompareContext();
  const { showToast }             = useToast();
  const [compareProducts, setCompareProducts] = useState([]);

  /* ID 목록이 바뀔 때마다 상품 데이터 fetch */
  useEffect(() => {
    if (!compareIds.length) {
      setCompareProducts([]);
      return;
    }
    Promise.all(
      compareIds.map((id) =>
        fetch(`/api/products/${id}`)
          .then((r) => (r.ok ? r.json() : null))
          .then((json) => json?.data ?? null)
      )
    ).then((results) => setCompareProducts(results.filter(Boolean)));
  }, [compareIds]);

  const isInCompare = useCallback((productId) => compareIds.includes(productId), [compareIds]);

  const addToCompare = useCallback((product) => {
    if (compareIds.includes(product.id)) return;
    if (compareIds.length >= MAX_COMPARE) {
      showToast(`비교는 최대 ${MAX_COMPARE}개까지 가능합니다.`, 'warning');
      return;
    }
    updateIds([...compareIds, product.id]);
  }, [compareIds, updateIds, showToast]);

  const removeFromCompare = useCallback((productId) => {
    updateIds(compareIds.filter((id) => id !== productId));
  }, [compareIds, updateIds]);

  const clearCompare = useCallback(() => updateIds([]), [updateIds]);

  return {
    compareIds,
    compareProducts,
    isInCompare,
    isFull: compareIds.length >= MAX_COMPARE,
    addToCompare,
    removeFromCompare,
    clearCompare,
  };
}
