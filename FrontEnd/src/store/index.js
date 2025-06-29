import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import coursesReducer from "./courseSlice";
import categoryReducer from "./categorySlice";
import notificationReducer from "./notificationSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: coursesReducer,
    categories: categoryReducer,
    notifications: notificationReducer,
  },
});
