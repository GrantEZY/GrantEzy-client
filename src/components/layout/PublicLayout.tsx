"use client";

import { useState } from 'react';
import Image from 'next/image';
import { navItems, footerLinks, contactInfo, copyrightText } from '@/constants';
import DarkModeToggle from '@/components/ui/DarkModeToggle';

interface PublicHeaderProps {
  onNavigate?: (section: string) => void;
}

function PublicHeader({ onNavigate }: PublicHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-[var(--color-white)] border-b border-[var(--color-gray-200)] px-4 sm:px-6 py-4 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center space-x-3 sm:space-x-4 flex-shrink-0">
          <Image
            src="/assets/College_Logo.png"
            alt="College Logo"
            width={50}
            height={50}
            className="sm:w-[60px] sm:h-[60px] lg:w-[70px] lg:h-[70px] rounded-full"
            priority
          />
          <div className="flex flex-col">
            <h1 className="text-sm sm:text-base font-semibold text-[var(--color-gray-800)] leading-tight">
              <span className="hidden sm:inline">Indian Institute of Information <br /> Technology Sri City</span>
              <span className="sm:hidden">IIIT Sri City</span>
            </h1>
            <p className="pt-1 text-xs text-[var(--color-gray-600)] hidden sm:block">भारतीय सूचना प्रौद्योगिकी संस्थान श्री सिटी</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate?.(item.id)}
              className="text-[var(--color-gray-700)] hover:text-[var(--color-blue-600)] font-medium transition-colors duration-200 text-sm xl:text-base"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center space-x-3 flex-shrink-0">
          <DarkModeToggle />
          <button className="border border-[var(--color-blue-600)] text-[var(--color-gray-900)] px-4 lg:px-6 py-2 rounded-lg font-medium hover:bg-[var(--color-blue-50)] transition-colors duration-200 text-sm lg:text-base">
            Sign In
          </button>
          <button className="bg-[var(--color-blue-600)] text-[var(--color-white)] px-4 lg:px-6 py-2 rounded-lg font-medium hover:bg-[var(--color-blue-700)] transition-colors duration-200 text-sm lg:text-base">
            Login
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg border border-[var(--color-gray-300)] hover:bg-[var(--color-gray-50)] transition-colors duration-200"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg className="w-5 h-5 text-[var(--color-gray-700)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 py-4 border-t border-[var(--color-gray-200)]">
          <nav className="flex flex-col space-y-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate?.(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className="text-left text-[var(--color-gray-700)] hover:text-[var(--color-blue-600)] font-medium transition-colors duration-200 py-2"
              >
                {item.label}
              </button>
            ))}
            <div className="flex flex-col space-y-3 pt-4 border-t border-[var(--color-gray-200)]">
              <div className="flex justify-center pb-2">
                <DarkModeToggle />
              </div>
              <button className="border border-[var(--color-blue-600)] text-[var(--color-gray-900)] px-4 py-2 rounded-lg font-medium hover:bg-[var(--color-blue-50)] transition-colors duration-200 text-center">
                Sign In
              </button>
              <button className="bg-[var(--color-blue-600)] text-[var(--color-white)] px-4 py-2 rounded-lg font-medium hover:bg-[var(--color-blue-700)] transition-colors duration-200 text-center">
                Login
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function PublicFooter() {
  return (
  <footer className="bg-[var(--color-white)] text-[var(--color-gray-900)] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Institution Info */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="flex items-center space-x-3 sm:space-x-4 mb-4">
              <Image
                src="/assets/College_Logo.png"
                alt="College Logo"
                width={40}
                height={40}
                className="sm:w-[50px] sm:h-[50px] rounded-full"
              />
              <div>
                <h3 className="text-base sm:text-lg font-semibold">IIIT Sri City</h3>
                <p className="text-xs sm:text-sm text-[var(--color-gray-400)]">Innovation & Entrepreneurship</p>
              </div>
            </div>
            <p className="text-[var(--color-gray-400)] text-sm leading-relaxed max-w-md">
              Fostering innovation and entrepreneurship through comprehensive support for startups,
              mentorship programs, and research initiatives.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {footerLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-[var(--color-gray-400)] hover:text-[var(--color-white)] transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Contact</h4>
            <div className="space-y-2 text-sm text-[var(--color-gray-400)]">
              <p>{contactInfo.address.line1}</p>
              <p>{contactInfo.address.line2}</p>
              <p>Email: {contactInfo.email}</p>
              <p>Phone: {contactInfo.phone}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-[var(--color-gray-700)] mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
          <p className="text-[var(--color-gray-400)] text-xs sm:text-sm">
            {copyrightText}
          </p>
        </div>
      </div>
    </footer>
  );
}

interface PublicLayoutProps {
  children: React.ReactNode;
  onNavigate?: (section: string) => void;
}

export default function PublicLayout({ children, onNavigate }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--color-white)] flex flex-col">
      <PublicHeader onNavigate={onNavigate} />
      <main className="flex-1">
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}