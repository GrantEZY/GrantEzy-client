"use client";

import { useState } from "react";

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
        background: "var(--color-blue-custom)",
        boxShadow:
          "0px 0px 13.9px 0px var(--shadow-black-10), 2px 6px 10px 0px var(--shadow-white-80) inset",
        border: "none",
      }
    : {
        boxShadow: "0px 0px 13.9px 0px var(--shadow-light)",
        background: "var(--color-white)",
      };

  return (
    <button
      aria-pressed={selected}
      className={baseClasses + (selected ? " " : " hover:shadow-lg")}
      onClick={onClick}
      style={selectedStyle}
    >
      <div
        className={`h-12 w-12 ${selected ? "bg-white/20" : "bg-[var(--color-gray-100)]"} flex items-center justify-center rounded-full`}
      >
        {/* icon should inherit currentColor, so we toggle text color */}
        <span
          className={
            selected
              ? "text-[var(--color-white)]"
              : "text-[var(--color-gray-600)]"
          }
        >
          {icon}
        </span>
      </div>

      <h3
        className={`${selected ? "text-[var(--color-white)]" : "text-[var(--color-gray-800)]"} font-inter text-[22px] font-normal`}
      >
        {title}
      </h3>
    </button>
  );
}

export default function RoleSelectionMenu() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleRoleSelect = (role: string) => {
    setSelectedRole((prev) => (prev === role ? null : role));
    // TODO: Implement navigation or state management
  };

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
            className="flex items-start space-x-8"
            role="group"
          >
            <RoleCard
              icon={
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                  />
                </svg>
              }
              onClick={() => handleRoleSelect("startups")}
              selected={selectedRole === "startups"}
              title="Startups"
            />

            <RoleCard
              icon={
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                  />
                </svg>
              }
              onClick={() => handleRoleSelect("eirs")}
              selected={selectedRole === "eirs"}
              title="EIRs"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
