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

export function EditUserModal({ isOpen, onClose, onSubmit, isLoading, user }: EditUserModalProps) {
  const [formData, setFormData] = useState<UpdateUserRoleRequest>({
    email: '',
    type: UpdateRole.ADD_ROLE,
    role: UserRoles.APPLICANT,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user && isOpen) {
      // Extract email from user object (handle both flat and nested structure)
      const userEmail = user.contact?.email || user.email || '';
      
      // Extract role (handle both single role and array of roles)
      const userRole = Array.isArray(user.role) 
        ? user.role[0] || UserRoles.APPLICANT 
        : user.role || UserRoles.APPLICANT;
      
      setFormData({
        email: userEmail,
        type: UpdateRole.ADD_ROLE,
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
      newErrors.email = 'User email is required';
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
    <div className="fixed inset-0 bg-white/10 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all duration-200 scale-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Edit User Role</h2>
          {user && (
            <div className="text-sm text-gray-600 mt-1">
              <p className="font-medium">
                {user.person?.firstName || user.firstName || ''} {user.person?.lastName || user.lastName || ''}
              </p>
              <p className="text-gray-500">{user.contact?.email || user.email}</p>
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User Email
            </label>
            <input
              type="email"
              value={formData.email || ''}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 cursor-not-allowed"
              placeholder="User email will be displayed here"
            />
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
