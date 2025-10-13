/**
 * Step 6: Documents Form
 * Collects: 6 required documents + optional otherDocuments[]
 * Uploads files to Cloudinary before saving to database
 */
"use client";

import { useState } from "react";
import { useApplicant } from "@/hooks/useApplicant";
import { Document } from "@/types/applicant.types";
import { FileUpload } from "@/components/ui/FileUpload";
import { CLOUDINARY_CONFIG } from "@/lib/config/cloudinary.config";

interface DocumentUpload {
  endorsementLetter: Document | null;
  plagiarismUndertaking: Document | null;
  ageProof: Document | null;
  aadhar: Document | null;
  piCertificate: Document | null;
  coPiCertificate: Document | null;
  otherDocuments: Document[];
}

const REQUIRED_DOCUMENTS = [
  {
    key: "endorsementLetter" as const,
    label: "Endorsement Letter",
    description: "Letter signed by the head of institution",
  },
  {
    key: "plagiarismUndertaking" as const,
    label: "Plagiarism Undertaking",
    description: "Signed undertaking against plagiarism",
  },
  {
    key: "ageProof" as const,
    label: "Age Proof",
    description: "Valid age proof document",
  },
  {
    key: "aadhar" as const,
    label: "Aadhar Card",
    description: "Scanned copy of Aadhar card",
  },
  {
    key: "piCertificate" as const,
    label: "PI Certificate",
    description: "Principal Investigator certificate",
  },
  {
    key: "coPiCertificate" as const,
    label: "Co-PI Certificate",
    description: "Co-Principal Investigator certificate",
  },
];

