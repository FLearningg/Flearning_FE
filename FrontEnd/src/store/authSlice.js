import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
    registerUser as registerApi, 
    loginUser as loginApi, 
    googleLogin as googleApi, 
    logoutUser as logoutApi 
} from '../services/api/authService';

// Lấy state ban đầu từ localStorage để giữ trạng thái đăng nhập khi tải lại trang
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
const token = localStorage.getItem('accessToken');

const initialState = {
  currentUser: currentUser || null,
  token: token || null,
  isAuthenticated: !!token,
  isLoading: false,
  error: null,
};

// Async Thunk cho việc đăng ký
export const registerUser = createAsyncThunk(
  'auth/register',
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
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginApi(credentials);
      return response.data;
    } catch (error) {
      // Đóng gói payload lỗi để chứa các thông tin cần thiết
      const errorPayload = {
        message: error.response?.data?.message || 'Lỗi không xác định',
        status: error.response?.status,
        errorCode: error.response?.data?.errorCode,
      };
      return rejectWithValue(errorPayload);
    }
  }
);

// Async Thunk cho việc đăng nhập bằng Google
export const googleLogin = createAsyncThunk(
  'auth/googleLogin',
  async (tokenId, { rejectWithValue }) => {
    try {
      const response = await googleApi(tokenId);
      return response.data;
    } catch (error) {
      const errorPayload = {
        message: error.response?.data?.message || 'Lỗi không xác định',
        status: error.response?.status,
        errorCode: error.response?.data?.errorCode,
      };
      return rejectWithValue(errorPayload);
    }
  }
);

// Tạo Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('accessToken');
      state.currentUser = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      logoutApi().catch(err => console.error("API logout failed", err));
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
        localStorage.setItem('currentUser', JSON.stringify(action.payload.user));
        localStorage.setItem('accessToken', action.payload.accessToken);
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
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;