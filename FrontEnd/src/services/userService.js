import apiClient from "./authService";

// Get all users (for search functionality)
export const getAllUsers = (page = 1, limit = 20) =>
  apiClient.get(`/users?page=${page}&limit=${limit}`);

// Search users by name or username
export const searchUsers = (query, page = 1, limit = 20) =>
  apiClient.get(
    `/user/search?query=${encodeURIComponent(
      query
    )}&page=${page}&limit=${limit}`
  );

// Get user by ID
export const getUserById = (userId) => apiClient.get(`/users/${userId}`);

// Get current user profile
export const getCurrentUserProfile = () => apiClient.get("/user/profile");

// Update user profile
export const updateUserProfile = (profileData) =>
  apiClient.put("/user/profile", profileData);

// Get user statistics
export const getUserStats = () => apiClient.get("/user/stats");
