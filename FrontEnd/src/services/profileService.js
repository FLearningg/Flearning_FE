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
