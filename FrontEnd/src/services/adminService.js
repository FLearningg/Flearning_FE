import apiClient from "./authService";

// Get all users (with query params for pagination, search, filter)
export const getAllUsers = (params) =>
  apiClient.get("/admin/users", { params });

// Update user status (ban/unban/verify)
export const updateUserStatus = (userId, status) =>
  apiClient.put(`/admin/users/${userId}/status`, { status });

// Update user role (approve instructor, change role)
export const updateUserRole = (userId, role) =>
  apiClient.put(`/admin/users/${userId}/role`, { role });

// Get pending instructor applications
export const getInstructorApplications = (params) =>
  apiClient.get(`/admin/instructor-applications`, { params });

// Approve or reject an instructor application
export const reviewInstructorApplication = (applicationId, action) =>
  apiClient.put(`/admin/instructor-applications/${applicationId}`, { action });

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

// Get available discounts (active, not expired, usage not full)
export const getAvailableDiscounts = () =>
  apiClient.get("/discounts/available");

// Assign discount to course
export const assignDiscountToCourse = (courseId, discountId) =>
  apiClient.post(`/courses/${courseId}/assign-discount`, { discountId });

// Increase usage for discount (user)
export const increaseDiscountUsage = (discountId) =>
  apiClient.post(`/discounts/${discountId}/increase-usage`);

// Upload and process quiz document
export const uploadQuizDocument = async (file, courseId) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    if (courseId) {
      formData.append("courseId", courseId);
    }

    const response = await apiClient.post("/admin/upload-quiz", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response;
  } catch (error) {
    throw error;
  }
};
