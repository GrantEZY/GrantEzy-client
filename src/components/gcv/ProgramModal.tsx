/**
 * Add/Edit Program Modal Component
 */
import { useEffect, useState } from "react";

import { OrganisationType } from "@/types/admin.types";
import {
  CreateProgramRequest,
  Program,
  TRL,
  UpdateProgramRequest,
} from "@/types/gcv.types";

interface ProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: CreateProgramRequest | UpdateProgramRequest,
  ) => Promise<void>;
  isLoading?: boolean;
  mode: "create" | "edit";
  program?: Program;
}

export function ProgramModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  mode,
  program,
}: ProgramModalProps) {
  const [formData, setFormData] = useState({
    organizationName: "",
    organizationType: OrganisationType.IIIT as OrganisationType,
    isNewOrganization: false,
    programName: "",
    programDescription: "",
    programCategory: "",
    startDate: "",
    endDate: "",
    budgetAmount: "",
    budgetCurrency: "USD",
    minTRL: TRL.TRL1 as TRL,
    maxTRL: TRL.TRL5 as TRL,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (mode === "edit" && program) {
      setFormData({
        organizationName: program.organization?.name || "",
        organizationType: program.organization?.type || OrganisationType.IIIT,
        isNewOrganization: false,
        programName: program.details.name,
        programDescription: program.details.description,
        programCategory: program.details.category,
        startDate: program.duration.startDate
          ? new Date(program.duration.startDate).toISOString().split("T")[0]
          : "",
        endDate: program.duration.endDate
          ? new Date(program.duration.endDate).toISOString().split("T")[0]
          : "",
        budgetAmount: program.budget.amount.toString(),
        budgetCurrency: program.budget.currency,
        minTRL: program.minTRL,
        maxTRL: program.maxTRL,
      });
    }
  }, [mode, program]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.organizationName.trim()) {
      newErrors.organizationName = "Organization name is required";
    }
    if (!formData.programName.trim()) {
      newErrors.programName = "Program name is required";
    }
    if (!formData.programDescription.trim()) {
      newErrors.programDescription = "Description is required";
    }
    if (!formData.programCategory.trim()) {
      newErrors.programCategory = "Category is required";
    }
    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }
    if (!formData.budgetAmount || parseFloat(formData.budgetAmount) <= 0) {
      newErrors.budgetAmount = "Valid budget amount is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (mode === "create") {
      const data: CreateProgramRequest = {
        organization: {
          name: formData.organizationName,
          type: formData.organizationType,
          isNew: formData.isNewOrganization,
        },
        details: {
          name: formData.programName,
          description: formData.programDescription,
          category: formData.programCategory,
        },
        duration: {
          startDate: new Date(formData.startDate).toISOString(),
          endDate: formData.endDate
            ? new Date(formData.endDate).toISOString()
            : null,
        },
        budget: {
          amount: parseFloat(formData.budgetAmount),
          currency: formData.budgetCurrency,
        },
        minTRL: formData.minTRL,
        maxTRL: formData.maxTRL,
      };
      console.log("Create program request:", JSON.stringify(data, null, 2));
      await onSubmit(data);
    } else if (program) {
      const data: UpdateProgramRequest = {
        id: program.id,
        details: {
          name: formData.programName,
          description: formData.programDescription,
          category: formData.programCategory,
        },
        duration: {
          startDate: new Date(formData.startDate).toISOString(),
          endDate: formData.endDate
            ? new Date(formData.endDate).toISOString()
            : null,
        },
        budget: {
          amount: parseFloat(formData.budgetAmount),
          currency: formData.budgetCurrency,
        },
        minTRL: formData.minTRL,
        maxTRL: formData.maxTRL,
      };
      console.log("Update program request:", JSON.stringify(data, null, 2));
      await onSubmit(data);
    }

    handleClose();
  };

  const handleClose = () => {
    setFormData({
      organizationName: "",
      organizationType: OrganisationType.IIIT,
      isNewOrganization: false,
      programName: "",
      programDescription: "",
      programCategory: "",
      startDate: "",
      endDate: "",
      budgetAmount: "",
      budgetCurrency: "USD",
      minTRL: TRL.TRL1,
      maxTRL: TRL.TRL5,
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-white/10 backdrop-blur-md p-4">
      <div className="my-8 w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === "create" ? "Create Program" : "Edit Program"}
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

        <form className="max-h-[70vh] overflow-y-auto" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Organization Section */}
            {mode === "create" && (
              <div className="rounded-lg border border-gray-200 p-4">
                <h3 className="mb-3 font-semibold text-gray-900">
                  Organization Details
                </h3>

                <div className="mb-3">
                  <label className="flex items-center space-x-2">
                    <input
                      checked={formData.isNewOrganization}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isNewOrganization: e.target.checked,
                        })
                      }
                      type="checkbox"
                    />

                    <span className="text-sm text-gray-700">
                      Create new organization
                    </span>
                  </label>
                </div>

                <div className="mb-3">
                  <label
                    className="mb-2 block text-sm font-medium text-gray-700"
                    htmlFor="organizationName"
                  >
                    Organization Name
                  </label>

                  <input
                    className={`w-full rounded-lg border px-4 py-2 ${
                      errors.organizationName
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    id="organizationName"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        organizationName: e.target.value,
                      })
                    }
                    value={formData.organizationName}
                  />

                  {errors.organizationName && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.organizationName}
                    </p>
                  )}
                </div>

                {formData.isNewOrganization && (
                  <div>
                    <label
                      className="mb-2 block text-sm font-medium text-gray-700"
                      htmlFor="organizationType"
                    >
                      Organization Type
                    </label>

                    <select
                      className="w-full rounded-lg border border-gray-300 px-4 py-2"
                      id="organizationType"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          organizationType: e.target.value as OrganisationType,
                        })
                      }
                      value={formData.organizationType}
                    >
                      {Object.values(OrganisationType).map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* Program Details */}
            <div className="rounded-lg border border-gray-200 p-4">
              <h3 className="mb-3 font-semibold text-gray-900">
                Program Details
              </h3>

              <div className="mb-3">
                <label
                  className="mb-2 block text-sm font-medium text-gray-700"
                  htmlFor="programName"
                >
                  Program Name
                </label>

                <input
                  className={`w-full rounded-lg border px-4 py-2 ${
                    errors.programName ? "border-red-500" : "border-gray-300"
                  }`}
                  id="programName"
                  onChange={(e) =>
                    setFormData({ ...formData, programName: e.target.value })
                  }
                  value={formData.programName}
                />

                {errors.programName && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.programName}
                  </p>
                )}
              </div>

              <div className="mb-3">
                <label
                  className="mb-2 block text-sm font-medium text-gray-700"
                  htmlFor="programDescription"
                >
                  Description
                </label>

                <textarea
                  className={`w-full rounded-lg border px-4 py-2 ${
                    errors.programDescription
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  id="programDescription"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      programDescription: e.target.value,
                    })
                  }
                  rows={3}
                  value={formData.programDescription}
                />

                {errors.programDescription && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.programDescription}
                  </p>
                )}
              </div>

              <div>
                <label
                  className="mb-2 block text-sm font-medium text-gray-700"
                  htmlFor="programCategory"
                >
                  Category
                </label>

                <input
                  className={`w-full rounded-lg border px-4 py-2 ${
                    errors.programCategory
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  id="programCategory"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      programCategory: e.target.value,
                    })
                  }
                  value={formData.programCategory}
                />

                {errors.programCategory && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.programCategory}
                  </p>
                )}
              </div>
            </div>

            {/* Duration */}
            <div className="rounded-lg border border-gray-200 p-4">
              <h3 className="mb-3 font-semibold text-gray-900">Duration</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className="mb-2 block text-sm font-medium text-gray-700"
                    htmlFor="startDate"
                  >
                    Start Date
                  </label>

                  <input
                    className={`w-full rounded-lg border px-4 py-2 ${
                      errors.startDate ? "border-red-500" : "border-gray-300"
                    }`}
                    id="startDate"
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    type="date"
                    value={formData.startDate}
                  />

                  {errors.startDate && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.startDate}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="mb-2 block text-sm font-medium text-gray-700"
                    htmlFor="endDate"
                  >
                    End Date (Optional)
                  </label>

                  <input
                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                    id="endDate"
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    type="date"
                    value={formData.endDate}
                  />
                </div>
              </div>
            </div>

            {/* Budget */}
            <div className="rounded-lg border border-gray-200 p-4">
              <h3 className="mb-3 font-semibold text-gray-900">Budget</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className="mb-2 block text-sm font-medium text-gray-700"
                    htmlFor="budgetAmount"
                  >
                    Amount
                  </label>

                  <input
                    className={`w-full rounded-lg border px-4 py-2 ${
                      errors.budgetAmount ? "border-red-500" : "border-gray-300"
                    }`}
                    id="budgetAmount"
                    onChange={(e) =>
                      setFormData({ ...formData, budgetAmount: e.target.value })
                    }
                    type="number"
                    value={formData.budgetAmount}
                  />

                  {errors.budgetAmount && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.budgetAmount}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="mb-2 block text-sm font-medium text-gray-700"
                    htmlFor="budgetCurrency"
                  >
                    Currency
                  </label>

                  <input
                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                    id="budgetCurrency"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        budgetCurrency: e.target.value,
                      })
                    }
                    value={formData.budgetCurrency}
                  />
                </div>
              </div>
            </div>

            {/* TRL Range */}
            <div className="rounded-lg border border-gray-200 p-4">
              <h3 className="mb-3 font-semibold text-gray-900">TRL Range</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className="mb-2 block text-sm font-medium text-gray-700"
                    htmlFor="minTRL"
                  >
                    Minimum TRL
                  </label>

                  <select
                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                    id="minTRL"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        minTRL: e.target.value as TRL,
                      })
                    }
                    value={formData.minTRL}
                  >
                    {Object.values(TRL).map((trl) => (
                      <option key={trl} value={trl}>
                        {trl}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    className="mb-2 block text-sm font-medium text-gray-700"
                    htmlFor="maxTRL"
                  >
                    Maximum TRL
                  </label>

                  <select
                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                    id="maxTRL"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxTRL: e.target.value as TRL,
                      })
                    }
                    value={formData.maxTRL}
                  >
                    {Object.values(TRL).map((trl) => (
                      <option key={trl} value={trl}>
                        {trl}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
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
              {isLoading
                ? mode === "create"
                  ? "Creating..."
                  : "Updating..."
                : mode === "create"
                  ? "Create Program"
                  : "Update Program"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
