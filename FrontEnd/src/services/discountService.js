import apiClient from "./authService";

// ===== ADMIN ENDPOINTS =====

// Get all discounts with filtering and pagination (Admin)
export const getAllDiscounts = async (params = {}) => {
  try {
    const response = await apiClient.get("/admin/discounts", { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

// Get discount by ID (Admin)
export const getDiscountById = async (discountId) => {
  try {
    const response = await apiClient.get(`/admin/discounts/${discountId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

// Create new discount (Admin)
export const createDiscount = async (discountData) => {
  try {
    const response = await apiClient.post("/admin/discounts", discountData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

// Update discount (Admin)
export const updateDiscount = async (discountId, updateData) => {
  try {
    const response = await apiClient.put(
      `/admin/discounts/${discountId}`,
      updateData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

// Get discount statistics (Admin)
export const getDiscountStats = async () => {
  try {
    const response = await apiClient.get("/admin/discounts/stats");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

// Remove course from discount applyCourses (Admin)
export const removeCourseFromDiscount = async (discountId, courseId) => {
  try {
    const response = await apiClient.delete(
      `/admin/discounts/${discountId}/courses/${courseId}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

// ===== INSTRUCTOR ENDPOINTS =====

// Get instructor's own discounts with filtering and pagination
export const getInstructorDiscounts = async (params = {}) => {
  try {
    const response = await apiClient.get("/instructor/discounts", { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

// Get discount by ID (Instructor)
export const getInstructorDiscountById = async (discountId) => {
  try {
    const response = await apiClient.get(`/instructor/discounts/${discountId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

// Create new discount (Instructor)
export const createInstructorDiscount = async (discountData) => {
  try {
    const response = await apiClient.post("/instructor/discounts", discountData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

// Update discount (Instructor)
export const updateInstructorDiscount = async (discountId, updateData) => {
  try {
    const response = await apiClient.put(
      `/instructor/discounts/${discountId}`,
      updateData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

// Remove course from discount applyCourses (Instructor)
export const removeInstructorCourseFromDiscount = async (discountId, courseId) => {
  try {
    const response = await apiClient.delete(
      `/instructor/discounts/${discountId}/courses/${courseId}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

// ===== PUBLIC ENDPOINTS =====

// Get available discounts for specific courses
export const getAvailableDiscountsForCourses = async (courseIds) => {
  try {
    const response = await apiClient.post("/discounts/available-for-courses", {
      courseIds,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};
