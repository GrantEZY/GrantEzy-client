"use client";

import Image from 'next/image';

interface UserInfoProps {
  name: string;
  greeting: string;
  initials: string;
}

function UserInfo({ name, greeting, initials }: UserInfoProps) {
  return (
    <div className="flex items-center space-x-3">
            <div className="text-right">
        <div className="text-[var(--color-gray-800)] text-base font-semibold font-inter">
          {name}
        </div>
        <div className="text-[var(--color-gray-500)] text-xs font-inter">
          {greeting}
        </div>
      </div>
      <div className="w-10 h-10 bg-[var(--color-blue-500)] rounded-full flex items-center justify-center">
        <span className="text-[var(--color-white)] text-sm font-medium">{initials}</span>
      </div>
    </div>
  );
}

function SearchBar() {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search"
        className="w-[400px] h-[55px] bg-[var(--color-background-light)] rounded-[30px] px-6 py-4 pr-12 
                   focus:outline-none focus:ring-2 focus:ring-[var(--color-blue-500)] focus:ring-offset-2
                   font-inter text-base border-0"
        style={{ boxShadow: '0px 1px 4px 0px rgba(0,0,0,0.25)' }}
      />
      <svg
        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-gray-500)] pointer-events-none"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
  );
}

function NotificationBell() {
  return (
    <button 
      className="relative p-2 text-[var(--color-gray-600)] hover:text-[var(--color-gray-800)] transition-colors
                 focus:outline-none focus:ring-2 focus:ring-[var(--color-blue-500)] focus:ring-offset-2 rounded-lg"
      aria-label="Notifications"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
      <span className="absolute -top-1 -right-1 bg-[var(--color-yellow-400)] text-[var(--color-white)] text-xs rounded-full h-5 w-5 flex items-center justify-center">
        !
      </span>
    </button>
  );
}

export default function Header() {
  return (
    <header className="h-[98px] bg-[var(--color-white)] border-b border-[var(--color-border-gray)] px-6 py-4 w-full">
      <div className="flex items-center justify-between h-full max-w-full">
        {/* Logo and Institution Name */}
        <div className="flex items-center space-x-4 flex-shrink-0">
          <Image
            src="/assets/College_Logo.png"
            alt="College Logo"
            width={70}
            height={70}
            className="rounded-full"
            priority
          />
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-[var(--color-gray-800)] leading-tight">
              Indian Institute of Information
            </h1>
            <h1 className="text-lg font-semibold text-[var(--color-gray-800)] leading-tight">
              Technology Sri City
            </h1>
            <p className="text-sm text-[var(--color-gray-600)]">भारतीय सूचना प्रौद्योगिकी संस्थान श्री सिटी</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 flex justify-center px-4">
          <SearchBar />
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-4 flex-shrink-0">
          <NotificationBell />
          <UserInfo 
            name="New User" 
            greeting="Have a great day!" 
            initials="ST" 
          />
        </div>
      </div>
    </header>
  );
}
