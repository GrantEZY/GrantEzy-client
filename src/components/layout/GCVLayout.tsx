/**
 * GCV Layout Component
 * Provides consistent layout structure for GCV pages
 */
import React from 'react';

import GCVSidebar from './GCVSidebar';
import Header from './Header';

interface GCVLayoutProps {
  children: React.ReactNode;
}

export default function GCVLayout({ children }: GCVLayoutProps) {
  return (
    <div className="flex h-screen flex-col bg-[var(--color-background)]">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <GCVSidebar />

        <main className="flex-1 overflow-y-auto p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
