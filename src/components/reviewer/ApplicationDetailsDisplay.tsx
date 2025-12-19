/**
 * Application Details Display Component for Reviewers
 * Shows complete application information before the review form
 */
'use client';

import { Application, RiskImpact } from '@/types/reviewer.types';

interface ApplicationDetailsDisplayProps {
  application: Application;
}

export default function ApplicationDetailsDisplay({ application }: ApplicationDetailsDisplayProps) {
  const getRiskColor = (impact: RiskImpact) => {
    switch (impact) {
      case RiskImpact.LOW:
        return 'bg-green-100 text-green-800';
      case RiskImpact.MEDIUM:
        return 'bg-yellow-100 text-yellow-800';
      case RiskImpact.HIGH:
        return 'bg-orange-100 text-orange-800';
      case RiskImpact.CRITICAL:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency || 'INR',
    }).format(amount);
  };

  const calculateTotalBudget = () => {
    if (!application.budget) return 0;
    let total = 0;

    // Array items
    application.budget.ManPower?.forEach((item) => (total += Number(item.Budget.amount) || 0));
    application.budget.Equipment?.forEach((item) => (total += Number(item.Budget.amount) || 0));
    application.budget.OtherCosts?.forEach((item) => (total += Number(item.Budget.amount) || 0));

    // Single items
    total += Number(application.budget.Consumables?.Budget.amount) || 0;
    total += Number(application.budget.Travel?.Budget.amount) || 0;
    total += Number(application.budget.Contigency?.Budget.amount) || 0;
    total += Number(application.budget.Overhead?.Budget.amount) || 0;

    return total;
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      {application.basicDetails && (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700">Project Title</h3>
              <p className="mt-1 text-gray-900">{application.basicDetails.title}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700">Summary</h3>
              <p className="mt-1 text-gray-900">{application.basicDetails.summary}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700">Problem Statement</h3>
              <p className="mt-1 text-gray-900">{application.basicDetails.problem}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700">Proposed Solution</h3>
              <p className="mt-1 text-gray-900">{application.basicDetails.solution}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700">Innovation</h3>
              <p className="mt-1 text-gray-900">{application.basicDetails.innovation}</p>
            </div>
          </div>
        </div>
      )}

      {/* Budget */}
      {application.budget && (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Budget Breakdown</h2>
          <div className="space-y-4">
            {/* ManPower */}
            {application.budget.ManPower && application.budget.ManPower.length > 0 && (
              <div>
                <h3 className="mb-2 text-sm font-medium text-gray-700">ManPower</h3>
                <div className="space-y-2">
                  {application.budget.ManPower.map((item, idx) => (
                    <div key={idx} className="flex justify-between rounded bg-gray-50 p-3">
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
                <h3 className="mb-2 text-sm font-medium text-gray-700">Equipment</h3>
                <div className="space-y-2">
                  {application.budget.Equipment.map((item, idx) => (
                    <div key={idx} className="flex justify-between rounded bg-gray-50 p-3">
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
                <h3 className="mb-2 text-sm font-medium text-gray-700">Other Costs</h3>
                <div className="space-y-2">
                  {application.budget.OtherCosts.map((item, idx) => (
                    <div key={idx} className="flex justify-between rounded bg-gray-50 p-3">
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
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {application.budget.Consumables && (
                <div className="flex justify-between rounded bg-gray-50 p-3">
                  <span className="text-sm text-gray-900">Consumables</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(
                      application.budget.Consumables.Budget.amount,
                      application.budget.Consumables.Budget.currency
                    )}
                  </span>
                </div>
              )}
              {application.budget.Travel && (
                <div className="flex justify-between rounded bg-gray-50 p-3">
                  <span className="text-sm text-gray-900">Travel</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(
                      application.budget.Travel.Budget.amount,
                      application.budget.Travel.Budget.currency
                    )}
                  </span>
                </div>
              )}
              {application.budget.Contigency && (
                <div className="flex justify-between rounded bg-gray-50 p-3">
                  <span className="text-sm text-gray-900">Contingency</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(
                      application.budget.Contigency.Budget.amount,
                      application.budget.Contigency.Budget.currency
                    )}
                  </span>
                </div>
              )}
              {application.budget.Overhead && (
                <div className="flex justify-between rounded bg-gray-50 p-3">
                  <span className="text-sm text-gray-900">Overhead</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(
                      application.budget.Overhead.Budget.amount,
                      application.budget.Overhead.Budget.currency
                    )}
                  </span>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="mt-4 border-t border-gray-200 pt-4">
              <div className="flex justify-between">
                <span className="text-lg font-semibold text-gray-900">Total Budget</span>
                <span className="text-lg font-bold text-indigo-600">
                  {formatCurrency(calculateTotalBudget(), 'INR')}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Technical Specifications */}
      {application.technicalSpec && (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Technical Specifications</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700">Technology Stack</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {application.technicalSpec.techStack?.map((tech, idx) => (
                  <span
                    key={idx}
                    className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-800"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700">Description</h3>
              <p className="mt-1 text-gray-900">{application.technicalSpec.description}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700">Prototype</h3>
              <p className="mt-1 text-gray-900">{application.technicalSpec.prototype}</p>
            </div>
          </div>
        </div>
      )}

      {/* Market Information */}
      {application.marketInfo && (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Market Information</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700">Total Addressable Market (TAM)</h3>
              <p className="mt-1 text-gray-900">{application.marketInfo.totalAddressableMarket}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700">Serviceable Market (SAM)</h3>
              <p className="mt-1 text-gray-900">{application.marketInfo.serviceableMarket}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700">Obtainable Market (SOM)</h3>
              <p className="mt-1 text-gray-900">{application.marketInfo.obtainableMarket}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700">Competitor Analysis</h3>
              <p className="mt-1 text-gray-900">{application.marketInfo.competitorAnalysis}</p>
            </div>
          </div>
        </div>
      )}

      {/* Revenue Model */}
      {application.revenueModel && (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Revenue Model</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700">Primary Revenue Stream</h3>
              <div className="mt-2 rounded bg-indigo-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">
                    {application.revenueModel.primaryStream.type}
                  </span>
                  <span className="text-sm font-semibold text-indigo-600">
                    {application.revenueModel.primaryStream.percentage}%
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-700">
                  {application.revenueModel.primaryStream.description}
                </p>
              </div>
            </div>

            {application.revenueModel.secondaryStreams &&
              application.revenueModel.secondaryStreams.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Secondary Revenue Streams</h3>
                  <div className="mt-2 space-y-2">
                    {application.revenueModel.secondaryStreams.map((stream, idx) => (
                      <div key={idx} className="rounded bg-gray-50 p-4">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900">{stream.type}</span>
                          <span className="text-sm font-semibold text-gray-600">
                            {stream.percentage}%
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-gray-700">{stream.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            <div>
              <h3 className="text-sm font-medium text-gray-700">Pricing Strategy</h3>
              <p className="mt-1 text-gray-900">{application.revenueModel.pricing}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700">Unit Economics</h3>
              <p className="mt-1 text-gray-900">{application.revenueModel.unitEconomics}</p>
            </div>
          </div>
        </div>
      )}

      {/* Risks */}
      {application.risks && application.risks.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Risks & Mitigation</h2>
          <div className="space-y-3">
            {application.risks.map((risk, idx) => (
              <div key={idx} className="rounded border border-gray-200 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">Risk {idx + 1}</h3>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${getRiskColor(
                      risk.impact
                    )}`}
                  >
                    {risk.impact}
                  </span>
                </div>
                <p className="mb-2 text-sm text-gray-700">{risk.description}</p>
                <div className="mt-2 rounded bg-green-50 p-2">
                  <span className="text-xs font-medium text-green-800">Mitigation:</span>
                  <p className="mt-1 text-sm text-green-900">{risk.mitigation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Milestones */}
      {application.milestones && application.milestones.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Project Milestones</h2>
          <div className="space-y-4">
            {application.milestones.map((milestone, idx) => (
              <div key={idx} className="rounded border border-gray-200 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">{milestone.title}</h3>
                  <span className="text-sm text-gray-600">
                    Due: {new Date(milestone.dueDate).toLocaleDateString()}
                  </span>
                </div>
                <p className="mb-3 text-sm text-gray-700">{milestone.description}</p>
                <div>
                  <h4 className="mb-1 text-xs font-medium text-gray-700">Deliverables:</h4>
                  <ul className="list-inside list-disc space-y-1">
                    {milestone.deliverables.map((deliverable, dIdx) => (
                      <li key={dIdx} className="text-sm text-gray-600">
                        {deliverable}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Team Members */}
      {application.teamMateInvites && application.teamMateInvites.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Team Members</h2>
          <div className="space-y-2">
            {application.teamMateInvites.map((member, idx) => (
              <div key={idx} className="flex items-center justify-between rounded bg-gray-50 p-3">
                <span className="text-sm text-gray-900">{member.email}</span>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    member.status === 'ACCEPTED'
                      ? 'bg-green-100 text-green-800'
                      : member.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {member.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
