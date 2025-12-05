'use client';

import { ReactNode, useEffect } from 'react';

import { usePathname, useRouter } from 'next/navigation';

import { useAuthStore } from '@/store/auth.store';

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * AuthGuard component to protect routes from unauthenticated access
 * Automatically redirects to login page if user is not authenticated
 */
export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, isHydrated } = useAuthStore();

  // AuthProvider handles initialization on app startup
  // No need to call initialize() here

  useEffect(() => {
    // Wait for hydration to complete before checking authentication
    if (isHydrated && !isLoading && !isAuthenticated) {
      // Save current path to redirect back after login
      const loginUrl = `/login?redirect=${encodeURIComponent(pathname)}`;
      router.push(loginUrl);
    }
  }, [isAuthenticated, isLoading, isHydrated, router, pathname]);

  // Show loading state while checking authentication or hydrating
  if (!isHydrated || isLoading) {
    return (
      fallback || (
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
        </div>
      )
    );
  }

  // If not authenticated, show nothing (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  // If authenticated, render children
  return <>{children}</>;
}
