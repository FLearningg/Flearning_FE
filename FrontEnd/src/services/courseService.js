import {
  bestSellingFailure,
  bestSellingStart,
  bestSellingSuccess,
  getCourseFailure,
  getCourseStart,
  getCourseSuccess,
  recentlyAddedFailure,
  recentlyAddedStart,
  recentlyAddedSuccess,
  searchCourseFailure,
  searchCourseStart,
  searchCourseSuccess,
} from "../store/courseSlice";
import apiClient from "./authService";

// take course data from api and dispatch to store
export const getAllCourses = async (dispatch) => {
  dispatch(getCourseStart());
  try {
    const response = await apiClient.get(`/courses`);
    dispatch(getCourseSuccess(response.data));
  } catch (error) {
    console.error("Error fetching all courses:", error);
    dispatch(getCourseFailure(error.message));
  }
};
// take course data and keyword from api and dispatch to store
export const searchCourses = async (dispatch, keyword) => {
  dispatch(searchCourseStart());
  try {
    const response = await apiClient.get(`/courses/search?keyword=${keyword}`);
    dispatch(searchCourseSuccess(response.data));
  } catch (error) {
    console.error("Error searching courses:", error);
    dispatch(searchCourseFailure(error.message));
  }
};
// take best selling course data from api and dispatch to store
export const getBestSellingCourses = async (dispatch) => {
  dispatch(bestSellingStart());
  try {
    const response = await apiClient.get(`courses/top-selling?limit=5`);
    dispatch(bestSellingSuccess(response.data));
  } catch (error) {
    console.error("Error fetching best selling courses:", error);
    dispatch(bestSellingFailure(error.message));
  }
};
// take recently added course data from api and dispatch to store
export const getRecentlyAddedCourses = async (dispatch) => {
  dispatch(recentlyAddedStart());
  try {
    const response = await apiClient.get(`courses/recently-added?limit=4`);
    dispatch(recentlyAddedSuccess(response.data));
  } catch (error) {
    console.error("Error fetching recently added courses:", error);
    dispatch(recentlyAddedFailure(error.message));
  }
};
