'use client';

import { useCallback, useEffect, useState } from 'react';

import { useGcv } from '@/hooks/useGcv';

import { Program } from '@/types/gcv.types';
import { Cycle, CycleStatus } from '@/types/pm.types';

import { CycleDetailsModal } from './CycleDetailsModal';

interface ProgramCyclesModalProps {
  isOpen: boolean;
  onClose: () => void;
  program: Program | null;
}

export function ProgramCyclesModal({ isOpen, onClose, program }: ProgramCyclesModalProps) {
  const {
    programCycles,
    programCyclesPagination,
    isProgramCyclesLoading,
    programCyclesError,
    getProgramCycles,
    clearProgramCycles,
  } = useGcv();

  const [currentPage, setCurrentPage] = useState(1);
  const [isCycleDetailsOpen, setIsCycleDetailsOpen] = useState(false);
  const [selectedCycle, setSelectedCycle] = useState<Cycle | null>(null);
  const pageSize = 10;

  const fetchProgramCycles = useCallback(
    (page: number) => {
      if (!program) return;

      getProgramCycles({
        programId: program.id,
        page,
        numberOfResults: pageSize,
      });
    },
    [program, getProgramCycles]
  );

  useEffect(() => {
    if (isOpen && program) {
      fetchProgramCycles(1);
    } else if (!isOpen) {
      clearProgramCycles();
      setCurrentPage(1);
    }
  }, [isOpen, program?.id, clearProgramCycles, fetchProgramCycles]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchProgramCycles(page);
  };

  const getStatusColor = (status?: CycleStatus) => {
    switch (status) {
      case CycleStatus.ACTIVE:
        return 'bg-green-100 text-green-800';
      case CycleStatus.INACTIVE:
        return 'bg-gray-100 text-gray-800';
      case CycleStatus.DRAFT:
        return 'bg-yellow-100 text-yellow-800';
      case CycleStatus.COMPLETED:
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCycleClick = (cycle: Cycle) => {
    setSelectedCycle(cycle);
    setIsCycleDetailsOpen(true);
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString();
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-md" onClick={onClose} />

      {/* Modal */}
      <div className="thin-scrollbar relative z-10 mx-4 flex max-h-[90vh] w-full max-w-6xl flex-col rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Program Cycles</h2>
            {program && (
              <p className="mt-1 text-sm text-gray-600">
                {program.details.name} - {program.details.category}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 transition-colors hover:text-gray-600"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <div className="flex h-64 items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
            </div>
          ) : programCyclesError ? (
            <div className="flex h-64 items-center justify-center">
              <div className="text-center">
                <div className="mb-2 text-lg font-medium text-red-500">Error Loading Cycles</div>
                <p className="text-gray-600">{programCyclesError}</p>
              </div>
            </div>
          ) : programCycles.length === 0 ? (
            <div className="flex h-64 items-center justify-center">
              <div className="text-center">
                <svg
                  className="mx-auto mb-4 h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <div className="mb-2 text-lg font-medium text-gray-500">No Cycles Found</div>
                <p className="text-gray-400">This program doesn&apos;t have any cycles yet.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Cycles Grid */}
              <div className="grid gap-6 md:grid-cols-2">
                {programCycles.map((cycle) => (
                  <div
                    key={cycle.id}
                    onClick={() => handleCycleClick(cycle)}
                    className="cursor-pointer rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
                    title="Click to view cycle details"
                  >
                    {/* Cycle Header */}
                    <div className="border-b border-gray-100 bg-gray-50 px-4 py-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {cycle.round.type} {cycle.round.year}
                        </h3>
                        {cycle.status && (
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(cycle.status)}`}
                          >
                            {cycle.status}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Cycle Content */}
                    <div className="space-y-4 p-4">
                      {/* Budget */}
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-5 w-5 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                            />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">Budget</div>
                          <div className="text-sm text-gray-600">
                            {formatCurrency(cycle.budget.amount, cycle.budget.currency)}
                          </div>
                        </div>
                      </div>

                      {/* Duration */}
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-5 w-5 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">Duration</div>
                          <div className="text-sm text-gray-600">
                            {formatDate(cycle.duration.startDate)}
                            {cycle.duration.endDate && ` - ${formatDate(cycle.duration.endDate)}`}
                          </div>
                        </div>
                      </div>

                      {/* TRL Criteria */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <svg
                            className="h-5 w-5 text-purple-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                            />
                          </svg>
                          <div className="text-sm font-medium text-gray-900">TRL Criteria</div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {Object.entries(cycle.trlCriteria)
                            .slice(0, 6)
                            .map(([trl, criteria]) => (
                              <div key={trl} className="text-center">
                                <div className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                                  {trl}
                                </div>
                                <div className="mt-1 text-xs text-gray-500">
                                  {criteria.requirements.length} req
                                </div>
                              </div>
                            ))}
                        </div>
                        {Object.keys(cycle.trlCriteria).length > 6 && (
                          <div className="text-center text-xs text-gray-500">
                            +{Object.keys(cycle.trlCriteria).length - 6} more TRL levels
                          </div>
                        )}
                      </div>

                      {/* Scoring Scheme */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <svg
                            className="h-5 w-5 text-orange-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                            />
                          </svg>
                          <div className="text-sm font-medium text-gray-900">Scoring Weights</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Technical:</span>
                            <span className="font-medium">
                              {cycle.scoringScheme.technical.weightage}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Market:</span>
                            <span className="font-medium">
                              {cycle.scoringScheme.market.weightage}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Financial:</span>
                            <span className="font-medium">
                              {cycle.scoringScheme.financial.weightage}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Team:</span>
                            <span className="font-medium">
                              {cycle.scoringScheme.team.weightage}%
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Metadata */}
                      <div className="border-t border-gray-100 pt-3">
                        <div className="text-xs text-gray-500">
                          Created: {formatDate(cycle.createdAt)}
                        </div>
                        {cycle.updatedAt !== cycle.createdAt && (
                          <div className="text-xs text-gray-500">
                            Updated: {formatDate(cycle.updatedAt)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {programCyclesPagination && programCyclesPagination.totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                  <div className="flex flex-1 justify-between sm:hidden">
                    <button
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() =>
                        handlePageChange(
                          Math.min(programCyclesPagination.totalPages, currentPage + 1)
                        )
                      }
                      disabled={currentPage === programCyclesPagination.totalPages}
                      className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing{' '}
                        <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> to{' '}
                        <span className="font-medium">
                          {Math.min(currentPage * pageSize, programCyclesPagination.total)}
                        </span>{' '}
                        of <span className="font-medium">{programCyclesPagination.total}</span>{' '}
                        cycles
                      </p>
                    </div>
                    <div>
                      <nav
                        className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                        aria-label="Pagination"
                      >
                        <button
                          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <span className="sr-only">Previous</span>
                          <svg
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>

                        {Array.from({ length: programCyclesPagination.totalPages }, (_, i) => i + 1)
                          .filter(
                            (page) =>
                              page === 1 ||
                              page === programCyclesPagination.totalPages ||
                              (page >= currentPage - 1 && page <= currentPage + 1)
                          )
                          .map((page, idx, arr) => (
                            <div key={page} className="flex items-center">
                              {idx > 0 && arr[idx - 1] !== page - 1 && (
                                <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-gray-300 ring-inset focus:outline-offset-0">
                                  ...
                                </span>
                              )}
                              <button
                                onClick={() => handlePageChange(page)}
                                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                  currentPage === page
                                    ? 'z-10 bg-blue-600 text-white focus:z-20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                                    : 'text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                                }`}
                              >
                                {page}
                              </button>
                            </div>
                          ))}

                        <button
                          onClick={() =>
                            handlePageChange(
                              Math.min(programCyclesPagination.totalPages, currentPage + 1)
                            )
                          }
                          disabled={currentPage === programCyclesPagination.totalPages}
                          className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <span className="sr-only">Next</span>
                          <svg
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Cycle Details Modal */}
      <CycleDetailsModal
        isOpen={isCycleDetailsOpen}
        onClose={() => {
          setIsCycleDetailsOpen(false);
          setSelectedCycle(null);
        }}
        cycle={selectedCycle}
      />
    </div>
  );
}
