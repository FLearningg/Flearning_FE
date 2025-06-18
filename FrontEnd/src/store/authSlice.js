import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { registerUser as registerApi, loginUser as loginApi, googleLogin as googleApi, logoutUser as logoutApi } from '../services/authService';

// Lấy state ban đầu từ localStorage
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
const token = localStorage.getItem('accessToken');

const initialState = {
  currentUser: currentUser || null,
  token: token || null,
  isAuthenticated: !!token,
  isLoading: false,
  error: null,
};

// --- Tạo các Async Thunks để xử lý API calls ---

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await registerApi(userData);
      return response.data; // payload của action fulfilled
    } catch (error) {
      return rejectWithValue(error.response.data); // payload của action rejected
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginApi(credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const googleLogin = createAsyncThunk(
  'auth/googleLogin',
  async (tokenId, { rejectWithValue }) => {
    try {
      const response = await googleApi(tokenId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// --- Tạo Slice ---

const authSlice = createSlice({
  name: 'auth',
  initialState,
  // Reducers cho các action đồng bộ (synchronous)
  reducers: {
    logout: (state) => {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('accessToken');
      state.currentUser = null;
      state.token = null;
      state.isAuthenticated = false;
      logoutApi(); // Vẫn gọi API để xóa cookie ở backend
    },
  },
  // ExtraReducers cho các action bất đồng bộ (từ createAsyncThunk)
  extraReducers: (builder) => {
    builder
      // Xử lý Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload.user;
        state.token = action.payload.accessToken;
        state.isAuthenticated = true;
        localStorage.setItem('currentUser', JSON.stringify(action.payload.user));
        localStorage.setItem('accessToken', action.payload.accessToken);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // GG login
      .addCase(googleLogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload.user;
        state.token = action.payload.accessToken;
        state.isAuthenticated = true;
        localStorage.setItem('currentUser', JSON.stringify(action.payload.user));
        localStorage.setItem('accessToken', action.payload.accessToken);
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
       // Xử lý Register (chỉ loading và error, không tự động login)
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