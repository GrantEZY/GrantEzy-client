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
  clipboard: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </svg>
  ),
  documentText: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </svg>
  ),
};

export default function ReviewerSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const menuItems: MenuItem[] = [
    {
      icon: icons.home,
      label: 'Dashboard',
      href: '/reviewer',
      active: pathname === '/reviewer',
    },
    {
      icon: icons.clipboard,
      label: 'My Reviews',
      href: '/reviewer/reviews',
      active: pathname.startsWith('/reviewer/reviews'),
    },
  ];

  return (
    <aside className="w-64 border-r border-[var(--color-gray-200)] bg-white shadow-sm">
      <div className="flex h-full flex-col">
        {/* Logo/Title */}
        <div className="border-b border-[var(--color-gray-200)] p-6">
          <h2 className="text-lg font-semibold text-[var(--color-gray-900)]">Reviewer Portal</h2>

          <p className="mt-1 text-sm text-[var(--color-gray-600)]">Application Reviews</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-1">
            {menuItems.map((item, index) => (
              <SidebarItem
                active={item.active}
                href={item.href}
                icon={item.icon}
                index={index}
                isSubItem={item.isSubItem}
                key={index}
                label={item.label}
              />
            ))}
          </div>
        </nav>

        {/* User Actions */}
        <div className="border-t border-[var(--color-gray-200)] p-4">
          <div className="space-y-1">
            <button
              className="flex w-full items-center space-x-3 rounded-lg px-3 py-3 text-sm font-medium text-[var(--color-gray-700)] transition-all duration-200 hover:bg-[var(--color-gray-50)] hover:text-[var(--color-gray-900)] focus:ring-2 focus:ring-[var(--color-blue-500)] focus:ring-offset-2 focus:outline-none"
              onClick={logout}
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
      </div>
    </aside>
  );
}
