'use client';

import { useState, useEffect } from 'react';
import { UpdateUserRoleRequest, UpdateRole } from '../../types/admin.types';
import { UserRoles } from '../../types/auth.types';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: UpdateUserRoleRequest) => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
  user?: {
    email: string;
    role: UserRoles;
    firstName?: string;
    lastName?: string;
  } | null;
}

export function EditUserModal({ isOpen, onClose, onSubmit, isLoading, user }: EditUserModalProps) {
  const [formData, setFormData] = useState<UpdateUserRoleRequest>({
    email: '',
    type: UpdateRole.ADD_ROLE,
    role: UserRoles.APPLICANT,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        email: user.email,
        type: UpdateRole.ADD_ROLE,
        role: user.role,
      });
    }
  }, [user, isOpen]);

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
      setErrors({});
      onClose();
    }
  };

  const handleChange = (field: keyof UpdateUserRoleRequest, value: string | UpdateRole) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Edit User Role</h2>
          {user && (
            <p className="text-sm text-gray-600 mt-1">
              {user.firstName && user.lastName 
                ? `${user.firstName} ${user.lastName} (${user.email})`
                : user.email
              }
            </p>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter user's email address"
              disabled={true} // Email shouldn't be editable in update mode
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Action Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value as UpdateRole)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={UpdateRole.ADD_ROLE}>Add Role</option>
              <option value={UpdateRole.DELETE_ROLE}>Remove Role</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) => handleChange('role', e.target.value as UserRoles)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {Object.values(UserRoles).map((role) => (
                <option key={role} value={role}>
                  {role.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>
        </form>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Updating...' : 'Update Role'}
          </button>
        </div>
      </div>
    </div>
  );
}
