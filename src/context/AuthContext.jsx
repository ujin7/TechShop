'use client';

import { createContext, useContext, useEffect, useReducer } from 'react';

export const AuthContext = createContext(null);

function authReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, isLoading: false };
    case 'CLEAR_USER':
      return { ...state, user: null, isLoading: false };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, { user: null, isLoading: true });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' });
        const json = await res.json();
        if (!cancelled) {
          dispatch({ type: 'SET_USER', payload: json?.data ?? null });
        }
      } catch {
        if (!cancelled) {
          dispatch({ type: 'CLEAR_USER' });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return <AuthContext.Provider value={{ ...state, dispatch }}>{children}</AuthContext.Provider>;
}

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
};
