"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AuthGuard } from "@/components/guards/AuthGuard";
import ApplicantLayout from "@/components/layout/ApplicantLayout";
import { applicantService } from "@/services/applicant.service";
import { Application } from "@/types/applicant.types";

export default function ApplicationDetailsPage() {
  const params = useParams();
  //  const _router = useRouter(); // Uncomment if navigation is needed
  const applicationId = params.id as string;

  const [application, setApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await applicantService.getUserCreatedApplicationDetails(
          applicationId,
        );

        if (response.status === 200 && response.res.application) {
          setApplication(response.res.application);
        } else {
          setError("Application not found");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load application",
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (applicationId) {
      fetchApplicationDetails();
    }
  }, [applicationId]);

  if (isLoading) {
    return (
      <AuthGuard>
        <ApplicantLayout>
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading application details...</p>
            </div>
          </div>
        </ApplicantLayout>
      </AuthGuard>
    );
  }

  if (error || !application) {
    return (
      <AuthGuard>
        <ApplicantLayout>
          <div className="rounded-lg border border-red-200 bg-red-50 p-6">
            <h3 className="text-lg font-medium text-red-900">Error</h3>
            <p className="mt-2 text-sm text-red-700">
              {error || "Application not found"}
            </p>
            <Link
              href="/applicant"
              className="mt-4 inline-block rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Back to Dashboard
            </Link>
          </div>
        </ApplicantLayout>
      </AuthGuard>
    );
  }

  const formatDate = (date: string | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(amount);
  };

  return (
    <AuthGuard>
      <ApplicantLayout>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Application Details
              </h1>
              <p className="mt-2 text-gray-600">
                {application.isSubmitted ? "Submitted" : "Draft"} Application
              </p>
            </div>
            <Link
              href="/applicant"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              ← Back to Dashboard
            </Link>
          </div>

          {/* Status Badge */}
          <div className="mt-4">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${application.isSubmitted
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
                }`}
            >
              {application.isSubmitted ? "Submitted" : "Draft"}
            </span>
            <span className="ml-3 text-sm text-gray-500">
              Last updated: {formatDate(application.updatedAt)}
            </span>
          </div>
        </div>

        {/* Basic Information */}
        {application.basicInfo && (
          <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Basic Information
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Title</h3>
                <p className="mt-1 text-base text-gray-900">
                  {application.basicInfo.title}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Summary</h3>
                <p className="mt-1 text-base text-gray-900">
                  {application.basicInfo.summary}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Problem Statement</h3>
                <p className="mt-1 text-base text-gray-900">
                  {application.basicInfo.problem}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Proposed Solution</h3>
                <p className="mt-1 text-base text-gray-900">
                  {application.basicInfo.solution}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Innovation</h3>
                <p className="mt-1 text-base text-gray-900">
                  {application.basicInfo.innovation}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Budget Details */}
        {application.budget && (
          <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Budget Details
            </h2>
            <div className="space-y-6">
              {/* ManPower */}
              {application.budget.ManPower && application.budget.ManPower.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">ManPower</h3>
                  <div className="space-y-2">
                    {application.budget.ManPower.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-2 bg-gray-50 rounded"
                      >
                        <span className="text-sm text-gray-900">{item.BudgetReason}</span>
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(item.Budget.amount, item.Budget.currency)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Equipment */}
              {application.budget.Equipment && application.budget.Equipment.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Equipment</h3>
                  <div className="space-y-2">
                    {application.budget.Equipment.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-2 bg-gray-50 rounded"
                      >
                        <span className="text-sm text-gray-900">{item.BudgetReason}</span>
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(item.Budget.amount, item.Budget.currency)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Other Costs */}
              {application.budget.OtherCosts && application.budget.OtherCosts.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Other Costs</h3>
                  <div className="space-y-2">
                    {application.budget.OtherCosts.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-2 bg-gray-50 rounded"
                      >
                        <span className="text-sm text-gray-900">{item.BudgetReason}</span>
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(item.Budget.amount, item.Budget.currency)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Single Items */}
              <div className="grid grid-cols-2 gap-4">
                {application.budget.Consumables && (
                  <div className="p-3 bg-gray-50 rounded">
                    <h3 className="text-sm font-medium text-gray-700">Consumables</h3>
                    <p className="mt-1 text-base font-medium text-gray-900">
                      {formatCurrency(
                        application.budget.Consumables.Budget.amount,
                        application.budget.Consumables.Budget.currency,
                      )}
                    </p>
                  </div>
                )}
                {application.budget.Travel && (
                  <div className="p-3 bg-gray-50 rounded">
                    <h3 className="text-sm font-medium text-gray-700">Travel</h3>
                    <p className="mt-1 text-base font-medium text-gray-900">
                      {formatCurrency(
                        application.budget.Travel.Budget.amount,
                        application.budget.Travel.Budget.currency,
                      )}
                    </p>
                  </div>
                )}
                {application.budget.Contigency && (
                  <div className="p-3 bg-gray-50 rounded">
                    <h3 className="text-sm font-medium text-gray-700">Contingency</h3>
                    <p className="mt-1 text-base font-medium text-gray-900">
                      {formatCurrency(
                        application.budget.Contigency.Budget.amount,
                        application.budget.Contigency.Budget.currency,
                      )}
                    </p>
                  </div>
                )}
                {application.budget.Overhead && (
                  <div className="p-3 bg-gray-50 rounded">
                    <h3 className="text-sm font-medium text-gray-700">Overhead</h3>
                    <p className="mt-1 text-base font-medium text-gray-900">
                      {formatCurrency(
                        application.budget.Overhead.Budget.amount,
                        application.budget.Overhead.Budget.currency,
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Technical Specifications */}
        {application.technicalSpec && (
          <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Technical Specifications
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                <p className="mt-1 text-base text-gray-900">
                  {application.technicalSpec.description}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Tech Stack</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {application.technicalSpec.techStack.map((tech, index) => (
                    <span
                      key={index}
                      className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Prototype Status</h3>
                <p className="mt-1 text-base text-gray-900">
                  {application.technicalSpec.prototype}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Market Information */}
        {application.marketInfo && (
          <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Market Analysis
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Total Addressable Market (TAM)
                </h3>
                <p className="mt-1 text-base text-gray-900">
                  {application.marketInfo.totalAddressableMarket}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Serviceable Market (SAM)
                </h3>
                <p className="mt-1 text-base text-gray-900">
                  {application.marketInfo.serviceableMarket}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Obtainable Market (SOM)
                </h3>
                <p className="mt-1 text-base text-gray-900">
                  {application.marketInfo.obtainableMarket}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Competitor Analysis
                </h3>
                <p className="mt-1 text-base text-gray-900">
                  {application.marketInfo.competitorAnalysis}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Revenue Model */}
        {application.revenueModel && (
          <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Revenue Model
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Primary Revenue Stream</h3>
                <div className="mt-2 p-3 bg-gray-50 rounded">
                  <p className="text-sm font-medium text-gray-900">
                    {application.revenueModel.primaryStream.type} (
                    {application.revenueModel.primaryStream.percentage}%)
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    {application.revenueModel.primaryStream.description}
                  </p>
                </div>
              </div>
              {application.revenueModel.secondaryStreams &&
                application.revenueModel.secondaryStreams.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Secondary Revenue Streams
                    </h3>
                    <div className="mt-2 space-y-2">
                      {application.revenueModel.secondaryStreams.map((stream, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded">
                          <p className="text-sm font-medium text-gray-900">
                            {stream.type} ({stream.percentage}%)
                          </p>
                          <p className="mt-1 text-sm text-gray-600">{stream.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              <div>
                <h3 className="text-sm font-medium text-gray-500">Pricing Strategy</h3>
                <p className="mt-1 text-base text-gray-900">
                  {application.revenueModel.pricing}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Unit Economics</h3>
                <p className="mt-1 text-base text-gray-900">
                  {application.revenueModel.unitEconomics}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Risks & Milestones */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Risks */}
          {application.risks && application.risks.length > 0 && (
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Risks</h2>
              <div className="space-y-3">
                {application.risks.map((risk, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        Risk #{index + 1}
                      </span>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded ${risk.impact === "CRITICAL"
                          ? "bg-red-100 text-red-800"
                          : risk.impact === "HIGH"
                            ? "bg-orange-100 text-orange-800"
                            : risk.impact === "MEDIUM"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                      >
                        {risk.impact}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{risk.description}</p>
                    <p className="text-xs text-gray-600">
                      <span className="font-medium">Mitigation:</span> {risk.mitigation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Milestones */}
          {application.milestones && application.milestones.length > 0 && (
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Milestones</h2>
              <div className="space-y-3">
                {application.milestones.map((milestone, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded">
                    <p className="text-sm font-medium text-gray-900">
                      {milestone.title}
                    </p>
                    <p className="mt-1 text-xs text-gray-600">
                      {milestone.description}
                    </p>
                    <p className="mt-2 text-xs text-gray-500">
                      Due: {formatDate(milestone.dueDate)}
                    </p>
                    {milestone.deliverables && milestone.deliverables.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-gray-700">Deliverables:</p>
                        <ul className="mt-1 list-disc list-inside text-xs text-gray-600">
                          {milestone.deliverables.map((deliverable, idx) => (
                            <li key={idx}>{deliverable}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Documents */}
        {application.documents && (
          <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Documents</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {application.documents.endorsementLetter && (
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-sm font-medium text-gray-900">Endorsement Letter</p>
                  <p className="mt-1 text-xs text-gray-600">
                    {application.documents.endorsementLetter.fileName}
                  </p>
                </div>
              )}
              {application.documents.plagiarismUndertaking && (
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-sm font-medium text-gray-900">
                    Plagiarism Undertaking
                  </p>
                  <p className="mt-1 text-xs text-gray-600">
                    {application.documents.plagiarismUndertaking.fileName}
                  </p>
                </div>
              )}
              {application.documents.ageProof && (
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-sm font-medium text-gray-900">Age Proof</p>
                  <p className="mt-1 text-xs text-gray-600">
                    {application.documents.ageProof.fileName}
                  </p>
                </div>
              )}
              {application.documents.aadhar && (
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-sm font-medium text-gray-900">Aadhar</p>
                  <p className="mt-1 text-xs text-gray-600">
                    {application.documents.aadhar.fileName}
                  </p>
                </div>
              )}
              {application.documents.piCertificate && (
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-sm font-medium text-gray-900">PI Certificate</p>
                  <p className="mt-1 text-xs text-gray-600">
                    {application.documents.piCertificate.fileName}
                  </p>
                </div>
              )}
              {application.documents.coPiCertificate && (
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-sm font-medium text-gray-900">Co-PI Certificate</p>
                  <p className="mt-1 text-xs text-gray-600">
                    {application.documents.coPiCertificate.fileName}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Team Members */}
        {application.teamMateInvites && application.teamMateInvites.length > 0 && (
          <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Team Members</h2>
            <div className="space-y-2">
              {application.teamMateInvites.map((invite) => (
                <div
                  key={invite.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded"
                >
                  <span className="text-sm text-gray-900">{invite.email}</span>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded ${invite.status === "ACCEPTED"
                      ? "bg-green-100 text-green-800"
                      : invite.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                      }`}
                  >
                    {invite.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex justify-between items-center border-t border-gray-200 pt-6">
          <Link
            href="/applicant"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            ← Back to Dashboard
          </Link>
          {!application.isSubmitted && (
            <Link
              href={`/applicant/new-application?applicationId=${applicationId}`}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Continue Editing →
            </Link>
          )}
        </div>
      </ApplicantLayout>
    </AuthGuard>
  );
}
