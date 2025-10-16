import apiClient from "./authService";

// Get all categories - try instructor endpoint first, fallback to admin endpoint
export const getAllCategories = async () => {
  try {
    // Try instructor endpoint first
    return await apiClient.get("/instructor/categories");
  } catch (error) {
    console.log("Instructor categories endpoint failed, trying admin endpoint...");
    try {
      // Fallback to admin endpoint
      return await apiClient.get("/admin/categories");
    } catch (secondError) {
      console.log("Admin categories endpoint also failed");
      throw secondError;
    }
  }
};

// Get course by ID for editing - for instructors
export const getCourseById = async (courseId) => {
  try {
    // Try instructor endpoint first
    return await apiClient.get(`/instructor/courses/${courseId}`);
  } catch (error) {
    if (error.response?.status === 404) {
      // If instructor endpoint not found, try public endpoint
      return await apiClient.get(`/courses/${courseId}`);
    }
    throw error;
  }
};

// Get all instructor courses
export const getInstructorCourses = async () => {
  try {
    return await apiClient.get("/instructor/courses");
  } catch (error) {
    console.log("Instructor courses endpoint failed, trying public endpoint...");
    try {
      return await apiClient.get("/courses");
    } catch (secondError) {
      console.log("Public courses endpoint also failed");
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

// Upload and process quiz document
export const uploadQuizDocument = async (file, courseId) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    if (courseId) {
      formData.append("courseId", courseId);
    }

    const response = await apiClient.post("/instructor/upload-quiz", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response;
  } catch (error) {
    throw error;
  }
};
