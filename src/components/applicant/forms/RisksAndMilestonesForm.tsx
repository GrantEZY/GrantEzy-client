/**
 * Step 5: Risks and Milestones Form
 * Collects: risks[] (description, impact, mitigation) + milestones[] (title, description, deliverables[], dueDate)
 */
"use client";

import { useState } from "react";
import { useApplicant } from "@/hooks/useApplicant";
import { Risk, Milestone, RiskImpact } from "@/types/applicant.types";

export default function RisksAndMilestonesForm() {
  const { addRisksAndMilestones, isLoading, goToPreviousStep, currentApplication } = useApplicant();

  const [risks, setRisks] = useState<Risk[]>(
    currentApplication?.risks || []
  );
  const [milestones, setMilestones] = useState<Milestone[]>(
    currentApplication?.milestones || []
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Risk Management
  const addRisk = () => {
    setRisks([...risks, { description: "", impact: RiskImpact.MEDIUM, mitigation: "" }]);
  };

  const removeRisk = (index: number) => {
    setRisks(risks.filter((_: any, i: number) => i !== index));
  };

  const updateRisk = (index: number, field: keyof Risk, value: string | RiskImpact) => {
    setRisks(risks.map((risk: Risk, i: number) => (i === index ? { ...risk, [field]: value } : risk)));
    setErrors((prev) => ({ ...prev, [`risk_${index}_${field}`]: "" }));
  };

  // Milestone Management
  const addMilestone = () => {
    setMilestones([...milestones, { title: "", description: "", deliverables: [], dueDate: "" }]);
  };

  const removeMilestone = (index: number) => {
    setMilestones(milestones.filter((_: any, i: number) => i !== index));
  };

  const updateMilestone = (
    index: number,
    field: keyof Milestone,
    value: string | string[]
  ) => {
    setMilestones(
      milestones.map((milestone: Milestone, i: number) =>
        i === index ? { ...milestone, [field]: value } : milestone
      )
    );
    setErrors((prev) => ({ ...prev, [`milestone_${index}_${field}`]: "" }));
  };

  const addDeliverable = (milestoneIndex: number) => {
    const milestone = milestones[milestoneIndex];
    updateMilestone(milestoneIndex, "deliverables", [...milestone.deliverables, ""]);
  };

  const updateDeliverable = (milestoneIndex: number, deliverableIndex: number, value: string) => {
    const milestone = milestones[milestoneIndex];
    const newDeliverables = milestone.deliverables.map((d: string, i: number) =>
      i === deliverableIndex ? value : d
    );
    updateMilestone(milestoneIndex, "deliverables", newDeliverables);
  };

  const removeDeliverable = (milestoneIndex: number, deliverableIndex: number) => {
    const milestone = milestones[milestoneIndex];
    const newDeliverables = milestone.deliverables.filter((_: any, i: number) => i !== deliverableIndex);
    updateMilestone(milestoneIndex, "deliverables", newDeliverables);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (risks.length === 0) {
      newErrors.risksRequired = "Add at least one risk";
    }

    risks.forEach((risk: Risk, index: number) => {
      if (!risk.description.trim()) {
        newErrors[`risk_${index}_description`] = "Risk description is required";
      }
      if (!risk.mitigation.trim()) {
        newErrors[`risk_${index}_mitigation`] = "Mitigation strategy is required";
      }
    });

    if (milestones.length === 0) {
      newErrors.milestonesRequired = "Add at least one milestone";
    }

    milestones.forEach((milestone: Milestone, index: number) => {
      if (!milestone.title.trim()) {
        newErrors[`milestone_${index}_title`] = "Milestone title is required";
      }
      if (!milestone.description.trim()) {
        newErrors[`milestone_${index}_description`] = "Milestone description is required";
      }
      if (milestone.deliverables.length === 0) {
        newErrors[`milestone_${index}_deliverables`] = "Add at least one deliverable";
      }
      if (!milestone.dueDate) {
        newErrors[`milestone_${index}_dueDate`] = "Due date is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await addRisksAndMilestones(risks, milestones);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Risks & Milestones</h2>
        <p className="mt-1 text-sm text-gray-600">
          Identify potential risks and define project milestones
        </p>
      </div>

      {/* Risks Section */}
      <div className="rounded-lg border border-gray-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Project Risks</h3>
          <button
            type="button"
            onClick={addRisk}
            className="inline-flex items-center rounded-md bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100"
          >
            <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Risk
          </button>
        </div>

        {errors.risksRequired && <p className="text-sm text-red-500">{errors.risksRequired}</p>}

        {risks.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
            <p className="text-sm text-gray-500">No risks added yet. Click  Add Risk" to begin.</p>
          </div>
        ) : (
          risks.map((risk: Risk, index: number) => (
            <div key={index} className="rounded-lg border border-gray-200 p-4 space-y-3">
              <div className="flex items-start justify-between">
                <span className="text-sm font-medium text-gray-700">Risk {index + 1}</span>
                <button
                  type="button"
                  onClick={() => removeRisk(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Impact Level</label>
                <select
                  value={risk.impact}
                  onChange={(e) => updateRisk(index, "impact", e.target.value as RiskImpact)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {Object.values(RiskImpact).map((impact) => (
                    <option key={impact} value={impact}>
                      {impact}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description *</label>
                <textarea
                  value={risk.description}
                  onChange={(e) => updateRisk(index, "description", e.target.value)}
                  rows={2}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                    errors[`risk_${index}_description`] ? "border-red-300" : ""
                  }`}
                  placeholder="Describe the risk..."
                />
                {errors[`risk_${index}_description`] && (
                  <p className="mt-1 text-sm text-red-500">{errors[`risk_${index}_description`]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Mitigation Strategy *</label>
                <textarea
                  value={risk.mitigation}
                  onChange={(e) => updateRisk(index, "mitigation", e.target.value)}
                  rows={2}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                    errors[`risk_${index}_mitigation`] ? "border-red-300" : ""
                  }`}
                  placeholder="How will you mitigate this risk?"
                />
                {errors[`risk_${index}_mitigation`] && (
                  <p className="mt-1 text-sm text-red-500">{errors[`risk_${index}_mitigation`]}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Milestones Section */}
      <div className="rounded-lg border border-gray-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Project Milestones</h3>
          <button
            type="button"
            onClick={addMilestone}
            className="inline-flex items-center rounded-md bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100"
          >
            <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Milestone
          </button>
        </div>

        {errors.milestonesRequired && (
          <p className="text-sm text-red-500">{errors.milestonesRequired}</p>
        )}

        {milestones.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
            <p className="text-sm text-gray-500">No milestones added yet. Click "Add Milestone" to begin.</p>
          </div>
        ) : (
          milestones.map((milestone: Milestone, index: number) => (
            <div key={index} className="rounded-lg border border-gray-200 p-4 space-y-3">
              <div className="flex items-start justify-between">
                <span className="text-sm font-medium text-gray-700">Milestone {index + 1}</span>
                <button
                  type="button"
                  onClick={() => removeMilestone(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Title *</label>
                <input
                  type="text"
                  value={milestone.title}
                  onChange={(e) => updateMilestone(index, "title", e.target.value)}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                    errors[`milestone_${index}_title`] ? "border-red-300" : ""
                  }`}
                  placeholder="e.g., MVP Development"
                />
                {errors[`milestone_${index}_title`] && (
                  <p className="mt-1 text-sm text-red-500">{errors[`milestone_${index}_title`]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description *</label>
                <textarea
                  value={milestone.description}
                  onChange={(e) => updateMilestone(index, "description", e.target.value)}
                  rows={2}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                    errors[`milestone_${index}_description`] ? "border-red-300" : ""
                  }`}
                  placeholder="Describe this milestone..."
                />
                {errors[`milestone_${index}_description`] && (
                  <p className="mt-1 text-sm text-red-500">{errors[`milestone_${index}_description`]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Due Date *</label>
                <input
                  type="date"
                  value={milestone.dueDate}
                  onChange={(e) => updateMilestone(index, "dueDate", e.target.value)}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                    errors[`milestone_${index}_dueDate`] ? "border-red-300" : ""
                  }`}
                />
                {errors[`milestone_${index}_dueDate`] && (
                  <p className="mt-1 text-sm text-red-500">{errors[`milestone_${index}_dueDate`]}</p>
                )}
              </div>

              {/* Deliverables */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Deliverables *</label>
                  <button
                    type="button"
                    onClick={() => addDeliverable(index)}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    + Add Deliverable
                  </button>
                </div>
                {errors[`milestone_${index}_deliverables`] && (
                  <p className="mb-2 text-sm text-red-500">{errors[`milestone_${index}_deliverables`]}</p>
                )}
                {milestone.deliverables.map((deliverable: string, dIndex: number) => (
                  <div key={dIndex} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={deliverable}
                      onChange={(e) => updateDeliverable(index, dIndex, e.target.value)}
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="e.g., Working prototype"
                    />
                    <button
                      type="button"
                      onClick={() => removeDeliverable(index, dIndex)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={goToPreviousStep}
          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center rounded-md bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? "Saving..." : "Continue"}
          <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </form>
  );
}
