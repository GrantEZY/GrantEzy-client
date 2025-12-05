/**
 * File Upload Component with Cloudinary Integration
 * Reusable component for uploading files with drag-and-drop support
 */

"use client";

import React, { useRef, useState } from "react";

import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";

import { CLOUDINARY_CONFIG } from "@/lib/config/cloudinary.config";

import { getViewableUrl } from "@/utils/cloudinary.util";

/**
 * File Upload Component with Cloudinary Integration
 * Reusable component for uploading files with drag-and-drop support
 */

export interface FileUploadProps {
  /**
   * Callback when file is successfully uploaded
   */
  onUploadSuccess: (result: {
    url: string;
    publicId: string;
    fileName: string;
    fileSize: string;
    mimeType: string;
  }) => void;

  /**
   * Callback when upload fails
   */
  onUploadError?: (error: string) => void;

  /**
   * Label for the upload button
   */
  label?: string;

  /**
   * Description text
   */
  description?: string;

  /**
   * Allowed file formats
   */
  allowedFormats?: readonly string[];

  /**
   * Maximum file size in MB
   */
  maxSizeMB?: number;

  /**
   * Cloudinary folder path
   */
  folder?: string;

  /**
   * Accept attribute for file input
   */
  accept?: string;

  /**
   * Whether upload is required
   */
  required?: boolean;

  /**
   * Custom class name
   */
  className?: string;

  /**
   * Show preview after upload
   */
  showPreview?: boolean;

  /**
   * Existing file URL (for editing)
   */
  existingFileUrl?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUploadSuccess,
  onUploadError,
  label = "Upload File",
  description,
  allowedFormats = CLOUDINARY_CONFIG.ALLOWED_FORMATS.DOCUMENTS,
  maxSizeMB = 10,
  folder = CLOUDINARY_CONFIG.FOLDERS.APPLICATION_DOCUMENTS,
  accept,
  required = false,
  className = "",
  showPreview = true,
  existingFileUrl,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{
    url: string;
    fileName: string;
  } | null>(
    existingFileUrl
      ? { url: existingFileUrl, fileName: "Existing file" }
      : null,
  );

  const { uploadFile, uploading, error, formatFileSize, getMimeType } =
    useCloudinaryUpload();

  const handleFileSelect = async (file: File) => {
    try {
      const result = await uploadFile(file, {
        folder,
        resourceType: "auto",
        tags: ["application_document"],
      });

      if (result) {
        // Use getViewableUrl to ensure PDFs open inline instead of downloading
        const viewableUrl = getViewableUrl(result.secure_url);

        const uploadData = {
          url: viewableUrl,
          publicId: result.public_id,
          fileName: file.name,
          fileSize: formatFileSize(result.bytes),
          mimeType: getMimeType(file.name),
        };

        setUploadedFile({
          url: viewableUrl,
          fileName: file.name,
        });

        onUploadSuccess(uploadData);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Upload failed";
      if (onUploadError) {
        onUploadError(errorMsg);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemove = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getAcceptAttribute = () => {
    if (accept) return accept;
    return allowedFormats.map((format) => `.${format}`).join(",");
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      {/* Description */}
      {description && <p className="text-sm text-gray-500">{description}</p>}

      {/* Upload Area */}
      {!uploadedFile ? (
        <div
          className={`rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          } ${uploading ? "pointer-events-none opacity-50" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={getAcceptAttribute()}
            onChange={handleInputChange}
            className="hidden"
            disabled={uploading}
          />

          {uploading ? (
            <div className="space-y-2">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="text-sm text-gray-600">Uploading...</p>
            </div>
          ) : (
            <>
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
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                >
                  Choose File
                </button>
                <p className="mt-2 text-xs text-gray-500">
                  or drag and drop here
                </p>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                {allowedFormats.join(", ").toUpperCase()} up to {maxSizeMB}MB
              </p>
            </>
          )}
        </div>
      ) : (
        showPreview && (
          <div className="rounded-lg border border-gray-300 bg-gray-50 p-4">
            <div className="flex items-center justify-between">
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
                  <p className="text-sm font-medium text-gray-900">
                    {uploadedFile.fileName}
                  </p>
                  <p className="text-xs text-gray-500">Uploaded successfully</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemove}
                className="text-sm font-medium text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          </div>
        )
      )}

      {/* Error Message */}
      {error && (
        <div className="rounded-md bg-red-50 p-3">
          <div className="flex">
            <svg
              className="h-5 w-5 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p className="ml-3 text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};
