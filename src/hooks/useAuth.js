'use client';

import { useCallback, useState } from 'react';
import { useAuthContext } from '@/context/AuthContext';

export function useAuth() {
  const { user, isLoading, dispatch } = useAuthContext();
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  const login = useCallback(
    async (email, password) => {
      setAuthLoading(true);
      setAuthError(null);
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const json = await res.json();

        if (!res.ok) {
          const msg = json?.error || '로그인에 실패했습니다.';
          setAuthError(msg);
          return { success: false, message: msg };
        }

        dispatch({ type: 'SET_USER', payload: json.data });
        return { success: true };
      } catch {
        const msg = '로그인 중 오류가 발생했습니다.';
        setAuthError(msg);
        return { success: false, message: msg };
      } finally {
        setAuthLoading(false);
      }
    },
    [dispatch]
  );

  const signup = useCallback(
    async (userData) => {
      setAuthLoading(true);
      setAuthError(null);
      try {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
        });
        const json = await res.json();

        if (!res.ok) {
          const msg = json?.error || '회원가입에 실패했습니다.';
          setAuthError(msg);
          return { success: false, message: msg };
        }

        dispatch({ type: 'SET_USER', payload: json.data });
        return { success: true };
      } catch {
        const msg = '회원가입 중 오류가 발생했습니다.';
        setAuthError(msg);
        return { success: false, message: msg };
      } finally {
        setAuthLoading(false);
      }
    },
    [dispatch]
  );

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      dispatch({ type: 'CLEAR_USER' });
    }
  }, [dispatch]);

  const updateProfile = useCallback(
    (updates) => {
      const updated = { ...user, ...updates };
      dispatch({ type: 'SET_USER', payload: updated });
    },
    [user, dispatch]
  );

  return {
    user,
    isLoading: isLoading || authLoading,
    authError,
    login,
    signup,
    logout,
    updateProfile,
  };
}
