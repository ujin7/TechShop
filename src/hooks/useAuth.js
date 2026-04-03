'use client';

import { useCallback, useState } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import {
  getSupabaseBrowserClient,
  isSupabaseBrowserConfigured,
} from '@/lib/supabase/client';

const AUTH_NOT_CONFIGURED_MESSAGE = '인증 환경변수가 설정되지 않아 로그인 기능을 사용할 수 없습니다.';

export function useAuth() {
  const { user, isLoading, dispatch } = useAuthContext();
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  const getClientOrError = useCallback(() => {
    if (!isSupabaseBrowserConfigured()) {
      setAuthError(AUTH_NOT_CONFIGURED_MESSAGE);
      return null;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setAuthError(AUTH_NOT_CONFIGURED_MESSAGE);
      return null;
    }

    return supabase;
  }, []);

  const login = useCallback(async (email, password) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const supabase = getClientOrError();
      if (!supabase) {
        return { success: false, message: AUTH_NOT_CONFIGURED_MESSAGE };
      }

      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        const msg = error.message || '로그인에 실패했습니다.';
        setAuthError(msg);
        return { success: false, message: msg };
      }

      const sUser = data.user;
      dispatch({
        type: 'SET_USER',
        payload: sUser
          ? {
              id: sUser.id,
              email: sUser.email,
              name: sUser.user_metadata?.name || sUser.user_metadata?.full_name || sUser.email?.split('@')[0] || 'User',
              avatar: sUser.user_metadata?.avatar_url || null,
            }
          : null,
      });
      return { success: true };
    } catch {
      const msg = '로그인 중 오류가 발생했습니다.';
      setAuthError(msg);
      return { success: false, message: msg };
    } finally {
      setAuthLoading(false);
    }
  }, [dispatch, getClientOrError]);

  const signup = useCallback(async ({ name, email, password }) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const supabase = getClientOrError();
      if (!supabase) {
        return { success: false, message: AUTH_NOT_CONFIGURED_MESSAGE };
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        const msg = error.message || '회원가입에 실패했습니다.';
        setAuthError(msg);
        return { success: false, message: msg };
      }

      if (!data.session) {
        const msg = '회원가입은 완료되었지만 아직 로그인 세션이 없습니다. Supabase 이메일 인증 설정을 확인한 뒤 다시 로그인해주세요.';
        dispatch({ type: 'CLEAR_USER' });
        setAuthError(msg);
        return {
          success: false,
          requiresVerification: true,
          message: msg,
        };
      }

      const sUser = data.user;
      dispatch({
        type: 'SET_USER',
        payload: sUser
          ? {
              id: sUser.id,
              email: sUser.email,
              name: sUser.user_metadata?.name || sUser.email?.split('@')[0] || 'User',
              avatar: sUser.user_metadata?.avatar_url || null,
            }
          : null,
      });

      return {
        success: true,
        message: null,
      };
    } catch {
      const msg = '회원가입 중 오류가 발생했습니다.';
      setAuthError(msg);
      return { success: false, message: msg };
    } finally {
      setAuthLoading(false);
    }
  }, [dispatch, getClientOrError]);

  const logout = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    try {
      if (supabase) {
        await supabase.auth.signOut();
      }
    } finally {
      dispatch({ type: 'CLEAR_USER' });
    }
  }, [dispatch]);

  const updateProfile = useCallback(async (updates) => {
    const supabase = getClientOrError();
    if (!supabase) {
      return { success: false, message: AUTH_NOT_CONFIGURED_MESSAGE };
    }

    const { data, error } = await supabase.auth.updateUser({ data: updates });
    if (error) {
      setAuthError(error.message || '프로필 업데이트에 실패했습니다.');
      return { success: false, message: error.message };
    }

    const sUser = data?.user;
    dispatch({
      type: 'SET_USER',
      payload: sUser
        ? {
            id: sUser.id,
            email: sUser.email,
            name: sUser.user_metadata?.name || sUser.user_metadata?.full_name || sUser.email?.split('@')[0] || 'User',
            avatar: sUser.user_metadata?.avatar_url || null,
          }
        : user,
    });

    return { success: true };
  }, [dispatch, getClientOrError, user]);

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
