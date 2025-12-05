"use client";

import { useEffect, useState } from "react";

import { useProjectManagement } from "@/hooks/useProjectManagement";

import { CreateCycleCriteriaRequest } from "@/types/project.types";

interface CycleCriteriaManagementProps {
  cycleSlug: string;
  cycleId: string;
}

export default function CycleCriteriaManagement({
  cycleSlug,
  cycleId,
}: CycleCriteriaManagementProps) {
  const {
    criterias,
    isCriteriasLoading,
    criteriasError,
    getCycleCriterias,
    createCycleCriteria,
    clearCriterias,
  } = useProjectManagement();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    briefReview: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (cycleSlug) {
      getCycleCriterias({ cycleSlug });
    }
    return () => {
      clearCriterias();
    };
  }, [cycleSlug, getCycleCriterias, clearCriterias]);

  const handleOpenModal = () => {
    setIsCreateModalOpen(true);
    setFormData({ name: "", briefReview: "" });
    setErrors({});
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setFormData({ name: "", briefReview: "" });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Criteria name is required";
    }
    if (!formData.briefReview.trim()) {
      newErrors.briefReview = "Brief review is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const criteriaData: CreateCycleCriteriaRequest = {
      cycleId,
      name: formData.name,
      briefReview: formData.briefReview,
    };

    const response = await createCycleCriteria(criteriaData);

    setIsSubmitting(false);

    if (response) {
      handleCloseModal();
      getCycleCriterias({ cycleSlug });
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Assessment Criteria
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            Create and manage evaluation criteria for projects in this cycle
          </p>
        </div>
        <button
          onClick={handleOpenModal}
          className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          type="button"
        >
          <svg
            className="mr-2 h-4 w-4"
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
          Create Criteria
        </button>
      </div>

      {/* Loading State */}
      {isCriteriasLoading && (
        <div className="flex h-32 items-center justify-center rounded-lg border border-gray-200 bg-white">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <p className="mt-2 text-sm text-gray-600">Loading criteria...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {criteriasError && !isCriteriasLoading && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">{criteriasError}</p>
        </div>
      )}

      {/* Criteria List */}
      {!isCriteriasLoading && criterias.length === 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No Criteria
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Create your first assessment criteria to start evaluating projects
          </p>
          <div className="mt-4">
            <button
              onClick={handleOpenModal}
              className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              type="button"
            >
              Create First Criteria
            </button>
          </div>
        </div>
      )}

      {!isCriteriasLoading && criterias.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {criterias.map((criteria) => (
            <div
              key={criteria.id}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{criteria.name}</h4>
                  <p className="mt-2 text-sm text-gray-600">
                    {criteria.briefReview}
                  </p>
                </div>
              </div>
              {criteria.templateFile && (
                <div className="mt-3 flex items-center text-sm text-gray-500">
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                  <span className="truncate">{criteria.templateFile.name}</span>
                </div>
              )}
              <div className="mt-3 text-xs text-gray-500">
                Created: {new Date(criteria.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Criteria Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div
              className="bg-opacity-75 fixed inset-0 bg-gray-500 transition-opacity"
              onClick={handleCloseModal}
            ></div>

            {/* Modal panel */}
            <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
              {/* Header */}
              <div className="border-b border-gray-200 bg-white px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Create Assessment Criteria
                  </h3>
                  <button
                    onClick={handleCloseModal}
                    className="rounded-md text-gray-400 hover:text-gray-500"
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
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="bg-white px-6 py-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Criteria Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      placeholder="e.g., Technical Feasibility"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Brief Review *
                    </label>
                    <textarea
                      value={formData.briefReview}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          briefReview: e.target.value,
                        })
                      }
                      rows={4}
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      placeholder="Describe what this criteria evaluates..."
                    />
                    {errors.briefReview && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.briefReview}
                      </p>
                    )}
                  </div>

                  <div className="rounded-md bg-blue-50 p-4">
                    <div className="flex">
                      <svg
                        className="h-5 w-5 text-blue-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">
                          Note
                        </h3>
                        <div className="mt-2 text-sm text-blue-700">
                          <p>
                            File upload for evaluation templates will be added
                            in the next iteration. For now, you can create
                            criteria with names and descriptions.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>

              {/* Footer */}
              <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
                <div className="flex items-center justify-end space-x-3">
                  <button
                    onClick={handleCloseModal}
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    type="button"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                    type="button"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="mr-2 h-4 w-4 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Creating...
                      </>
                    ) : (
                      "Create Criteria"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
