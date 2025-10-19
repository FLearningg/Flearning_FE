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
export const getBestSellingCourses = async (dispatch, categoryName) => {
  dispatch(bestSellingStart());
  try {
    let url = `courses/top-selling?limit=5`;
    if (categoryName) {
      url += `&category=${encodeURIComponent(categoryName)}`;
    }
    const response = await apiClient.get(url);
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
//get course by id
export const getCourseById = async (courseId) => {
  try {
    const response = await apiClient.get(`/courses/${courseId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching course by ID:", error);
    throw error;
  }
};
//get all courses not using dispatch
export const getAllCoursesWithoutDispatch = async () => {
  try {
    const response = await apiClient.get(`/courses`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all courses:", error);
    throw error;
  }
};

//Enrolls a user in one or more courses.
export const enrollInCourses = async (userId, courseIds) => {
  if (!userId || !courseIds || courseIds.length === 0) {
    const errorMessage =
      "User ID and a list of course IDs are required for enrollment.";
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  const payload = { userId, courseIds };

  try {
    const response = await apiClient.post("/courses/enroll-course", payload);
    return response.data;
  } catch (error) {
    console.error("Error during course enrollment:", error);
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to enroll user in courses";
    throw new Error(message);
  }
};

// Create a new course
export const createCourse = async (courseData) => {
  try {
    const response = await apiClient.post("/admin/courses", courseData);
    return response.data;
  } catch (error) {
    console.error("Error creating course:", error);
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to create course";
    throw new Error(message);
  }
};

// Create a new section in a course
export const createSection = async (courseId, sectionData) => {
  try {
    const response = await apiClient.post(
      `/admin/courses/${courseId}/sections`,
      sectionData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating section:", error);
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to create section";
    throw new Error(message);
  }
};

// Create a new lesson in a section
export const createLesson = async (courseId, sectionId, lessonData) => {
  try {
    const response = await apiClient.post(
      `/admin/courses/${courseId}/sections/${sectionId}/lessons`,
      lessonData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating lesson:", error);
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to create lesson";
    throw new Error(message);
  }
};

// Move lesson video from temporary to course folder
export const moveLessonVideo = async (courseId, lessonId, videoUrl) => {
  try {
    const response = await apiClient.post(
      `/admin/courses/${courseId}/lessons/${lessonId}/move-video`,
      { videoUrl }
    );
    return response.data;
  } catch (error) {
    console.error("Error moving lesson video:", error);
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to move lesson video";
    throw new Error(message);
  }
};

export const isUserEnrolled = async (userId, courseId) => {
  try {
    const response = await apiClient.get(
      `/courses/is-enrolled?userId=${userId}&courseId=${courseId}`
    );
    return response.data.isEnrolled;
  } catch (error) {
    console.error("Error checking enrollment status:", error);
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to check enrollment status";
    throw new Error(message);
  }
};
