"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { contactInfo, copyrightText, footerLinks, navItems } from "@/constants";

import DarkModeToggle from "@/components/ui/DarkModeToggle";
import { Navbar, NavBody, NavItems } from "@/components/ui/resizable-navbar";

interface PublicHeaderProps {
  onNavigate?: (section: string) => void;
}

function PublicHeader({ onNavigate }: PublicHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  // Handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Transform navItems to match the expected format
  const navLinks = navItems.map((item) => ({
    name: item.label,
    link: `#${item.id}`,
  }));

  return (
    <>
      {/* Old Navbar Design - Hide when scrolled with transition */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isScrolled
            ? "pointer-events-none -translate-y-full opacity-0"
            : "translate-y-0 opacity-100"
        }`}
      >
        <header className="sticky top-0 z-40 border-b border-[var(--color-gray-200)] bg-[var(--color-white)] px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex flex-shrink-0 items-center space-x-3 sm:space-x-4">
              <Image
                alt="College Logo"
                className="rounded-full sm:h-[60px] sm:w-[60px] lg:h-[70px] lg:w-[70px]"
                height={50}
                priority
                src="/assets/College_Logo.png"
                width={50}
              />

              <div className="flex flex-col">
                <h1 className="text-sm leading-tight font-semibold text-[var(--color-gray-800)] sm:text-base">
                  <span className="hidden sm:inline">
                    Indian Institute of Information <br /> Technology Sri City
                  </span>

                  <span className="sm:hidden">IIIT Sri City</span>
                </h1>

                <p className="hidden pt-1 text-xs text-[var(--color-gray-600)] sm:block">
                  भारतीय सूचना प्रौद्योगिकी संस्थान श्री सिटी
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden items-center space-x-6 lg:flex xl:space-x-8">
              {navItems.map((item) => (
                <button
                  className="text-sm font-medium text-[var(--color-gray-700)] transition-colors duration-200 hover:text-[var(--color-blue-600)] xl:text-base"
                  key={item.id}
                  onClick={() => onNavigate?.(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Desktop Action Buttons */}
            <div className="hidden flex-shrink-0 items-center space-x-3 md:flex">
              <DarkModeToggle />

              <button
                className="rounded-lg border border-[var(--color-blue-600)] px-4 py-2 text-sm font-medium text-[var(--color-gray-900)] transition-colors duration-200 hover:bg-[var(--color-blue-50)] lg:px-6 lg:text-base"
                onClick={() => router.push("/signup")}
              >
                Sign Up
              </button>

              <button
                className="rounded-lg bg-[var(--color-blue-600)] px-4 py-2 text-sm font-medium text-[var(--color-white)] transition-colors duration-200 hover:bg-[var(--color-blue-700)] lg:px-6 lg:text-base"
                onClick={() => router.push("/login")}
              >
                Login
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--color-gray-300)] transition-colors duration-200 hover:bg-[var(--color-gray-50)] md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg
                className="h-5 w-5 text-[var(--color-gray-700)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="mt-4 border-t border-[var(--color-gray-200)] py-4 md:hidden">
              <nav className="flex flex-col space-y-3">
                {navItems.map((item) => (
                  <button
                    className="py-2 text-left font-medium text-[var(--color-gray-700)] transition-colors duration-200 hover:text-[var(--color-blue-600)]"
                    key={item.id}
                    onClick={() => {
                      onNavigate?.(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    {item.label}
                  </button>
                ))}

                <div className="flex flex-col space-y-3 border-t border-[var(--color-gray-200)] pt-4">
                  <div className="flex justify-center pb-2">
                    <DarkModeToggle />
                  </div>

                  <button
                    className="rounded-lg border border-[var(--color-blue-600)] px-4 py-2 text-center font-medium text-[var(--color-gray-900)] transition-colors duration-200 hover:bg-[var(--color-blue-50)]"
                    onClick={() => {
                      router.push("/signup");
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Sign Up
                  </button>

                  <button
                    className="rounded-lg bg-[var(--color-blue-600)] px-4 py-2 text-center font-medium text-[var(--color-white)] transition-colors duration-200 hover:bg-[var(--color-blue-700)]"
                    onClick={() => {
                      router.push("/login");
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Login
                  </button>
                </div>
              </nav>
            </div>
          )}
        </header>
      </div>

      {/* Resizable Navbar - Uses its own scroll detection */}
      <Navbar className="fixed top-0 z-50">
        <NavBody>
          {({ visible: _visible }: { visible?: boolean }) => (
            <>
              {/* Logo Section */}
              <div className="flex flex-shrink-0 items-center space-x-3">
                <Image
                  alt="College Logo"
                  className="rounded-full"
                  height={40}
                  priority
                  src="/assets/College_Logo.png"
                  width={40}
                />

                <div className="flex flex-col">
                  <h1 className="text-sm leading-tight font-semibold text-black">
                    IIIT Sri City
                  </h1>
                </div>
              </div>

              {/* Navigation Items */}
              <NavItems items={navLinks} />

              {/* Dark Mode Toggle */}
              <div className="flex flex-shrink-0 items-center">
                <DarkModeToggle />
              </div>
            </>
          )}
        </NavBody>
      </Navbar>
    </>
  );
}

function PublicFooter() {
  return (
    <footer className="bg-[var(--color-white)] py-8 text-[var(--color-gray-900)] sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
          {/* Institution Info */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="mb-4 flex items-center space-x-3 sm:space-x-4">
              <Image
                alt="College Logo"
                className="rounded-full sm:h-[50px] sm:w-[50px]"
                height={40}
                src="/assets/College_Logo.png"
                width={40}
              />

              <div>
                <h3 className="text-base font-semibold sm:text-lg">
                  IIIT Sri City
                </h3>

                <p className="text-xs text-[var(--color-gray-400)] sm:text-sm">
                  Innovation & Entrepreneurship
                </p>
              </div>
            </div>

            <p className="max-w-md text-sm leading-relaxed text-[var(--color-gray-400)]">
              Fostering innovation and entrepreneurship through comprehensive
              support for startups, mentorship programs, and research
              initiatives.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-3 text-base font-semibold sm:mb-4 sm:text-lg">
              Quick Links
            </h4>

            <ul className="space-y-2 text-sm">
              {footerLinks.map((link, index) => (
                <li key={index}>
                  <a
                    className="text-[var(--color-gray-400)] transition-colors hover:text-[var(--color-white)]"
                    href={link.href}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="mb-3 text-base font-semibold sm:mb-4 sm:text-lg">
              Contact
            </h4>

            <div className="space-y-2 text-sm text-[var(--color-gray-400)]">
              <p>{contactInfo.address.line1}</p>

              <p>{contactInfo.address.line2}</p>

              <p>Email: {contactInfo.email}</p>

              <p>Phone: {contactInfo.phone}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-[var(--color-gray-700)] pt-6 text-center sm:mt-8 sm:pt-8">
          <p className="text-xs text-[var(--color-gray-400)] sm:text-sm">
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

export default function PublicLayout({
  children,
  onNavigate,
}: PublicLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-white)]">
      <PublicHeader onNavigate={onNavigate} />

      <main className="flex-1">{children}</main>

      <PublicFooter />
    </div>
  );
}
