'use client';

import { useState } from 'react';

import { AddOrganizationRequest, OrganisationType } from '../../types/admin.types';

interface AddOrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (orgData: AddOrganizationRequest) => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
}

export function AddOrganizationModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: AddOrganizationModalProps) {
  const [formData, setFormData] = useState<AddOrganizationRequest>({
    name: '',
    type: OrganisationType.IIT,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Organization name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Organization name must be at least 3 characters';
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
        name: '',
        type: OrganisationType.IIT,
      });
      setErrors({});
      onClose();
    } else if (result.error) {
      // Show error in the form
      setErrors({ name: result.error });
    }
  };

  const handleChange = (field: keyof AddOrganizationRequest, value: string | OrganisationType) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-md">
      <div className="mx-4 w-full max-w-md scale-100 transform rounded-lg bg-white p-6 shadow-xl transition-all duration-200">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Add New Organization</h2>

          <button
            className="text-gray-400 hover:text-gray-600"
            disabled={isLoading}
            onClick={onClose}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M6 18L18 6M6 6l12 12"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="name">
              Organization Name
            </label>

            <input
              className={`w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isLoading}
              id="name"
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter organization name"
              type="text"
              value={formData.name}
            />

            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="type">
              Organization Type
            </label>

            <select
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              disabled={isLoading}
              id="type"
              onChange={(e) => handleChange('type', e.target.value as OrganisationType)}
              value={formData.type}
            >
              {Object.values(OrganisationType).map((type) => (
                <option key={type} value={type}>
                  {type
                    .replace(/_/g, ' ')
                    .toLowerCase()
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              className="flex-1 rounded-md bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:outline-none"
              disabled={isLoading}
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>

            <button
              className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? 'Adding...' : 'Add Organization'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
