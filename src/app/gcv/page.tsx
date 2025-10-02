"use client";

import { useEffect } from "react";

import Link from "next/link";

import { AuthGuard } from "@/components/guards/AuthGuard";
import GCVLayout from "@/components/layout/GCVLayout";

import { useGcv } from "@/hooks/useGcv";
import { UserRoles } from "@/types/auth.types";

export default function GCVDashboard() {
  const {
    members,
    membersPagination,
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
      filter: { role: UserRoles.COMMITTEE_MEMBER }
    });
    getPrograms({ page: 1, numberOfResults: 5 });
  }, []);  return (
    <AuthGuard>
      <GCVLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Grant Committee View Dashboard
            </h1>

            <p className="mt-2 text-gray-600">
              Manage committee members and programs
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Committee Members
                  </p>

                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    {isMembersLoading ? "..." : members.length}
                  </p>
                </div>

                <div className="rounded-full bg-blue-100 p-3">
                  <svg
                    className="h-6 w-6 text-blue-600"
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
                className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
                href="/gcv/members"
              >
                View all members →
              </Link>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Programs
                  </p>

                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    {isProgramsLoading ? "..." : programsPagination?.total || 0}
                  </p>
                </div>

                <div className="rounded-full bg-green-100 p-3">
                  <svg
                    className="h-6 w-6 text-green-600"
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
                className="mt-4 inline-block text-sm font-medium text-green-600 hover:text-green-700"
                href="/gcv/programs"
              >
                View all programs →
              </Link>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Active Programs
                  </p>

                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    {isProgramsLoading
                      ? "..."
                      : programs.filter((p) => p.status === "ACTIVE").length}
                  </p>
                </div>

                <div className="rounded-full bg-purple-100 p-3">
                  <svg
                    className="h-6 w-6 text-purple-600"
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

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Programs with Managers
                  </p>

                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    {isProgramsLoading
                      ? "..."
                      : programs.filter((p) => p.managerId).length}
                  </p>
                </div>

                <div className="rounded-full bg-yellow-100 p-3">
                  <svg
                    className="h-6 w-6 text-yellow-600"
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

          {/* Recent Members */}
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Recent Members
                </h2>

                <Link
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                  href="/gcv/members"
                >
                  View all
                </Link>
              </div>
            </div>

            <div className="p-6">
              {isMembersLoading ? (
                <div className="flex h-32 items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
                </div>
              ) : members.length === 0 ? (
                <p className="py-8 text-center text-gray-500">
                  No members found
                </p>
              ) : (
                <div className="space-y-4">
                  {members.slice(0, 5).map((member) => (
                    <div
                      className="flex items-center justify-between rounded-lg border border-gray-100 p-4 hover:bg-gray-50"
                      key={member.personId}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                          <span className="text-sm font-semibold text-blue-600">
                            {member.person?.firstName?.charAt(0) ||
                              member.firstName?.charAt(0) ||
                              "?"}
                          </span>
                        </div>

                        <div>
                          <p className="font-medium text-gray-900">
                            {member.person?.firstName ||
                              member.firstName ||
                              "N/A"}{" "}
                            {member.person?.lastName || member.lastName || ""}
                          </p>

                          <p className="text-sm text-gray-600">
                            {member.contact?.email || member.email || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {member.role.map((role, idx) => (
                          <span
                            className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800"
                            key={idx}
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Programs */}
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Recent Programs
                </h2>

                <Link
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                  href="/gcv/programs"
                >
                  View all
                </Link>
              </div>
            </div>

            <div className="p-6">
              {isProgramsLoading ? (
                <div className="flex h-32 items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
                </div>
              ) : programs.length === 0 ? (
                <p className="py-8 text-center text-gray-500">
                  No programs found
                </p>
              ) : (
                <div className="space-y-4">
                  {programs.slice(0, 5).map((program) => (
                    <div
                      className="rounded-lg border border-gray-100 p-4 hover:bg-gray-50"
                      key={program.id}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {program.details.name}
                          </h3>

                          <p className="mt-1 text-sm text-gray-600">
                            {program.details.description}
                          </p>

                          <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                            <span>
                              Budget: {program.budget.currency}{" "}
                              {program.budget.amount.toLocaleString()}
                            </span>

                            <span>
                              TRL: {program.minTRL} - {program.maxTRL}
                            </span>
                          </div>
                        </div>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            program.status === "ACTIVE"
                              ? "bg-green-100 text-green-800"
                              : program.status === "INACTIVE"
                                ? "bg-gray-100 text-gray-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {program.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </GCVLayout>
    </AuthGuard>
  );
}
