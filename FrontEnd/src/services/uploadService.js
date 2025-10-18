import apiClient from "./authService";

/**
 * Upload Service - Automatically determines correct endpoint based on user role
 * Supports both Admin and Instructor file uploads
 */

/**
 * Get user role from localStorage or Redux store
 * @returns {string} User role ('admin', 'instructor', 'student', etc.)
 */
const getUserRole = () => {
  try {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    return currentUser?.role?.toLowerCase() || "student";
  } catch (error) {
    console.error("Error getting user role:", error);
    return "student";
  }
};

/**
 * Get role-based endpoint helper function
 * @param {string} instructorPath - Path for instructor role
 * @param {string} adminPath - Path for admin role
 * @returns {string} Appropriate endpoint based on user role
 */
const getRoleBasedEndpoint = (instructorPath, adminPath) => {
  const role = getUserRole();
  
  if (role === "instructor") {
    return instructorPath;
  }
  
  if (role === "admin") {
    return adminPath;
  }
  
  // Default to instructor for backward compatibility
  return instructorPath;
};

/**
 * Get upload endpoint based on user role
 * @returns {string} Upload endpoint path
 */
const getUploadEndpoint = () => {
  return getRoleBasedEndpoint("/instructor/upload", "/admin/upload");
};

/**
 * Get move-file endpoint based on user role
 * @returns {string} Move file endpoint path
 */
const getMoveFileEndpoint = () => {
  return getRoleBasedEndpoint("/instructor/move-to-course", "/admin/move-file");
};

/**
 * Get delete file endpoint based on user role
 * @returns {string} Delete file endpoint path
 */
const getDeleteFileEndpoint = () => {
  return getRoleBasedEndpoint("/instructor/files", "/admin/files");
};

/**
 * Upload a file (thumbnail, trailer, lesson video, etc.)
 * @param {File} file - File to upload
 * @param {Object} options - Upload options
 * @param {string} options.courseId - Course ID (optional)
 * @param {string} options.fileType - File type (thumbnail, trailer, video, etc.)
 * @param {Function} options.onUploadProgress - Progress callback
 * @returns {Promise<Object>} Upload response with URL
 */
export const uploadFile = async (file, options = {}) => {
  const { courseId, fileType, onUploadProgress } = options;
  
  try {
    const formData = new FormData();
    formData.append("file", file);

    // Add optional metadata
    if (courseId) {
      formData.append("courseId", courseId);
    }

    if (fileType) {
      formData.append("fileType", fileType);
    }

    // Get correct endpoint based on role
    const endpoint = getUploadEndpoint();

    console.log(`[Upload Service] Uploading to: ${endpoint}`, {
      fileType,
      courseId,
      role: getUserRole(),
    });

    const response = await apiClient.post(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: onUploadProgress
        ? (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onUploadProgress(percentCompleted);
          }
        : undefined,
    });

    if (!response.data || !response.data.url) {
      throw new Error(response.data?.message || "Upload failed - no URL returned");
    }

    console.log(`[Upload Service] Upload successful:`, response.data.url);
    return response.data;
  } catch (error) {
    console.error("[Upload Service] Upload error:", error);
    
    // Provide more detailed error message
    const errorMessage = error.response?.data?.message 
      || error.message 
      || "Failed to upload file";
    
    throw new Error(errorMessage);
  }
};

/**
 * Move file from temporary folder to course folder
 * @param {Object} params - Move parameters
 * @param {string} params.fromUrl - Source file URL (in temporary folder)
 * @param {string} params.courseId - Target course ID
 * @param {string} params.fileType - File type (thumbnail, trailer, video)
 * @returns {Promise<Object>} Response with new URL
 */
export const moveFileToCourse = async ({ fromUrl, courseId, fileType }) => {
  try {
    const endpoint = getMoveFileEndpoint();

    console.log(`[Upload Service] Moving file to course:`, {
      endpoint,
      fromUrl,
      courseId,
      fileType,
    });

    const response = await apiClient.post(endpoint, {
      fromUrl,
      courseId,
      fileType,
    });

    if (!response.data || !response.data.url) {
      throw new Error(response.data?.message || "Failed to move file");
    }

    console.log(`[Upload Service] File moved successfully:`, response.data.url);
    return response.data;
  } catch (error) {
    console.error("[Upload Service] Move file error:", error);
    
    const errorMessage = error.response?.data?.message 
      || error.message 
      || "Failed to move file";
    
    throw new Error(errorMessage);
  }
};

/**
 * Delete a file
 * @param {string} fileUrl - URL of file to delete
 * @returns {Promise<Object>} Delete response
 */
export const deleteFile = async (fileUrl) => {
  try {
    const endpoint = getDeleteFileEndpoint();

    console.log(`[Upload Service] Deleting file:`, {
      endpoint,
      fileUrl,
    });

    const response = await apiClient.delete(endpoint, {
      data: { fileUrl },
    });

    console.log(`[Upload Service] File deleted successfully`);
    return response.data;
  } catch (error) {
    console.error("[Upload Service] Delete file error:", error);
    
    const errorMessage = error.response?.data?.message 
      || error.message 
      || "Failed to delete file";
    
    throw new Error(errorMessage);
  }
};

/**
 * Get temporary files by folder type
 * @param {string} folderType - Folder type (thumbnail, trailer, video, etc.)
 * @returns {Promise<Array>} List of temporary files
 */
export const getTemporaryFiles = async (folderType) => {
  try {
    const role = getUserRole();
    const endpoint = role === "instructor" 
      ? `/instructor/temporary-files/${folderType}`
      : `/admin/temporary-files/${folderType}`;

    const response = await apiClient.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("[Upload Service] Get temporary files error:", error);
    throw error;
  }
};

/**
 * Get course files by folder type
 * @param {string} courseId - Course ID
 * @param {string} folderType - Folder type (thumbnail, trailer, video, etc.)
 * @returns {Promise<Array>} List of course files
 */
export const getCourseFiles = async (courseId, folderType) => {
  try {
    const role = getUserRole();
    const endpoint = role === "instructor"
      ? `/instructor/courses/${courseId}/files/${folderType}`
      : `/admin/courses/${courseId}/files/${folderType}`;

    const response = await apiClient.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("[Upload Service] Get course files error:", error);
    throw error;
  }
};

const uploadServiceDefault = {
  uploadFile,
  moveFileToCourse,
  deleteFile,
  getTemporaryFiles,
  getCourseFiles,
  getUserRole,
};

export default uploadServiceDefault;
