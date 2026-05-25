'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/context/auth-store';
import { useRouter } from 'next/navigation';

export const useProtectedRoute = () => {
  const { isAuthenticated, checkAuth, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const verify = async () => {
      await checkAuth();
      if (!isAuthenticated && !isLoading) {
        router.push('/login');
      }
    };
    verify();
  }, []);

  return isLoading;
};

export const usePublicRoute = () => {
  const { isAuthenticated, checkAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const verify = async () => {
      await checkAuth();
      if (isAuthenticated) {
        router.push('/dashboard');
      }
    };
    verify();
  }, []);
};
