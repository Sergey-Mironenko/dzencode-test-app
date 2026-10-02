'use client';

import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState, AppDispatch } from '@/store/store';
import { loginThunk, registerThunk, logout, clearAuthError } from '@/store/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { token, user, isLoading, error } = useSelector((state: RootState) => state.auth);

  const login = async (credentials: { email: string; password: string }) => {
    const result = await dispatch(loginThunk(credentials));
    if (loginThunk.fulfilled.match(result)) {
      router.push('/');
      router.refresh();
      return true;
    }
    return false;
  };

  const register = async (credentials: { email: string; password: string }) => {
    const result = await dispatch(registerThunk(credentials));
    if (registerThunk.fulfilled.match(result)) {
      router.push('/');
      router.refresh();
      return true;
    }
    return false;
  };

  return {
    token,
    user,
    isLoading,
    error,
    isAuthenticated: !!token,
    login,
    register,
    logout: () => dispatch(logout()),
    clearError: () => dispatch(clearAuthError()),
  };
};