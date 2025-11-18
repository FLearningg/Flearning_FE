import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// Đảm bảo đường dẫn này đúng với project của bạn
import apiClient from "../services/authService";

// Async thunk để lấy danh sách thông báo từ API
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/notifications/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error fetching notifications"
      );
    }
  }
);

// Async thunk để đánh dấu tất cả là đã đọc
export const markAllRead = createAsyncThunk(
  "notifications/markAllRead",
  async (_, { rejectWithValue }) => {
    try {
      await apiClient.put("/notifications/read-all");
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error marking all read");
    }
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    items: [],
    unreadCount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    // Action này được gọi từ Socket
    addNewNotification: (state, action) => {
      const exists = state.items.find(
        (item) => item._id === action.payload._id
      );
      if (!exists) {
        state.items.unshift(action.payload);
        state.unreadCount += 1;
      }
    },
    updateUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Fetch Notifications ---
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.notifications;
        state.unreadCount = action.payload.unreadCount;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- Mark All Read (ĐÃ SỬA LOGIC TẠI ĐÂY) ---
      .addCase(markAllRead.fulfilled, (state) => {
        // 1. Reset số lượng chưa đọc về 0
        state.unreadCount = 0;

        // 2. QUAN TRỌNG: Duyệt qua danh sách hiện tại và đánh dấu đã đọc
        // Việc này giúp giao diện cập nhật ngay lập tức mà không cần gọi lại API fetch
        state.items.forEach((item) => {
          item.isRead = true;
        });
      });
  },
});

export const { addNewNotification, updateUnreadCount } =
  notificationSlice.actions;
export default notificationSlice.reducer;
