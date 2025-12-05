/**
 * Co-Applicant Layout Component
 * Provides consistent layout structure for Co-Applicant pages
 */
import React from 'react';

import Header from './Header';

interface CoApplicantLayoutProps {
  children: React.ReactNode;
}

export default function CoApplicantLayout({ children }: CoApplicantLayoutProps) {
  return (
    <div className="h-screen overflow-hidden bg-[var(--color-background-light)]">
      <Header />

      <main className="flex-1 overflow-auto h-[calc(100vh-98px)]">
        <div className="h-full">{children}</div>
      </main>
    </div>
  );
}
