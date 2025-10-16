import axios from "axios";

import { store } from "../store";
import { logout } from "../store/authSlice";

// Tạo một instance của axios với cấu hình chung
const apiClient = axios.create({
  baseURL:
    // "https://flearning-api-a5h6hbcphdcbhndv.southeastasia-01.azurewebsites.net/api",
    "http://localhost:5000/api",
  withCredentials: true,
});

// Interceptor 1: Can thiệp vào TRƯỚC KHI request được gửi đi
apiClient.interceptors.request.use(
  (config) => {
    // Lấy accessToken từ localStorage
    const token = localStorage.getItem("accessToken");
    if (token) {
      // Nếu có token, đính kèm nó vào header Authorization
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;

let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Interceptor 2: Can thiệp vào SAU KHI nhận được response
apiClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Skip refresh token for change password API
    if (
      error.response?.status === 401 &&
      !originalRequest.url.includes("/user/change-password")
    ) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      console.log("Access Token hết hạn, đang thử làm mới...");

      try {
        const { data } = await axios.post(
          "http://localhost:5000/api/auth/refresh-token",
          {},
          { withCredentials: true }
        );

        const { accessToken } = data;
        console.log("Làm mới Access Token thành công!");
        localStorage.setItem("accessToken", accessToken);

        apiClient.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;

        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

        processQueue(null, accessToken);

        return apiClient(originalRequest);
      } catch (_error) {
        console.error(
          "Refresh Token không hợp lệ. Đang đăng xuất người dùng...",
          _error
        );

        processQueue(_error, null);

        store.dispatch(logout());

        window.location.replace("/login");

        return Promise.reject(_error);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

// Auth Routes
export const registerUser = (userData) =>
  apiClient.post("/auth/register", userData);
export const registerInstructor = (instructorData) =>
  apiClient.post("/auth/instructor/register", instructorData);
export const loginUser = (credentials) =>
  apiClient.post("/auth/login", credentials);
export const googleLogin = (tokenId) =>
  apiClient.post("/auth/google", { tokenId });
export const verifyEmail = (token) =>
  apiClient.get(`/auth/verify-email/${token}`);
export const logoutUser = () => apiClient.post("/auth/logout");
export const resendVerificationLink = (email) =>
  apiClient.post("/auth/resend-verification", { email });
export const forgotPassword = (email) =>
  apiClient.post("/auth/forgot-password", { email });
export const resetPassword = (token, newPassword) =>
  apiClient.post(`/auth/reset-password/${token}`, { newPassword });

// User Routes
export const getUserProfile = () => apiClient.get("/user/profile");
export const setPassword = (passwordData) =>
  apiClient.post("/user/set-password", passwordData);
export const changePassword = (passwordData) =>
  apiClient.put("/user/change-password", passwordData);

export default apiClient;
