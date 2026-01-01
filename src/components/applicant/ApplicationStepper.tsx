/**
 * Application Stepper Component
 * Shows the 7-step progress with visual indicators in a horizontal timeline
 */
'use client';

import { ApplicationStepInfo, ApplicationStep } from '@/types/applicant.types';

interface ApplicationStepperProps {
  steps: ApplicationStepInfo[];
  currentStep: ApplicationStep;
}

export default function ApplicationStepper({
  steps,
  //currentStep commented out as it's unused,
}: ApplicationStepperProps) {
  return (
    <nav aria-label="Progress" className="mb-8">
      <ol className="flex items-center justify-between">
        {steps.map((step, index) => (
          <li key={step.step} className="relative flex flex-col items-center flex-1">
            {/* Connector Line (before node) */}
            {index > 0 && (
              <div
                className={`absolute right-1/2 top-4 h-0.5 w-full ${
                  steps[index - 1].isCompleted ? 'bg-green-600' : 'bg-gray-300'
                }`}
                style={{ transform: 'translateY(-50%)' }}
              />
            )}

            {/* Step Indicator */}
            <div className="relative z-10">
              {step.isCompleted ? (
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 shadow-md">
                  <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              ) : step.isActive ? (
                <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-blue-600 bg-blue-50 shadow-md">
                  <span className="h-3 w-3 rounded-full bg-blue-600" />
                </span>
              ) : (
                <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-300 bg-white shadow-sm">
                  <span className="text-gray-400 text-sm font-medium">{index + 1}</span>
                </span>
              )}
            </div>

            {/* Step Name */}
            <span
              className={`mt-3 text-center text-sm font-medium ${
                step.isActive
                  ? 'text-blue-600'
                  : step.isCompleted
                    ? 'text-gray-900'
                    : 'text-gray-500'
              }`}
            >
              {step.title}
            </span>

            {/* Connector Line (after node) */}
            {index < steps.length - 1 && (
              <div
                className={`absolute left-1/2 top-4 h-0.5 w-full ${
                  step.isCompleted ? 'bg-green-600' : 'bg-gray-300'
                }`}
                style={{ transform: 'translateY(-50%)' }}
              />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
