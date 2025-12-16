/**
 * Co-Applicant Sidebar Component
 * Navigation sidebar for co-applicant pages
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
  projects: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
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
};

export default function CoApplicantSidebar() {
  const pathname = usePathname();
  const { user: _user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const menuItems: MenuItem[] = [
    {
      icon: icons.home,
      label: 'Dashboard',
      href: '/co-applicant/dashboard',
      active: pathname === '/co-applicant/dashboard' || pathname === '/co-applicant',
    },
    {
      icon: icons.projects,
      label: 'My Projects',
      href: '/co-applicant/my-projects',
      active: pathname?.startsWith('/co-applicant/my-projects'),
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
