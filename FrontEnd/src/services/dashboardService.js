import apiClient from './authService';

/**
 * @desc    Lấy dữ liệu thống kê cho dashboard (Admin)
 * @returns {Promise}
 */
export const getDashboardStats = () => {
    // apiClient sẽ tự động thêm token và gọi đến /api/admin/stats
    return apiClient.get('/admin/stats');
};

/**
 * @desc    Lấy dữ liệu thống kê cho dashboard (Instructor)
 * @param {Object} params - Query parameters (year, startDate, endDate, period)
 * @returns {Promise}
 */
export const getInstructorDashboardStats = (params = {}) => {
    // apiClient sẽ tự động thêm token và gọi đến /api/instructor/dashboard
    return apiClient.get('/instructor/dashboard', { params });
};