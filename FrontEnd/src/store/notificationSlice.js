import { createSlice } from "@reduxjs/toolkit";
const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    getNotifications: {
      notifications: [],
      isLoading: false,
      error: false,
      errorMsg: "",
    },
    updateNotification: {
      isLoading: false,
      error: false,
      errorMsg: "",
      success: false,
    },
  },
  reducers: {
    getNotificationStart: (state) => {
      state.getNotifications.isLoading = true;
    },
    getNotificationSuccess: (state, action) => {
      state.getNotifications.isLoading = false;
      state.getNotifications.notifications = action.payload;
      state.getNotifications.error = false;
    },
    getNotificationFailure: (state, action) => {
      state.getNotifications.isLoading = false;
      state.getNotifications.error = true;
      state.getNotifications.errorMsg = action.payload;
    },
    updateNotificationStart: (state) => {
      state.updateNotification.isLoading = true;
    },
    updateNotificationSuccess: (state) => {
      state.updateNotification.isLoading = false;
      state.updateNotification.success = true;
      state.updateNotification.error = false;
    },
    updateNotificationFailure: (state, action) => {
      state.updateNotification.isLoading = false;
      state.updateNotification.error = true;
      state.updateNotification.errorMsg = action.payload;
    },
  },
});
export const {
  getNotificationStart,
  getNotificationSuccess,
  getNotificationFailure,
  updateNotificationStart,
  updateNotificationSuccess,
  updateNotificationFailure,
} = notificationSlice.actions;
export default notificationSlice.reducer;
