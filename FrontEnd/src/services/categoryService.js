import {
  getCategoriesFailure,
  getCategoriesStart,
  getCategoriesSuccess,
} from "../store/categorySlice";
import apiClient from "./authService";

export const getTopCategories = async (dispatch) => {
  dispatch(getCategoriesStart());
  try {
    const response = await apiClient.get("/categories/top");
    dispatch(getCategoriesSuccess(response.data));
  } catch (error) {
    console.error("Error fetching top categories:", error);
    dispatch(getCategoriesFailure(error.message));
  }
};

export const getAllCategories = async (config = {}) => {
  try {
    // Giả sử endpoint của bạn là /categories
    const response = await apiClient.get("/categories", config);
    return response.data;
  } catch (error) {
    console.error("Error fetching all categories:", error);
    throw error;
  }
};
