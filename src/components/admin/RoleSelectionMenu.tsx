'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { useAuth } from '@/hooks/useAuth';

import { UserRoles } from '@/types/auth.types';

interface RoleCardProps {
  title: string;
  icon: React.ReactNode;
  onClick?: () => void;
  selected?: boolean;
}

function RoleCard({ title, icon, onClick, selected = false }: RoleCardProps) {
  const baseClasses = `w-[300px] h-[200px] rounded-[30px] flex flex-col items-center justify-center space-y-4 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`;

  const cardClasses = selected
    ? `${baseClasses} text-white`
    : `${baseClasses} bg-white hover:shadow-2xl hover:scale-105 hover:text-white group`;

  const cardStyle: React.CSSProperties = selected
    ? {
        background: 'var(--color-blue-custom)',
        boxShadow:
          '0px 0px 13.9px 0px var(--shadow-black-10), 2px 6px 10px 0px var(--shadow-white-80) inset',
        border: 'none',
      }
    : {
        boxShadow: '0px 0px 13.9px 0px var(--shadow-light)',
      };

  const hoverStyle: React.CSSProperties = !selected
    ? {
        background:
          'linear-gradient(135deg, var(--color-blue-custom) 0%, var(--color-blue-600, #2563eb) 50%, var(--color-blue-700, #1d4ed8) 100%)',
      }
    : {};

  return (
    <button
      aria-pressed={selected}
      className={cardClasses}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (!selected) {
          Object.assign(e.currentTarget.style, hoverStyle);
        }
      }}
      onMouseLeave={(e) => {
        if (!selected) {
          e.currentTarget.style.background = 'white';
        }
      }}
      style={cardStyle}
    >
      <div
        className={`h-12 w-12 ${selected ? 'bg-white/20' : 'bg-[var(--color-gray-100)] group-hover:bg-white/20'} flex items-center justify-center rounded-full transition-all duration-200`}
      >
        {/* icon should inherit currentColor, so we toggle text color */}
        <span
          className={`transition-colors duration-200 ${
            selected ? 'text-white' : 'text-[var(--color-gray-600)] group-hover:text-white'
          }`}
        >
          {icon}
        </span>
      </div>

      <h3
        className={`${selected ? 'text-white' : 'text-[var(--color-gray-800)] group-hover:text-white'} font-inter text-[22px] font-normal transition-colors duration-200`}
      >
        {title}
      </h3>
    </button>
  );
}

export default function RoleSelectionMenu() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const handleRoleSelect = (role: string) => {
    setSelectedRole((prev) => (prev === role ? null : role));

    // Navigate to the appropriate admin page
    if (role === 'users') {
      router.push('/admin/users');
    } else if (role === 'organizations') {
      router.push('/admin/organizations');
    }
  };

  // Check if user has admin access
  const hasAdminRole = user?.role?.includes(UserRoles.ADMIN);
  if (!isAuthenticated || !hasAdminRole) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-semibold text-gray-900">Access Denied</h2>

          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      {/* Page Title */}
      <header className="mt-12 mb-24 ml-12">
        <h1 className="font-inter text-[32px] font-light text-[var(--color-gray-800)]">
          Role Selection Menu
        </h1>
      </header>

      {/* Main Content */}
      <section className="flex justify-center">
        <div className="flex flex-col items-start">
          {/* Section Subtitle */}
          <div className="mb-4">
            <h2 className="font-inter text-[24px] font-light text-[var(--color-gray-600)]">
              Choose Role to Manage:
            </h2>
          </div>

          {/* Role Selection Cards */}
          <div
            aria-label="Role selection"
            className="flex flex-wrap items-start gap-4 space-x-8"
            role="group"
          >
            <RoleCard
              icon={
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                  />
                </svg>
              }
              onClick={() => handleRoleSelect('users')}
              selected={selectedRole === 'users'}
              title="All Users"
            />

            <RoleCard
              icon={
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                  />
                </svg>
              }
              onClick={() => handleRoleSelect('organizations')}
              selected={selectedRole === 'organizations'}
              title="Organizations"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
