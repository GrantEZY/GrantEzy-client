"use client";

import { useEffect } from "react";

import Link from "next/link";

import { AuthGuard } from "@/components/guards/AuthGuard";
import GCVLayout from "@/components/layout/GCVLayout";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useGcv } from "@/hooks/useGcv";

import { UserRoles } from "@/types/auth.types";
import { ProgramStatus } from "@/types/gcv.types";

export default function GCVDashboard() {
  const {
    members,
    isMembersLoading,
    getAllGCVMembers,
    programs,
    programsPagination,
    isProgramsLoading,
    getPrograms,
  } = useGcv();

  useEffect(() => {
    // Fetch initial data - get all committee members to count them
    getAllGCVMembers({
      page: 1,
      numberOfResults: 1000, // Large number to get all committee members
      filter: { role: UserRoles.COMMITTEE_MEMBER },
    });
    getPrograms({ page: 1, numberOfResults: 5 });
  }, []);

  return (
    <AuthGuard>
      <GCVLayout>
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

              <p className="text-gray-600">Grant Committee Overview</p>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-500">Last updated</p>

              <p className="text-sm font-medium text-gray-900">
                {new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Committee Members
                  </p>

                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    {isMembersLoading ? "..." : members.length}
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                  <svg
                    className="h-5 w-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </div>
              </div>

              <Link
                className="mt-2 inline-block text-xs text-blue-600 hover:text-blue-700"
                href="/gcv/members"
              >
                View all →
              </Link>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Programs
                  </p>

                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    {isProgramsLoading ? "..." : programsPagination?.total || 0}
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                  <svg
                    className="h-5 w-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </div>
              </div>

              <Link
                className="mt-2 inline-block text-xs text-green-600 hover:text-green-700"
                href="/gcv/programs"
              >
                View all →
              </Link>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Active Programs
                  </p>

                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    {isProgramsLoading
                      ? "..."
                      : programs.filter((p) => p.status === "ACTIVE").length}
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
                  <svg
                    className="h-5 w-5 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Managed Programs
                  </p>

                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    {isProgramsLoading
                      ? "..."
                      : programs.filter((p) => p.managerId).length}
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
                  <svg
                    className="h-5 w-5 text-amber-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Recent Members */}
            <div className="rounded-lg border border-gray-200 bg-white">
              <div className="border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Recent Members
                  </h2>

                  <Link
                    className="text-sm text-blue-600 hover:text-blue-700"
                    href="/gcv/members"
                  >
                    View all
                  </Link>
                </div>
              </div>

              <div className="p-6">
                {isMembersLoading ? (
                  <div className="flex h-24 items-center justify-center">
                    <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-blue-500"></div>
                  </div>
                ) : members.length === 0 ? (
                  <p className="py-8 text-center text-gray-500">
                    No members found
                  </p>
                ) : (
                  <div className="space-y-3">
                    {members.slice(0, 5).map((member) => (
                      <div
                        className="flex items-center space-x-3 rounded-lg p-3 hover:bg-gray-50"
                        key={member.personId}
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-blue-200 bg-blue-100">
                          <span className="text-sm font-semibold text-blue-700">
                            {member.person?.firstName?.charAt(0) ||
                              member.firstName?.charAt(0) ||
                              "?"}

                            {member.person?.lastName?.charAt(0) ||
                              member.lastName?.charAt(0) ||
                              ""}
                          </span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-gray-900">
                            {member.person?.firstName ||
                              member.firstName ||
                              "Unknown"}{" "}
                            {member.person?.lastName || member.lastName || ""}
                          </p>

                          <p className="truncate text-xs text-gray-500">
                            {member.contact?.email ||
                              member.email ||
                              "No email"}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {member.role.slice(0, 2).map((role) => (
                            <span
                              className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800"
                              key={role}
                            >
                              {role.replace("_", " ").toLowerCase()}
                            </span>
                          ))}

                          {member.role.length > 2 && (
                            <Popover>
                              <PopoverTrigger asChild>
                                <button className="inline-flex cursor-pointer items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800 transition-colors hover:bg-gray-200">
                                  +{member.role.length - 2}
                                </button>
                              </PopoverTrigger>

                              <PopoverContent
                                align="end"
                                className="w-auto p-2"
                              >
                                <div className="flex flex-col gap-1">
                                  {member.role.slice(2).map((role, index) => (
                                    <span
                                      className="inline-flex w-fit items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800"
                                      key={index}
                                    >
                                      {role.replace("_", " ").toLowerCase()}
                                    </span>
                                  ))}
                                </div>
                              </PopoverContent>
                            </Popover>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recent Programs */}
            <div className="rounded-lg border border-gray-200 bg-white">
              <div className="border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Recent Programs
                  </h2>

                  <Link
                    className="text-sm text-green-600 hover:text-green-700"
                    href="/gcv/programs"
                  >
                    View all
                  </Link>
                </div>
              </div>

              <div className="p-6">
                {isProgramsLoading ? (
                  <div className="flex h-24 items-center justify-center">
                    <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-green-500"></div>
                  </div>
                ) : programs.length === 0 ? (
                  <p className="py-8 text-center text-gray-500">
                    No programs found
                  </p>
                ) : (
                  <div className="space-y-3">
                    {programs.slice(0, 5).map((program) => (
                      <div
                        className="flex items-center space-x-3 rounded-lg p-3 hover:bg-gray-50"
                        key={program.id}
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-green-200 bg-green-100">
                          <svg
                            className="h-5 w-5 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                            />
                          </svg>
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-gray-900">
                            {program.details.name}
                          </p>

                          <p className="truncate text-xs text-gray-500">
                            {program.details.category} •{" "}
                            {program.budget.currency}{" "}
                            {program.budget.amount.toLocaleString()}
                          </p>
                        </div>

                        <div className="flex flex-col items-end space-y-1">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                              program.status === ProgramStatus.ACTIVE
                                ? "bg-emerald-100 text-emerald-800"
                                : program.status === ProgramStatus.IN_ACTIVE
                                  ? "bg-gray-100 text-gray-800"
                                  : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {program.status}
                          </span>

                          {program.manager && (
                            <span className="text-xs text-gray-500">
                              {program.manager.person.firstName}{" "}
                              {program.manager.person.lastName}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </GCVLayout>
    </AuthGuard>
  );
}
