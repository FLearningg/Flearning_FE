import { createSlice } from "@reduxjs/toolkit";
const notificationSlice = createSlice({
    name: 'notifications',
    initialState: {
        getNotifications: {
            notifications: [],
            isLoading: false,
            error: false,
            errorMsg: ''
        }
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
    }
});
export const { 
    getNotificationStart, 
    getNotificationSuccess, 
    getNotificationFailure 
} = notificationSlice.actions;
export default notificationSlice.reducer;
