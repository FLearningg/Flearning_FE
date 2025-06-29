import { getNotificationFailure, getNotificationStart, getNotificationSuccess } from "../store/notificationSlice";
import apiClient from "./authService";
export const getNotifications = async (dispatch, userId, page, limit=10) => {
    dispatch(getNotificationStart());
    try {
        const response = await apiClient.get(`/notifications/${userId}?page=${page}&limit=${limit}`);
        dispatch(getNotificationSuccess(response.data.notifications));
    } catch (error) {
        console.error("Error fetching notifications:", error);
        dispatch(getNotificationFailure(error.message));
    }
};
