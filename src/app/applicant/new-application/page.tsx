/**
 * Multi-step Application Form - Main Page
 * Handles the 7-stage application submission process
 */
'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { AuthGuard } from '@/components/guards/AuthGuard';
import ApplicantLayout from '@/components/layout/ApplicantLayout';
import { useApplicant } from '@/hooks/useApplicant';
import ApplicationStepper from '@/components/applicant/ApplicationStepper';
import ApplicationProgress from '@/components/applicant/ApplicationProgress';
import BasicInfoForm from '@/components/applicant/forms/BasicInfoForm';
import BudgetForm from '@/components/applicant/forms/BudgetForm';
import TechnicalDetailsForm from '@/components/applicant/forms/TechnicalDetailsForm';
import RevenueModelForm from '@/components/applicant/forms/RevenueModelForm';
import RisksAndMilestonesForm from '@/components/applicant/forms/RisksAndMilestonesForm';
import DocumentsForm from '@/components/applicant/forms/DocumentsForm';
import TeamMembersForm from '@/components/applicant/forms/TeamMembersForm';
import { ApplicationStep } from '@/types/applicant.types';
import { ToastProvider } from '@/components/ui/ToastNew';

export default function NewApplicationPage() {
  const searchParams = useSearchParams();
  const cycleSlug = searchParams.get('cycleSlug');

  const {
    currentStep,
    applicationSteps,
    currentApplication,
    error,
    successMessage,
    clearError,
    clearSuccessMessage,
    getProgressPercentage,
    loadSavedApplication,
  } = useApplicant();

  // Load saved application on mount (draft restoration)
  useEffect(() => {
    if (cycleSlug) {
      loadSavedApplication(cycleSlug);
    }
  }, [cycleSlug, loadSavedApplication]);

  useEffect(() => {
    if (!cycleSlug) {
      // Redirect to cycles list if no cycleSlug provided
      window.location.href = '/applicant/cycles';
    }
  }, [cycleSlug]);

  if (!cycleSlug) {
    return (
      <AuthGuard>
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Missing Cycle Information</h2>
            <p className="mt-2 text-gray-600">Please select a cycle to apply for.</p>
          </div>
        </div>
      </AuthGuard>
    );
  }

  const renderStepForm = () => {
    switch (currentStep) {
      case ApplicationStep.BASIC_INFO:
        return <BasicInfoForm cycleSlug={cycleSlug} />;
      case ApplicationStep.BUDGET:
        return <BudgetForm />;
      case ApplicationStep.TECHNICAL_DETAILS:
        return <TechnicalDetailsForm />;
      case ApplicationStep.REVENUE_MODEL:
        return <RevenueModelForm />;
      case ApplicationStep.RISKS_MILESTONES:
        return <RisksAndMilestonesForm />;
      case ApplicationStep.DOCUMENTS:
        return <DocumentsForm />;
      case ApplicationStep.TEAM_MEMBERS:
        return <TeamMembersForm />;
      default:
        return null;
    }
  };

  return (
    <AuthGuard>
      <ToastProvider>
        <ApplicantLayout>
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">New Application</h1>
            <p className="mt-2 text-gray-600">Complete all 7 steps to submit your application</p>
          </div>

          {/* Progress Bar */}
          <ApplicationProgress
            currentStep={currentStep}
            totalSteps={7}
            percentage={getProgressPercentage()}
          />

          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <p className="mt-1 text-sm text-red-700">{error}</p>
                </div>
                <button onClick={clearError} className="ml-auto flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400 hover:text-red-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">{successMessage}</p>
                </div>
                <button onClick={clearSuccessMessage} className="ml-auto flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400 hover:text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Stepper Sidebar */}
            <div className="lg:col-span-3">
              <ApplicationStepper steps={applicationSteps} currentStep={currentStep} />
            </div>

            {/* Form Content */}
            <div className="lg:col-span-9">
              <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
                {renderStepForm()}
              </div>
            </div>
          </div>

          {/* Application Info */}
          {currentApplication && (
            <div className="mt-6 rounded-lg bg-blue-50 border border-blue-200 p-4">
              <div className="flex items-start">
                <svg
                  className="h-5 w-5 text-blue-400 mt-0.5"
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
                  <h3 className="text-sm font-medium text-blue-800">Application in Progress</h3>
                  <p className="mt-1 text-sm text-blue-700">
                    Application ID: {currentApplication.id}
                    <br />
                    You can save your progress and come back later to complete the remaining steps.
                  </p>
                </div>
              </div>
            </div>
          )}
        </ApplicantLayout>
      </ToastProvider>
    </AuthGuard>
  );
}
