"use client";

import { ReactNode, useEffect } from "react";

import { useAuthStore } from "@/store/auth.store";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    // Initialize auth state from localStorage on app startup
    initialize();
  }, [initialize]);

  return <>{children}</>;
}
