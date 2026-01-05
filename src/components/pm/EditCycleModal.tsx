'use client';

import { useState, useEffect } from 'react';
import { usePm } from '@/hooks/usePm';
import {
  UpdateCycleRequest,
  TRL,
  Cycle,
  ProgramRound,
  Duration,
  TRLCriteria,
} from '@/types/pm.types';

interface EditCycleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  cycle: Cycle | null;
}

export default function EditCycleModal({ isOpen, onClose, onSuccess, cycle }: EditCycleModalProps) {
  const { updateCycle, isCyclesLoading } = usePm();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<{
    id: string;
    round: ProgramRound;
    duration: Duration;
    trlCriteria: Record<TRL, TRLCriteria>;
  }>({
    id: '',
    round: {
      year: new Date().getFullYear(),
      type: 'Spring',
    },
    duration: {
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
    },
    trlCriteria: {
      [TRL.TRL_1]: {
        requirements: ['Basic research'],
        evidence: ['Research documentation'],
        metrics: ['Initial concept validation'],
      },
      [TRL.TRL_2]: {
        requirements: ['Technology concept formulated'],
        evidence: ['Concept documentation'],
        metrics: ['Feasibility assessment'],
      },
      [TRL.TRL_3]: {
        requirements: ['Experimental proof of concept'],
        evidence: ['Prototype development'],
        metrics: ['Performance metrics'],
      },
      [TRL.TRL_4]: {
        requirements: ['Technology validated in lab'],
        evidence: ['Lab test results'],
        metrics: ['Validation reports'],
      },
      [TRL.TRL_5]: {
        requirements: ['Technology validated in relevant environment'],
        evidence: ['Field test results'],
        metrics: ['Performance data'],
      },
      [TRL.TRL_6]: {
        requirements: ['Technology demonstrated in relevant environment'],
        evidence: ['Demo results'],
        metrics: ['Market readiness'],
      },
      [TRL.TRL_7]: {
        requirements: ['System prototype demonstration'],
        evidence: ['Prototype testing'],
        metrics: ['System performance'],
      },
      [TRL.TRL_8]: {
        requirements: ['System complete and qualified'],
        evidence: ['Complete system'],
        metrics: ['Quality metrics'],
      },
      [TRL.TRL_9]: {
        requirements: ['Actual system proven in operational environment'],
        evidence: ['Operational proof'],
        metrics: ['Commercial metrics'],
      },
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [originalCycle, setOriginalCycle] = useState<Cycle | null>(null);

  // Initialize form data when cycle changes
  useEffect(() => {
    if (cycle && isOpen) {
      setOriginalCycle(cycle);
      setFormData({
        id: cycle.id,
        round: cycle.round,
        duration: {
          startDate:
            typeof cycle.duration.startDate === 'string'
              ? cycle.duration.startDate
              : new Date(cycle.duration.startDate).toISOString().split('T')[0],
          endDate: cycle.duration.endDate
            ? typeof cycle.duration.endDate === 'string'
              ? cycle.duration.endDate
              : new Date(cycle.duration.endDate).toISOString().split('T')[0]
            : '',
        },
        trlCriteria: cycle.trlCriteria || formData.trlCriteria,
      });
      setCurrentStep(1);
      setErrors({});
    }
  }, [cycle, isOpen]);

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.round?.year || formData.round.year < 2020) {
        newErrors.year = 'Valid year is required';
      }
      if (!formData.round?.type?.trim()) {
        newErrors.type = 'Cycle type is required';
      }
      if (!formData.duration?.startDate) {
        newErrors.startDate = 'Start date is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 2));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter' && currentStep !== 2) {
      e.preventDefault();
      if (currentStep < 2 && validateStep(currentStep)) {
        handleNext();
      }
    }
  };

  const handleDateChange = (section: string, field: string, value: string) => {
    updateNestedFormData(section, field, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentStep !== 2) {
      return;
    }

    if (!validateStep(currentStep)) {
      return;
    }

    try {
      // Build update request with only changed fields
      const updateRequest: UpdateCycleRequest = {
        id: formData.id,
      };

      // Only include round if it changed
      if (
        originalCycle &&
        formData.round &&
        (formData.round.year !== originalCycle.round.year ||
          formData.round.type !== originalCycle.round.type)
      ) {
        updateRequest.round = formData.round;
      }

      // Only include duration if it changed
      const originalStartDate =
        typeof originalCycle?.duration.startDate === 'string'
          ? originalCycle.duration.startDate
          : new Date(originalCycle?.duration.startDate || '').toISOString().split('T')[0];
      const originalEndDate = originalCycle?.duration.endDate
        ? typeof originalCycle.duration.endDate === 'string'
          ? originalCycle.duration.endDate
          : new Date(originalCycle.duration.endDate).toISOString().split('T')[0]
        : '';

      if (
        originalCycle &&
        formData.duration &&
        (formData.duration.startDate !== originalStartDate ||
          formData.duration.endDate !== originalEndDate)
      ) {
        updateRequest.duration = formData.duration;
      }

      // Always include trlCriteria (deep comparison would be too complex)
      updateRequest.trlCriteria = formData.trlCriteria;

      const success = await updateCycle(updateRequest);
      if (success) {
        onSuccess();
      }
    } catch (error) {
      console.error('Failed to update cycle:', error);
    }
  };

  const updateNestedFormData = (section: string, field: string, value: any) => {
    setFormData((prev) => {
      const updatedSection = {
        ...(prev[section as keyof typeof prev] as any),
      };
      updatedSection[field] = value;

      return {
        ...prev,
        [section]: updatedSection,
      };
    });
  };

  if (!isOpen || !cycle) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-md">
      <div className="mx-4 w-full max-w-4xl scale-100 transform rounded-lg bg-white shadow-xl transition-all duration-200">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Edit Cycle</h2>
              <p className="mt-1 text-sm text-gray-600">
                Step {currentStep} of 2: {currentStep === 1 ? 'Basic Information' : 'TRL Criteria'}
              </p>
            </div>

            <button className="text-gray-400 hover:text-gray-600" onClick={onClose}>
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

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center">
              {[1, 2].map((step) => (
                <div className="flex items-center" key={step}>
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium \${
                      step <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {step}
                  </div>
                  {step < 2 && (
                    <div
                      className={`mx-2 h-1 w-16 \${
                        step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form Content */}
        <form className="px-6 py-6" onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Cycle Year</label>
                  <input
                    className={`w-full rounded-md border px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 \${
                      errors.year ? 'border-red-500' : 'border-gray-300'
                    }`}
                    max="2050"
                    min="2020"
                    onChange={(e) =>
                      updateNestedFormData('round', 'year', parseInt(e.target.value))
                    }
                    type="number"
                    value={formData.round.year}
                  />
                  {errors.year && <p className="mt-1 text-sm text-red-600">{errors.year}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Cycle Type</label>
                  <select
                    className={`w-full rounded-md border px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 \${
                      errors.type ? 'border-red-500' : 'border-gray-300'
                    }`}
                    onChange={(e) => updateNestedFormData('round', 'type', e.target.value)}
                    value={formData.round.type}
                  >
                    <option value="Spring">Spring</option>
                    <option value="Summer">Summer</option>
                    <option value="Fall">Fall</option>
                    <option value="Winter">Winter</option>
                    <option value="Annual">Annual</option>
                  </select>
                  {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    className={`w-full rounded-md border px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 \${
                      errors.startDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                    onChange={(e) => handleDateChange('duration', 'startDate', e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                      }
                    }}
                    type="date"
                    value={
                      typeof formData.duration.startDate === 'string'
                        ? formData.duration.startDate
                        : formData.duration.startDate.toISOString().split('T')[0]
                    }
                  />
                  {errors.startDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    End Date (Optional)
                  </label>
                  <input
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => handleDateChange('duration', 'endDate', e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                      }
                    }}
                    type="date"
                    value={
                      formData.duration.endDate
                        ? typeof formData.duration.endDate === 'string'
                          ? formData.duration.endDate
                          : formData.duration.endDate.toISOString().split('T')[0]
                        : ''
                    }
                  />
                </div>
              </div>

              {/* Read-only info about budget and scoring */}
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm text-amber-800">
                  <strong>Note:</strong> Budget and Scoring Scheme cannot be edited after cycle
                  creation.
                </p>
              </div>
            </div>
          )}

          {/* Step 2: TRL Criteria */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="mb-2 text-lg font-medium text-gray-900">
                  TRL Criteria Configuration
                </h3>
                <p className="mb-4 text-sm text-gray-600">
                  TRL criteria are configured. You can customize individual criteria settings after
                  update.
                </p>
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <p className="text-sm text-blue-800">
                    ✓ TRL 1-9 criteria configured with requirements, evidence, and metrics
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6">
            <div className="flex space-x-3">
              {currentStep > 1 && (
                <button
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  onClick={handlePrevious}
                  type="button"
                >
                  Previous
                </button>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={onClose}
                type="button"
              >
                Cancel
              </button>

              {currentStep < 2 ? (
                <button
                  className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  onClick={handleNext}
                  type="button"
                >
                  Next
                </button>
              ) : (
                <button
                  className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isCyclesLoading}
                  type="submit"
                >
                  {isCyclesLoading ? 'Updating...' : 'Update Cycle'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
