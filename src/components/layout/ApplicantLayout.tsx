/**
 * Applicant Layout Component
 * Provides consistent layout structure for Applicant pages
 */
import React from 'react';

import ApplicantSidebar from './ApplicantSidebar';
import Header from './Header';

interface ApplicantLayoutProps {
  children: React.ReactNode;
}

export default function ApplicantLayout({ children }: ApplicantLayoutProps) {
  return (
    <div className="h-screen overflow-hidden bg-[var(--color-background-light)]">
      <Header />

      <div className="flex h-[calc(100vh-98px)]">
        <ApplicantSidebar />

        <main className="flex-1 overflow-auto">
          <div className="h-full p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
