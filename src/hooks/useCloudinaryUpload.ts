/**
 * Custom hook for file uploads to Cloudinary
 */

import { useState } from "react";
import {
  uploadToCloudinary,
  uploadMultipleToCloudinary,
  validateFile,
  formatFileSize,
  getMimeType,
  CloudinaryUploadResult,
  UploadOptions,
} from "../utils/cloudinary.util";

export interface UploadProgress {
  fileName: string;
  progress: number;
  status: "idle" | "uploading" | "success" | "error";
  error?: string;
  result?: CloudinaryUploadResult;
}

export const useCloudinaryUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress[]>([]);
  const [error, setError] = useState<string | null>(null);

  /**
   * Upload single file
   */
  const uploadFile = async (
    file: File,
    options?: UploadOptions
  ): Promise<CloudinaryUploadResult | null> => {
    setUploading(true);
    setError(null);

    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      setError(validation.error || "File validation failed");
      setUploading(false);
      return null;
    }

    // Initialize progress
    setProgress([
      {
        fileName: file.name,
        progress: 0,
        status: "uploading",
      },
    ]);

    try {
      const result = await uploadToCloudinary(file, options);

      setProgress([
        {
          fileName: file.name,
          progress: 100,
          status: "success",
          result,
        },
      ]);

      setUploading(false);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Upload failed";
      setError(errorMessage);

      setProgress([
        {
          fileName: file.name,
          progress: 0,
          status: "error",
          error: errorMessage,
        },
      ]);

      setUploading(false);
      return null;
    }
  };

  /**
   * Upload multiple files
   */
  const uploadFiles = async (
    files: File[],
    options?: UploadOptions
  ): Promise<(CloudinaryUploadResult | null)[]> => {
    setUploading(true);
    setError(null);

    // Validate all files
    const validations = files.map((file) => ({
      file,
      validation: validateFile(file),
    }));

    const invalidFiles = validations.filter((v) => !v.validation.valid);
    if (invalidFiles.length > 0) {
      const errors = invalidFiles
        .map((v) => `${v.file.name}: ${v.validation.error}`)
        .join(", ");
      setError(errors);
      setUploading(false);
      return [];
    }

    // Initialize progress for all files
    setProgress(
      files.map((file) => ({
        fileName: file.name,
        progress: 0,
        status: "uploading",
      }))
    );

    try {
      const results = await uploadMultipleToCloudinary(files, options);

      setProgress(
        files.map((file, index) => ({
          fileName: file.name,
          progress: 100,
          status: "success",
          result: results[index],
        }))
      );

      setUploading(false);
      return results;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Upload failed";
      setError(errorMessage);

      setProgress(
        files.map((file) => ({
          fileName: file.name,
          progress: 0,
          status: "error",
          error: errorMessage,
        }))
      );

      setUploading(false);
      return [];
    }
  };

  /**
   * Reset upload state
   */
  const reset = () => {
    setUploading(false);
    setProgress([]);
    setError(null);
  };

  return {
    uploadFile,
    uploadFiles,
    uploading,
    progress,
    error,
    reset,
    // Utility functions
    validateFile,
    formatFileSize,
    getMimeType,
  };
};
