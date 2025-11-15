/**
 * Cloudinary Configuration
 * Handles media uploads to Cloudinary CDN
 */

export const CLOUDINARY_CONFIG = {
  CLOUD_NAME: "dzw5te0mo",
  API_KEY: "598625579828629",
  UPLOAD_PRESET: "grantezy_uploads", // You'll need to create this in Cloudinary dashboard
  
  // Folder structure for organized uploads
  FOLDERS: {
    APPLICATION_DOCUMENTS: "grantezy/applications/documents",
    USER_AVATARS: "grantezy/users/avatars",
    PROGRAM_IMAGES: "grantezy/programs/images",
    TEMP: "grantezy/temp",
  },
  
  // File upload constraints
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FORMATS: {
    DOCUMENTS: ["pdf", "doc", "docx", "txt"],
    IMAGES: ["jpg", "jpeg", "png", "gif", "webp"],
    ALL: ["pdf", "doc", "docx", "txt", "jpg", "jpeg", "png", "gif", "webp"],
  },
} as const;

export const getCloudinaryUrl = () => {
  return `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.CLOUD_NAME}/upload`;
};

export const getUploadSignature = async (paramsToSign: Record<string, any>) => {
  // For unsigned uploads, we don't need signature
  // For signed uploads, you'd call your backend to generate signature
  return null;
};
