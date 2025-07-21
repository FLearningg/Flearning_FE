import apiClient from "./authService";

/**
 * Get all feedback for a specific course with pagination
 * @param {string} courseId - The course ID
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Items per page (default: 10)
 * @returns {Promise} API response with feedback data and pagination info
 */
export const getCourseFeedback = async (courseId, page = 1, limit = 10) => {
  try {
    const response = await apiClient.get(
      `/courses/${courseId}/feedback?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching course feedback:", error);
    throw error;
  }
};

/**
 * Create new feedback for a course
 * @param {string} courseId - The course ID
 * @param {Object} feedbackData - Feedback data { content, rateStar }
 * @returns {Promise} API response with created feedback
 */
export const createCourseFeedback = async (courseId, feedbackData) => {
  try {
    const response = await apiClient.post(
      `/courses/${courseId}/feedback`,
      feedbackData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating course feedback:", error);
    throw error;
  }
};

/**
 * Update existing feedback for a course
 * @param {string} courseId - The course ID
 * @param {Object} feedbackData - Updated feedback data { content, rateStar }
 * @returns {Promise} API response with updated feedback
 */
export const updateCourseFeedback = async (courseId, feedbackData) => {
  try {
    const response = await apiClient.put(
      `/courses/${courseId}/feedback`,
      feedbackData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating course feedback:", error);
    throw error;
  }
};

/**
 * Delete feedback for a course
 * @param {string} courseId - The course ID
 * @param {string} feedbackId - The feedback ID
 * @returns {Promise} API response
 */
export const deleteCourseFeedback = async (courseId, feedbackId) => {
  try {
    const response = await apiClient.delete(
      `/courses/${courseId}/feedback/${feedbackId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting course feedback:", error);
    throw error;
  }
};

/**
 * Get user's feedback for a specific course
 * @param {string} courseId - The course ID
 * @param {string} userId - The user ID
 * @returns {Promise} API response with user's feedback
 */
export const getUserFeedbackForCourse = async (courseId, userId) => {
  try {
    const response = await apiClient.get(`/courses/${courseId}/feedback`);
    const userFeedback = response.data.feedback.find((feedback) => {
      if (!feedback.userId) return false;
      if (typeof feedback.userId === "string") {
        return feedback.userId === userId;
      }
      return feedback.userId._id === userId;
    });
    return userFeedback || null;
  } catch (error) {
    console.error("Error fetching user feedback:", error);
    return null;
  }
};

/**
 * Get average rating for a specific course
 * @param {string} courseId - The course ID
 * @returns {Promise} API response with average rating and total feedback
 */
export const getCourseAverageRating = async (courseId) => {
  try {
    const response = await apiClient.get(`/courses/${courseId}/average-rating`);
    return response.data;
  } catch (error) {
    console.error("Error fetching course average rating:", error);
    throw error;
  }
};
