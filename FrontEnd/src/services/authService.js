import axios from "axios";

let store;
export const injectStore = (_store) => {
  store = _store;
};

const apiClient = axios.create({
  baseURL:
    "https://flearning-api-a5h6hbcphdcbhndv.southeastasia-01.azurewebsites.net/api",
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      console.log("Access Token hết hạn, đang thử làm mới...");

      try {
        const { data } = await axios.post(
          "https://flearning-api-a5h6hbcphdcbhndv.southeastasia-01.azurewebsites.net/api/auth/refresh-token",
          {},
          { withCredentials: true }
        );

        const { accessToken } = data;
        console.log("Làm mới Access Token thành công!");

        localStorage.setItem("accessToken", accessToken);
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (_error) {
        console.error(
          "Refresh Token không hợp lệ hoặc đã hết hạn. Đang đăng xuất người dùng...",
          _error
        );
        if (store) {
          const { logout } = await import("../store/authSlice");
          store.dispatch(logout());
        }
        window.location.replace("/login");

        return Promise.reject(_error);
      }
    }
    return Promise.reject(error);
  }
);

// --- Export các hàm gọi API ---
// (Giữ nguyên không thay đổi)
export const registerUser = (userData) =>
  apiClient.post("/auth/register", userData);
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

export const getUserProfile = () => apiClient.get("/user/profile");
export const setPassword = (passwordData) =>
  apiClient.post("/user/set-password", passwordData);
export const changePassword = (passwordData) =>
  apiClient.put("/user/change-password", passwordData);

export default apiClient;
