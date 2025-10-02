"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { AuthGuard } from "@/components/guards/AuthGuard";
import GCVLayout from "@/components/layout/GCVLayout";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useGcv } from "@/hooks/useGcv";
import { ProgramStatus } from "@/types/gcv.types";
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
                {new Date().toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Committee Members</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {isMembersLoading ? "..." : members.length}
                  </p>
                </div>
                <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <Link href="/gcv/members" className="text-xs text-blue-600 hover:text-blue-700 mt-2 inline-block">
                View all →
              </Link>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Programs</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {isProgramsLoading ? "..." : programsPagination?.total || 0}
                  </p>
                </div>
                <div className="h-10 w-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
              <Link href="/gcv/programs" className="text-xs text-green-600 hover:text-green-700 mt-2 inline-block">
                View all →
              </Link>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Programs</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {isProgramsLoading ? "..." : programs.filter((p) => p.status === "ACTIVE").length}
                  </p>
                </div>
                <div className="h-10 w-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <svg className="h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Managed Programs</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {isProgramsLoading ? "..." : programs.filter((p) => p.managerId).length}
                  </p>
                </div>
                <div className="h-10 w-10 bg-amber-50 rounded-lg flex items-center justify-center">
                  <svg className="h-5 w-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Recent Members */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Members</h2>
                  <Link href="/gcv/members" className="text-sm text-blue-600 hover:text-blue-700">
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
                  <p className="text-center text-gray-500 py-8">No members found</p>
                ) : (
                  <div className="space-y-3">
                    {members.slice(0, 5).map((member) => (
                      <div key={member.personId} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 border-2 border-blue-200">
                          <span className="text-sm font-semibold text-blue-700">
                            {member.person?.firstName?.charAt(0) || member.firstName?.charAt(0) || "?"}
                            {member.person?.lastName?.charAt(0) || member.lastName?.charAt(0) || ""}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {member.person?.firstName || member.firstName || "Unknown"} {member.person?.lastName || member.lastName || ""}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {member.contact?.email || member.email || "No email"}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {member.role.slice(0, 2).map((role) => (
                            <span
                              key={role}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {role.replace("_", " ").toLowerCase()}
                            </span>
                          ))}
                          {member.role.length > 2 && (
                            <Popover>
                              <PopoverTrigger asChild>
                                <button className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors cursor-pointer">
                                  +{member.role.length - 2}
                                </button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-2" align="end">
                                <div className="flex flex-col gap-1">
                                  {member.role.slice(2).map((role, index) => (
                                    <span
                                      key={index}
                                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 w-fit"
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
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Programs</h2>
                  <Link href="/gcv/programs" className="text-sm text-green-600 hover:text-green-700">
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
                  <p className="text-center text-gray-500 py-8">No programs found</p>
                ) : (
                  <div className="space-y-3">
                    {programs.slice(0, 5).map((program) => (
                      <div key={program.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 border-2 border-green-200">
                          <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {program.details.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {program.details.category} • {program.budget.currency} {program.budget.amount.toLocaleString()}
                          </p>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
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
                              {program.manager.person.firstName} {program.manager.person.lastName}
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
