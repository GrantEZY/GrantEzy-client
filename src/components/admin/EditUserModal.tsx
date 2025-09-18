"use client";

import { useEffect, useState } from "react";

import { UserRoles } from "../../types/auth.types";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: {
    email: string;
    role: UserRoles;
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
  const [formData, setFormData] = useState<{ email: string; role: UserRoles }>({
    email: "",
    role: UserRoles.APPLICANT,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user && isOpen) {
      // Extract email from user object (handle both flat and nested structure)
      const userEmail = user.contact?.email || user.email || "";

      // Extract role (handle both single role and array of roles)
      let userRole: UserRoles = UserRoles.APPLICANT; // Default fallback

      if (Array.isArray(user.role)) {
        // Filter out any invalid roles and take the first valid one
        const validRoles = user.role.filter((role) =>
          Object.values(UserRoles).includes(role as UserRoles),
        );
        userRole =
          validRoles.length > 0
            ? (validRoles[0] as UserRoles)
            : UserRoles.APPLICANT;
      } else if (
        user.role &&
        Object.values(UserRoles).includes(user.role as UserRoles)
      ) {
        userRole = user.role as UserRoles;
      }

      setFormData({
        email: userEmail,
        role: userRole,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const result = await onSubmit(formData);

    if (result.success) {
      setErrors({});
      onClose();
    }
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
              Current Role
            </label>

            <div className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-600">
              {Array.isArray(user?.role)
                ? user.role.join(", ")
                : user?.role || "N/A"}
            </div>

            <p className="mt-1 text-xs text-gray-500">
              This is the user&apos;s current role(s)
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              New Role
            </label>

            <select
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
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

            <p className="mt-1 text-xs text-gray-500">
              Select the new role for this user. The system will handle the role
              change automatically.
            </p>
          </div>
        </form>

        <div className="flex justify-end space-x-3 border-t border-gray-200 px-6 py-4">
          <button
            className="rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:outline-none"
            disabled={isLoading}
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>

          <button
            className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isLoading}
            onClick={handleSubmit}
          >
            {isLoading ? "Updating..." : "Update Role"}
          </button>
        </div>
      </div>
    </div>
  );
}
