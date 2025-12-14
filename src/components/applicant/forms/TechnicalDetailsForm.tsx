/**
 * Step 3: Technical Details Form
 * Collects technical specifications and market information
 */
'use client';

import { useState, useEffect } from 'react';
import { useApplicant } from '@/hooks/useApplicant';
import { TechnicalSpec, MarketInfo } from '@/types/applicant.types';

interface TechnicalDetailsFormData {
  technicalSpec: TechnicalSpec;
  marketInfo: MarketInfo;
}

export default function TechnicalDetailsForm() {
  const { addTechnicalDetails, isLoading, goToPreviousStep, currentApplication } = useApplicant();

  const [formData, setFormData] = useState<TechnicalDetailsFormData>({
    technicalSpec: currentApplication?.technicalSpec || {
      description: '',
      techStack: [],
      prototype: '',
    },
    marketInfo: currentApplication?.marketInfo || {
      totalAddressableMarket: '',
      serviceableMarket: '',
      obtainableMarket: '',
      competitorAnalysis: '',
    },
  });

  const [newTech, setNewTech] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addTechStack = () => {
    if (newTech.trim()) {
      setFormData((prev) => ({
        ...prev,
        technicalSpec: {
          ...prev.technicalSpec,
          techStack: [...prev.technicalSpec.techStack, newTech.trim()],
        },
      }));
      setNewTech('');
    }
  };

  const removeTechStack = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      technicalSpec: {
        ...prev.technicalSpec,
        techStack: prev.technicalSpec.techStack.filter((_: any, i: number) => i !== index),
      },
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.technicalSpec.description.trim()) {
      newErrors.description = 'Technical description is required';
    } else if (formData.technicalSpec.description.length < 100) {
      newErrors.description = 'Description must be at least 100 characters';
    }

    if (formData.technicalSpec.techStack.length === 0) {
      newErrors.techStack = 'Add at least one technology';
    }

    if (formData.technicalSpec.prototype && !isValidUrl(formData.technicalSpec.prototype)) {
      newErrors.prototype = 'Invalid URL format';
    }

    if (!formData.marketInfo.totalAddressableMarket.trim()) {
      newErrors.totalAddressableMarket = 'Total Addressable Market is required';
    }

    if (!formData.marketInfo.serviceableMarket.trim()) {
      newErrors.serviceableMarket = 'Serviceable Addressable Market is required';
    }

    if (!formData.marketInfo.obtainableMarket.trim()) {
      newErrors.obtainableMarket = 'Serviceable Obtainable Market is required';
    }

    if (!formData.marketInfo.competitorAnalysis.trim()) {
      newErrors.competitorAnalysis = 'Competitor analysis is required';
    } else if (formData.marketInfo.competitorAnalysis.length < 100) {
      newErrors.competitorAnalysis = 'Competitor analysis must be at least 100 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await addTechnicalDetails(formData.technicalSpec, formData.marketInfo);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Technical Details</h2>
        <p className="mt-1 text-sm text-gray-600">
          Describe your technical implementation and market analysis
        </p>
      </div>

      {/* Technical Specification Section */}
      <div className="rounded-lg border border-gray-200 p-6 space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Technical Specification</h3>

        {/* Technical Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Technical Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            value={formData.technicalSpec.description}
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                technicalSpec: { ...prev.technicalSpec, description: e.target.value },
              }));
              setErrors((prev) => ({ ...prev, description: '' }));
            }}
            rows={6}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors.description ? 'border-red-300' : ''
            }`}
            placeholder="Describe your technical approach, architecture, and implementation details..."
          />
          <div className="mt-1 flex justify-between text-sm">
            <span className={errors.description ? 'text-red-500' : 'text-gray-500'}>
              {errors.description ||
                `${formData.technicalSpec.description.length} / 100 minimum characters`}
            </span>
          </div>
        </div>

        {/* Tech Stack */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Technology Stack <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 flex gap-2">
            <input
              type="text"
              value={newTech}
              onChange={(e) => {
                setNewTech(e.target.value);
                setErrors((prev) => ({ ...prev, techStack: '' }));
              }}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTechStack())}
              className={`block flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                errors.techStack ? 'border-red-300' : ''
              }`}
              placeholder="e.g., React, Node.js, PostgreSQL"
            />
            <button
              type="button"
              onClick={addTechStack}
              className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          {errors.techStack && <p className="mt-1 text-sm text-red-500">{errors.techStack}</p>}
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.technicalSpec.techStack.map((tech: string, index: number) => (
              <span
                key={index}
                className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
              >
                {tech}
                <button
                  type="button"
                  onClick={() => removeTechStack(index)}
                  className="ml-2 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-blue-200"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Prototype URL */}
        <div>
          <label htmlFor="prototype" className="block text-sm font-medium text-gray-700">
            Prototype/Demo URL (Optional)
          </label>
          <input
            id="prototype"
            type="text"
            value={formData.technicalSpec.prototype}
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                technicalSpec: { ...prev.technicalSpec, prototype: e.target.value },
              }));
              setErrors((prev) => ({ ...prev, prototype: '' }));
            }}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors.prototype ? 'border-red-300' : ''
            }`}
            placeholder="https://your-prototype.com"
          />
          {errors.prototype && <p className="mt-1 text-sm text-red-500">{errors.prototype}</p>}
        </div>
      </div>

      {/* Market Information Section */}
      <div className="rounded-lg border border-gray-200 p-6 space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Market Information</h3>

        {/* TAM */}
        <div>
          <label
            htmlFor="totalAddressableMarket"
            className="block text-sm font-medium text-gray-700"
          >
            TAM - Total Addressable Market <span className="text-red-500">*</span>
          </label>
          <input
            id="totalAddressableMarket"
            type="text"
            value={formData.marketInfo.totalAddressableMarket}
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                marketInfo: { ...prev.marketInfo, totalAddressableMarket: e.target.value },
              }));
              setErrors((prev) => ({ ...prev, totalAddressableMarket: '' }));
            }}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors.totalAddressableMarket ? 'border-red-300' : ''
            }`}
            placeholder="e.g., $10B global market for AI-powered analytics"
          />
          {errors.totalAddressableMarket && (
            <p className="mt-1 text-sm text-red-500">{errors.totalAddressableMarket}</p>
          )}
        </div>

        {/* SAM */}
        <div>
          <label htmlFor="serviceableMarket" className="block text-sm font-medium text-gray-700">
            SAM - Serviceable Addressable Market <span className="text-red-500">*</span>
          </label>
          <input
            id="serviceableMarket"
            type="text"
            value={formData.marketInfo.serviceableMarket}
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                marketInfo: { ...prev.marketInfo, serviceableMarket: e.target.value },
              }));
              setErrors((prev) => ({ ...prev, serviceableMarket: '' }));
            }}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors.serviceableMarket ? 'border-red-300' : ''
            }`}
            placeholder="e.g., $2B in North America"
          />
          {errors.serviceableMarket && (
            <p className="mt-1 text-sm text-red-500">{errors.serviceableMarket}</p>
          )}
        </div>

        {/* SOM */}
        <div>
          <label htmlFor="obtainableMarket" className="block text-sm font-medium text-gray-700">
            SOM - Serviceable Obtainable Market <span className="text-red-500">*</span>
          </label>
          <input
            id="obtainableMarket"
            type="text"
            value={formData.marketInfo.obtainableMarket}
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                marketInfo: { ...prev.marketInfo, obtainableMarket: e.target.value },
              }));
              setErrors((prev) => ({ ...prev, obtainableMarket: '' }));
            }}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors.obtainableMarket ? 'border-red-300' : ''
            }`}
            placeholder="e.g., $100M in first 3 years"
          />
          {errors.obtainableMarket && (
            <p className="mt-1 text-sm text-red-500">{errors.obtainableMarket}</p>
          )}
        </div>

        {/* Competitor Analysis */}
        <div>
          <label htmlFor="competitorAnalysis" className="block text-sm font-medium text-gray-700">
            Competitor Analysis <span className="text-red-500">*</span>
          </label>
          <textarea
            id="competitorAnalysis"
            value={formData.marketInfo.competitorAnalysis}
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                marketInfo: { ...prev.marketInfo, competitorAnalysis: e.target.value },
              }));
              setErrors((prev) => ({ ...prev, competitorAnalysis: '' }));
            }}
            rows={5}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors.competitorAnalysis ? 'border-red-300' : ''
            }`}
            placeholder="Analyze your competitors, their strengths, weaknesses, and your competitive advantages..."
          />
          <div className="mt-1 flex justify-between text-sm">
            <span className={errors.competitorAnalysis ? 'text-red-500' : 'text-gray-500'}>
              {errors.competitorAnalysis ||
                `${formData.marketInfo.competitorAnalysis.length} / 100 minimum characters`}
            </span>
          </div>
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
