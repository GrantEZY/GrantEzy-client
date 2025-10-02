/**
 * Add Program Manager Modal
 */
import { useState } from "react";

interface AddProgramManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => Promise<void>;
  programName: string;
  isLoading?: boolean;
}

export function AddProgramManagerModal({
  isOpen,
  onClose,
  onSubmit,
  programName,
  isLoading = false,
}: AddProgramManagerModalProps) {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ email?: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { email?: string } = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await onSubmit(email);
    setEmail("");
    setErrors({});
  };

  const handleClose = () => {
    setEmail("");
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-md">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Add Program Manager
          </h2>

          <button
            className="text-gray-400 hover:text-gray-600"
            onClick={handleClose}
            type="button"
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

        <div className="mb-4 rounded-lg bg-yellow-50 p-3">
          <p className="text-sm text-yellow-800">
            <span className="font-semibold">Program:</span> {programName}
          </p>

          <p className="mt-1 text-xs text-yellow-700">
            Note: Adding a new manager will replace the existing manager if one
            exists.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="mb-2 block text-sm font-medium text-gray-700"
              htmlFor="managerEmail"
            >
              Manager Email Address
            </label>

            <input
              className={`w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none ${
                errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              id="managerEmail"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="manager@example.com"
              type="email"
              value={email}
            />

            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              onClick={handleClose}
              type="button"
            >
              Cancel
            </button>

            <button
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? "Adding..." : "Add Manager"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
