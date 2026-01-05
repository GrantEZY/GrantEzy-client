/**
 * Step 2: Budget Details Form
 * Collects: ManPower, Equipment, OtherCosts, Consumables, Travel, Contingency, Overhead
 */
'use client';

import { useState, useEffect } from 'react';
import { useApplicant } from '@/hooks/useApplicant';
import { Budget, BudgetItem } from '@/types/applicant.types';

export default function BudgetForm() {
  const { addBudget, isLoading, goToPreviousStep, currentApplication } = useApplicant();

  const [formData, setFormData] = useState<Budget>({
    ManPower: currentApplication?.budget?.ManPower || [],
    Equipment: currentApplication?.budget?.Equipment || [],
    OtherCosts: currentApplication?.budget?.OtherCosts || [],
    Consumables: currentApplication?.budget?.Consumables || {
      BudgetReason: '',
      Budget: { amount: '' as any, currency: 'INR' },
    },
    Travel: currentApplication?.budget?.Travel || {
      BudgetReason: '',
      Budget: { amount: '' as any, currency: 'INR' },
    },
    Contigency: currentApplication?.budget?.Contigency || {
      BudgetReason: '',
      Budget: { amount: '' as any, currency: 'INR' },
    },
    Overhead: currentApplication?.budget?.Overhead || {
      BudgetReason: '',
      Budget: { amount: '' as any, currency: 'INR' },
    },
  });

  // Update form data when currentApplication loads from draft
  useEffect(() => {
    if (currentApplication?.budget) {
      setFormData({
        ManPower: currentApplication.budget.ManPower || [],
        Equipment: currentApplication.budget.Equipment || [],
        OtherCosts: currentApplication.budget.OtherCosts || [],
        Consumables: currentApplication.budget.Consumables || {
          BudgetReason: '',
          Budget: { amount: '' as any, currency: 'INR' },
        },
        Travel: currentApplication.budget.Travel || {
          BudgetReason: '',
          Budget: { amount: '' as any, currency: 'INR' },
        },
        Contigency: currentApplication.budget.Contigency || {
          BudgetReason: '',
          Budget: { amount: '' as any, currency: 'INR' },
        },
        Overhead: currentApplication.budget.Overhead || {
          BudgetReason: '',
          Budget: { amount: '' as any, currency: 'INR' },
        },
      });
    }
  }, [currentApplication]);

  const addArrayItem = (field: 'ManPower' | 'Equipment' | 'OtherCosts') => {
    setFormData((prev) => ({
      ...prev,
      [field]: [
        ...prev[field],
        { BudgetReason: '', Budget: { amount: '' as any, currency: 'INR' } },
      ],
    }));
  };

  const removeArrayItem = (field: 'ManPower' | 'Equipment' | 'OtherCosts', index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const updateArrayItem = (
    field: 'ManPower' | 'Equipment' | 'OtherCosts',
    index: number,
    key: 'BudgetReason' | 'amount',
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) =>
        i === index
          ? key === 'BudgetReason'
            ? { ...item, BudgetReason: value as string }
            : { ...item, Budget: { ...item.Budget, amount: value === '' ? '' : (value as number) } }
          : item
      ),
    }));
  };

  const updateSingleItem = (
    field: 'Consumables' | 'Travel' | 'Contigency' | 'Overhead',
    key: 'BudgetReason' | 'amount',
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]:
        key === 'BudgetReason'
          ? { ...prev[field], BudgetReason: value as string }
          : {
              ...prev[field],
              Budget: { ...prev[field].Budget, amount: value === '' ? '' : (value as number) },
            },
    }));
  };

  const calculateTotal = (): number => {
    let total = 0;
    formData.ManPower.forEach((item) => (total += Number(item.Budget.amount) || 0));
    formData.Equipment.forEach((item) => (total += Number(item.Budget.amount) || 0));
    formData.OtherCosts.forEach((item) => (total += Number(item.Budget.amount) || 0));
    total += Number(formData.Consumables.Budget.amount) || 0;
    total += Number(formData.Travel.Budget.amount) || 0;
    total += Number(formData.Contigency.Budget.amount) || 0;
    total += Number(formData.Overhead.Budget.amount) || 0;
    return total;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addBudget(formData);
  };

  const renderArraySection = (
    title: string,
    field: 'ManPower' | 'Equipment' | 'OtherCosts',
    items: BudgetItem[]
  ) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <button
          type="button"
          onClick={() => addArrayItem(field)}
          className="inline-flex items-center rounded-md bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100"
        >
          <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Item
        </button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
          <p className="text-sm text-gray-500">No items added yet. Click "Add Item" to begin.</p>
        </div>
      ) : (
        items.map((item, index) => (
          <div key={index} className="rounded-lg border border-gray-200 p-4 space-y-3">
            <div className="flex items-start justify-between">
              <span className="text-sm font-medium text-gray-700">Item {index + 1}</span>
              <button
                type="button"
                onClick={() => removeArrayItem(field, index)}
                className="text-red-600 hover:text-red-700"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Reason</label>
              <input
                type="text"
                value={item.BudgetReason}
                onChange={(e) => updateArrayItem(field, index, 'BudgetReason', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder={`e.g., ${field === 'ManPower' ? 'Hiring developers' : field === 'Equipment' ? 'GPU Servers' : 'Other expenses'}`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount (INR)</label>
              <input
                type="number"
                min="0"
                value={item.Budget.amount}
                onChange={(e) =>
                  updateArrayItem(
                    field,
                    index,
                    'amount',
                    e.target.value === '' ? '' : Number(e.target.value)
                  )
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter amount"
              />
            </div>
          </div>
        ))
      )}
    </div>
  );

  const renderSingleSection = (
    title: string,
    field: 'Consumables' | 'Travel' | 'Contigency' | 'Overhead',
    item: BudgetItem,
    placeholder: string
  ) => (
    <div className="space-y-3">
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <div className="rounded-lg border border-gray-200 p-4 space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">Reason</label>
          <input
            type="text"
            value={item.BudgetReason}
            onChange={(e) => updateSingleItem(field, 'BudgetReason', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder={placeholder}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Amount (INR)</label>
          <input
            type="number"
            min="0"
            value={item.Budget.amount}
            onChange={(e) =>
              updateSingleItem(field, 'amount', e.target.value === '' ? '' : Number(e.target.value))
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter amount"
          />
        </div>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Budget Details</h2>
        <p className="mt-1 text-sm text-gray-600">
          Provide detailed budget breakdown for your project
        </p>
      </div>

      {/* ManPower */}
      {renderArraySection('ManPower', 'ManPower', formData.ManPower)}

      {/* Equipment */}
      {renderArraySection('Equipment', 'Equipment', formData.Equipment)}

      {/* Other Costs */}
      {renderArraySection('Other Costs', 'OtherCosts', formData.OtherCosts)}

      {/* Consumables */}
      {renderSingleSection(
        'Consumables',
        'Consumables',
        formData.Consumables,
        'e.g., Cloud credits'
      )}

      {/* Travel */}
      {renderSingleSection('Travel', 'Travel', formData.Travel, 'e.g., Conferences')}

      {/* Contingency */}
      {renderSingleSection(
        'Contingency',
        'Contigency',
        formData.Contigency,
        'e.g., Unexpected costs'
      )}

      {/* Overhead */}
      {renderSingleSection('Overhead', 'Overhead', formData.Overhead, 'e.g., Admin expenses')}

      {/* Total Budget */}
      <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
        <div className="flex items-center justify-between">
          <span className="text-lg font-medium text-gray-900">Total Budget</span>
          <span className="text-2xl font-bold text-blue-600">
            ₹{calculateTotal().toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={goToPreviousStep}
          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Previous
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center rounded-md bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Continue'}
          <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </button>
      </div>
    </form>
  );
}
