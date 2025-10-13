/**
 * Step 6: Documents Form
 * Collects: 6 required documents + optional otherDocuments[]
 * Note: This is a simplified version - actual file upload logic will need backend integration
 */
"use client";

import { useState } from "react";
import { useApplicant } from "@/hooks/useApplicant";
import { Document } from "@/types/applicant.types";

interface DocumentUpload {
  endorsementLetter: Document | null;
  plagiarismUndertaking: Document | null;
  ageProof: Document | null;
  aadhar: Document | null;
  piCertificate: Document | null;
  coPiCertificate: Document | null;
  otherDocuments: Document[];
}

export default function DocumentsForm() {
  const { addDocuments, isLoading, goToPreviousStep } = useApplicant();

  const [documents, setDocuments] = useState<DocumentUpload>({
    endorsementLetter: null,
    plagiarismUndertaking: null,
    ageProof: null,
    aadhar: null,
    piCertificate: null,
    coPiCertificate: null,
    otherDocuments: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  // Mock file upload handler - replace with actual upload logic
  const handleFileUpload = async (
    file: File,
    field: keyof Omit<DocumentUpload, "otherDocuments">
  ): Promise<Document | null> => {
    try {
      // Validate file
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        setErrors((prev) => ({ ...prev, [field]: "File size must be less than 10MB" }));
        return null;
      }

      // Simulate upload progress
      setUploadProgress((prev) => ({ ...prev, [field]: 0 }));
      for (let i = 0; i <= 100; i += 20) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        setUploadProgress((prev) => ({ ...prev, [field]: i }));
      }

      // TODO: Replace with actual file upload to storage service
      const mockDocument: Document = {
        title: file.name,
        description: `${field} document`,
        fileName: file.name,
        fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        mimeType: file.type,
        storageUrl: `https://storage.example.com/${file.name}`, // Mock URL
        metaData: {
          uploadedAt: new Date().toISOString(),
        },
      };

      setDocuments((prev) => ({ ...prev, [field]: mockDocument }));
      setErrors((prev) => ({ ...prev, [field]: "" }));
      setUploadProgress((prev) => ({ ...prev, [field]: 100 }));
      
      return mockDocument;
    } catch (error) {
      setErrors((prev) => ({ ...prev, [field]: "Upload failed. Please try again." }));
      return null;
    }
  };

  const handleOtherDocumentUpload = async (file: File) => {
    const mockDocument: Document = {
      title: file.name,
      description: "Additional document",
      fileName: file.name,
      fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      mimeType: file.type,
      storageUrl: `https://storage.example.com/${file.name}`,
      metaData: {
        uploadedAt: new Date().toISOString(),
      },
    };
    setDocuments((prev) => ({
      ...prev,
      otherDocuments: [...prev.otherDocuments, mockDocument],
    }));
  };

  const removeOtherDocument = (index: number) => {
    setDocuments((prev) => ({
      ...prev,
      otherDocuments: prev.otherDocuments.filter((_: any, i: number) => i !== index),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!documents.endorsementLetter) newErrors.endorsementLetter = "Endorsement letter is required";
    if (!documents.plagiarismUndertaking) newErrors.plagiarismUndertaking = "Plagiarism undertaking is required";
    if (!documents.ageProof) newErrors.ageProof = "Age proof is required";
    if (!documents.aadhar) newErrors.aadhar = "Aadhar card is required";
    if (!documents.piCertificate) newErrors.piCertificate = "PI certificate is required";
    if (!documents.coPiCertificate) newErrors.coPiCertificate = "Co-PI certificate is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await addDocuments({
        endorsementLetter: documents.endorsementLetter!,
        plagiarismUndertaking: documents.plagiarismUndertaking!,
        ageProof: documents.ageProof!,
        aadhar: documents.aadhar!,
        piCertificate: documents.piCertificate!,
        coPiCertificate: documents.coPiCertificate!,
        otherDocuments: documents.otherDocuments.length > 0 ? documents.otherDocuments : undefined,
      });
    }
  };

  const renderFileUpload = (
    label: string,
    field: keyof Omit<DocumentUpload, "otherDocuments">,
    acceptedTypes: string = ".pdf,.doc,.docx"
  ) => {
    const doc = documents[field];
    const progress = uploadProgress[field];

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700">
          {label} <span className="text-red-500">*</span>
        </label>
        
        {!doc ? (
          <div className="mt-1">
            <label
              htmlFor={field}
              className={`flex justify-center rounded-lg border-2 border-dashed px-6 py-10 cursor-pointer hover:border-blue-400 ${
                errors[field] ? "border-red-300" : "border-gray-300"
              }`}
            >
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="mt-4 flex text-sm leading-6 text-gray-600">
                  <span className="font-semibold text-blue-600">Upload a file</span>
                  <span className="ml-1">or drag and drop</span>
                </div>
                <p className="text-xs leading-5 text-gray-600">PDF, DOC, DOCX up to 10MB</p>
              </div>
            </label>
            <input
              id={field}
              type="file"
              accept={acceptedTypes}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file, field);
              }}
              className="sr-only"
            />
            {errors[field] && <p className="mt-1 text-sm text-red-500">{errors[field]}</p>}
            {progress !== undefined && progress < 100 && (
              <div className="mt-2">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-1 flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-4 py-3">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-sm font-medium text-gray-900">{doc.fileName}</p>
                <p className="text-xs text-gray-500">{doc.fileSize}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setDocuments((prev) => ({ ...prev, [field]: null }))}
              className="text-red-600 hover:text-red-700"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Document Upload</h2>
        <p className="mt-1 text-sm text-gray-600">
          Upload all required documents for your application
        </p>
      </div>

      {/* Required Documents */}
      <div className="rounded-lg border border-gray-200 p-6 space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Required Documents</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderFileUpload("Endorsement Letter", "endorsementLetter")}
          {renderFileUpload("Plagiarism Undertaking", "plagiarismUndertaking")}
          {renderFileUpload("Age Proof", "ageProof")}
          {renderFileUpload("Aadhar Card", "aadhar")}
          {renderFileUpload("PI Certificate", "piCertificate")}
          {renderFileUpload("Co-PI Certificate", "coPiCertificate")}
        </div>
      </div>

      {/* Other Documents */}
      <div className="rounded-lg border border-gray-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Additional Documents (Optional)</h3>
          <label
            htmlFor="otherDocs"
            className="inline-flex items-center rounded-md bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100 cursor-pointer"
          >
            <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Document
          </label>
          <input
            id="otherDocs"
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleOtherDocumentUpload(file);
            }}
            className="sr-only"
          />
        </div>

        {documents.otherDocuments.length > 0 ? (
          <div className="space-y-2">
            {documents.otherDocuments.map((doc: Document, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{doc.fileName}</p>
                  <p className="text-xs text-gray-500">{doc.fileSize}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeOtherDocument(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">No additional documents added</p>
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
