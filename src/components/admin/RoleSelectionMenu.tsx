"use client";

import { useState } from 'react';

interface RoleCardProps {
  title: string;
  icon: React.ReactNode;
  onClick?: () => void;
  selected?: boolean;
}

function RoleCard({ title, icon, onClick, selected = false }: RoleCardProps) {
  const baseClasses = `w-[300px] h-[200px] rounded-[30px] flex flex-col items-center justify-center space-y-4 transition-shadow duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`;

  const selectedStyle: React.CSSProperties | undefined = selected
    ? {
        background: 'var(--color-blue-custom)',
        boxShadow: '0px 0px 13.9px 0px var(--shadow-black-10), 2px 6px 10px 0px var(--shadow-white-80) inset',
        border: 'none',
      }
    : { boxShadow: '0px 0px 13.9px 0px var(--shadow-light)', background: 'var(--color-white)' };

  return (
    <button
      onClick={onClick}
      className={baseClasses + (selected ? ' ' : ' hover:shadow-lg')}
      style={selectedStyle}
      aria-pressed={selected}
    >
      <div className={`w-12 h-12 ${selected ? 'bg-white/20' : 'bg-[var(--color-gray-100)]'} rounded-full flex items-center justify-center`}>
        {/* icon should inherit currentColor, so we toggle text color */}
        <span className={selected ? 'text-[var(--color-white)]' : 'text-[var(--color-gray-600)]'}>{icon}</span>
      </div>
      <h3 className={`${selected ? 'text-[var(--color-white)]' : 'text-[var(--color-gray-800)]'} text-[22px] font-normal font-inter`}>
        {title}
      </h3>
    </button>
  );
}

export default function RoleSelectionMenu() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleRoleSelect = (role: string) => {
    setSelectedRole((prev) => (prev === role ? null : role));
    console.log(`Selected role: ${role}`);
    // TODO: Implement navigation or state management
  };

  return (
    <div className="w-full h-full">
      {/* Page Title */}
      <header className="mb-24 ml-12 mt-12">
        <h1 className="text-[var(--color-gray-800)] text-[32px] font-light font-inter">
          Role Selection Menu
        </h1>
      </header>
      
      {/* Main Content */}
      <section className="flex justify-center">
        <div className="flex flex-col items-start">
          {/* Section Subtitle */}
          <div className="mb-4">
            <h2 className="text-[var(--color-gray-600)] text-[24px] font-light font-inter">
              Choose Role to Manage:
            </h2>
          </div>
          
          {/* Role Selection Cards */}
          <div className="flex items-start space-x-8" role="group" aria-label="Role selection">
            <RoleCard
              title="Startups"
              selected={selectedRole === 'startups'}
              onClick={() => handleRoleSelect('startups')}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
            />
            <RoleCard
              title="EIRs"
              selected={selectedRole === 'eirs'}
              onClick={() => handleRoleSelect('eirs')}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              }
            />
          </div>
        </div>
      </section>
    </div>
  );
}
