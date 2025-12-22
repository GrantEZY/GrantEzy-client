'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthGuard } from '@/components/guards/AuthGuard';
import PMLayout from '@/components/layout/PMLayout';
import { usePm } from '@/hooks/usePm';
import { useProjectManagement } from '@/hooks/useProjectManagement';
import CreateProjectModal from '@/components/pm/CreateProjectModal';
import CycleCriteriaManagement from '@/components/pm/CycleCriteriaManagement';

export default function CycleDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const cycleSlug = params.cycleSlug as string;

  const [activeTab, setActiveTab] = useState<'applications' | 'projects' | 'criteria'>(
    'applications'
  );
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const { currentCycle, currentCycleApplications, isCycleDetailsLoading, getCycleDetails, openCycleForApplication, closeCycleForApplication, archiveCycle } =
    usePm();

  const { projects, projectsPagination, isProjectsLoading, getCycleProjects, clearProjects } =
    useProjectManagement();

  useEffect(() => {
    if (cycleSlug) {
      getCycleDetails({ cycleSlug });
    }
    return () => {
      clearProjects();
    };
  }, [cycleSlug, getCycleDetails, clearProjects]);

  // Debug: Log applications when they change
  useEffect(() => {
    if (currentCycleApplications) {
      // Applications loaded
    }
  }, [currentCycleApplications]);

  // Load projects when Projects tab is active
  useEffect(() => {
    if (activeTab === 'projects' && cycleSlug) {
      getCycleProjects({
        cycleSlug,
        page: 1,
        numberOfResults: 20,
      });
    }
  }, [activeTab, cycleSlug, getCycleProjects]);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return 'bg-blue-100 text-blue-800';
      case 'UNDER_REVIEW':
      case 'IN_REVIEW':
        return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'REVISION_REQUESTED':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateProjectBudget = (budget: any) => {
    if (!budget) return 0;

    let total = 0;

    // Sum array items (ManPower, Equipment, OtherCosts)
    if (budget.ManPower && Array.isArray(budget.ManPower)) {
      total += budget.ManPower.reduce(
        (sum: number, item: any) => sum + (item.Budget?.amount || 0),
        0
      );
    }
    if (budget.Equipment && Array.isArray(budget.Equipment)) {
      total += budget.Equipment.reduce(
        (sum: number, item: any) => sum + (item.Budget?.amount || 0),
        0
      );
    }
    if (budget.OtherCosts && Array.isArray(budget.OtherCosts)) {
      total += budget.OtherCosts.reduce(
        (sum: number, item: any) => sum + (item.Budget?.amount || 0),
        0
      );
    }

    // Add single budget items
    total += budget.Consumables?.Budget?.amount || 0;
    total += budget.Travel?.Budget?.amount || 0;
    total += budget.Contigency?.Budget?.amount || 0;
    total += budget.Overhead?.Budget?.amount || 0;

    return total;
  };

  const handleStatusChange = async (action: 'open' | 'close' | 'archive') => {
    if (!currentCycle) return;
    
    setShowStatusMenu(false);
    
    try {
      let success = false;
      if (action === 'open') {
        success = await openCycleForApplication(currentCycle.id);
      } else if (action === 'close') {
        success = await closeCycleForApplication(currentCycle.id);
      } else if (action === 'archive') {
        success = await archiveCycle(currentCycle.id);
      }
      
      if (success) {
        // Refresh cycle details to get updated status
        await getCycleDetails({ cycleSlug });
      }
    } catch (error) {
      console.error('Failed to update cycle status:', error);
    }
  };

  const getStatusBadge = () => {
    if (!currentCycle || !currentCycle.status) return null;
    
    const statusClasses: Record<string, string> = {
      CREATED: 'bg-gray-100 text-gray-800',
      OPEN: 'bg-green-100 text-green-800',
      CLOSED: 'bg-red-100 text-red-800',
      ARCHIVED: 'bg-purple-100 text-purple-800',
    };
    
    return (
      <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${statusClasses[currentCycle.status] || 'bg-gray-100 text-gray-800'}`}>
        {currentCycle.status}
      </span>
    );
  };

  return (
    <AuthGuard>
      <PMLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <button
              className="mb-4 flex items-center text-sm text-gray-600 hover:text-gray-900"
              onClick={() => router.back()}
              type="button"
            >
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
              Back to Cycles
            </button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {currentCycle
                    ? `${currentCycle.round.type} ${currentCycle.round.year}`
                    : 'Cycle Details'}
                </h1>
                <p className="mt-2 text-gray-600">
                  View and manage applications for this funding cycle
                </p>
              </div>
              
              {/* Cycle Status Control */}
              {currentCycle && (
                <div className="relative">
                  <button
                    onClick={() => setShowStatusMenu(!showStatusMenu)}
                    className="flex items-center space-x-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    type="button"
                  >
                    {getStatusBadge()}
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {showStatusMenu && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowStatusMenu(false)}
                      />
                      <div className="absolute right-0 z-20 mt-2 w-48 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                        {currentCycle.status !== 'OPEN' && (
                          <button
                            onClick={() => handleStatusChange('open')}
                            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                            type="button"
                          >
                            Open for Applications
                          </button>
                        )}
                        {currentCycle.status !== 'CLOSED' && currentCycle.status !== 'ARCHIVED' && (
                          <button
                            onClick={() => handleStatusChange('close')}
                            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                            type="button"
                          >
                            Close Applications
                          </button>
                        )}
                        {currentCycle.status !== 'ARCHIVED' && (
                          <button
                            onClick={() => handleStatusChange('archive')}
                            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                            type="button"
                          >
                            Archive Cycle
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Cycle Info Card */}
          {currentCycle && (
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Cycle Information</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm font-medium text-gray-600">Budget</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {currentCycle.budget?.currency || 'INR'}{' '}
                    {currentCycle.budget?.amount?.toLocaleString() || '0'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <span
                    className={`mt-1 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getStatusBadgeClass(currentCycle.status || 'DRAFT')}`}
                  >
                    {currentCycle.status || 'DRAFT'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Duration</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {currentCycle.duration?.startDate
                      ? new Date(currentCycle.duration.startDate).toLocaleDateString()
                      : 'Not set'}{' '}
                    -{' '}
                    {currentCycle.duration?.endDate
                      ? new Date(currentCycle.duration.endDate).toLocaleDateString()
                      : 'Not set'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tabs Navigation */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('applications')}
                className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${
                  activeTab === 'applications'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
                type="button"
              >
                Applications
                {currentCycleApplications && (
                  <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs">
                    {currentCycleApplications.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('projects')}
                className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${
                  activeTab === 'projects'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
                type="button"
              >
                Projects
                {projects && (
                  <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs">
                    {projects.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('criteria')}
                className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${
                  activeTab === 'criteria'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
                type="button"
              >
                Assessment Criteria
              </button>
            </nav>
          </div>

          {/* Loading State */}
          {isCycleDetailsLoading && (
            <div className="flex h-64 items-center justify-center rounded-lg border border-gray-200 bg-white">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
                <p className="mt-4 text-sm text-gray-600">Loading cycle details...</p>
              </div>
            </div>
          )}

          {/* Applications Tab Content */}
          {activeTab === 'applications' && !isCycleDetailsLoading && currentCycleApplications && (
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Applications ({currentCycleApplications.length})
                </h2>
              </div>

              {currentCycleApplications.length === 0 ? (
                <div className="p-12 text-center">
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
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No Applications</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    No applications have been submitted for this cycle yet.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Applicant
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Submitted
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {currentCycleApplications.map((application) => (
                        <tr key={application.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">
                              {application.basicInfo?.title || 'Untitled Application'}
                            </div>
                            {application.basicInfo?.summary && (
                              <div className="mt-1 text-sm text-gray-500">
                                {application.basicInfo.summary.substring(0, 100)}
                                {application.basicInfo.summary.length > 100 && '...'}
                              </div>
                            )}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            {application.applicant?.email || 
                             (application.applicant?.firstName && application.applicant?.lastName
                               ? `${application.applicant.firstName} ${application.applicant.lastName}`
                               : 'No applicant info')}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <span
                              className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusBadgeClass(application.status)}`}
                            >
                              {application.status}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            {application.createdAt
                              ? new Date(application.createdAt).toLocaleDateString()
                              : 'N/A'}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                            <Link
                              className="text-blue-600 hover:text-blue-700"
                              href={`/pm/cycles/${cycleSlug}/applications/${application.slug}`}
                            >
                              View Details
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Projects Tab Content */}
          {activeTab === 'projects' && (
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Projects {projectsPagination && `(${projectsPagination.totalResults})`}
                </h2>
                <button
                  onClick={() => setIsCreateProjectModalOpen(true)}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                  type="button"
                >
                  <svg
                    className="mr-2 h-4 w-4"
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
                  Create Project
                </button>
              </div>

              {isProjectsLoading && (
                <div className="flex h-64 items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-sm text-gray-600">Loading projects...</p>
                  </div>
                </div>
              )}

              {!isProjectsLoading && projects.length === 0 && (
                <div className="p-12 text-center">
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
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No Projects</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    No projects have been created for this cycle yet. Create a project from an
                    approved application.
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={() => setIsCreateProjectModalOpen(true)}
                      className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                      type="button"
                    >
                      Create First Project
                    </button>
                  </div>
                </div>
              )}

              {!isProjectsLoading && projects.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Project Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Allocated Budget
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Duration
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {projects.map((project) => (
                        <tr key={project.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">
                              {/* Backend returns Application objects as projects (when APPROVED) */}
                              {project.basicInfo?.title || project.title || 'Untitled Project'}
                            </div>
                            <div className="mt-1 text-sm text-gray-500">
                              Application ID: {project.id.substring(0, 8)}...
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <span
                              className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusBadgeClass(project.status)}`}
                            >
                              {project.status}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                            {project.budget?.Budget?.amount 
                              ? `${project.budget.Budget.currency} ${project.budget.Budget.amount.toLocaleString()}`
                              : 'Not set'}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            {project.basicInfo?.projectDuration
                              ? `${new Date(project.basicInfo.projectDuration.startDate).toLocaleDateString()} - ${new Date(project.basicInfo.projectDuration.endDate).toLocaleDateString()}`
                              : 'Not set'}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                            <Link
                              className="text-blue-600 hover:text-blue-700"
                              href={`/pm/cycles/${cycleSlug}/projects/${project.slug}`}
                            >
                              View Details
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Assessment Criteria Tab Content */}
          {activeTab === 'criteria' && currentCycle && (
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <CycleCriteriaManagement cycleSlug={cycleSlug} cycleId={currentCycle.id} />
            </div>
          )}
          {activeTab === 'criteria' && !currentCycle && (
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-red-600">Error: Current cycle not loaded</p>
            </div>
          )}

          {/* Create Project Modal */}
          {currentCycle && (
            <CreateProjectModal
              isOpen={isCreateProjectModalOpen}
              onClose={() => setIsCreateProjectModalOpen(false)}
              onSuccess={() => {
                setIsCreateProjectModalOpen(false);
                if (cycleSlug) {
                  getCycleProjects({
                    cycleSlug,
                    page: 1,
                    numberOfResults: 20,
                  });
                }
              }}
              cycleSlug={cycleSlug}
              applications={currentCycleApplications || []}
            />
          )}

          {/* Empty State - No cycle loaded */}
          {!isCycleDetailsLoading && !currentCycle && (
            <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
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
              <h3 className="mt-2 text-sm font-medium text-gray-900">Cycle Not Found</h3>
              <p className="mt-1 text-sm text-gray-500">
                The cycle you're looking for doesn't exist or you don't have access to it.
              </p>
              <div className="mt-6">
                <Link
                  className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  href="/pm/programs"
                >
                  Back to Programs
                </Link>
              </div>
            </div>
          )}
        </div>
      </PMLayout>
    </AuthGuard>
  );
}
