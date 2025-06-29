import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  registerUser as registerApi,
  loginUser as loginApi,
  googleLogin as googleApi,
  logoutUser as logoutApi,
} from "../services/authService";

import { updateUserProfile as updateProfileApi,
  getCurrentUserProfile as getUserProfile
 } from "../services/userService";

// Lấy state ban đầu từ localStorage để giữ trạng thái đăng nhập khi tải lại trang
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const token = localStorage.getItem("accessToken");

const initialState = {
  currentUser: currentUser || null,
  token: token || null,
  isAuthenticated: !!token,
  isLoading: false,
  error: null,
};

// Async Thunk cho việc đăng ký
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await registerApi(userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async Thunk cho việc đăng nhập
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginApi(credentials);
      return response.data;
    } catch (error) {
      // Đóng gói payload lỗi để chứa các thông tin cần thiết
      const errorPayload = {
        message: error.response?.data?.message || "Lỗi không xác định",
        status: error.response?.status,
        errorCode: error.response?.data?.errorCode,
      };
      return rejectWithValue(errorPayload);
    }
  }
);

// Async Thunk cho việc đăng nhập bằng Google
export const googleLogin = createAsyncThunk(
  "auth/googleLogin",
  async (tokenId, { rejectWithValue }) => {
    try {
      const response = await googleApi(tokenId);
      return response.data;
    } catch (error) {
      const errorPayload = {
        message: error.response?.data?.message || "Lỗi không xác định",
        status: error.response?.status,
        errorCode: error.response?.data?.errorCode,
      };
      return rejectWithValue(errorPayload);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "auth/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await updateProfileApi(profileData);
      return response.data;
    } catch (error) {
      const errorPayload = {
        message: error.response?.data?.message || "Cập nhật thất bại",
        status: error.response?.status,
      };
      return rejectWithValue(errorPayload);
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => { // Dùng _ vì không cần tham số đầu vào
    try {
      // Backend sẽ trả về đối tượng user đầy đủ
      const response = await getUserProfile();
      return response.data;
    } catch (error) {
      // Nếu không lấy được (ví dụ token hết hạn), sẽ trả về lỗi
      return rejectWithValue(error.response.data);
    }
  }
);

// Tạo Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("currentUser");
      localStorage.removeItem("accessToken");
      state.currentUser = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      logoutApi().catch((err) => console.error("API logout failed", err));
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state) => {
      state.isLoading = true;
      state.error = null;
    };
    const handleFulfilled = (state, action) => {
      state.isLoading = false;
      state.currentUser = action.payload.user;
      state.token = action.payload.accessToken;
      state.isAuthenticated = true;
      localStorage.setItem("currentUser", JSON.stringify(action.payload.user));
      localStorage.setItem("accessToken", action.payload.accessToken);
    };
    const handleRejected = (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    };

    builder
      // Xử lý Login & Google Login
      .addCase(loginUser.pending, handlePending)
      .addCase(loginUser.fulfilled, handleFulfilled)
      .addCase(loginUser.rejected, handleRejected)
      .addCase(googleLogin.pending, handlePending)
      .addCase(googleLogin.fulfilled, handleFulfilled)
      .addCase(googleLogin.rejected, handleRejected)
      // Xử lý Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        // Cập nhật currentUser với dữ liệu mới từ API
        state.currentUser = action.payload;
        // Đồng bộ lại với localStorage để giữ khi tải lại trang
        localStorage.setItem("currentUser", JSON.stringify(action.payload));
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.currentUser = action.payload; 
        localStorage.setItem('currentUser', JSON.stringify(action.payload));
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        console.error("Failed to fetch current user:", action.payload);
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
