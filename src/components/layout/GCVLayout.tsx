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
    <div className="min-h-screen bg-[var(--color-background)]">
      <Header />

      <div className="flex">
        <GCVSidebar />

        <main className="flex-1 p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
