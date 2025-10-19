"use client";

import { useState } from "react";

import { usePm } from "@/hooks/usePm";

import { CreateCycleRequest, TRL } from "@/types/pm.types";

interface CreateCycleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  programId: string;
}

export default function CreateCycleModal({
  isOpen,
  onClose,
  onSuccess,
  programId,
}: CreateCycleModalProps) {
  const { createCycle, isCyclesLoading } = usePm();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CreateCycleRequest>({
    programId,
    round: {
      year: new Date().getFullYear(),
      type: "Spring",
    },
    budget: {
      amount: 100000,
      currency: "INR",
    },
    duration: {
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
    },
    trlCriteria: {
      [TRL.TRL_1]: {
        requirements: ["Basic research"],
        evidence: ["Research documentation"],
        metrics: ["Initial concept validation"],
      },
      [TRL.TRL_2]: {
        requirements: ["Technology concept formulated"],
        evidence: ["Concept documentation"],
        metrics: ["Feasibility assessment"],
      },
      [TRL.TRL_3]: {
        requirements: ["Experimental proof of concept"],
        evidence: ["Prototype development"],
        metrics: ["Performance metrics"],
      },
      [TRL.TRL_4]: {
        requirements: ["Technology validated in lab"],
        evidence: ["Lab test results"],
        metrics: ["Validation reports"],
      },
      [TRL.TRL_5]: {
        requirements: ["Technology validated in relevant environment"],
        evidence: ["Field test results"],
        metrics: ["Performance data"],
      },
      [TRL.TRL_6]: {
        requirements: ["Technology demonstrated in relevant environment"],
        evidence: ["Demo results"],
        metrics: ["Market readiness"],
      },
      [TRL.TRL_7]: {
        requirements: ["System prototype demonstration"],
        evidence: ["Prototype testing"],
        metrics: ["System performance"],
      },
      [TRL.TRL_8]: {
        requirements: ["System complete and qualified"],
        evidence: ["Complete system"],
        metrics: ["Quality metrics"],
      },
      [TRL.TRL_9]: {
        requirements: ["Actual system proven in operational environment"],
        evidence: ["Operational proof"],
        metrics: ["Commercial metrics"],
      },
    },
    scoringScheme: {
      technical: { minScore: 1, maxScore: 10, weightage: 0.3 },
      market: { minScore: 1, maxScore: 10, weightage: 0.2 },
      financial: { minScore: 1, maxScore: 10, weightage: 0.2 },
      team: { minScore: 1, maxScore: 10, weightage: 0.15 },
      innovation: { minScore: 1, maxScore: 10, weightage: 0.15 },
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.round.year || formData.round.year < 2020) {
        newErrors.year = "Valid year is required";
      }
      if (!formData.round.type.trim()) {
        newErrors.type = "Cycle type is required";
      }
      if (!formData.budget.amount || formData.budget.amount <= 0) {
        newErrors.amount = "Valid budget amount is required";
      }
      if (!formData.duration.startDate) {
        newErrors.startDate = "Start date is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(currentStep)) {
      return;
    }

    try {
      const success = await createCycle(formData);
      if (success) {
        onSuccess();
      }
    } catch (error) {
      console.error("Failed to create cycle:", error);
    }
  };

  const updateNestedFormData = (section: string, field: string, value: any) => {
    setFormData((prev) => {
      const updatedSection = {
        ...(prev[section as keyof CreateCycleRequest] as any),
      };
      updatedSection[field] = value;

      return {
        ...prev,
        [section]: updatedSection,
      };
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-md">
      <div className="mx-4 w-full max-w-4xl scale-100 transform rounded-lg bg-white shadow-xl transition-all duration-200">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Create New Cycle
              </h2>

              <p className="mt-1 text-sm text-gray-600">
                Step {currentStep} of 3:{" "}
                {currentStep === 1
                  ? "Basic Information"
                  : currentStep === 2
                    ? "TRL Criteria"
                    : "Scoring Scheme"}
              </p>
            </div>

            <button
              className="text-gray-400 hover:text-gray-600"
              onClick={onClose}
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

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center">
              {[1, 2, 3].map((step) => (
                <div className="flex items-center" key={step}>
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                      step <= currentStep
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {step}
                  </div>

                  {step < 3 && (
                    <div
                      className={`mx-2 h-1 w-16 ${
                        step < currentStep ? "bg-blue-600" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form Content */}
        <form className="px-6 py-6" onSubmit={handleSubmit}>
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Cycle Year
                  </label>

                  <input
                    className={`w-full rounded-md border px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${
                      errors.year ? "border-red-500" : "border-gray-300"
                    }`}
                    max="2050"
                    min="2020"
                    onChange={(e) =>
                      updateNestedFormData(
                        "round",
                        "year",
                        parseInt(e.target.value),
                      )
                    }
                    type="number"
                    value={formData.round.year}
                  />

                  {errors.year && (
                    <p className="mt-1 text-sm text-red-600">{errors.year}</p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Cycle Type
                  </label>

                  <select
                    className={`w-full rounded-md border px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${
                      errors.type ? "border-red-500" : "border-gray-300"
                    }`}
                    onChange={(e) =>
                      updateNestedFormData("round", "type", e.target.value)
                    }
                    value={formData.round.type}
                  >
                    <option value="Spring">Spring</option>

                    <option value="Summer">Summer</option>

                    <option value="Fall">Fall</option>

                    <option value="Winter">Winter</option>

                    <option value="Annual">Annual</option>
                  </select>

                  {errors.type && (
                    <p className="mt-1 text-sm text-red-600">{errors.type}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Budget Amount
                  </label>

                  <input
                    className={`w-full rounded-md border px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${
                      errors.amount ? "border-red-500" : "border-gray-300"
                    }`}
                    min="1"
                    onChange={(e) =>
                      updateNestedFormData(
                        "budget",
                        "amount",
                        parseInt(e.target.value),
                      )
                    }
                    type="number"
                    value={formData.budget.amount}
                  />

                  {errors.amount && (
                    <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Currency
                  </label>

                  <select
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    onChange={(e) =>
                      updateNestedFormData("budget", "currency", e.target.value)
                    }
                    value={formData.budget.currency}
                  >
                    <option value="INR">INR</option>

                    <option value="USD">USD</option>

                    <option value="EUR">EUR</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Start Date
                  </label>

                  <input
                    className={`w-full rounded-md border px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${
                      errors.startDate ? "border-red-500" : "border-gray-300"
                    }`}
                    onChange={(e) =>
                      updateNestedFormData(
                        "duration",
                        "startDate",
                        e.target.value,
                      )
                    }
                    type="date"
                    value={
                      typeof formData.duration.startDate === "string"
                        ? formData.duration.startDate
                        : formData.duration.startDate
                            .toISOString()
                            .split("T")[0]
                    }
                  />

                  {errors.startDate && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.startDate}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    End Date (Optional)
                  </label>

                  <input
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    onChange={(e) =>
                      updateNestedFormData(
                        "duration",
                        "endDate",
                        e.target.value,
                      )
                    }
                    type="date"
                    value={
                      formData.duration.endDate
                        ? typeof formData.duration.endDate === "string"
                          ? formData.duration.endDate
                          : formData.duration.endDate
                              .toISOString()
                              .split("T")[0]
                        : ""
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: TRL Criteria (Simplified) */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="mb-2 text-lg font-medium text-gray-900">
                  TRL Criteria Configuration
                </h3>

                <p className="mb-4 text-sm text-gray-600">
                  TRL criteria have been pre-configured with standard
                  requirements. You can customize them after creation.
                </p>

                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <p className="text-sm text-blue-800">
                    ✓ TRL 1-9 criteria configured with standard requirements,
                    evidence, and metrics
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Scoring Scheme */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="mb-4 text-lg font-medium text-gray-900">
                Scoring Scheme Configuration
              </h3>

              <div className="space-y-4">
                {Object.entries(formData.scoringScheme).map(
                  ([key, criteria]) => (
                    <div className="rounded-lg bg-gray-50 p-4" key={key}>
                      <h4 className="mb-2 font-medium text-gray-900 capitalize">
                        {key} Evaluation
                      </h4>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="mb-1 block text-xs font-medium text-gray-600">
                            Min Score
                          </label>

                          <input
                            className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                            min="0"
                            onChange={(e) =>
                              updateNestedFormData("scoringScheme", key, {
                                ...criteria,
                                minScore: parseInt(e.target.value),
                              })
                            }
                            type="number"
                            value={criteria.minScore}
                          />
                        </div>

                        <div>
                          <label className="mb-1 block text-xs font-medium text-gray-600">
                            Max Score
                          </label>

                          <input
                            className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                            min="1"
                            onChange={(e) =>
                              updateNestedFormData("scoringScheme", key, {
                                ...criteria,
                                maxScore: parseInt(e.target.value),
                              })
                            }
                            type="number"
                            value={criteria.maxScore}
                          />
                        </div>

                        <div>
                          <label className="mb-1 block text-xs font-medium text-gray-600">
                            Weight (0-1)
                          </label>

                          <input
                            className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                            max="1"
                            min="0"
                            onChange={(e) =>
                              updateNestedFormData("scoringScheme", key, {
                                ...criteria,
                                weightage: parseFloat(e.target.value),
                              })
                            }
                            step="0.01"
                            type="number"
                            value={criteria.weightage}
                          />
                        </div>
                      </div>
                    </div>
                  ),
                )}
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

              {currentStep < 3 ? (
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
                  {isCyclesLoading ? "Creating..." : "Create Cycle"}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
