"use client";

import { useState } from 'react';
import { Metadata } from 'next';
import PublicLayout from '@/components/layout/PublicLayout';
import PublicPageContent from '@/components/public/PublicPageContent';

export default function PublicPage() {
  const [activeSection, setActiveSection] = useState('home');

  const handleNavigate = (section: string) => {
    setActiveSection(section);
    // Scroll to section if needed
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
