"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { coApplicantService } from "@/services/co-applicant.service";
import { Project } from "@/types/project.types";
import CoApplicantLayout from "@/components/layout/CoApplicantLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, DollarSign, FileText, Users } from "lucide-react";
import Link from "next/link";

export default function CoApplicantProjectDetailsPage() {
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
      const response = await coApplicantService.getProjectDetails(slug);

      if (response.status === 200 && response.res) {
        setProject(response.res.project);
      } else {
        throw new Error(response.message || "Failed to load project details");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load project details");
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
      month: "long",
      day: "numeric",
    });
  };

  const calculateBudgetTotal = (project: Project): number => {
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

  const calculateDuration = (start: Date | string | undefined | null, end: Date | string | undefined | null) => {
    if (!start || !end) return "N/A";
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const months = Math.floor(diffDays / 30);
    const days = diffDays % 30;
    return months > 0 ? `${months} month${months > 1 ? 's' : ''} ${days} day${days !== 1 ? 's' : ''}` : `${days} day${days !== 1 ? 's' : ''}`;
  };

  if (isLoading) {
    return (
      <CoApplicantLayout>
        <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading project details...</p>
          </div>
        </div>
      </CoApplicantLayout>
    );
  };

  if (error || !project) {
    return (
      <CoApplicantLayout>
        <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
          <div className="text-center">
            <p className="text-destructive">{error || "Project not found"}</p>
            <Button onClick={() => router.push("/co-applicant/projects")} className="mt-4">
              Back to Projects
            </Button>
          </div>
        </div>
      </CoApplicantLayout>
    );
  }

  const totalBudget = calculateBudgetTotal(project);
  const duration = calculateDuration(project.plannedDuration?.startDate, project.plannedDuration?.endDate);

  return (
    <CoApplicantLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/co-applicant/projects")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Linked Project Details</h1>
              <p className="text-muted-foreground">View project information as co-applicant</p>
            </div>
          </div>
          <Badge className={getStatusColor(project.status)}>
            {project.status}
          </Badge>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalBudget)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Duration</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{duration}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Project ID</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold truncate">{project.id.slice(0, 8)}...</div>
            </CardContent>
          </Card>
        </div>

        {/* Timeline */}
        {project.plannedDuration && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Project Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Start Date</p>
                  <p className="text-lg font-semibold">
                    {formatDate(project.plannedDuration.startDate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">End Date</p>
                  <p className="text-lg font-semibold">
                    {formatDate(project.plannedDuration.endDate)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Budget Breakdown */}
        {project.allocatedBudget && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Budget Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* ManPower */}
              {project.allocatedBudget.ManPower && project.allocatedBudget.ManPower.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">ManPower</h3>
                  <div className="rounded-md border overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium">Reason</th>
                          <th className="px-4 py-2 text-right text-sm font-medium">Quantity</th>
                          <th className="px-4 py-2 text-right text-sm font-medium">Rate</th>
                          <th className="px-4 py-2 text-right text-sm font-medium">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {project.allocatedBudget.ManPower.map((item: any, index: number) => (
                          <tr key={index} className="border-t">
                            <td className="px-4 py-2 text-sm">{item.BudgetReason}</td>
                            <td className="px-4 py-2 text-sm text-right">{item.Budget?.quantity}</td>
                            <td className="px-4 py-2 text-sm text-right">{formatCurrency(item.Budget?.rate)}</td>
                            <td className="px-4 py-2 text-sm text-right font-medium">
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
              {project.allocatedBudget.Equipment && project.allocatedBudget.Equipment.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Equipment</h3>
                  <div className="rounded-md border overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium">Reason</th>
                          <th className="px-4 py-2 text-right text-sm font-medium">Quantity</th>
                          <th className="px-4 py-2 text-right text-sm font-medium">Rate</th>
                          <th className="px-4 py-2 text-right text-sm font-medium">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {project.allocatedBudget.Equipment.map((item: any, index: number) => (
                          <tr key={index} className="border-t">
                            <td className="px-4 py-2 text-sm">{item.BudgetReason}</td>
                            <td className="px-4 py-2 text-sm text-right">{item.Budget?.quantity}</td>
                            <td className="px-4 py-2 text-sm text-right">{formatCurrency(item.Budget?.rate)}</td>
                            <td className="px-4 py-2 text-sm text-right font-medium">
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
              {project.allocatedBudget.OtherCosts && project.allocatedBudget.OtherCosts.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Other Costs</h3>
                  <div className="rounded-md border overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium">Reason</th>
                          <th className="px-4 py-2 text-right text-sm font-medium">Quantity</th>
                          <th className="px-4 py-2 text-right text-sm font-medium">Rate</th>
                          <th className="px-4 py-2 text-right text-sm font-medium">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {project.allocatedBudget.OtherCosts.map((item: any, index: number) => (
                          <tr key={index} className="border-t">
                            <td className="px-4 py-2 text-sm">{item.BudgetReason}</td>
                            <td className="px-4 py-2 text-sm text-right">{item.Budget?.quantity}</td>
                            <td className="px-4 py-2 text-sm text-right">{formatCurrency(item.Budget?.rate)}</td>
                            <td className="px-4 py-2 text-sm text-right font-medium">
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
                <h3 className="text-lg font-semibold mb-3">Additional Costs</h3>
                <div className="grid gap-3 md:grid-cols-2">
                  {project.allocatedBudget.Consumables && (
                    <div className="rounded-lg border p-4">
                      <p className="text-sm text-muted-foreground">Consumables</p>
                      <p className="text-xl font-bold">
                        {formatCurrency((project.allocatedBudget.Consumables as any).Budget?.totalAmount)}
                      </p>
                    </div>
                  )}
                  {project.allocatedBudget.Travel && (
                    <div className="rounded-lg border p-4">
                      <p className="text-sm text-muted-foreground">Travel</p>
                      <p className="text-xl font-bold">
                        {formatCurrency((project.allocatedBudget.Travel as any).Budget?.totalAmount)}
                      </p>
                    </div>
                  )}
                  {project.allocatedBudget.Contigency && (
                    <div className="rounded-lg border p-4">
                      <p className="text-sm text-muted-foreground">Contingency</p>
                      <p className="text-xl font-bold">
                        {formatCurrency((project.allocatedBudget.Contigency as any).Budget?.totalAmount)}
                      </p>
                    </div>
                  )}
                  {project.allocatedBudget.Overhead && (
                    <div className="rounded-lg border p-4">
                      <p className="text-sm text-muted-foreground">Overhead</p>
                      <p className="text-xl font-bold">
                        {formatCurrency((project.allocatedBudget.Overhead as any).Budget?.totalAmount)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between border-t pt-4">
                <span className="text-lg font-semibold">Total Budget</span>
                <span className="text-2xl font-bold text-primary">
                  {formatCurrency(totalBudget)}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Associated Application */}
        {project.applicationId && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Associated Application
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">Application ID</p>
              <p className="font-mono text-sm mb-4">{project.applicationId}</p>
              <p className="text-sm text-muted-foreground">
                This project is linked to an application where you are a co-applicant.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Metadata */}
        <Card>
          <CardHeader>
            <CardTitle>Metadata</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Created At</p>
                <p className="font-medium">{formatDate(project.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="font-medium">{formatDate(project.updatedAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </CoApplicantLayout>
  );
}