export default function DocumentsForm() {
  const { addDocuments, isLoading, goToPreviousStep, currentApplication } = useApplicant();

  const [documents, setDocuments] = useState<DocumentUpload>({
    endorsementLetter: currentApplication?.documents?.endorsementLetter || null,
    plagiarismUndertaking: currentApplication?.documents?.plagiarismUndertaking || null,
    ageProof: currentApplication?.documents?.ageProof || null,
    aadhar: currentApplication?.documents?.aadhar || null,
    piCertificate: currentApplication?.documents?.piCertificate || null,
    coPiCertificate: currentApplication?.documents?.coPiCertificate || null,
    otherDocuments: currentApplication?.documents?.otherDocuments || [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDocumentUpload = (
    field: keyof Omit<DocumentUpload, "otherDocuments">,
    uploadResult: {
      url: string;
      publicId: string;
      fileName: string;
      fileSize: string;
      mimeType: string;
    }
  ) => {
    const document: Document = {
      title: REQUIRED_DOCUMENTS.find((d) => d.key === field)?.label || field,
      description: REQUIRED_DOCUMENTS.find((d) => d.key === field)?.description || "",
      fileName: uploadResult.fileName,
      fileSize: uploadResult.fileSize,
      mimeType: uploadResult.mimeType,
      storageUrl: uploadResult.url,
      metaData: {
        publicId: uploadResult.publicId,
        uploadedAt: new Date().toISOString(),
      },
    };

    setDocuments((prev) => ({ ...prev, [field]: document }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleOtherDocumentUpload = (uploadResult: {
    url: string;
    publicId: string;
    fileName: string;
    fileSize: string;
    mimeType: string;
  }) => {
    const document: Document = {
      title: uploadResult.fileName,
      description: "Additional document",
      fileName: uploadResult.fileName,
      fileSize: uploadResult.fileSize,
      mimeType: uploadResult.mimeType,
      storageUrl: uploadResult.url,
      metaData: {
        publicId: uploadResult.publicId,
        uploadedAt: new Date().toISOString(),
      },
    };

    setDocuments((prev) => ({
      ...prev,
      otherDocuments: [...prev.otherDocuments, document],
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

    REQUIRED_DOCUMENTS.forEach((doc) => {
      if (!documents[doc.key]) {
        newErrors[doc.key] = `${doc.label} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Ensure all required documents are present
    const documentsToSubmit = {
      endorsementLetter: documents.endorsementLetter!,
      plagiarismUndertaking: documents.plagiarismUndertaking!,
      ageProof: documents.ageProof!,
      aadhar: documents.aadhar!,
      piCertificate: documents.piCertificate!,
      coPiCertificate: documents.coPiCertificate!,
      otherDocuments: documents.otherDocuments.length > 0 ? documents.otherDocuments : undefined,
    };

    const success = await addDocuments(documentsToSubmit);
    
    if (!success) {
      setIsSubmitting(false);
    }
  };

  const allRequiredDocsUploaded = REQUIRED_DOCUMENTS.every(
    (doc) => documents[doc.key] !== null
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Document Upload</h2>
        <p className="mt-1 text-sm text-gray-600">
          Upload all required documents for your application. Files will be securely stored.
        </p>
      </div>

      {/* Required Documents */}
      <div className="rounded-lg border border-gray-200 p-6 space-y-6">
        <h3 className="text-lg font-medium text-gray-900">Required Documents</h3>
        {REQUIRED_DOCUMENTS.map((doc) => (
          <div key={doc.key} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
            <FileUpload
              label={doc.label}
              description={doc.description}
              required={true}
              allowedFormats={CLOUDINARY_CONFIG.ALLOWED_FORMATS.DOCUMENTS}
              folder={`${CLOUDINARY_CONFIG.FOLDERS.APPLICATION_DOCUMENTS}/${doc.key}`}
              onUploadSuccess={(result) => handleDocumentUpload(doc.key, result)}
              onUploadError={(error) => setErrors((prev) => ({ ...prev, [doc.key]: error }))}
              existingFileUrl={documents[doc.key]?.storageUrl}
              maxSizeMB={10}
              showPreview={true}
            />
            {errors[doc.key] && (
              <p className="mt-2 text-sm text-red-600">{errors[doc.key]}</p>
            )}
          </div>
        ))}
      </div>

      {/* Other Documents */}
      <div className="rounded-lg border border-gray-200 p-6 space-y-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            Additional Documents{" "}
            <span className="text-sm font-normal text-gray-500">(Optional)</span>
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            Upload any other relevant documents that support your application
          </p>
        </div>

        {documents.otherDocuments.length > 0 && (
          <div className="space-y-2">
            {documents.otherDocuments.map((doc: Document, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <svg
                    className="h-8 w-8 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{doc.fileName}</p>
                    <p className="text-xs text-gray-500">{doc.fileSize}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeOtherDocument(index)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        <FileUpload
          label="Upload Additional Document"
          description="PDF, DOC, DOCX up to 10MB"
          allowedFormats={CLOUDINARY_CONFIG.ALLOWED_FORMATS.DOCUMENTS}
          folder={`${CLOUDINARY_CONFIG.FOLDERS.APPLICATION_DOCUMENTS}/other`}
          onUploadSuccess={handleOtherDocumentUpload}
          required={false}
          maxSizeMB={10}
          showPreview={false}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={goToPreviousStep}
          disabled={isLoading || isSubmitting}
          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>

        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            {REQUIRED_DOCUMENTS.filter((doc) => documents[doc.key]).length} / {REQUIRED_DOCUMENTS.length} required
          </span>
          <button
            type="submit"
            disabled={!allRequiredDocsUploaded || isLoading || isSubmitting}
            className="inline-flex items-center rounded-md bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading || isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Saving...
              </>
            ) : (
              <>
                Continue
                <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Help Section */}
      <div className="rounded-md bg-blue-50 p-4">
        <div className="flex">
          <svg className="h-5 w-5 text-blue-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
          </svg>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Upload Guidelines</h3>
            <ul className="mt-2 text-sm text-blue-700 list-disc pl-5 space-y-1">
              <li>All documents must be in PDF, DOC, or DOCX format</li>
              <li>Maximum file size: 10MB per document</li>
              <li>Files are securely uploaded to Cloudinary CDN</li>
              <li>Ensure documents are clear and legible</li>
            </ul>
          </div>
        </div>
      </div>
    </form>
  );
}
