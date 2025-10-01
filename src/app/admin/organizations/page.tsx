"use client";

import { useCallback, useEffect, useState } from "react";

import { useAdminStore } from "@/store/admin.store";

import { AddOrganizationModal } from "@/components/admin/AddOrganizationModal";
import { DeleteOrganizationModal } from "@/components/admin/DeleteOrganizationModal";
import { EditOrganizationModal } from "@/components/admin/EditOrganizationModal";
import { AuthGuard } from "@/components/guards/AuthGuard";
import AdminLayout from "@/components/layout/AdminLayout";
import { showToast, ToastProvider } from "@/components/ui/ToastNew";

import { useAuth } from "@/hooks/useAuth";

import {
  AddOrganizationRequest,
  OrganisationType,
  Organization,
  UpdateOrganizationRequest,
} from "@/types/admin.types";
import { UserRoles } from "@/types/auth.types";

interface OrganizationTableProps {
  organizations: Organization[];
  isLoading: boolean;
  onEditOrganization: (org: Organization) => void;
  onDeleteOrganization: (org: Organization) => void;
}

function OrganizationTable({
  organizations,
  isLoading,
  onEditOrganization,
  onDeleteOrganization,
}: OrganizationTableProps) {
  const formatType = (type: OrganisationType) => {
    return type
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="w-full">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
              Name
            </th>

            <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
              Type
            </th>

            <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
              Created Date
            </th>

            <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 bg-white">
          {!organizations || organizations.length === 0 ? (
            <tr>
              <td className="px-6 py-8 text-center text-gray-500" colSpan={4}>
                No organizations found
              </td>
            </tr>
          ) : (
            organizations?.map((org) => (
              <tr className="hover:bg-gray-50" key={org.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {org.name}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                    {formatType(org.type)}
                  </span>
                </td>

                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                  {formatDate(org.createdAt)}
                </td>

                <td className="space-x-2 px-6 py-4 text-sm font-medium whitespace-nowrap">
                  <button
                    className="text-blue-600 transition-colors hover:text-blue-900"
                    onClick={() => onEditOrganization(org)}
                  >
                    Edit
                  </button>

                  <button
                    className="text-red-600 transition-colors hover:text-red-900"
                    onClick={() => onDeleteOrganization(org)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function OrganizationsPageContent() {
  const { user } = useAuth();

  const {
    organizations,
    isLoading,
    error,
    getOrganizations,
    addOrganization,
    updateOrganization,
    deleteOrganization,
    setError,
  } = useAdminStore();

  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedOrganization, setSelectedOrganization] =
    useState<Organization | null>(null);

  // Load organizations on component mount
  useEffect(() => {
    getOrganizations();
  }, [getOrganizations]);

  // Show error toast when error occurs
  useEffect(() => {
    if (error) {
      showToast.error(error);
      setError(null);
    }
  }, [error, setError]);

  const handleAddOrganization = useCallback(
    async (orgData: AddOrganizationRequest) => {
      try {
        const success = await addOrganization(orgData);
        if (success) {
          showToast.success("Organization added successfully!");
          getOrganizations(); // Refresh the list
          return { success: true };
        } else {
          return { success: false, error: "Failed to add organization" };
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to add organization";
        return { success: false, error: errorMessage };
      }
    },
    [addOrganization, getOrganizations],
  );

  const handleEditOrganization = useCallback(
    async (orgData: UpdateOrganizationRequest) => {
      try {
        const success = await updateOrganization(orgData);
        if (success) {
          showToast.success("Organization updated successfully!");
          getOrganizations(); // Refresh the list
          return { success: true };
        } else {
          return { success: false, error: "Failed to update organization" };
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to update organization";
        return { success: false, error: errorMessage };
      }
    },
    [updateOrganization, getOrganizations],
  );

  const handleDeleteOrganization = useCallback(async () => {
    if (!selectedOrganization)
      return { success: false, error: "No organization selected" };

    try {
      const success = await deleteOrganization({ id: selectedOrganization.id });
      if (success) {
        showToast.success("Organization deleted successfully!");
        getOrganizations(); // Refresh the list
        return { success: true };
      } else {
        return { success: false, error: "Failed to delete organization" };
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to delete organization";
      return { success: false, error: errorMessage };
    }
  }, [selectedOrganization, deleteOrganization, getOrganizations]);

  const openEditModal = (org: Organization) => {
    setSelectedOrganization(org);
    setEditModalOpen(true);
  };

  const openDeleteModal = (org: Organization) => {
    setSelectedOrganization(org);
    setDeleteModalOpen(true);
  };

  const closeModals = () => {
    setAddModalOpen(false);
    setEditModalOpen(false);
    setDeleteModalOpen(false);
    setSelectedOrganization(null);
  };

  // Check if user has admin role
  const isAdmin = user?.role?.includes(UserRoles.ADMIN);

  if (!isAdmin) {
    return (
      <AdminLayout>
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              Access Denied
            </h2>

            <p className="text-gray-600">
              You don&apos;t have permission to access this page.
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Organizations</h1>

            <p className="mt-1 text-gray-600">Manage system organizations</p>
          </div>

          <button
            className="flex items-center space-x-2 rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
            onClick={() => setAddModalOpen(true)}
          >
            <svg
              className="h-5 w-5"
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

            <span>Add Organization</span>
          </button>
        </div>

        {/* Organizations Table */}
        <OrganizationTable
          isLoading={isLoading}
          onDeleteOrganization={openDeleteModal}
          onEditOrganization={openEditModal}
          organizations={organizations}
        />

        {/* Modals */}
        <AddOrganizationModal
          isLoading={isLoading}
          isOpen={addModalOpen}
          onClose={closeModals}
          onSubmit={handleAddOrganization}
        />

        <EditOrganizationModal
          isLoading={isLoading}
          isOpen={editModalOpen}
          onClose={closeModals}
          onSubmit={handleEditOrganization}
          organization={selectedOrganization}
        />

        <DeleteOrganizationModal
          isLoading={isLoading}
          isOpen={deleteModalOpen}
          onClose={closeModals}
          onConfirm={handleDeleteOrganization}
          organization={selectedOrganization}
        />
      </div>
    </AdminLayout>
  );
}

export default function OrganizationsPage() {
  return (
    <AuthGuard>
      <ToastProvider>
        <OrganizationsPageContent />
      </ToastProvider>
    </AuthGuard>
  );
}
