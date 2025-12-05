/**
 * Application Progress Bar Component
 * Shows overall progress percentage
 */
"use client";

import { ApplicationStep } from "@/types/applicant.types";

/**
 * Application Progress Bar Component
 * Shows overall progress percentage
 */

/**
 * Application Progress Bar Component
 * Shows overall progress percentage
 */

interface ApplicationProgressProps {
  currentStep: ApplicationStep;
  totalSteps: number;
  percentage: number;
}

export default function ApplicationProgress({
  currentStep,
  totalSteps,
  percentage,
}: ApplicationProgressProps) {
  return (
    <div className="mb-8">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm font-medium text-gray-700">
          {percentage}% Complete
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full bg-blue-600 transition-all duration-300 ease-in-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
