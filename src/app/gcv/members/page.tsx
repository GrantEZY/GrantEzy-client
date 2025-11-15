"use client";

import { useCallback, useEffect, useState } from "react";

import { AddGCVMemberModal } from "@/components/gcv/AddGCVMemberModal";
import { AuthGuard } from "@/components/guards/AuthGuard";
import GCVLayout from "@/components/layout/GCVLayout";
import { showToast, ToastProvider } from "@/components/ui/ToastNew";

import { useGcv } from "@/hooks/useGcv";

import { UserRoles } from "@/types/auth.types";
import { GCVMember, UpdateRole } from "@/types/gcv.types";

export default function GCVMembersPage() {
  const {
    members,
    membersPagination,
    isMembersLoading,
    membersError,
    getAllGCVMembers,
    addGCVMember,
    updateGCVUserRole,
  } = useGcv();

  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const pageSize = 10;

  const fetchMembers = useCallback(
    (page: number) => {
      getAllGCVMembers({
        page,
        numberOfResults: pageSize,
        filter: { role: UserRoles.COMMITTEE_MEMBER },
      });
    },
    [getAllGCVMembers],
  );

  useEffect(() => {
    fetchMembers(currentPage);
  }, [currentPage, fetchMembers]);

  const handleAddMember = async (email: string) => {
    try {
      const success = await addGCVMember({ email });
      if (success) {
        showToast.success("Member added successfully!");
        setIsAddModalOpen(false);
        fetchMembers(currentPage);
      }
    } catch (error) {
      // Extract detailed error message from the store
      const errorMessage =
        error instanceof Error
          ? error.message
          : membersError || "Failed to add member";
      showToast.error(errorMessage);
    }
  };

  const handleToggleRole = async (member: GCVMember) => {
    const hasRole = member.role.includes(UserRoles.COMMITTEE_MEMBER);
    const type = hasRole ? UpdateRole.DELETE_ROLE : UpdateRole.ADD_ROLE;

    const requestData = {
      email: member.contact?.email || member.email,
      type,
    };

    try {
      const success = await updateGCVUserRole(requestData);

      if (success) {
        showToast.success(
          `Role ${hasRole ? "removed" : "added"} successfully!`,
        );
        fetchMembers(currentPage);
      }
    } catch (error) {
      // Extract detailed error message from the store
      const errorMessage =
        error instanceof Error
          ? error.message
          : membersError || "Failed to update role";
      showToast.error(errorMessage);
    }
  };

  const filteredMembers = members.filter((member) => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    const firstName = member.person?.firstName || member.firstName || "";
    const lastName = member.person?.lastName || member.lastName || "";
    const email = member.contact?.email || member.email || "";
    return (
      firstName.toLowerCase().includes(search) ||
      lastName.toLowerCase().includes(search) ||
      email.toLowerCase().includes(search)
    );
  });

  return (
    <AuthGuard>
      <ToastProvider>
        <div />
      </ToastProvider>

      <GCVLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">GCV Members</h1>

              <p className="mt-2 text-gray-600">
                Manage Grant Committee View members
              </p>
            </div>

            <button
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              onClick={() => setIsAddModalOpen(true)}
            >
              <svg
                className="mr-2 -ml-1 inline-block h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 4v16m8-8H4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
              Add Member
            </button>
          </div>

          {/* Search and Stats */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <svg
                  className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>

                <input
                  className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search members..."
                  type="text"
                  value={searchQuery}
                />
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white px-4 py-2">
              <p className="text-sm text-gray-600">
                Total Members:{" "}
                <span className="font-semibold text-gray-900">
                  {membersPagination?.total || 0}
                </span>
              </p>
            </div>
          </div>

          {/* Members Table */}
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            {isMembersLoading ? (
              <div className="flex h-64 items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Name
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Email
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Roles
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Joined Date
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredMembers.length === 0 ? (
                    <tr>
                      <td
                        className="px-6 py-8 text-center text-gray-500"
                        colSpan={5}
                      >
                        No members found
                      </td>
                    </tr>
                  ) : (
                    filteredMembers.map((member) => (
                      <tr className="hover:bg-gray-50" key={member.personId}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                              <span className="text-sm font-semibold text-blue-600">
                                {member.person?.firstName?.charAt(0) ||
                                  member.firstName?.charAt(0) ||
                                  "?"}
                              </span>
                            </div>

                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {member.person?.firstName ||
                                  member.firstName ||
                                  "N/A"}{" "}
                                {member.person?.lastName ||
                                  member.lastName ||
                                  ""}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-700">
                            {member.contact?.email || member.email || "N/A"}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1">
                            {member.role.map((role, idx) => (
                              <span
                                className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800"
                                key={idx}
                              >
                                {role}
                              </span>
                            ))}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-700">
                            {new Date(member.createdAt).toLocaleDateString()}
                          </div>
                        </td>

                        <td className="px-6 py-4 text-sm whitespace-nowrap">
                          <button
                            className={`rounded-lg px-3 py-1 font-medium ${
                              member.role.includes(UserRoles.COMMITTEE_MEMBER)
                                ? "bg-red-100 text-red-700 hover:bg-red-200"
                                : "bg-green-100 text-green-700 hover:bg-green-200"
                            }`}
                            onClick={() => handleToggleRole(member)}
                          >
                            {member.role.includes(UserRoles.COMMITTEE_MEMBER)
                              ? "Remove Role"
                              : "Add Role"}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {membersPagination && membersPagination.totalPages > 1 && (
            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-6 py-4">
              <div className="text-sm text-gray-600">
                Showing {(currentPage - 1) * pageSize + 1} to{" "}
                {Math.min(currentPage * pageSize, membersPagination.total)} of{" "}
                {membersPagination.total} members
              </div>

              <div className="flex space-x-2">
                <button
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </button>

                <div className="flex items-center space-x-1">
                  {Array.from(
                    { length: membersPagination.totalPages },
                    (_, i) => i + 1,
                  )
                    .filter(
                      (page) =>
                        page === 1 ||
                        page === membersPagination.totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1),
                    )
                    .map((page, idx, arr) => (
                      <div className="flex items-center" key={page}>
                        {idx > 0 && arr[idx - 1] !== page - 1 && (
                          <span className="px-2 text-gray-500">...</span>
                        )}

                        <button
                          className={`h-10 w-10 rounded-lg text-sm font-medium ${
                            currentPage === page
                              ? "bg-blue-600 text-white"
                              : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </button>
                      </div>
                    ))}
                </div>

                <button
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={currentPage === membersPagination.totalPages}
                  onClick={() =>
                    setCurrentPage((p) =>
                      Math.min(membersPagination.totalPages, p + 1),
                    )
                  }
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modals */}
        <AddGCVMemberModal
          isLoading={isMembersLoading}
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddMember}
        />
      </GCVLayout>
    </AuthGuard>
  );
}
