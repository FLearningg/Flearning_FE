import apiClient from "./authService";

// Get all users (with query params for pagination, search, filter)
export const getAllUsers = (params) =>
  apiClient.get("/admin/users", { params });

// Update user status (ban/unban/verify)
export const updateUserStatus = (userId, status) =>
  apiClient.put(`/admin/users/${userId}/status`, { status });
