'use client';

import { useState } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useAuth } from '@/hooks/useAuth';

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  isSubItem?: boolean;
  href?: string;
}

interface SidebarItemProps extends MenuItem {
  index: number;
  onClick?: (e: React.MouseEvent) => void;
}

// FIX 1: SidebarItem no longer renders the wrapping <li>. It just renders the link.
function SidebarItem({
  icon,
  label,
  active = false,
  isSubItem,
  href = '#',
  index: _index,
  onClick,
}: SidebarItemProps) {
  const content = (
    <>
      <span className={active ? 'text-[var(--color-blue-700)]' : 'text-[var(--color-gray-600)]'}>
        {icon}
      </span>

      <span>{label}</span>
    </>
  );

  const className = `flex items-center space-x-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200 hover:bg-[var(--color-gray-50)] focus:ring-2 focus:ring-[var(--color-blue-500)] focus:ring-offset-2 focus:outline-none ${isSubItem ? 'ml-6' : ''} ${
    active
      ? 'border-l-4 border-[var(--color-blue-700)] bg-[var(--color-blue-50)] text-[var(--color-blue-700)] shadow-sm'
      : 'text-[var(--color-gray-700)] hover:text-[var(--color-gray-900)]'
  }`;

  return (
    <>
      {href !== '#' ? (
        <Link className={className} href={href}>
          {content}
        </Link>
      ) : (
        <button
          className={className + ' w-full'}
          onClick={(e) => {
            if (onClick) {
              e.preventDefault();
              onClick(e);
            }
          }}
        >
          {content}
        </button>
      )}
    </>
  );
}

const icons = {
  home: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </svg>
  ),
  academics: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </svg>
  ),
  honors: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </svg>
  ),
  btp: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </svg>
  ),
  feedback: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </svg>
  ),
  people: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </svg>
  ),
  startups: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        d="M13 10V3L4 14h7v7l9-11h-7z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </svg>
  ),
  mentors: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </svg>
  ),
  eirs: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </svg>
  ),
  organizations: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </svg>
  ),
  settings: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />

      <path
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </svg>
  ),
};

export default function Sidebar() {
  const [peopleOpen, setPeopleOpen] = useState(true); // Keep people menu open by default for admin
  const pathname = usePathname();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const menuItems: MenuItem[] = [
    {
      icon: icons.home,
      label: 'Home',
      active: pathname === '/admin',
      href: '/admin',
    },
    {
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
        </svg>
      ),
      label: 'Dashboard',
      active: pathname === '/admin/dashboard',
      href: '/admin/dashboard',
    },
    {
      icon: icons.people,
      label: 'People',
      active: pathname.includes('/admin/') && !pathname.includes('/admin/dashboard'),
    },
  ];

  const subItems: MenuItem[] = [
    {
      icon: icons.mentors,
      label: 'All Users',
      active: pathname === '/admin/users',
      isSubItem: true,
      href: '/admin/users',
    },
    {
      icon: icons.organizations,
      label: 'Organizations',
      active: pathname === '/admin/organizations',
      isSubItem: true,
      href: '/admin/organizations',
    },
  ];

  return (
    <aside className="flex h-full w-[280px] flex-col flex-shrink-0 border-r border-[var(--color-border-light)] bg-[var(--color-white)]">
      <div className="flex-1">
        <nav className="p-4">
          <ul className="space-y-1">
            {menuItems.map((item, idx) => (
              // FIX 2: The <li> wrapper is here. Added className="relative" to it.
              <li className="relative" key={idx}>
                <SidebarItem
                  {...item}
                  index={idx}
                  onClick={() => {
                    if (item.label === 'People') {
                      setPeopleOpen((v) => !v);
                    }
                  }}
                />

                {item.label === 'People' && (
                  <div
                    className={`relative mt-2 mb-4 ${peopleOpen ? 'block' : 'hidden'}`}
                    style={{ zIndex: 1 }}
                  >
                    <div
                      aria-hidden
                      className="absolute"
                      style={{
                        left: 24,
                        top: 8,
                        bottom: 8,
                        width: 3,
                        background: 'var(--color-black)',
                        borderRadius: 2,
                      }}
                    />

                    {/* FIX 3: Replaced invalid <div> wrappers with a proper <ul>/<li> structure for the sub-menu. */}
                    <ul className="flex flex-col space-y-6">
                      {subItems.map((sub, sidx) => {
                        const isSelected = sub.active;
                        return (
                          <li className="relative" key={sidx}>
                            <span
                              aria-hidden
                              className="absolute top-1/2 -translate-y-1/2"
                              style={{
                                left: '19.5px',
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                background: isSelected
                                  ? 'var(--color-yellow)'
                                  : 'var(--color-black)',
                                border: '3px solid var(--color-black)',
                                boxSizing: 'border-box',
                                zIndex: 1,
                              }}
                            />

                            <Link
                              className={`flex items-center space-x-3 rounded-lg px-3 py-1 pl-12 text-sm font-medium transition-all duration-200 hover:bg-[var(--color-gray-50)] ${
                                isSelected
                                  ? 'font-semibold text-[var(--color-gray-900)]'
                                  : 'text-[var(--color-gray-700)]'
                              }`}
                              href={sub.href || '#'}
                            >
                              <span className="text-[var(--color-gray-700)]">{sub.icon}</span>

                              <span>{sub.label}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* User Actions */}
      <div className="border-t border-[var(--color-gray-200)] p-4">
        <div className="space-y-1">
          <a
            className="flex items-center space-x-3 rounded-lg px-3 py-3 text-sm font-medium text-[var(--color-gray-700)] transition-all duration-200 hover:bg-[var(--color-gray-50)] hover:text-[var(--color-gray-900)] focus:ring-2 focus:ring-[var(--color-blue-500)] focus:ring-offset-2 focus:outline-none"
            href="#"
          >
            {icons.settings}

            <span>Settings</span>
          </a>

          <button
            className="flex w-full items-center space-x-3 rounded-lg px-3 py-3 text-sm font-medium text-[var(--color-gray-700)] transition-all duration-200 hover:bg-[var(--color-red-50)] hover:text-[var(--color-red-700)] focus:ring-2 focus:ring-[var(--color-red-500)] focus:ring-offset-2 focus:outline-none"
            onClick={handleLogout}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>

            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
