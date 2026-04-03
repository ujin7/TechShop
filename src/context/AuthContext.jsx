'use client';

import { createContext, useContext, useEffect, useReducer } from 'react';
import {
  getSupabaseBrowserClient,
  isSupabaseBrowserConfigured,
} from '@/lib/supabase/client';

export const AuthContext = createContext(null);

function mapSupabaseUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
    avatar: user.user_metadata?.avatar_url || null,
  };
}

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
    if (!isSupabaseBrowserConfigured()) {
      dispatch({ type: 'CLEAR_USER' });
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      dispatch({ type: 'CLEAR_USER' });
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!cancelled) {
          dispatch({ type: 'SET_USER', payload: mapSupabaseUser(user) });
        }
      } catch {
        if (!cancelled) {
          dispatch({ type: 'CLEAR_USER' });
        }
      }
    })();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (cancelled) return;
      dispatch({ type: 'SET_USER', payload: mapSupabaseUser(session?.user ?? null) });
    });

    return () => {
      cancelled = true;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  return <AuthContext.Provider value={{ ...state, dispatch }}>{children}</AuthContext.Provider>;
}

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
};
