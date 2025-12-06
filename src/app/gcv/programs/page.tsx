'use client';

import { useCallback, useEffect, useState } from 'react';

import { AddProgramManagerModal } from '@/components/gcv/AddProgramManagerModal';
import { DeleteProgramModal } from '@/components/gcv/DeleteProgramModal';
import { ProgramCyclesModal } from '@/components/gcv/ProgramCyclesModal';
import { ProgramModal } from '@/components/gcv/ProgramModal';
import { AuthGuard } from '@/components/guards/AuthGuard';
import GCVLayout from '@/components/layout/GCVLayout';
import { showToast, ToastProvider } from '@/components/ui/ToastNew';

import { useGcv } from '@/hooks/useGcv';

import {
  CreateProgramRequest,
  Program,
  ProgramStatus,
  UpdateProgramRequest,
} from '@/types/gcv.types';

export default function GCVProgramsPage() {
  const {
    programs,
    programsPagination,
    isProgramsLoading,
    programsError,
    createProgram,
    getPrograms,
    updateProgram,
    deleteProgram,
    addProgramManager,
  } = useGcv();

  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isManagerModalOpen, setIsManagerModalOpen] = useState(false);
  const [isCyclesModalOpen, setIsCyclesModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const pageSize = 10;

  const fetchPrograms = useCallback(
    (page: number) => {
      getPrograms({
        page,
        numberOfResults: pageSize,
      });
    },
    [getPrograms]
  );

  useEffect(() => {
    fetchPrograms(currentPage);
  }, [currentPage, fetchPrograms]);

  const handleCreateProgram = async (data: CreateProgramRequest | UpdateProgramRequest) => {
    try {
      const success = await createProgram(data as CreateProgramRequest);
      if (success) {
        showToast.success('Program created successfully!');
        setIsCreateModalOpen(false);
        fetchPrograms(1);
        setCurrentPage(1);
      }
    } catch (error) {
      // Extract detailed error message from the store
      const errorMessage =
        error instanceof Error ? error.message : programsError || 'Failed to create program';
      showToast.error(errorMessage);
    }
  };

  const handleUpdateProgram = async (data: CreateProgramRequest | UpdateProgramRequest) => {
    try {
      const success = await updateProgram(data as UpdateProgramRequest);
      if (success) {
        showToast.success('Program updated successfully!');
        setIsEditModalOpen(false);
        setSelectedProgram(null);
        await fetchPrograms(currentPage);
      }
    } catch (error) {
      // Extract detailed error message from the store
      const errorMessage =
        error instanceof Error ? error.message : programsError || 'Failed to update program';
      console.error('Update program error:', error);
      showToast.error(errorMessage);
    }
  };

  const handleDeleteProgram = async () => {
    if (!selectedProgram) return;

    try {
      const success = await deleteProgram({ id: selectedProgram.id });
      if (success) {
        showToast.success('Program deleted successfully!');
        setIsDeleteModalOpen(false);
        setSelectedProgram(null);
        await fetchPrograms(currentPage);
      }
    } catch (error) {
      // Extract detailed error message from the store
      const errorMessage =
        error instanceof Error ? error.message : programsError || 'Failed to delete program';
      console.error('Delete program error:', error);
      showToast.error(errorMessage);
    }
  };

  const handleAddManager = async (email: string) => {
    if (!selectedProgram) return;

    try {
      const success = await addProgramManager({
        id: selectedProgram.id,
        email,
      });
      if (success) {
        showToast.success('Program manager added successfully!');
        setIsManagerModalOpen(false);
        setSelectedProgram(null);
        fetchPrograms(currentPage);
      }
    } catch (error) {
      // Extract detailed error message from the store
      const errorMessage =
        error instanceof Error ? error.message : programsError || 'Failed to add program manager';
      showToast.error(errorMessage);
    }
  };

  const filteredPrograms = programs.filter((program) => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      program.details.name.toLowerCase().includes(search) ||
      program.details.description.toLowerCase().includes(search) ||
      program.details.category.toLowerCase().includes(search)
    );
  });

  return (
    <AuthGuard>
      <ToastProvider>
        <div />
      </ToastProvider>

      <GCVLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Programs</h1>

              <p className="mt-2 text-gray-600">Manage grant programs and assign managers</p>
            </div>

            <button
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <svg
                className="mr-2 -ml-1 inline-block h-5 w-5"
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
              Create Program
            </button>
          </div>

          {/* Search and Stats */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <svg
                  className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>

                <input
                  className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search programs..."
                  type="text"
                  value={searchQuery}
                />
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white px-4 py-2">
              <p className="text-sm text-gray-600">
                Total Programs:{' '}
                <span className="font-semibold text-gray-900">
                  {programsPagination?.total || 0}
                </span>
              </p>
            </div>
          </div>

          {/* Programs Grid */}
          {isProgramsLoading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
            </div>
          ) : filteredPrograms.length === 0 ? (
            <div className="flex h-64 items-center justify-center rounded-lg border border-gray-200 bg-white">
              <div className="text-center">
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

                <p className="mt-2 text-gray-500">No programs found</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredPrograms.map((program) => (
                <div
                  className="group relative cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:border-blue-300 hover:shadow-md"
                  key={program.id}
                  onClick={() => {
                    setSelectedProgram(program);
                    setIsCyclesModalOpen(true);
                  }}
                  title="Click to view program cycles"
                >
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${
                        program.status === ProgramStatus.ACTIVE
                          ? 'bg-emerald-100 text-emerald-800'
                          : program.status === ProgramStatus.IN_ACTIVE
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {program.status}
                    </span>
                  </div>

                  {/* Header */}
                  <div className="border-b border-gray-100 bg-blue-50 px-5 py-4">
                    <h3 className="truncate text-lg font-semibold text-gray-900">
                      {program.details.name}
                    </h3>

                    <p className="mt-1 text-sm text-blue-600">{program.details.category}</p>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-gray-600">
                      {program.details.description}
                    </p>

                    {/* Program Details in a cleaner layout */}
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-md bg-gray-50 p-3 text-center">
                          <div className="mb-1 text-xs font-medium tracking-wide text-gray-500 uppercase">
                            Budget
                          </div>

                          <div className="text-sm font-semibold text-gray-900">
                            {program.budget.currency} {program.budget.amount.toLocaleString()}
                          </div>
                        </div>

                        <div className="rounded-md bg-gray-50 p-3 text-center">
                          <div className="mb-1 text-xs font-medium tracking-wide text-gray-500 uppercase">
                            TRL Range
                          </div>

                          <div className="text-sm font-semibold text-gray-900">
                            {program.minTRL} - {program.maxTRL}
                          </div>
                        </div>
                      </div>

                      <div className="rounded-md bg-blue-50 p-3">
                        <div className="mb-2 text-xs font-medium tracking-wide text-blue-700 uppercase">
                          Duration
                        </div>

                        <div className="text-sm font-semibold text-blue-900">
                          {new Date(program.duration.startDate).toLocaleDateString()}

                          {program.duration.endDate &&
                            ` - ${new Date(program.duration.endDate).toLocaleDateString()}`}
                        </div>
                      </div>

                      {program.organization && (
                        <div className="rounded-md bg-blue-50 p-3">
                          <div className="mb-2 text-xs font-medium tracking-wide text-blue-700 uppercase">
                            Organization
                          </div>

                          <div className="text-sm font-semibold text-blue-900">
                            {program.organization.name}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Manager Section */}
                    <div className="mt-4 border-t border-gray-100 pt-4">
                      {program.manager ? (
                        <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                          <div className="flex items-center space-x-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-green-200 bg-green-100">
                              <span className="text-xs font-bold text-green-700">
                                {program.manager.person.firstName.charAt(0)}

                                {program.manager.person.lastName.charAt(0)}
                              </span>
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-green-900">
                                {program.manager.person.firstName} {program.manager.person.lastName}
                              </p>

                              <p className="text-xs font-medium text-green-700">Program Manager</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <button
                          className="flex w-full items-center justify-center space-x-2 rounded-md border-2 border-dashed border-gray-300 px-3 py-2 text-sm font-medium text-gray-600 transition-all duration-200 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProgram(program);
                            setIsManagerModalOpen(true);
                          }}
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                            />
                          </svg>

                          <span>Add Manager</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="absolute top-12 right-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <div className="flex space-x-1">
                      <button
                        className="rounded border border-gray-200 bg-white p-1.5 text-gray-600 shadow-sm transition-colors duration-200 hover:bg-gray-50 hover:text-blue-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProgram(program);
                          setIsEditModalOpen(true);
                        }}
                        title="Edit program"
                      >
                        <svg
                          className="h-3.5 w-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                          />
                        </svg>
                      </button>

                      <button
                        className="rounded border border-gray-200 bg-white p-1.5 text-gray-600 shadow-sm transition-colors duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProgram(program);
                          setIsDeleteModalOpen(true);
                        }}
                        title="Delete program"
                      >
                        <svg
                          className="h-3.5 w-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {programsPagination && programsPagination.totalPages > 1 && (
            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-6 py-4">
              <div className="text-sm text-gray-600">
                Showing {(currentPage - 1) * pageSize + 1} to{' '}
                {Math.min(currentPage * pageSize, programsPagination.total)} of{' '}
                {programsPagination.total} programs
              </div>

              <div className="flex space-x-2">
                <button
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: programsPagination.totalPages }, (_, i) => i + 1)
                    .filter(
                      (page) =>
                        page === 1 ||
                        page === programsPagination.totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                    )
                    .map((page, idx, arr) => (
                      <div className="flex items-center" key={page}>
                        {idx > 0 && arr[idx - 1] !== page - 1 && (
                          <span className="px-2 text-gray-500">...</span>
                        )}

                        <button
                          className={`h-10 w-10 rounded-lg text-sm font-medium ${
                            currentPage === page
                              ? 'bg-blue-600 text-white'
                              : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </button>
                      </div>
                    ))}
                </div>

                <button
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={currentPage === programsPagination.totalPages}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(programsPagination.totalPages, p + 1))
                  }
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modals */}
        <ProgramModal
          isLoading={isProgramsLoading}
          isOpen={isCreateModalOpen}
          mode="create"
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateProgram}
        />

        <ProgramModal
          isLoading={isProgramsLoading}
          isOpen={isEditModalOpen}
          mode="edit"
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedProgram(null);
          }}
          onSubmit={handleUpdateProgram}
          program={selectedProgram || undefined}
        />

        <DeleteProgramModal
          isLoading={isProgramsLoading}
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedProgram(null);
          }}
          onConfirm={handleDeleteProgram}
          programName={selectedProgram?.details.name || ''}
        />

        <AddProgramManagerModal
          isLoading={isProgramsLoading}
          isOpen={isManagerModalOpen}
          onClose={() => {
            setIsManagerModalOpen(false);
            setSelectedProgram(null);
          }}
          onSubmit={handleAddManager}
          programName={selectedProgram?.details.name || ''}
        />

        <ProgramCyclesModal
          isOpen={isCyclesModalOpen}
          onClose={() => {
            setIsCyclesModalOpen(false);
            setSelectedProgram(null);
          }}
          program={selectedProgram}
        />
      </GCVLayout>
    </AuthGuard>
  );
}
