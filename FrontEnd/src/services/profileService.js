import apiClient from "./authService";

// Profile Routes
export const getProfile = () => apiClient.get("/profile");
export const updateProfile = (profileData) => {
  const config = {};
  if (profileData instanceof FormData) {
    config.headers = { "Content-Type": "multipart/form-data" };
  }
  return apiClient.put("/profile", profileData, config);
};

// Purchase History Routes
export const getPurchaseHistory = (page = 1, limit = 10) =>
  apiClient.get(`/profile/purchase-history?page=${page}&limit=${limit}`);

// Enrolled Courses Routes
export const getEnrolledCourses = () =>
  apiClient.get("/profile/enrolled-courses");

// Progress Routes
export const getCourseProgress = (courseId) =>
  apiClient.get(`/progress/${courseId}`);

export const getAllCoursesProgress = () => apiClient.get("/progress");

export const getCompletedCourses = () => apiClient.get("/progress/completed");

export const getIncompleteCourses = () => apiClient.get("/progress/incomplete");

export const markLessonCompleted = (courseId, lessonId) =>
  apiClient.post(`/progress/${courseId}/lessons/${lessonId}/complete`);

export const markLessonIncomplete = (courseId, lessonId) =>
  apiClient.delete(`/progress/${courseId}/lessons/${lessonId}/complete`);

// Thêm API tạo feedback mới cho course
export const createCourseFeedback = (courseId, { content, rateStar }) =>
  apiClient.post(`/courses/${courseId}/feedback`, { content, rateStar });

// Lấy feedback cho một course
export const getCourseFeedback = (courseId) =>
  apiClient.get(`/courses/${courseId}/feedback`);

// Update feedback cho một course
export const updateCourseFeedback = (courseId, { content, rateStar }) =>
  apiClient.put(`/courses/${courseId}/feedback`, { content, rateStar });
