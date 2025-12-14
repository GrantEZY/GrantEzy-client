/**
 * Step 4: Revenue Model Form
 * Collects: primaryStream, secondaryStreams[], pricing, unitEconomics
 */
'use client';

import { useState, useEffect } from 'react';
import { useApplicant } from '@/hooks/useApplicant';
import { RevenueModel, RevenueStream, RevenueStreamType } from '@/types/applicant.types';

export default function RevenueModelForm() {
  const { addRevenueStream, isLoading, goToPreviousStep, currentApplication } = useApplicant();

  const [formData, setFormData] = useState<RevenueModel>({
    primaryStream: currentApplication?.revenueModel?.primaryStream || {
      type: RevenueStreamType.SUBSCRIPTION,
      description: '',
      percentage: 100,
    },
    secondaryStreams: currentApplication?.revenueModel?.secondaryStreams || [],
    pricing: currentApplication?.revenueModel?.pricing || '',
    unitEconomics: currentApplication?.revenueModel?.unitEconomics || '',
  });

  // Update form data when currentApplication loads from draft
  useEffect(() => {
    if (currentApplication?.revenueModel) {
      setFormData({
        primaryStream: currentApplication.revenueModel.primaryStream || {
          type: RevenueStreamType.SUBSCRIPTION,
          description: '',
          percentage: 100,
        },
        secondaryStreams: currentApplication.revenueModel.secondaryStreams || [],
        pricing: currentApplication.revenueModel.pricing || '',
        unitEconomics: currentApplication.revenueModel.unitEconomics || '',
      });
    }
  }, [currentApplication]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const addSecondaryStream = () => {
    setFormData((prev) => ({
      ...prev,
      secondaryStreams: [
        ...prev.secondaryStreams,
        { type: RevenueStreamType.SUBSCRIPTION, description: '', percentage: '' as any },
      ],
    }));
  };

  const removeSecondaryStream = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      secondaryStreams: prev.secondaryStreams.filter((_: any, i: number) => i !== index),
    }));
  };

  const updateSecondaryStream = (
    index: number,
    field: keyof RevenueStream,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      secondaryStreams: prev.secondaryStreams.map((stream: RevenueStream, i: number) =>
        i === index ? { ...stream, [field]: value } : stream
      ),
    }));
  };

  const calculateTotalPercentage = (): number => {
    return (
      (Number(formData.primaryStream.percentage) || 0) +
      formData.secondaryStreams.reduce((sum: number, s: RevenueStream) => sum + (Number(s.percentage) || 0), 0)
    );
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.primaryStream.description.trim()) {
      newErrors.primaryDescription = 'Primary revenue stream description is required';
    }

    if (formData.primaryStream.percentage <= 0 || formData.primaryStream.percentage > 100) {
      newErrors.primaryPercentage = 'Percentage must be between 1 and 100';
    }

    const totalPercentage = calculateTotalPercentage();
    if (totalPercentage !== 100) {
      newErrors.totalPercentage = `Total percentage must be 100% (currently ${totalPercentage}%)`;
    }

    formData.secondaryStreams.forEach((stream: RevenueStream, index: number) => {
      if (!stream.description.trim()) {
        newErrors[`secondary_${index}_description`] = 'Description is required';
      }
      if (stream.percentage <= 0) {
        newErrors[`secondary_${index}_percentage`] = 'Percentage must be greater than 0';
      }
    });

    if (!formData.pricing.trim()) {
      newErrors.pricing = 'Pricing strategy is required';
    } else if (formData.pricing.length < 50) {
      newErrors.pricing = 'Pricing strategy must be at least 50 characters';
    }

    if (!formData.unitEconomics.trim()) {
      newErrors.unitEconomics = 'Unit economics is required';
    } else if (formData.unitEconomics.length < 50) {
      newErrors.unitEconomics = 'Unit economics must be at least 50 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await addRevenueStream(formData);
    }
  };

  const revenueTypes = Object.values(RevenueStreamType);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Revenue Model</h2>
        <p className="mt-1 text-sm text-gray-600">Define your revenue streams and business model</p>
      </div>

      {/* Primary Revenue Stream */}
      <div className="rounded-lg border border-gray-200 p-6 space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Primary Revenue Stream</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="primaryType" className="block text-sm font-medium text-gray-700">
              Revenue Type <span className="text-red-500">*</span>
            </label>
            <select
              id="primaryType"
              value={formData.primaryStream.type}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  primaryStream: {
                    ...prev.primaryStream,
                    type: e.target.value as RevenueStreamType,
                  },
                }))
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {revenueTypes.map((type) => (
                <option key={type} value={type}>
                  {type.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="primaryPercentage" className="block text-sm font-medium text-gray-700">
              Revenue % <span className="text-red-500">*</span>
            </label>
            <input
              id="primaryPercentage"
              type="number"
              min="0"
              max="100"
              value={formData.primaryStream.percentage}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  primaryStream: { ...prev.primaryStream, percentage: e.target.value === '' ? '' as any : Number(e.target.value) },
                }));
                setErrors((prev) => ({ ...prev, primaryPercentage: '', totalPercentage: '' }));
              }}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                errors.primaryPercentage ? 'border-red-300' : ''
              }`}
            />
            {errors.primaryPercentage && (
              <p className="mt-1 text-sm text-red-500">{errors.primaryPercentage}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="primaryDescription" className="block text-sm font-medium text-gray-700">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="primaryDescription"
            value={formData.primaryStream.description}
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                primaryStream: { ...prev.primaryStream, description: e.target.value },
              }));
              setErrors((prev) => ({ ...prev, primaryDescription: '' }));
            }}
            rows={3}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors.primaryDescription ? 'border-red-300' : ''
            }`}
            placeholder="Describe how this revenue stream works..."
          />
          {errors.primaryDescription && (
            <p className="mt-1 text-sm text-red-500">{errors.primaryDescription}</p>
          )}
        </div>
      </div>

      {/* Secondary Revenue Streams */}
      <div className="rounded-lg border border-gray-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Secondary Revenue Streams</h3>
          <button
            type="button"
            onClick={addSecondaryStream}
            className="inline-flex items-center rounded-md bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100"
          >
            <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Stream
          </button>
        </div>

        {formData.secondaryStreams.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            No secondary revenue streams added (optional)
          </p>
        ) : (
          formData.secondaryStreams.map((stream: RevenueStream, index: number) => (
            <div key={index} className="rounded-lg border border-gray-200 p-4 space-y-3">
              <div className="flex items-start justify-between">
                <span className="text-sm font-medium text-gray-700">Stream {index + 1}</span>
                <button
                  type="button"
                  onClick={() => removeSecondaryStream(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Revenue Type</label>
                  <select
                    value={stream.type}
                    onChange={(e) =>
                      updateSecondaryStream(index, 'type', e.target.value as RevenueStreamType)
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    {revenueTypes.map((type) => (
                      <option key={type} value={type}>
                        {type.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Revenue %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={stream.percentage}
                    onChange={(e) => {
                      updateSecondaryStream(index, 'percentage', e.target.value === '' ? '' : Number(e.target.value));
                      setErrors((prev) => ({
                        ...prev,
                        [`secondary_${index}_percentage`]: '',
                        totalPercentage: '',
                      }));
                    }}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                      errors[`secondary_${index}_percentage`] ? 'border-red-300' : ''
                    }`}
                  />
                  {errors[`secondary_${index}_percentage`] && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors[`secondary_${index}_percentage`]}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={stream.description}
                  onChange={(e) => {
                    updateSecondaryStream(index, 'description', e.target.value);
                    setErrors((prev) => ({ ...prev, [`secondary_${index}_description`]: '' }));
                  }}
                  rows={2}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                    errors[`secondary_${index}_description`] ? 'border-red-300' : ''
                  }`}
                  placeholder="Describe this revenue stream..."
                />
                {errors[`secondary_${index}_description`] && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors[`secondary_${index}_description`]}
                  </p>
                )}
              </div>
            </div>
          ))
        )}

        {/* Total Percentage Indicator */}
        <div
          className={`rounded-lg p-4 ${
            calculateTotalPercentage() === 100
              ? 'bg-green-50 border border-green-200'
              : 'bg-yellow-50 border border-yellow-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">Total Revenue Distribution</span>
            <span
              className={`text-xl font-bold ${
                calculateTotalPercentage() === 100 ? 'text-green-600' : 'text-yellow-600'
              }`}
            >
              {calculateTotalPercentage()}%
            </span>
          </div>
          {errors.totalPercentage && (
            <p className="mt-2 text-sm text-red-500">{errors.totalPercentage}</p>
          )}
        </div>
      </div>

      {/* Pricing Strategy */}
      <div>
        <label htmlFor="pricing" className="block text-sm font-medium text-gray-700">
          Pricing Strategy <span className="text-red-500">*</span>
        </label>
        <textarea
          id="pricing"
          value={formData.pricing}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, pricing: e.target.value }));
            setErrors((prev) => ({ ...prev, pricing: '' }));
          }}
          rows={4}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
            errors.pricing ? 'border-red-300' : ''
          }`}
          placeholder="Describe your pricing model, tiers, and strategy..."
        />
        <div className="mt-1 flex justify-between text-sm">
          <span className={errors.pricing ? 'text-red-500' : 'text-gray-500'}>
            {errors.pricing || `${formData.pricing.length} / 50 minimum characters`}
          </span>
        </div>
      </div>

      {/* Unit Economics */}
      <div>
        <label htmlFor="unitEconomics" className="block text-sm font-medium text-gray-700">
          Unit Economics <span className="text-red-500">*</span>
        </label>
        <textarea
          id="unitEconomics"
          value={formData.unitEconomics}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, unitEconomics: e.target.value }));
            setErrors((prev) => ({ ...prev, unitEconomics: '' }));
          }}
          rows={4}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
            errors.unitEconomics ? 'border-red-300' : ''
          }`}
          placeholder="Explain CAC, LTV, margins, and profitability metrics..."
        />
        <div className="mt-1 flex justify-between text-sm">
          <span className={errors.unitEconomics ? 'text-red-500' : 'text-gray-500'}>
            {errors.unitEconomics || `${formData.unitEconomics.length} / 50 minimum characters`}
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
