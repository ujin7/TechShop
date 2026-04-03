'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * useState처럼 동작하지만 localStorage와 자동 동기화됩니다.
 * SSR-safe: 서버에서는 initialValue를 반환합니다.
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(initialValue);

  /* 마운트 후 실제 값 로드 */
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) setStoredValue(JSON.parse(item));
    } catch {
      /* 무시 */
    }
  }, [key]);

  const setValue = useCallback(
    (value) => {
      try {
        const toStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(toStore);
        window.localStorage.setItem(key, JSON.stringify(toStore));
      } catch {
        /* 무시 */
      }
    },
    [key, storedValue]
  );

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      window.localStorage.removeItem(key);
    } catch {
      /* 무시 */
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}
