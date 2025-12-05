"use client";

import { useEffect, useState } from "react";

import { UserRoles } from "../../types/auth.types";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: {
    email: string;
    role: UserRoles;
    action: "add" | "remove";
  }) => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
  user?: {
    email: string;
    role: UserRoles | UserRoles[];
    firstName?: string;
    lastName?: string;
    person?: {
      firstName: string;
      lastName: string;
    };
    contact?: {
      email: string;
    };
  } | null;
}

export function EditUserModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  user,
}: EditUserModalProps) {
  const [formData, setFormData] = useState<{
    email: string;
    role: UserRoles;
    action: "add" | "remove";
  }>({
    email: "",
    role: UserRoles.APPLICANT,
    action: "add",
  });
  const [currentRoles, setCurrentRoles] = useState<UserRoles[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user && isOpen) {
      // Extract email from user object (handle both flat and nested structure)
      const userEmail = user.contact?.email || user.email || "";

      // Extract roles (handle both single role and array of roles)
      let userRoles: UserRoles[] = [];

      if (Array.isArray(user.role)) {
        // Filter out any invalid roles
        userRoles = user.role.filter((role) =>
          Object.values(UserRoles).includes(role as UserRoles),
        ) as UserRoles[];
      } else if (
        user.role &&
        Object.values(UserRoles).includes(user.role as UserRoles)
      ) {
        userRoles = [user.role as UserRoles];
      }

      // If no valid roles found, default to NORMAL_USER
      if (userRoles.length === 0) {
        userRoles = [UserRoles.NORMAL_USER];
      }

      setCurrentRoles(userRoles);
      setFormData({
        email: userEmail,
        role: UserRoles.APPLICANT, // Default selection for adding new role
        action: "add",
      });
      setErrors({}); // Clear any previous errors
    }
  }, [user, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Email validation removed since it's readonly and pre-filled
    // Only validate if we have required data
    if (!formData.email) {
      newErrors.email = "User email is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRoleAction = async (
    role: UserRoles,
    action: "add" | "remove",
  ) => {
    if (!validateForm()) {
      return;
    }

    const result = await onSubmit({
      email: formData.email,
      role: role,
      action: action,
    });

    if (result.success) {
      // Update current roles based on the action
      if (action === "add") {
        setCurrentRoles((prev) => [...prev, role]);
      } else if (action === "remove") {
        setCurrentRoles((prev) => prev.filter((r) => r !== role));
      }
      setErrors({});
    } else {
      setErrors({ submit: result.error || "Failed to update role" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // This form now uses handleRoleAction for individual role management
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-md">
      <div className="mx-4 w-full max-w-md scale-100 transform rounded-lg bg-white shadow-xl transition-all duration-200">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Edit User Role
          </h2>

          {user && (
            <div className="mt-1 text-sm text-gray-600">
              <p className="font-medium">
                {user.person?.firstName || user.firstName || ""}{" "}
                {user.person?.lastName || user.lastName || ""}
              </p>

              <p className="text-gray-500">
                {user.contact?.email || user.email}
              </p>
            </div>
          )}
        </div>

        <form className="space-y-4 px-6 py-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              User Email
            </label>

            <input
              className="w-full cursor-not-allowed rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-600"
              placeholder="User email will be displayed here"
              readOnly
              type="email"
              value={formData.email || ""}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Current Roles
            </label>

            <div className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2">
              {currentRoles.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {currentRoles.map((role) => (
                    <span
                      key={role}
                      className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
                    >
                      {role.replace(/_/g, " ")}
                      {currentRoles.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRoleAction(role, "remove")}
                          className="ml-1 flex h-4 w-4 items-center justify-center rounded-full hover:bg-blue-200"
                          disabled={isLoading}
                        >
                          ×
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-gray-500">No roles assigned</span>
              )}
            </div>

            <p className="mt-1 text-xs text-gray-500">
              Current roles assigned to this user. Click × to remove a role
              (minimum 1 role required).
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Manage Roles
            </label>

            <div className="flex gap-2">
              <select
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                onChange={(e) =>
                  handleChange("role", e.target.value as UserRoles)
                }
                value={formData.role}
              >
                {Object.values(UserRoles).map((role) => (
                  <option key={role} value={role}>
                    {role.replace(/_/g, " ")}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => handleRoleAction(formData.role, "add")}
                disabled={isLoading || currentRoles.includes(formData.role)}
                className="rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                Add Role
              </button>
            </div>

            <p className="mt-1 text-xs text-gray-500">
              Select a role and click "Add Role" to assign it to the user.
            </p>
          </div>
        </form>

        {errors.submit && (
          <div className="mx-6 mb-4 rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{errors.submit}</div>
          </div>
        )}

        <div className="flex justify-end space-x-3 border-t border-gray-200 px-6 py-4">
          <button
            className="rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:outline-none"
            disabled={isLoading}
            onClick={onClose}
            type="button"
          >
            {isLoading ? "Updating..." : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}
