'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { lsGet, lsSet } from '@/utils/localStorage';

const LS_COMPARE_KEY = 'techshop_compare';
export const MAX_COMPARE = 3;

export const CompareContext = createContext(null);

/** Context는 compareIds(string[]) + setter 만 보관. 상품 데이터 조회는 useCompare() hook에서 */
export function CompareProvider({ children }) {
  const [compareIds, setCompareIds] = useState([]);

  useEffect(() => {
    setCompareIds(lsGet(LS_COMPARE_KEY, []));
  }, []);

  const updateIds = useCallback((next) => {
    setCompareIds(next);
    lsSet(LS_COMPARE_KEY, next);
  }, []);

  return (
    <CompareContext.Provider value={{ compareIds, updateIds }}>
      {children}
    </CompareContext.Provider>
  );
}

export const useCompareContext = () => {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompareContext must be used within CompareProvider');
  return ctx;
};
