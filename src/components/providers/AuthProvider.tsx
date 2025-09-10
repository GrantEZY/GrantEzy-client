"use client";

import { ReactNode } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // The auth state is managed by Zustand store with persistence
  // This provider can be used for any global auth setup if needed
  return <>{children}</>;
}
