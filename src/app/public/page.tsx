"use client";

import PublicLayout from '@/components/layout/PublicLayout';
import PublicPageContent from '@/components/public/PublicPageContent';

export default function PublicPage() {
  const handleNavigate = (section: string) => {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <PublicLayout onNavigate={handleNavigate}>
      <PublicPageContent />
    </PublicLayout>
  );
}
