'use client';

import Image from 'next/image';

import { useAuth } from '@/hooks/useAuth';

interface UserInfoProps {
  name: string;
  greeting: string;
  initials: string;
}

function UserInfo({ name, greeting, initials }: UserInfoProps) {
  return (
    <div className="flex items-center space-x-3">
      <div className="text-right">
        <div className="font-inter text-base font-semibold text-[var(--color-gray-800)]">
          {name}
        </div>

        <div className="font-inter text-xs text-[var(--color-gray-500)]">{greeting}</div>
      </div>

      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-blue-500)]">
        <span className="text-sm font-medium text-[var(--color-white)]">{initials}</span>
      </div>
    </div>
  );
}

function SearchBar() {
  return (
    <div className="relative">
      <input
        className="font-inter h-[55px] w-[400px] rounded-[30px] border-0 bg-[var(--color-background-light)] px-6 py-4 pr-12 text-base focus:ring-2 focus:ring-[var(--color-blue-500)] focus:ring-offset-2 focus:outline-none"
        placeholder="Search"
        style={{ boxShadow: '0px 1px 4px 0px rgba(0,0,0,0.25)' }}
        type="text"
      />

      <svg
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 transform text-[var(--color-gray-500)]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
        />
      </svg>
    </div>
  );
}

function NotificationBell() {
  return (
    <button
      aria-label="Notifications"
      className="relative rounded-lg p-2 text-[var(--color-gray-600)] transition-colors hover:text-[var(--color-gray-800)] focus:ring-2 focus:ring-[var(--color-blue-500)] focus:ring-offset-2 focus:outline-none"
    >
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
        />
      </svg>

      <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-yellow-400)] text-xs text-[var(--color-white)]">
        !
      </span>
    </button>
  );
}

export default function Header() {
  const { user, isAuthenticated } = useAuth();

  // Get user initials
  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    }
    return 'U';
  };

  // Get user display name
  const getUserName = () => {
    if (user?.firstName) {
      return user.firstName;
    }
    return 'User';
  };
  return (
    <header className="h-[98px] w-full border-b border-[var(--color-border-gray)] bg-[var(--color-white)] px-6 py-4">
      <div className="flex h-full max-w-full items-center justify-between">
        {/* Logo and Institution Name */}
        <div className="flex flex-shrink-0 items-center space-x-4">
          <Image
            alt="College Logo"
            className="rounded-full"
            height={70}
            priority
            src="/assets/College_Logo.png"
            width={70}
          />

          <div className="flex flex-col">
            <h1 className="text-lg leading-tight font-semibold text-[var(--color-gray-800)]">
              Indian Institute of Information
            </h1>

            <h1 className="text-lg leading-tight font-semibold text-[var(--color-gray-800)]">
              Technology Sri City
            </h1>

            <p className="text-sm text-[var(--color-gray-600)]">
              भारतीय सूचना प्रौद्योगिकी संस्थान श्री सिटी
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex flex-1 justify-center px-4">
          <SearchBar />
        </div>

        {/* User Actions */}
        <div className="flex flex-shrink-0 items-center space-x-4">
          <NotificationBell />

          {isAuthenticated ? (
            <div className="flex items-center space-x-3">
              <UserInfo
                greeting="Have a great day!"
                initials={getUserInitials()}
                name={getUserName()}
              />
            </div>
          ) : (
            <UserInfo greeting="Please log in" initials="?" name="Guest" />
          )}
        </div>
      </div>
    </header>
  );
}
