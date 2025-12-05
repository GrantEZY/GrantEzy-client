'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthGuard } from '@/components/guards/AuthGuard';
import ApplicantLayout from '@/components/layout/ApplicantLayout';
import { applicantService } from '@/services/applicant.service';
import { Project } from '@/types/project.types';

export default function ApplicantProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      loadProjectDetails();
    }
  }, [slug]);

  const loadProjectDetails = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await applicantService.getProjectDetails(slug);

      if (response.status === 200 && response.res) {
        setProject(response.res.project);
      } else {
        throw new Error(response.message || 'Failed to load project details');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load project details');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      case 'ON_HOLD':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number | undefined | null) => {
    if (!amount) return '₹0.00';
    return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: Date | string | undefined | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const calculateBudgetTotal = (project: Project): number => {
    const budget = project.allocatedBudget;
    if (!budget) return 0;

    let total = 0;

    if (budget.ManPower) {
      total += budget.ManPower.reduce(
        (sum: number, item: any) => sum + (item.Budget?.totalAmount || 0),
        0
      );
    }

    if (budget.Equipment) {
      total += budget.Equipment.reduce(
        (sum: number, item: any) => sum + (item.Budget?.totalAmount || 0),
        0
      );
    }

    if (budget.OtherCosts) {
      total += budget.OtherCosts.reduce(
        (sum: number, item: any) => sum + (item.Budget?.totalAmount || 0),
        0
      );
    }

    if (budget.Consumables && 'Budget' in budget.Consumables) {
      total += (budget.Consumables as any).Budget?.totalAmount || 0;
    }
    if (budget.Travel && 'Budget' in budget.Travel) {
      total += (budget.Travel as any).Budget?.totalAmount || 0;
    }
    if (budget.Contigency && 'Budget' in budget.Contigency) {
      total += (budget.Contigency as any).Budget?.totalAmount || 0;
    }
    if (budget.Overhead && 'Budget' in budget.Overhead) {
      total += (budget.Overhead as any).Budget?.totalAmount || 0;
    }

    return total;
  };

  const calculateDuration = (
    start: Date | string | undefined | null,
    end: Date | string | undefined | null
  ) => {
    if (!start || !end) return 'N/A';
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const months = Math.floor(diffDays / 30);
    const days = diffDays % 30;
    return months > 0
      ? `${months} month${months > 1 ? 's' : ''} ${days} day${days !== 1 ? 's' : ''}`
      : `${days} day${days !== 1 ? 's' : ''}`;
  };

  if (isLoading) {
    return (
      <AuthGuard>
        <ApplicantLayout>
          <div className="flex h-96 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
              <p className="mt-4 text-sm text-gray-600">Loading project details...</p>
            </div>
          </div>
        </ApplicantLayout>
      </AuthGuard>
    );
  }

  if (error || !project) {
    return (
      <AuthGuard>
        <ApplicantLayout>
          <div className="flex h-96 items-center justify-center">
            <div className="text-center">
              <p className="text-red-600">{error || 'Project not found'}</p>
              <Link
                href="/applicant/projects"
                className="mt-4 inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Back to Projects
              </Link>
            </div>
          </div>
        </ApplicantLayout>
      </AuthGuard>
    );
  }

  const totalBudget = calculateBudgetTotal(project);
  const duration = calculateDuration(
    project.plannedDuration?.startDate,
    project.plannedDuration?.endDate
  );

  return (
    <AuthGuard>
      <ApplicantLayout>
        <div className="space-y-6 p-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/applicant/projects')}
                className="rounded-md p-2 hover:bg-gray-100"
                type="button"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Project Details</h1>
                <p className="text-gray-600">View your project information</p>
              </div>
            </div>
            <span
              className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(project.status)}`}
            >
              {project.status}
            </span>
          </div>

          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-600">Total Budget</p>
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </div>
              <p className="mt-2 text-2xl font-bold text-gray-900">{formatCurrency(totalBudget)}</p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-600">Duration</p>
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </div>
              <p className="mt-2 text-2xl font-bold text-gray-900">{duration}</p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-600">Project ID</p>
                <svg
                  className="h-5 w-5 text-gray-400"
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
              </div>
              <p className="mt-2 text-xl font-bold text-gray-900 truncate">
                {project.id.slice(0, 8)}...
              </p>
            </div>
          </div>

          {/* Timeline */}
          {project.plannedDuration && (
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
                Project Timeline
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-600">Start Date</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatDate(project.plannedDuration.startDate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">End Date</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatDate(project.plannedDuration.endDate)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Budget Breakdown */}
          {project.allocatedBudget && (
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
                Budget Breakdown
              </h2>
              <div className="space-y-6">
                {/* ManPower */}
                {project.allocatedBudget.ManPower &&
                  project.allocatedBudget.ManPower.length > 0 && (
                    <div>
                      <h3 className="mb-3 text-base font-semibold text-gray-900">ManPower</h3>
                      <div className="overflow-hidden rounded-md border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">
                                Reason
                              </th>
                              <th className="px-4 py-2 text-right text-xs font-medium uppercase text-gray-500">
                                Quantity
                              </th>
                              <th className="px-4 py-2 text-right text-xs font-medium uppercase text-gray-500">
                                Rate
                              </th>
                              <th className="px-4 py-2 text-right text-xs font-medium uppercase text-gray-500">
                                Total
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 bg-white">
                            {project.allocatedBudget.ManPower.map((item: any, index: number) => (
                              <tr key={index}>
                                <td className="px-4 py-2 text-sm text-gray-900">
                                  {item.BudgetReason}
                                </td>
                                <td className="px-4 py-2 text-right text-sm text-gray-900">
                                  {item.Budget?.quantity}
                                </td>
                                <td className="px-4 py-2 text-right text-sm text-gray-900">
                                  {formatCurrency(item.Budget?.rate)}
                                </td>
                                <td className="px-4 py-2 text-right text-sm font-medium text-gray-900">
                                  {formatCurrency(item.Budget?.totalAmount)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                {/* Equipment */}
                {project.allocatedBudget.Equipment &&
                  project.allocatedBudget.Equipment.length > 0 && (
                    <div>
                      <h3 className="mb-3 text-base font-semibold text-gray-900">Equipment</h3>
                      <div className="overflow-hidden rounded-md border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">
                                Reason
                              </th>
                              <th className="px-4 py-2 text-right text-xs font-medium uppercase text-gray-500">
                                Quantity
                              </th>
                              <th className="px-4 py-2 text-right text-xs font-medium uppercase text-gray-500">
                                Rate
                              </th>
                              <th className="px-4 py-2 text-right text-xs font-medium uppercase text-gray-500">
                                Total
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 bg-white">
                            {project.allocatedBudget.Equipment.map((item: any, index: number) => (
                              <tr key={index}>
                                <td className="px-4 py-2 text-sm text-gray-900">
                                  {item.BudgetReason}
                                </td>
                                <td className="px-4 py-2 text-right text-sm text-gray-900">
                                  {item.Budget?.quantity}
                                </td>
                                <td className="px-4 py-2 text-right text-sm text-gray-900">
                                  {formatCurrency(item.Budget?.rate)}
                                </td>
                                <td className="px-4 py-2 text-right text-sm font-medium text-gray-900">
                                  {formatCurrency(item.Budget?.totalAmount)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                {/* OtherCosts */}
                {project.allocatedBudget.OtherCosts &&
                  project.allocatedBudget.OtherCosts.length > 0 && (
                    <div>
                      <h3 className="mb-3 text-base font-semibold text-gray-900">Other Costs</h3>
                      <div className="overflow-hidden rounded-md border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">
                                Reason
                              </th>
                              <th className="px-4 py-2 text-right text-xs font-medium uppercase text-gray-500">
                                Quantity
                              </th>
                              <th className="px-4 py-2 text-right text-xs font-medium uppercase text-gray-500">
                                Rate
                              </th>
                              <th className="px-4 py-2 text-right text-xs font-medium uppercase text-gray-500">
                                Total
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 bg-white">
                            {project.allocatedBudget.OtherCosts.map((item: any, index: number) => (
                              <tr key={index}>
                                <td className="px-4 py-2 text-sm text-gray-900">
                                  {item.BudgetReason}
                                </td>
                                <td className="px-4 py-2 text-right text-sm text-gray-900">
                                  {item.Budget?.quantity}
                                </td>
                                <td className="px-4 py-2 text-right text-sm text-gray-900">
                                  {formatCurrency(item.Budget?.rate)}
                                </td>
                                <td className="px-4 py-2 text-right text-sm font-medium text-gray-900">
                                  {formatCurrency(item.Budget?.totalAmount)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                {/* Additional Costs */}
                <div>
                  <h3 className="mb-3 text-base font-semibold text-gray-900">Additional Costs</h3>
                  <div className="grid gap-3 md:grid-cols-2">
                    {project.allocatedBudget.Consumables && (
                      <div className="rounded-lg border border-gray-200 p-4">
                        <p className="text-sm text-gray-600">Consumables</p>
                        <p className="mt-1 text-xl font-bold text-gray-900">
                          {formatCurrency(
                            (project.allocatedBudget.Consumables as any).Budget?.totalAmount
                          )}
                        </p>
                      </div>
                    )}
                    {project.allocatedBudget.Travel && (
                      <div className="rounded-lg border border-gray-200 p-4">
                        <p className="text-sm text-gray-600">Travel</p>
                        <p className="mt-1 text-xl font-bold text-gray-900">
                          {formatCurrency(
                            (project.allocatedBudget.Travel as any).Budget?.totalAmount
                          )}
                        </p>
                      </div>
                    )}
                    {project.allocatedBudget.Contigency && (
                      <div className="rounded-lg border border-gray-200 p-4">
                        <p className="text-sm text-gray-600">Contingency</p>
                        <p className="mt-1 text-xl font-bold text-gray-900">
                          {formatCurrency(
                            (project.allocatedBudget.Contigency as any).Budget?.totalAmount
                          )}
                        </p>
                      </div>
                    )}
                    {project.allocatedBudget.Overhead && (
                      <div className="rounded-lg border border-gray-200 p-4">
                        <p className="text-sm text-gray-600">Overhead</p>
                        <p className="mt-1 text-xl font-bold text-gray-900">
                          {formatCurrency(
                            (project.allocatedBudget.Overhead as any).Budget?.totalAmount
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Total */}
                <div className="flex items-center justify-between border-t pt-4">
                  <span className="text-lg font-semibold text-gray-900">Total Budget</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {formatCurrency(totalBudget)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Metadata</h2>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <p className="text-sm text-gray-600">Created At</p>
                <p className="font-medium text-gray-900">{formatDate(project.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Last Updated</p>
                <p className="font-medium text-gray-900">{formatDate(project.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </ApplicantLayout>
    </AuthGuard>
  );
}
