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

// ========== COURSE MANAGEMENT APIs ==========

// Create a new course
export const createCourse = async (courseData) => {
  try {
    return await apiClient.post("/instructor/courses", courseData);
  } catch (error) {
    console.error("Error creating course:", error);
    throw error;
  }
};

// Update existing course
export const updateCourse = async (courseId, courseData) => {
  try {
    return await apiClient.put(`/instructor/courses/${courseId}`, courseData);
  } catch (error) {
    console.error("Error updating course:", error);
    throw error;
  }
};

// Delete course by ID
export const deleteCourse = async (courseId) => {
  try {
    return await apiClient.delete(`/instructor/courses/${courseId}`);
  } catch (error) {
    console.error("Error deleting course:", error);
    throw error;
  }
};

// ========== SECTION MANAGEMENT APIs ==========

// Create a new section in a course
export const createSection = async (courseId, sectionData) => {
  try {
    return await apiClient.post(
      `/instructor/courses/${courseId}/sections`,
      sectionData
    );
  } catch (error) {
    console.error("Error creating section:", error);
    throw error;
  }
};

// Update existing section
export const updateSection = async (courseId, sectionId, sectionData) => {
  try {
    return await apiClient.put(
      `/instructor/courses/${courseId}/sections/${sectionId}`,
      sectionData
    );
  } catch (error) {
    console.error("Error updating section:", error);
    throw error;
  }
};

// Delete section by ID
export const deleteSection = async (courseId, sectionId) => {
  try {
    return await apiClient.delete(
      `/instructor/courses/${courseId}/sections/${sectionId}`
    );
  } catch (error) {
    console.error("Error deleting section:", error);
    throw error;
  }
};

// ========== LESSON MANAGEMENT APIs ==========

// Create a new lesson in a section
export const createLesson = async (courseId, sectionId, lessonData) => {
  try {
    return await apiClient.post(
      `/instructor/courses/${courseId}/sections/${sectionId}/lessons`,
      lessonData
    );
  } catch (error) {
    console.error("Error creating lesson:", error);
    throw error;
  }
};

// Update existing lesson
export const updateLesson = async (courseId, lessonId, lessonData) => {
  try {
    return await apiClient.put(
      `/instructor/courses/${courseId}/lessons/${lessonId}`,
      lessonData
    );
  } catch (error) {
    console.error("Error updating lesson:", error);
    throw error;
  }
};

// Delete lesson by ID
export const deleteLesson = async (courseId, lessonId) => {
  try {
    return await apiClient.delete(
      `/instructor/courses/${courseId}/lessons/${lessonId}`
    );
  } catch (error) {
    console.error("Error deleting lesson:", error);
    throw error;
  }
};
