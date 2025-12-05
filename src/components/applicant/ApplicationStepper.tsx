/**
 * Application Stepper Component
 * Shows the 7-step progress with visual indicators
 */
"use client";

import { ApplicationStepInfo, ApplicationStep } from "@/types/applicant.types";

interface ApplicationStepperProps {
  steps: ApplicationStepInfo[];
  currentStep: ApplicationStep;
}

export default function ApplicationStepper({
  steps,
  //currentStep commented out as it's unused,
}: ApplicationStepperProps) {
  return (
    <nav aria-label="Progress">
      <ol className="space-y-4">
        {steps.map((step, index) => (
          <li key={step.step}>
            <div
              className={`group relative flex items-start ${step.isActive
                ? "cursor-default"
                : step.isCompleted
                  ? "cursor-pointer hover:opacity-75"
                  : "cursor-not-allowed opacity-50"
                }`}
            >
              {/* Step Indicator */}
              <span className="flex h-9 items-center">
                {step.isCompleted ? (
                  <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-green-600">
                    <svg
                      className="h-5 w-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                ) : step.isActive ? (
                  <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-blue-600 bg-white">
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                  </span>
                ) : (
                  <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white">
                    <span className="text-gray-500 text-sm font-medium">
                      {index + 1}
                    </span>
                  </span>
                )}
              </span>

              {/* Step Content */}
              <span className="ml-4 flex min-w-0 flex-col">
                <span
                  className={`text-sm font-medium ${step.isActive
                    ? "text-blue-600"
                    : step.isCompleted
                      ? "text-gray-900"
                      : "text-gray-500"
                    }`}
                >
                  {step.title}
                </span>
                <span className="text-sm text-gray-500">
                  {step.description}
                </span>
              </span>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={`absolute left-4 top-9 -ml-px mt-0.5 h-full w-0.5 ${step.isCompleted ? "bg-green-600" : "bg-gray-300"
                    }`}
                  style={{ height: "calc(100% + 1rem)" }}
                />
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
