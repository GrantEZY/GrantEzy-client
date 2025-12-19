/**
 * Co-Applicant Layout Component
 * Provides consistent layout structure for Co-Applicant pages
 */
import React from 'react';

import CoApplicantSidebar from './CoApplicantSidebar';
import Header from './Header';

interface CoApplicantLayoutProps {
  children: React.ReactNode;
}

export default function CoApplicantLayout({ children }: CoApplicantLayoutProps) {
  return (
    <div className="h-screen overflow-hidden bg-[var(--color-background-light)]">
      <Header />

      <div className="flex h-[calc(100vh-98px)]">
        <CoApplicantSidebar />

        <main className="flex-1 overflow-auto">
          <div className="h-full p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
