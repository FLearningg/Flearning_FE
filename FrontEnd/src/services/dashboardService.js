import apiClient from './authService';

/**
 * @desc    Lấy dữ liệu thống kê cho dashboard
 * @returns {Promise}
 */
export const getDashboardStats = () => {
    // apiClient sẽ tự động thêm token và gọi đến /api/admin/stats
    return apiClient.get('/admin/stats');
};