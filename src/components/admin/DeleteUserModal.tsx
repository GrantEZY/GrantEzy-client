'use client';

import { DeleteUserRequest } from '../../types/admin.types';

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (userData: DeleteUserRequest) => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
  user?: {
    email: string;
    firstName?: string;
    lastName?: string;
    role?: string;
  } | null;
}

export function DeleteUserModal({ isOpen, onClose, onConfirm, isLoading, user }: DeleteUserModalProps) {
  const handleConfirm = async () => {
    if (!user) return;
    
    const result = await onConfirm({ email: user.email });
    
    if (result.success) {
      onClose();
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-red-600">Delete User</h2>
        </div>
        
        <div className="px-6 py-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex-shrink-0">
              <svg className="h-10 w-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" 
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Are you sure you want to delete this user?
              </h3>
              <div className="mt-2 text-sm text-gray-600">
                <p className="font-medium">
                  {user.firstName && user.lastName 
                    ? `${user.firstName} ${user.lastName}`
                    : 'User'
                  }
                </p>
                <p className="text-gray-500">{user.email}</p>
                {user.role && (
                  <p className="text-gray-500">Role: {user.role.replace(/_/g, ' ')}</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-red-800">
                  Warning: This action cannot be undone
                </h4>
                <div className="mt-1 text-sm text-red-700">
                  <p>
                    This will permanently delete the user and all associated data.
                    The user will no longer have access to the system.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

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
            onClick={handleConfirm}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Deleting...' : 'Delete User'}
          </button>
        </div>
      </div>
    </div>
  );
}
