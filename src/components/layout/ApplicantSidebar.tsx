/**
 * Applicant Sidebar Component
 * Navigation sidebar for applicant pages
 */
'use client';

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
  document: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </svg>
  ),
  projects: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </svg>
  ),
  cycles: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </svg>
  ),
  help: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </svg>
  ),
  profile: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </svg>
  ),
};

export default function ApplicantSidebar() {
  const pathname = usePathname();
  const { user: _user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const menuItems: MenuItem[] = [
    {
      icon: icons.home,
      label: 'Dashboard',
      href: '/applicant',
      active: pathname === '/applicant',
    },
    {
      icon: icons.document,
      label: 'My Applications',
      href: '/applicant/applications',
      active: pathname?.startsWith('/applicant/applications'),
    },
    {
      icon: icons.projects,
      label: 'My Projects',
      href: '/applicant/projects',
      active: pathname?.startsWith('/applicant/projects'),
    },
    {
      icon: icons.cycles,
      label: 'Available Cycles',
      href: '/applicant/cycles',
      active: pathname?.startsWith('/applicant/cycles'),
    },
    {
      icon: icons.profile,
      label: 'Profile',
      href: '/applicant/profile',
      active: pathname?.startsWith('/applicant/profile'),
    },
    {
      icon: icons.help,
      label: 'Help & Support',
      href: '/applicant/help',
      active: pathname?.startsWith('/applicant/help'),
    },
  ];

  return (
    <aside className="flex h-full w-64 flex-col border-r border-[var(--color-border-light)] bg-white shadow-sm">
      <div className="flex-1">
        <nav className="space-y-1 p-4" role="navigation">
          {menuItems.map((item, index) => (
            <SidebarItem key={index} {...item} index={index} />
          ))}
        </nav>
      </div>

      {/* User Actions */}
      <div className="border-t border-[var(--color-gray-200)] p-4">
        <div className="space-y-1">
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
