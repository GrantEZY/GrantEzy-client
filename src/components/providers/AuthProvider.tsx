'use client';

import { ReactNode, useEffect, useRef } from 'react';

import { usePathname } from 'next/navigation';

import { useAuthStore } from '@/store/auth.store';

interface AuthProviderProps {
  children: ReactNode;
}

// Token refresh interval: 50 minutes (accessToken expires in 1 hour)
const TOKEN_REFRESH_INTERVAL = 50 * 60 * 1000; // 50 minutes in milliseconds

export function AuthProvider({ children }: AuthProviderProps) {
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const pathname = usePathname();

  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Zustand persist handles auth state restoration automatically
  // No need to manually call initialize()

  useEffect(() => {
    // Don't set up refresh on login/signup pages to prevent redirects during login
    const isAuthPage = pathname === '/login' || pathname === '/signup';

    // Set up automatic token refresh if user is authenticated and not on auth pages
    if (isAuthenticated && !isAuthPage) {
      // Clear any existing timer
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }

      // Don't refresh immediately on mount - only set up periodic refresh
      // This prevents redirect loops when user is logging in
      // The token will be fresh after login anyway

      // Set up periodic refresh (starts after 50 minutes)
      refreshTimerRef.current = setInterval(() => {
        refreshToken().catch(() => {
          // Error handled in store (redirects to login)
        });
      }, TOKEN_REFRESH_INTERVAL);

      // Cleanup on unmount or when authentication changes
      return () => {
        if (refreshTimerRef.current) {
          clearInterval(refreshTimerRef.current);
          refreshTimerRef.current = null;
        }
      };
    } else {
      // Clear timer if user is not authenticated
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
    }
  }, [isAuthenticated, refreshToken, pathname]);

  return <>{children}</>;
}
