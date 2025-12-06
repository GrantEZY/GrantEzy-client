'use client';

import { useState } from 'react';

import { AddUserRequest } from '../../types/admin.types';
import { UserRoles } from '../../types/auth.types';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: AddUserRequest) => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
}

export function AddUserModal({ isOpen, onClose, onSubmit, isLoading }: AddUserModalProps) {
  const [formData, setFormData] = useState<AddUserRequest>({
    email: '',
    role: UserRoles.APPLICANT,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
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
      // Reset form and close modal
      setFormData({
        email: '',
        role: UserRoles.APPLICANT,
      });
      setErrors({});
      onClose();
    }
  };

  const handleChange = (field: keyof AddUserRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-md">
      <div className="mx-4 w-full max-w-md scale-100 transform rounded-lg bg-white shadow-xl transition-all duration-200">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-900">Add User Role</h2>

          <p className="mt-1 text-sm text-gray-600">
            Assign a role to an existing user by their email address
          </p>
        </div>

        <form className="space-y-4 px-6 py-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Email Address</label>

            <input
              className={`w-full rounded-md border px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="Enter user's email address"
              type="email"
              value={formData.email}
            />

            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Role</label>

            <select
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              onChange={(e) => handleChange('role', e.target.value as UserRoles)}
              value={formData.role}
            >
              {Object.values(UserRoles).map((role) => (
                <option key={role} value={role}>
                  {role.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
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
            {isLoading ? 'Adding...' : 'Add Role'}
          </button>
        </div>
      </div>
    </div>
  );
}
