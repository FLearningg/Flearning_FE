import axios from 'axios';
import { store } from '../store';
import { logout } from '../store/authSlice';

// Tạo một instance của axios với cấu hình chung
const apiClient = axios.create({
    baseURL: 'https://flearning-api-a5h6hbcphdcbhndv.southeastasia-01.azurewebsites.net/api', // URL gốc của API backend
    withCredentials: true, // Cho phép trình duyệt tự động gửi cookie
});

// Interceptor 1: Can thiệp vào TRƯỚC KHI request được gửi đi
apiClient.interceptors.request.use(
    (config) => {
        // Lấy accessToken từ localStorage
        const token = localStorage.getItem('accessToken');
        if (token) {
            // Nếu có token, đính kèm nó vào header Authorization
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor 2: Can thiệp vào SAU KHI nhận được response
apiClient.interceptors.response.use(
    // Nếu response thành công, trả về response đó luôn
    (response) => response, 
    // Nếu response có lỗi, xử lý lỗi ở đây
    async (error) => {
        const originalRequest = error.config;

        // Chỉ xử lý lỗi 401 (Unauthorized) và request chưa được thử lại
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Đánh dấu là đã thử lại 1 lần để tránh lặp vô hạn
            
            console.log("Access Token hết hạn, đang thử làm mới...");

            try {
                // Gọi API để refresh token
                const { data } = await apiClient.post('/auth/refresh-token');
                const { accessToken } = data;
                
                console.log("Làm mới Access Token thành công!");
                
                // Lưu token mới vào localStorage
                localStorage.setItem('accessToken', accessToken);
                
                // Cập nhật lại header của request ban đầu và thử lại
                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                return apiClient(originalRequest);

            } catch (_error) {
                // Nếu việc refresh token cũng thất bại (ví dụ: refresh token hết hạn)
                console.log("Refresh Token không hợp lệ. Đang đăng xuất người dùng...");
                
                // Dùng store của Redux để dispatch action logout
                store.dispatch(logout());
                
                // Chuyển hướng người dùng về trang đăng nhập để chắc chắn
                window.location.href = '/login';
                
                return Promise.reject(_error);
            }
        }

        // Trả về lỗi cho các trường hợp khác (ví dụ: lỗi 400, 404, 500...)
        return Promise.reject(error);
    }
);


// --- Export các hàm gọi API ---

// Auth Routes
export const registerUser = (userData) => apiClient.post('/auth/register', userData);
export const loginUser = (credentials) => apiClient.post('/auth/login', credentials);
export const googleLogin = (tokenId) => apiClient.post('/auth/google', { tokenId });
export const verifyEmail = (token) => apiClient.get(`/auth/verify-email/${token}`);
export const logoutUser = () => apiClient.post('/auth/logout');
export const resendVerificationLink = (email) => apiClient.post('/auth/resend-verification', { email });
export const forgotPassword = (email) => apiClient.post('/auth/forgot-password', { email });
export const resetPassword = (token, newPassword) => apiClient.post(`/auth/reset-password/${token}`, { newPassword });

// User Routes
export const getUserProfile = () => apiClient.get('/user/profile');
export const setPassword = (passwordData) => apiClient.post('/user/set-password', passwordData);
export const changePassword = (passwordData) => apiClient.put('/user/change-password', passwordData);


export default apiClient;