"use client";

import { useState } from "react";

import { AdminUser, GetUserProfileRequest } from "../../types/admin.types";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadProfile: (
    params: GetUserProfileRequest,
  ) => Promise<{ success: boolean; error?: string }>;
  userProfile: AdminUser | null;
  isLoading: boolean;
}

export function UserProfileModal({
  isOpen,
  onClose,
  onLoadProfile,
  userProfile,
  isLoading,
}: UserProfileModalProps) {
  const [userSlug, setUserSlug] = useState("");
  const [searchError, setSearchError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userSlug.trim()) {
      setSearchError("User slug is required");
      return;
    }

    setSearchError("");
    const result = await onLoadProfile({ userSlug: userSlug.trim() });

    if (!result.success && result.error) {
      setSearchError(result.error);
    }
  };

  const handleClose = () => {
    setUserSlug("");
    setSearchError("");
    onClose();
  };

  const formatRole = (roles: string[]) => {
    return roles
      .map((role) =>
        role
          .replace(/_/g, " ")
          .toLowerCase()
          .replace(/\b\w/g, (l) => l.toUpperCase()),
      )
      .join(", ");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="mx-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">User Profile</h2>

          <button
            className="text-gray-400 hover:text-gray-600"
            disabled={isLoading}
            onClick={handleClose}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M6 18L18 6M6 6l12 12"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </button>
        </div>

        {/* Search Form */}
        <form className="mb-6" onSubmit={handleSearch}>
          <div className="flex space-x-3">
            <div className="flex-1">
              <label
                className="mb-1 block text-sm font-medium text-gray-700"
                htmlFor="userSlug"
              >
                User Slug
              </label>

              <input
                className={`w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                  searchError ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isLoading}
                id="userSlug"
                onChange={(e) => setUserSlug(e.target.value)}
                placeholder="Enter user slug to search"
                type="text"
                value={userSlug}
              />

              {searchError && (
                <p className="mt-1 text-sm text-red-600">{searchError}</p>
              )}
            </div>

            <div className="flex items-end">
              <button
                className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
                disabled={isLoading}
                type="submit"
              >
                {isLoading ? "Searching..." : "Search"}
              </button>
            </div>
          </div>
        </form>

        {/* User Profile Display */}
        {userProfile && (
          <div className="rounded-lg border bg-gray-50 p-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  Personal Information
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Person ID
                    </label>

                    <p className="font-mono text-sm text-gray-900">
                      {userProfile.personId}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Name
                    </label>

                    <p className="text-sm text-gray-900">
                      {userProfile.person?.firstName ||
                        userProfile.firstName ||
                        "N/A"}{" "}
                      {userProfile.person?.lastName ||
                        userProfile.lastName ||
                        ""}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>

                    <p className="text-sm text-gray-900">
                      {userProfile.contact?.email || userProfile.email || "N/A"}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Roles
                    </label>

                    <p className="text-sm text-gray-900">
                      {Array.isArray(userProfile.role)
                        ? formatRole(userProfile.role)
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  Account Information
                </h3>

                <div className="space-y-3">
                  {userProfile.id && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        User ID
                      </label>

                      <p className="font-mono text-sm text-gray-900">
                        {userProfile.id}
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Created At
                    </label>

                    <p className="text-sm text-gray-900">
                      {userProfile.createdAt
                        ? formatDate(userProfile.createdAt)
                        : "N/A"}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Last Updated
                    </label>

                    <p className="text-sm text-gray-900">
                      {userProfile.updatedAt
                        ? formatDate(userProfile.updatedAt)
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && !userProfile && (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>

            <span className="ml-3 text-gray-600">Loading user profile...</span>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !userProfile && (
          <div className="py-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
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

            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No user profile loaded
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Enter a user slug and search to view user profile details.
            </p>
          </div>
        )}

        <div className="flex justify-end pt-6">
          <button
            className="rounded-md bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:outline-none"
            disabled={isLoading}
            onClick={handleClose}
            type="button"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
