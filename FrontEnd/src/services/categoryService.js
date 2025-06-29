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
