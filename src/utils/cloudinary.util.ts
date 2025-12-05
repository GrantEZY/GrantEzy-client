/**
 * Cloudinary Upload Utility
 * Handles file uploads to Cloudinary CDN
 */

import { CLOUDINARY_CONFIG, getCloudinaryUrl } from '../lib/config/cloudinary.config';

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  format: string;
  resource_type: string;
  bytes: number;
  url: string;
  original_filename: string;
}

export interface UploadOptions {
  folder?: string;
  resourceType?: 'image' | 'raw' | 'video' | 'auto';
  publicId?: string;
  tags?: string[];
  context?: Record<string, string>;
}

/**
 * Upload file to Cloudinary
 * @param file - File object from input
 * @param options - Upload configuration options
 * @returns Cloudinary upload result with secure_url
 */
export const uploadToCloudinary = async (
  file: File,
  options: UploadOptions = {}
): Promise<CloudinaryUploadResult> => {
  try {
    const formData = new FormData();

    // Add file
    formData.append('file', file);

    // Add upload preset (required for unsigned uploads)
    formData.append('upload_preset', CLOUDINARY_CONFIG.UPLOAD_PRESET);

    // Add optional parameters
    if (options.folder) {
      formData.append('folder', options.folder);
    }

    if (options.publicId) {
      formData.append('public_id', options.publicId);
    }

    if (options.tags && options.tags.length > 0) {
      formData.append('tags', options.tags.join(','));
    }

    if (options.context) {
      formData.append(
        'context',
        Object.entries(options.context)
          .map(([key, value]) => `${key}=${value}`)
          .join('|')
      );
    }

    // Set resource type
    formData.append('resource_type', options.resourceType || 'auto');

    const response = await fetch(getCloudinaryUrl(), {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Upload failed');
    }

    const result: CloudinaryUploadResult = await response.json();
    return result;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

/**
 * Upload multiple files to Cloudinary
 * @param files - Array of File objects
 * @param options - Upload configuration options
 * @returns Array of upload results
 */
export const uploadMultipleToCloudinary = async (
  files: File[],
  options: UploadOptions = {}
): Promise<CloudinaryUploadResult[]> => {
  const uploadPromises = files.map((file) => uploadToCloudinary(file, options));
  return Promise.all(uploadPromises);
};

/**
 * Validate file before upload
 * @param file - File to validate
 * @param allowedFormats - Array of allowed file extensions
 * @param maxSize - Maximum file size in bytes
 */
export const validateFile = (
  file: File,
  allowedFormats: readonly string[] = CLOUDINARY_CONFIG.ALLOWED_FORMATS.ALL,
  maxSize: number = CLOUDINARY_CONFIG.MAX_FILE_SIZE
): { valid: boolean; error?: string } => {
  // Check file size
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds maximum allowed size of ${maxSize / (1024 * 1024)}MB`,
    };
  }

  // Check file format
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  if (!fileExtension || !allowedFormats.includes(fileExtension)) {
    return {
      valid: false,
      error: `File format .${fileExtension} is not allowed. Allowed formats: ${allowedFormats.join(', ')}`,
    };
  }

  return { valid: true };
};

/**
 * Formats file size in bytes to human-readable format
 * @param bytes - File size in bytes
 * @returns Formatted string (e.g., "1.5 MB")
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Get file MIME type from extension
 * @param filename - Name of the file
 * @returns MIME type string
 */
export const getMimeType = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  const mimeTypes: Record<string, string> = {
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    txt: 'text/plain',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
  };
  return mimeTypes[ext] || 'application/octet-stream';
};

/**
 * Transform Cloudinary URL for proper PDF viewing in browser
 * Adds flags to ensure PDF opens inline instead of downloading
 * @param url - Original Cloudinary URL
 * @returns Transformed URL with viewing flags
 */
export const getViewableUrl = (url: string): string => {
  if (!url || !url.includes('cloudinary.com')) {
    return url;
  }

  // Check if it's a PDF or document
  const isPdf = url.toLowerCase().includes('.pdf') || url.includes('/image/upload/');

  if (isPdf) {
    // Add fl_attachment:false to prevent download and ensure inline viewing
    // Add pg_1 to show first page for PDFs
    const urlParts = url.split('/upload/');
    if (urlParts.length === 2) {
      return `${urlParts[0]}/upload/fl_attachment:false/${urlParts[1]}`;
    }
  }

  return url;
};

/**
 * Get thumbnail URL for document preview
 * @param url - Original Cloudinary URL
 * @returns Thumbnail URL for preview
 */
export const getThumbnailUrl = (url: string, width = 200, height = 200): string => {
  if (!url || !url.includes('cloudinary.com')) {
    return url;
  }

  const urlParts = url.split('/upload/');
  if (urlParts.length === 2) {
    return `${urlParts[0]}/upload/w_${width},h_${height},c_fill,f_jpg,pg_1/${urlParts[1]}`;
  }

  return url;
};
