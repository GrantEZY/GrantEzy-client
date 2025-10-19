"use client";

import { useEffect } from "react";

import { useGcv } from "@/hooks/useGcv";

import { Cycle } from "@/types/pm.types";

interface CycleDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  cycle: Cycle | null;
}

export function CycleDetailsModal({
  isOpen,
  onClose,
  cycle,
}: CycleDetailsModalProps) {
  const { selectedCycle, getCycleDetails, isProgramCyclesLoading } = useGcv();

  useEffect(() => {
    if (isOpen && cycle) {
      // Use the actual slug from the cycle object if available
      if (cycle.slug) {
        getCycleDetails({ cycleSlug: cycle.slug });
      } else {
        // If no slug, we can't fetch cycle details
        console.warn(
          "Cycle does not have a slug, cannot fetch cycle details:",
          cycle,
        );
      }
    }
  }, [isOpen, cycle, getCycleDetails]);

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString();
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "INACTIVE":
        return "bg-gray-100 text-gray-800";
      case "DRAFT":
        return "bg-yellow-100 text-yellow-800";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!isOpen || !cycle) return null;

  const currentCycle = selectedCycle || cycle;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-white/10 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="thin-scrollbar relative z-10 mx-4 flex max-h-[90vh] w-full max-w-4xl flex-col rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Cycle Details</h2>
            <p className="mt-1 text-sm text-gray-600">
              {currentCycle.program?.details?.name} - {currentCycle.round.year}{" "}
              {currentCycle.round.type}
            </p>
          </div>
          <button
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            onClick={onClose}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isProgramCyclesLoading ? (
            <div className="flex h-32 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <h3 className="mb-3 text-lg font-semibold text-gray-900">
                    Basic Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Status:
                      </span>
                      <span
                        className={`ml-2 rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(currentCycle.status || "DRAFT")}`}
                      >
                        {currentCycle.status || "DRAFT"}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Round:
                      </span>
                      <span className="ml-2 text-sm text-gray-900">
                        {currentCycle.round.year} {currentCycle.round.type}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Budget:
                      </span>
                      <span className="ml-2 text-sm font-semibold text-gray-900">
                        {formatCurrency(
                          currentCycle.budget.amount,
                          currentCycle.budget.currency,
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <h3 className="mb-3 text-lg font-semibold text-gray-900">
                    Duration
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Start Date:
                      </span>
                      <span className="ml-2 text-sm text-gray-900">
                        {formatDate(currentCycle.duration.startDate)}
                      </span>
                    </div>
                    {currentCycle.duration.endDate && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">
                          End Date:
                        </span>
                        <span className="ml-2 text-sm text-gray-900">
                          {formatDate(currentCycle.duration.endDate)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* TRL Criteria */}
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  TRL Criteria
                </h3>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  {Object.entries(currentCycle.trlCriteria || {}).map(
                    ([trl, criteria]) => (
                      <div
                        key={trl}
                        className="rounded-lg border border-gray-100 bg-gray-50 p-4"
                      >
                        <h4 className="mb-3 font-medium text-gray-900">
                          {trl}
                        </h4>
                        <div className="space-y-2">
                          {criteria.requirements &&
                            criteria.requirements.length > 0 && (
                              <div>
                                <span className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                                  Requirements:
                                </span>
                                <ul className="mt-1 text-sm text-gray-700">
                                  {criteria.requirements.map((req, index) => (
                                    <li
                                      key={index}
                                      className="flex items-start"
                                    >
                                      <span className="mr-2">•</span>
                                      <span>{req}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          {criteria.evidence &&
                            criteria.evidence.length > 0 && (
                              <div>
                                <span className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                                  Evidence:
                                </span>
                                <ul className="mt-1 text-sm text-gray-700">
                                  {criteria.evidence.map((ev, index) => (
                                    <li
                                      key={index}
                                      className="flex items-start"
                                    >
                                      <span className="mr-2">•</span>
                                      <span>{ev}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          {criteria.metrics && criteria.metrics.length > 0 && (
                            <div>
                              <span className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                                Metrics:
                              </span>
                              <ul className="mt-1 text-sm text-gray-700">
                                {criteria.metrics.map((metric, index) => (
                                  <li key={index} className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>{metric}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* Scoring Scheme */}
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  Scoring Scheme
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {Object.entries(currentCycle.scoringScheme || {}).map(
                    ([category, criteria]) => (
                      <div
                        key={category}
                        className="rounded-lg border border-gray-100 bg-gray-50 p-4"
                      >
                        <h4 className="mb-3 font-medium text-gray-900 capitalize">
                          {category}
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Min Score:</span>
                            <span className="text-gray-900">
                              {criteria.minScore}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Max Score:</span>
                            <span className="text-gray-900">
                              {criteria.maxScore}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Weightage:</span>
                            <span className="text-gray-900">
                              {criteria.weightage}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex justify-end">
            <button
              className="rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
