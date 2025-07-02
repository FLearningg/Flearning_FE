import apiClient from "./authService";

// Get all users (with query params for pagination, search, filter)
export const getAllUsers = (params) =>
  apiClient.get("/admin/users", { params });

// Update user status (ban/unban/verify)
export const updateUserStatus = (userId, status) =>
  apiClient.put(`/admin/users/${userId}/status`, { status });

// Get all categories
export const getAllCategories = () => apiClient.get("/admin/categories");

// Get course by ID for editing - try both admin and public endpoints
export const getCourseById = async (courseId) => {
  try {
    // First try admin endpoint
    return await apiClient.get(`/admin/courses/${courseId}`);
  } catch (error) {
    if (error.response?.status === 404) {
      // If admin endpoint not found, try public endpoint
      return await apiClient.get(`/courses/${courseId}`);
    }
    throw error;
  }
};

// Get all admin courses - try multiple endpoints
export const getAdminCourses = async () => {
  try {
    // First try admin endpoint
    return await apiClient.get("/admin/courses");
  } catch (error) {
    console.log("Admin courses endpoint failed, trying public endpoint...");
    try {
      // If admin endpoint fails, try public endpoint
      return await apiClient.get("/courses");
    } catch (secondError) {
      console.log("Public courses endpoint also failed");
      throw secondError;
    }
  }
};

// Delete course by ID
export const deleteCourse = async (courseId) => {
  try {
    // First try admin endpoint
    return await apiClient.delete(`/admin/courses/${courseId}`);
  } catch (error) {
    console.log("Admin delete endpoint failed, trying public endpoint...");
    try {
      // If admin endpoint fails, try public endpoint
      return await apiClient.delete(`/courses/${courseId}`);
    } catch (secondError) {
      console.log("Public delete endpoint also failed");
      throw secondError;
    }
  }
};
