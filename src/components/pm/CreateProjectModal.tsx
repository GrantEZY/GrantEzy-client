"use client";

import { useEffect, useState } from "react";

import { useProjectManagement } from "@/hooks/useProjectManagement";

import { CycleApplication } from "@/types/pm.types";
import {
  BudgetItem,
  CreateProjectRequest,
  Money,
  QuotedBudget,
} from "@/types/project.types";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  cycleSlug: string;
  approvedApplications: CycleApplication[];
}

// Form-friendly budget item structure
interface FormBudgetItem {
  reason: string;
  qty: number;
  rate: number;
}

export default function CreateProjectModal({
  isOpen,
  onClose,
  onSuccess,
  approvedApplications,
}: CreateProjectModalProps) {
  const { createProject, isProjectLoading, projectError } =
    useProjectManagement();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedApplicationId, setSelectedApplicationId] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Debug: Log approved applications
  useEffect(() => {
    if (isOpen) {
      console.log("🎯 CreateProjectModal opened with:", {
        approvedApplicationsCount: approvedApplications.length,
        applications: approvedApplications.map((app) => ({
          id: app.id,
          title: app.basicInfo?.title,
          status: app.status,
        })),
      });
    }
  }, [isOpen, approvedApplications]);

  // Budget state - using form-friendly structure
  const [manPowerItems, setManPowerItems] = useState<FormBudgetItem[]>([
    { reason: "", qty: 1, rate: 0 },
  ]);
  const [equipmentItems, setEquipmentItems] = useState<FormBudgetItem[]>([
    { reason: "", qty: 1, rate: 0 },
  ]);
  const [otherCostItems, setOtherCostItems] = useState<FormBudgetItem[]>([
    { reason: "", qty: 1, rate: 0 },
  ]);
  const [consumables, setConsumables] = useState(0);
  const [travel, setTravel] = useState(0);
  const [contingency, setContingency] = useState(0);
  const [overhead, setOverhead] = useState(0);

  // Duration state
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setCurrentStep(1);
      setSelectedApplicationId("");
      setManPowerItems([{ reason: "", qty: 1, rate: 0 }]);
      setEquipmentItems([{ reason: "", qty: 1, rate: 0 }]);
      setOtherCostItems([{ reason: "", qty: 1, rate: 0 }]);
      setConsumables(0);
      setTravel(0);
      setContingency(0);
      setOverhead(0);
      setStartDate("");
      setEndDate("");
      setErrors({});
    }
  }, [isOpen]);

  const addBudgetItem = (
    items: FormBudgetItem[],
    setItems: React.Dispatch<React.SetStateAction<FormBudgetItem[]>>,
  ) => {
    setItems([...items, { reason: "", qty: 1, rate: 0 }]);
  };

  const removeBudgetItem = (
    index: number,
    items: FormBudgetItem[],
    setItems: React.Dispatch<React.SetStateAction<FormBudgetItem[]>>,
  ) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateBudgetItem = (
    index: number,
    field: keyof FormBudgetItem,
    value: string | number,
    items: FormBudgetItem[],
    setItems: React.Dispatch<React.SetStateAction<FormBudgetItem[]>>,
  ) => {
    const updated = [...items];
    updated[index][field] = value as never;
    setItems(updated);
  };

  const calculateTotal = () => {
    const manPowerTotal = manPowerItems.reduce(
      (sum, item) => sum + item.qty * item.rate,
      0,
    );
    const equipmentTotal = equipmentItems.reduce(
      (sum, item) => sum + item.qty * item.rate,
      0,
    );
    const otherCostTotal = otherCostItems.reduce(
      (sum, item) => sum + item.qty * item.rate,
      0,
    );

    return (
      manPowerTotal +
      equipmentTotal +
      otherCostTotal +
      consumables +
      travel +
      contingency +
      overhead
    );
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedApplicationId) {
      newErrors.application = "Please select an application";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};

    // Validate that at least one budget category has data
    const hasManPower = manPowerItems.some(
      (item) => item.reason.trim() !== "" && item.rate > 0,
    );
    const hasEquipment = equipmentItems.some(
      (item) => item.reason.trim() !== "" && item.rate > 0,
    );
    const hasOtherCost = otherCostItems.some(
      (item) => item.reason.trim() !== "" && item.rate > 0,
    );
    const hasConsumables = consumables > 0;
    const hasTravel = travel > 0;
    const hasContingency = contingency > 0;
    const hasOverhead = overhead > 0;

    if (
      !hasManPower &&
      !hasEquipment &&
      !hasOtherCost &&
      !hasConsumables &&
      !hasTravel &&
      !hasContingency &&
      !hasOverhead
    ) {
      newErrors.budget = "Please add at least one budget item";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};

    if (!startDate) {
      newErrors.startDate = "Start date is required";
    }
    if (!endDate) {
      newErrors.endDate = "End date is required";
    }
    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      newErrors.endDate = "End date must be after start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    let isValid = false;

    if (currentStep === 1) {
      isValid = validateStep1();
    } else if (currentStep === 2) {
      isValid = validateStep2();
    }

    if (isValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep3()) {
      return;
    }

    // Convert FormBudgetItems to BudgetItems
    const convertToBudgetItem = (item: FormBudgetItem): BudgetItem => ({
      BudgetReason: item.reason,
      Budget: {
        amount: item.qty * item.rate,
        currency: "INR",
      },
    });

    const convertToMoney = (amount: number): Money => ({
      amount,
      currency: "INR",
    });

    // Build the quoted budget
    const allocatedBudget: QuotedBudget = {
      ManPower: manPowerItems
        .filter((item) => item.reason.trim() !== "" && item.rate > 0)
        .map(convertToBudgetItem),
      Equipment: equipmentItems
        .filter((item) => item.reason.trim() !== "" && item.rate > 0)
        .map(convertToBudgetItem),
      OtherCosts: otherCostItems
        .filter((item) => item.reason.trim() !== "" && item.rate > 0)
        .map(convertToBudgetItem),
      Consumables: {
        BudgetReason: "Consumables",
        Budget: convertToMoney(consumables),
      },
      Travel: {
        BudgetReason: "Travel",
        Budget: convertToMoney(travel),
      },
      Contigency: {
        BudgetReason: "Contingency",
        Budget: convertToMoney(contingency),
      },
      Overhead: {
        BudgetReason: "Overhead",
        Budget: convertToMoney(overhead),
      },
    };

    const projectData: CreateProjectRequest = {
      applicationId: selectedApplicationId,
      allocatedBudget,
      plannedDuration: {
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
      },
    };

    const response = await createProject(projectData);

    if (response) {
      onSuccess();
    }
  };

  if (!isOpen) return null;

  const selectedApplication = approvedApplications.find(
    (app) => app.id === selectedApplicationId,
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="bg-opacity-75 fixed inset-0 bg-gray-500 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:align-middle">
          {/* Header */}
          <div className="border-b border-gray-200 bg-white px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Create Project
              </h3>
              <button
                onClick={onClose}
                className="rounded-md text-gray-400 hover:text-gray-500"
                type="button"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M6 18L18 6M6 6l12 12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </button>
            </div>

            {/* Progress Steps */}
            <div className="mt-4">
              <div className="flex items-center">
                {[1, 2, 3].map((step, index) => (
                  <div key={step} className="flex flex-1 items-center">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                        currentStep >= step
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-gray-300 bg-white text-gray-500"
                      }`}
                    >
                      {step}
                    </div>
                    <div
                      className={`ml-2 text-sm font-medium ${
                        currentStep >= step ? "text-blue-600" : "text-gray-500"
                      }`}
                    >
                      {step === 1
                        ? "Select Application"
                        : step === 2
                          ? "Budget Allocation"
                          : "Project Duration"}
                    </div>
                    {index < 2 && (
                      <div
                        className={`mx-4 h-0.5 flex-1 ${
                          currentStep > step ? "bg-blue-600" : "bg-gray-300"
                        }`}
                      ></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white px-6 py-6">
            {/* Step 1: Select Application */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Select Approved Application *
                  </label>
                  <p className="mt-1 text-sm text-gray-500">
                    Choose an approved application to create a project
                  </p>
                  {errors.application && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.application}
                    </p>
                  )}
                </div>

                {approvedApplications.length === 0 ? (
                  <div className="rounded-md bg-yellow-50 p-4">
                    <div className="flex">
                      <svg
                        className="h-5 w-5 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">
                          No approved applications
                        </h3>
                        <div className="mt-2 text-sm text-yellow-700">
                          <p>
                            There are no approved applications in this cycle
                            yet. You need to approve an application before
                            creating a project.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="max-h-96 space-y-2 overflow-y-auto">
                    {approvedApplications.map((app) => (
                      <div
                        key={app.id}
                        onClick={() => setSelectedApplicationId(app.id)}
                        className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                          selectedApplicationId === app.id
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              {app.basicInfo?.title || "Untitled Application"}
                            </h4>
                            {app.basicInfo?.summary && (
                              <p className="mt-1 text-sm text-gray-500">
                                {app.basicInfo.summary.substring(0, 150)}
                                {app.basicInfo.summary.length > 150 && "..."}
                              </p>
                            )}
                            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                              <span>
                                Applicant: {app.applicant?.email || "N/A"}
                              </span>
                              <span>•</span>
                              <span>
                                Submitted:{" "}
                                {app.createdAt
                                  ? new Date(app.createdAt).toLocaleDateString()
                                  : "N/A"}
                              </span>
                            </div>
                          </div>
                          {selectedApplicationId === app.id && (
                            <svg
                              className="h-6 w-6 text-blue-600"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Budget Allocation */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900">Allocate Budget</h4>
                  <p className="mt-1 text-sm text-gray-500">
                    Define the budget allocation for this project across
                    different categories
                  </p>
                  {errors.budget && (
                    <p className="mt-1 text-sm text-red-600">{errors.budget}</p>
                  )}
                </div>

                {/* Selected Application Info */}
                {selectedApplication && (
                  <div className="rounded-lg bg-blue-50 p-4">
                    <h5 className="font-medium text-blue-900">
                      {selectedApplication.basicInfo?.title || "Untitled"}
                    </h5>
                    <p className="mt-1 text-sm text-blue-700">
                      {selectedApplication.applicant?.email || "N/A"}
                    </p>
                  </div>
                )}

                {/* ManPower */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    ManPower
                  </label>
                  {manPowerItems.map((item, index) => (
                    <div
                      key={index}
                      className="mt-2 flex items-center space-x-2"
                    >
                      <input
                        type="text"
                        value={item.reason}
                        onChange={(e) =>
                          updateBudgetItem(
                            index,
                            "reason",
                            e.target.value,
                            manPowerItems,
                            setManPowerItems,
                          )
                        }
                        placeholder="Item description"
                        className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                      />
                      <input
                        type="number"
                        value={item.qty}
                        onChange={(e) =>
                          updateBudgetItem(
                            index,
                            "qty",
                            Number(e.target.value),
                            manPowerItems,
                            setManPowerItems,
                          )
                        }
                        placeholder="Qty"
                        className="w-20 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                        min="1"
                      />
                      <input
                        type="number"
                        value={item.rate}
                        onChange={(e) =>
                          updateBudgetItem(
                            index,
                            "rate",
                            Number(e.target.value),
                            manPowerItems,
                            setManPowerItems,
                          )
                        }
                        placeholder="Rate"
                        className="w-32 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                        min="0"
                      />
                      <span className="text-sm text-gray-500">
                        = {(item.qty * item.rate).toLocaleString()}
                      </span>
                      <button
                        onClick={() =>
                          removeBudgetItem(
                            index,
                            manPowerItems,
                            setManPowerItems,
                          )
                        }
                        className="text-red-600 hover:text-red-700"
                        type="button"
                        disabled={manPowerItems.length === 1}
                      >
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() =>
                      addBudgetItem(manPowerItems, setManPowerItems)
                    }
                    className="mt-2 text-sm text-blue-600 hover:text-blue-700"
                    type="button"
                  >
                    + Add ManPower Item
                  </button>
                </div>

                {/* Equipment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Equipment
                  </label>
                  {equipmentItems.map((item, index) => (
                    <div
                      key={index}
                      className="mt-2 flex items-center space-x-2"
                    >
                      <input
                        type="text"
                        value={item.reason}
                        onChange={(e) =>
                          updateBudgetItem(
                            index,
                            "reason",
                            e.target.value,
                            equipmentItems,
                            setEquipmentItems,
                          )
                        }
                        placeholder="Item description"
                        className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                      />
                      <input
                        type="number"
                        value={item.qty}
                        onChange={(e) =>
                          updateBudgetItem(
                            index,
                            "qty",
                            Number(e.target.value),
                            equipmentItems,
                            setEquipmentItems,
                          )
                        }
                        placeholder="Qty"
                        className="w-20 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                        min="1"
                      />
                      <input
                        type="number"
                        value={item.rate}
                        onChange={(e) =>
                          updateBudgetItem(
                            index,
                            "rate",
                            Number(e.target.value),
                            equipmentItems,
                            setEquipmentItems,
                          )
                        }
                        placeholder="Rate"
                        className="w-32 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                        min="0"
                      />
                      <span className="text-sm text-gray-500">
                        = {(item.qty * item.rate).toLocaleString()}
                      </span>
                      <button
                        onClick={() =>
                          removeBudgetItem(
                            index,
                            equipmentItems,
                            setEquipmentItems,
                          )
                        }
                        className="text-red-600 hover:text-red-700"
                        type="button"
                        disabled={equipmentItems.length === 1}
                      >
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() =>
                      addBudgetItem(equipmentItems, setEquipmentItems)
                    }
                    className="mt-2 text-sm text-blue-600 hover:text-blue-700"
                    type="button"
                  >
                    + Add Equipment Item
                  </button>
                </div>

                {/* Other Costs */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Other Costs
                  </label>
                  {otherCostItems.map((item, index) => (
                    <div
                      key={index}
                      className="mt-2 flex items-center space-x-2"
                    >
                      <input
                        type="text"
                        value={item.reason}
                        onChange={(e) =>
                          updateBudgetItem(
                            index,
                            "reason",
                            e.target.value,
                            otherCostItems,
                            setOtherCostItems,
                          )
                        }
                        placeholder="Item description"
                        className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                      />
                      <input
                        type="number"
                        value={item.qty}
                        onChange={(e) =>
                          updateBudgetItem(
                            index,
                            "qty",
                            Number(e.target.value),
                            otherCostItems,
                            setOtherCostItems,
                          )
                        }
                        placeholder="Qty"
                        className="w-20 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                        min="1"
                      />
                      <input
                        type="number"
                        value={item.rate}
                        onChange={(e) =>
                          updateBudgetItem(
                            index,
                            "rate",
                            Number(e.target.value),
                            otherCostItems,
                            setOtherCostItems,
                          )
                        }
                        placeholder="Rate"
                        className="w-32 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                        min="0"
                      />
                      <span className="text-sm text-gray-500">
                        = {(item.qty * item.rate).toLocaleString()}
                      </span>
                      <button
                        onClick={() =>
                          removeBudgetItem(
                            index,
                            otherCostItems,
                            setOtherCostItems,
                          )
                        }
                        className="text-red-600 hover:text-red-700"
                        type="button"
                        disabled={otherCostItems.length === 1}
                      >
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() =>
                      addBudgetItem(otherCostItems, setOtherCostItems)
                    }
                    className="mt-2 text-sm text-blue-600 hover:text-blue-700"
                    type="button"
                  >
                    + Add Other Cost Item
                  </button>
                </div>

                {/* Simple Amount Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Consumables
                    </label>
                    <input
                      type="number"
                      value={consumables}
                      onChange={(e) => setConsumables(Number(e.target.value))}
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Travel
                    </label>
                    <input
                      type="number"
                      value={travel}
                      onChange={(e) => setTravel(Number(e.target.value))}
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Contingency
                    </label>
                    <input
                      type="number"
                      value={contingency}
                      onChange={(e) => setContingency(Number(e.target.value))}
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Overhead
                    </label>
                    <input
                      type="number"
                      value={overhead}
                      onChange={(e) => setOverhead(Number(e.target.value))}
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                      min="0"
                    />
                  </div>
                </div>

                {/* Total */}
                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-gray-900">
                      Total Budget:
                    </span>
                    <span className="text-2xl font-bold text-blue-600">
                      INR {calculateTotal().toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Duration */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900">
                    Project Duration
                  </h4>
                  <p className="mt-1 text-sm text-gray-500">
                    Define the planned start and end dates for this project
                  </p>
                </div>

                {/* Selected Application Info */}
                {selectedApplication && (
                  <div className="rounded-lg bg-blue-50 p-4">
                    <h5 className="font-medium text-blue-900">
                      {selectedApplication.basicInfo?.title || "Untitled"}
                    </h5>
                    <p className="mt-1 text-sm text-blue-700">
                      Total Budget: INR {calculateTotal().toLocaleString()}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                    />
                    {errors.startDate && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.startDate}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      End Date *
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                    />
                    {errors.endDate && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.endDate}
                      </p>
                    )}
                  </div>
                </div>

                {startDate &&
                  endDate &&
                  new Date(startDate) < new Date(endDate) && (
                    <div className="rounded-lg bg-green-50 p-4">
                      <p className="text-sm text-green-800">
                        Project duration:{" "}
                        {Math.ceil(
                          (new Date(endDate).getTime() -
                            new Date(startDate).getTime()) /
                            (1000 * 60 * 60 * 24),
                        )}{" "}
                        days
                      </p>
                    </div>
                  )}

                {projectError && (
                  <div className="rounded-md bg-red-50 p-4">
                    <p className="text-sm text-red-800">{projectError}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  if (currentStep === 1) {
                    onClose();
                  } else {
                    setCurrentStep(currentStep - 1);
                  }
                }}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                type="button"
              >
                {currentStep === 1 ? "Cancel" : "Back"}
              </button>
              <div className="flex space-x-3">
                {currentStep < 3 && (
                  <button
                    onClick={handleNext}
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    type="button"
                  >
                    Next
                  </button>
                )}
                {currentStep === 3 && (
                  <button
                    onClick={handleSubmit}
                    disabled={isProjectLoading}
                    className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                    type="button"
                  >
                    {isProjectLoading ? (
                      <>
                        <svg
                          className="mr-2 h-4 w-4 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Creating...
                      </>
                    ) : (
                      "Create Project"
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
