import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:5000/api/auth',
    withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

export const registerUser = (userData) => apiClient.post('/register', userData);
export const loginUser = (credentials) => apiClient.post('/login', credentials);
export const googleLogin = (tokenId) => apiClient.post('/google', { tokenId });
export const verifyEmail = (token) => apiClient.get(`/verify-email/${token}`);
export const logoutUser = () => apiClient.post('/logout');

export default apiClient;