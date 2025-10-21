"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";

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
  href = "#",
  index: _index,
  onClick,
}: SidebarItemProps) {
  const content = (
    <>
      <span
        className={
          active
            ? "text-[var(--color-blue-700)]"
            : "text-[var(--color-gray-600)]"
        }
      >
        {icon}
      </span>

      <span>{label}</span>
    </>
  );

  const className = `flex items-center space-x-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200 hover:bg-[var(--color-gray-50)] focus:ring-2 focus:ring-[var(--color-blue-500)] focus:ring-offset-2 focus:outline-none ${isSubItem ? "ml-6" : ""} ${
    active
      ? "border-l-4 border-[var(--color-blue-700)] bg-[var(--color-blue-50)] text-[var(--color-blue-700)] shadow-sm"
      : "text-[var(--color-gray-700)] hover:text-[var(--color-gray-900)]"
  }`;

  return (
    <>
      {href !== "#" ? (
        <Link className={className} href={href}>
          {content}
        </Link>
      ) : (
        <button
          className={className + " w-full"}
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
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </svg>
  ),
  programs: (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </svg>
  ),
  cycles: (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </svg>
  ),
  analytics: (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </svg>
  ),
  settings: (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
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

export default function PMSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const menuItems: MenuItem[] = [
    {
      icon: icons.home,
      label: "Dashboard",
      href: "/pm",
      active: pathname === "/pm",
    },
    {
      icon: icons.programs,
      label: "My Programs",
      href: "/pm/programs",
      active: pathname.startsWith("/pm/programs"),
    },
    {
      icon: icons.analytics,
      label: "Analytics & Reports",
      href: "/pm/analytics",
      active: pathname === "/pm/analytics",
    },
  ];

  return (
    <aside className="w-64 border-r border-[var(--color-gray-200)] bg-white shadow-sm">
      <div className="flex h-full flex-col">
        {/* Logo/Title */}
        <div className="border-b border-[var(--color-gray-200)] p-6">
          <h2 className="text-lg font-semibold text-[var(--color-gray-900)]">
            Program Manager
          </h2>

          <p className="mt-1 text-sm text-[var(--color-gray-600)]">
            Cycle Management
          </p>
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
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
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
