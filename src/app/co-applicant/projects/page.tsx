"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { coApplicantService } from "@/services/co-applicant.service";
import { Project } from "@/types/project.types";
import CoApplicantLayout from "@/components/layout/CoApplicantLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, FolderOpen } from "lucide-react";
import Link from "next/link";

export default function CoApplicantProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const resultsPerPage = 10;

  useEffect(() => {
    loadProjects();
  }, [currentPage]);

  const loadProjects = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await coApplicantService.getUserLinkedProjects(currentPage, resultsPerPage);

      if (response && response.status === 200 && response.res) {
        setProjects(response.res.projects);
        setTotalPages(response.res.pagination?.totalPages || 1);
      } else {
        throw new Error((response as any)?.message || "Failed to load linked projects");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load linked projects");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-500";
      case "COMPLETED":
        return "bg-blue-500";
      case "ON_HOLD":
        return "bg-yellow-500";
      case "CANCELLED":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatCurrency = (amount: number | undefined | null) => {
    if (!amount) return "₹0.00";
    return `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: Date | string | undefined | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateProjectBudget = (project: Project): number => {
    const budget = project.allocatedBudget;
    if (!budget) return 0;

    let total = 0;

    // Sum ManPower
    if (budget.ManPower) {
      total += budget.ManPower.reduce((sum: number, item: any) => sum + (item.Budget?.totalAmount || 0), 0);
    }

    // Sum Equipment
    if (budget.Equipment) {
      total += budget.Equipment.reduce((sum: number, item: any) => sum + (item.Budget?.totalAmount || 0), 0);
    }

    // Sum OtherCosts
    if (budget.OtherCosts) {
      total += budget.OtherCosts.reduce((sum: number, item: any) => sum + (item.Budget?.totalAmount || 0), 0);
    }

    // Add single items with type checking
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

  const calculateDuration = (project: Project): string => {
    const duration = project.plannedDuration;
    if (!duration?.startDate || !duration?.endDate) return "N/A";

    const startDate = new Date(duration.startDate);
    const endDate = new Date(duration.endDate);
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
      <CoApplicantLayout>
        <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading your linked projects...</p>
          </div>
        </div>
      </CoApplicantLayout>
    );
  }

  if (error) {
    return (
      <CoApplicantLayout>
        <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
          <div className="text-center">
            <p className="text-destructive">{error}</p>
            <Button onClick={() => loadProjects()} className="mt-4">
              Try Again
            </Button>
          </div>
        </div>
      </CoApplicantLayout>
    );
  }

  return (
    <CoApplicantLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Linked Projects</h1>
            <p className="text-muted-foreground">
              View projects where you are a co-applicant
            </p>
          </div>
        </div>

        {/* Projects List */}
        {projects.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Linked Projects</h3>
              <p className="text-muted-foreground text-center max-w-md">
                You are not currently linked to any projects as a co-applicant.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Your Linked Projects ({projects.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr className="text-left">
                      <th className="pb-3 font-medium">Project ID</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium text-right">Budget</th>
                      <th className="pb-3 font-medium">Duration</th>
                      <th className="pb-3 font-medium">Start Date</th>
                      <th className="pb-3 font-medium">End Date</th>
                      <th className="pb-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project) => (
                      <tr key={project.id} className="border-b last:border-0">
                        <td className="py-4">
                          <span className="font-mono text-sm">
                            {project.id.slice(0, 8)}...
                          </span>
                        </td>
                        <td className="py-4">
                          <Badge className={getStatusColor(project.status)}>
                            {project.status}
                          </Badge>
                        </td>
                        <td className="py-4 text-right font-medium">
                          {formatCurrency(calculateProjectBudget(project))}
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{calculateDuration(project)}</span>
                          </div>
                        </td>
                        <td className="py-4 text-sm">
                          {formatDate(project.plannedDuration?.startDate)}
                        </td>
                        <td className="py-4 text-sm">
                          {formatDate(project.plannedDuration?.endDate)}
                        </td>
                        <td className="py-4 text-right">
                          <Link href={`/co-applicant/projects/${project.slug}`}>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-6 border-t">
                  <p className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </CoApplicantLayout>
  );
}
