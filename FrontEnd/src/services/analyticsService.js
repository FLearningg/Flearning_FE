import apiClient from "./authService";

/**
 * Get student learning analytics
 * @param {number} year - Year to filter analytics (optional, defaults to current year)
 */
export const getStudentAnalytics = async (year) => {
  try {
    const params = [];
    if (year) params.push(`year=${year}`);
    const queryString = params.length > 0 ? `?${params.join('&')}` : '';
    const response = await apiClient.get(`/progress/analytics${queryString}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching student analytics:", error);
    throw error;
  }
};
