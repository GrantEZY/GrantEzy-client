"use client";

import Image from 'next/image';
import { FaSearch, FaBell } from 'react-icons/fa';

interface PublicHeaderProps {
  onNavigate?: (section: string) => void;
}

function PublicHeader({ onNavigate }: PublicHeaderProps) {
  const navItems = [
    { label: 'Home', id: 'home' },
    { label: 'About', id: 'about' },
    { label: 'Projects', id: 'projects' },
    { label: 'Open Calls', id: 'open-calls' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <header className="bg-[var(--color-white)] border-b border-[var(--color-gray-200)] px-6 py-4 sticky top-0 z-50">
      <div className="flex items-center">
        <div className="flex-1 flex items-center space-x-4">
          <Image
            src="/assets/College_Logo.png"
            alt="College Logo"
            width={70}
            height={70}
            className="rounded-full"
            priority
          />
          <div className="flex flex-col">
            <h1 className="text-base font-semibold text-[var(--color-gray-800)] leading-tight">
              Indian Institute of Information <br /> Technology Sri City
            </h1>
            <p className="pt-1 text-xs text-[var(--color-gray-600)]">भारतीय सूचना प्रौद्योगिकी संस्थान श्री सिटी</p>
          </div>
        </div>

        <nav className="hidden lg:flex items-center space-x-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate?.(item.id)}
              className="text-[var(--color-gray-700)] hover:text-[var(--color-blue-600)] font-medium transition-colors duration-200"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex-1 flex justify-end items-center space-x-3">
          <button className="border border-[var(--color-blue-600)] text-[var(--color-gray-900)] px-6 py-2 rounded-lg font-medium hover:bg-[var(--color-blue-50)] transition-colors duration-200">
            Sign In
          </button>
          <button className="bg-[var(--color-blue-600)] text-[var(--color-white)] px-6 py-2 rounded-lg font-medium hover:bg-[var(--color-blue-700)] transition-colors duration-200">
            Login
          </button>
        </div>
      </div>
    </header>
  );
}

function PublicFooter() {
  return (
    <footer className="bg-[var(--color-gray-800)] text-[var(--color-white)] py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Institution Info */}
          <div className="col-span-2">
            <div className="flex items-center space-x-4 mb-4">
              <Image
                src="/assets/College_Logo.png"
                alt="College Logo"
                width={50}
                height={50}
                className="rounded-full"
              />
              <div>
                <h3 className="text-lg font-semibold">IIIT Sri City</h3>
                <p className="text-sm text-[var(--color-gray-500)]">Innovation & Entrepreneurship</p>
              </div>
            </div>
            <p className="text-[var(--color-gray-500)] text-sm leading-relaxed">
              Fostering innovation and entrepreneurship through comprehensive support for startups,
              mentorship programs, and research initiatives.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-[var(--color-gray-500)] hover:text-[var(--color-white)] transition-colors">About Us</a></li>
              <li><a href="#" className="text-[var(--color-gray-500)] hover:text-[var(--color-white)] transition-colors">Projects</a></li>
              <li><a href="#" className="text-[var(--color-gray-500)] hover:text-[var(--color-white)] transition-colors">Open Calls</a></li>
              <li><a href="#" className="text-[var(--color-gray-500)] hover:text-[var(--color-white)] transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-2 text-sm text-[var(--color-gray-500)]">
              <p>IIIT Sri City, Chittoor</p>
              <p>Andhra Pradesh, India</p>
              <p>Email: innovation@iiits.in</p>
              <p>Phone: +91-XXXX-XXXXXX</p>
            </div>
          </div>
        </div>

        <div className="border-t border-[var(--color-gray-700)] mt-8 pt-8 text-center">
          <p className="text-[var(--color-gray-500)] text-sm">
            © 2025 Indian Institute of Information Technology Sri City. All rights reserved.
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