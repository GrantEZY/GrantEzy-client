/**
 * Step 1: Basic Information Form
 * Collects: title, summary, problem, solution, innovation
 */
"use client";

import { useState } from "react";

import { useApplicant } from "@/hooks/useApplicant";

import { BasicInfo } from "@/types/applicant.types";

/**
 * Step 1: Basic Information Form
 * Collects: title, summary, problem, solution, innovation
 */

/**
 * Step 1: Basic Information Form
 * Collects: title, summary, problem, solution, innovation
 */

interface BasicInfoFormProps {
  cycleSlug: string;
}

export default function BasicInfoForm({ cycleSlug }: BasicInfoFormProps) {
  const { createApplication, isLoading, currentApplication } = useApplicant();

  const [formData, setFormData] = useState<BasicInfo>({
    title: currentApplication?.basicInfo?.title || "",
    summary: currentApplication?.basicInfo?.summary || "",
    problem: currentApplication?.basicInfo?.problem || "",
    solution: currentApplication?.basicInfo?.solution || "",
    innovation: currentApplication?.basicInfo?.innovation || "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof BasicInfo, string>>
  >({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof BasicInfo, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Project title is required";
    } else if (formData.title.length < 10) {
      newErrors.title = "Title must be at least 10 characters";
    }

    if (!formData.summary.trim()) {
      newErrors.summary = "Summary is required";
    } else if (formData.summary.length < 50) {
      newErrors.summary = "Summary must be at least 50 characters";
    }

    if (!formData.problem.trim()) {
      newErrors.problem = "Problem statement is required";
    } else if (formData.problem.length < 50) {
      newErrors.problem = "Problem statement must be at least 50 characters";
    }

    if (!formData.solution.trim()) {
      newErrors.solution = "Solution description is required";
    } else if (formData.solution.length < 50) {
      newErrors.solution = "Solution must be at least 50 characters";
    }

    if (!formData.innovation.trim()) {
      newErrors.innovation = "Innovation description is required";
    } else if (formData.innovation.length < 30) {
      newErrors.innovation = "Innovation must be at least 30 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await createApplication({
      cycleSlug,
      basicInfo: formData,
    });
  };

  const handleChange = (field: keyof BasicInfo, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
        <p className="mt-1 text-sm text-gray-600">
          Provide essential details about your project
        </p>
      </div>

      {/* Project Title */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Project Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          className={`mt-1 block w-full rounded-md border ${
            errors.title ? "border-red-300" : "border-gray-300"
          } px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none`}
          placeholder="e.g., AI-powered Healthcare Assistant"
          maxLength={200}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          {formData.title.length}/200 characters (minimum 10)
        </p>
      </div>

      {/* Summary */}
      <div>
        <label
          htmlFor="summary"
          className="block text-sm font-medium text-gray-700"
        >
          Project Summary <span className="text-red-500">*</span>
        </label>
        <textarea
          id="summary"
          rows={3}
          value={formData.summary}
          onChange={(e) => handleChange("summary", e.target.value)}
          className={`mt-1 block w-full rounded-md border ${
            errors.summary ? "border-red-300" : "border-gray-300"
          } px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none`}
          placeholder="Provide a brief overview of your project..."
          maxLength={500}
        />
        {errors.summary && (
          <p className="mt-1 text-sm text-red-600">{errors.summary}</p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          {formData.summary.length}/500 characters (minimum 50)
        </p>
      </div>

      {/* Problem Statement */}
      <div>
        <label
          htmlFor="problem"
          className="block text-sm font-medium text-gray-700"
        >
          Problem Statement <span className="text-red-500">*</span>
        </label>
        <textarea
          id="problem"
          rows={4}
          value={formData.problem}
          onChange={(e) => handleChange("problem", e.target.value)}
          className={`mt-1 block w-full rounded-md border ${
            errors.problem ? "border-red-300" : "border-gray-300"
          } px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none`}
          placeholder="Describe the problem your project addresses..."
          maxLength={1000}
        />
        {errors.problem && (
          <p className="mt-1 text-sm text-red-600">{errors.problem}</p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          {formData.problem.length}/1000 characters (minimum 50)
        </p>
      </div>

      {/* Solution */}
      <div>
        <label
          htmlFor="solution"
          className="block text-sm font-medium text-gray-700"
        >
          Proposed Solution <span className="text-red-500">*</span>
        </label>
        <textarea
          id="solution"
          rows={4}
          value={formData.solution}
          onChange={(e) => handleChange("solution", e.target.value)}
          className={`mt-1 block w-full rounded-md border ${
            errors.solution ? "border-red-300" : "border-gray-300"
          } px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none`}
          placeholder="Explain your proposed solution..."
          maxLength={1000}
        />
        {errors.solution && (
          <p className="mt-1 text-sm text-red-600">{errors.solution}</p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          {formData.solution.length}/1000 characters (minimum 50)
        </p>
      </div>

      {/* Innovation */}
      <div>
        <label
          htmlFor="innovation"
          className="block text-sm font-medium text-gray-700"
        >
          Innovation & Uniqueness <span className="text-red-500">*</span>
        </label>
        <textarea
          id="innovation"
          rows={4}
          value={formData.innovation}
          onChange={(e) => handleChange("innovation", e.target.value)}
          className={`mt-1 block w-full rounded-md border ${
            errors.innovation ? "border-red-300" : "border-gray-300"
          } px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none`}
          placeholder="What makes your project innovative and unique?"
          maxLength={1000}
        />
        {errors.innovation && (
          <p className="mt-1 text-sm text-red-600">{errors.innovation}</p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          {formData.innovation.length}/1000 characters (minimum 30)
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 border-t border-gray-200 pt-6">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center rounded-md bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <svg
                className="mr-2 -ml-1 h-4 w-4 animate-spin text-white"
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
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Creating Application...
            </>
          ) : (
            <>
              Continue to Budget
              <svg
                className="ml-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
