import { createSlice } from "@reduxjs/toolkit";
const courseSlice = createSlice({
  name: "courses",
  initialState: {
    // Get All Courses
    getCourses: {
      courses: [],
      isLoading: false,
      error: false,
      errorMsg: "",
    },
    // Search Courses
    searchCourses: {
      courses: [],
      isLoading: false,
      error: false,
      errorMsg: "",
    },
    // Best Selling Courses
    bestSelling: {
      bestSellingCourses: [],
      isLoading: false,
      error: false,
      errorMsg: "",
    },
    // Recently Added Courses
    recentlyAdded: {
      recentlyCourses: [],
      isLoading: false,
      error: false,
      errorMsg: "",
    },
    // Search courses
    search: {
      courses: [],
      isLoading: false,
      error: false,
      errorMsg: "",
    },
  },
  reducers: {
    getCourseStart: (state) => {
      state.getCourses.isLoading = true;
    },
    getCourseSuccess: (state, action) => {
      state.getCourses.isLoading = false;
      state.getCourses.courses = action.payload;
      state.getCourses.error = false;
    },
    getCourseFailure: (state, action) => {
      state.getCourses.isLoading = false;
      state.getCourses.error = true;
      state.getCourses.errorMsg = action.payload;
    },
    // search courses
    searchCourseStart: (state) => {
      state.searchCourses.isLoading = true;
    },
    searchCourseSuccess: (state, action) => {
      state.searchCourses.isLoading = false;
      state.searchCourses.courses = action.payload;
      state.searchCourses.error = false;
    },
    searchCourseFailure: (state, action) => {
      state.searchCourses.isLoading = false;
      state.searchCourses.error = true;
      state.searchCourses.errorMsg = action.payload;
    },
    // best selling courses
    bestSellingStart: (state) => {
      state.bestSelling.isLoading = true;
    },
    bestSellingSuccess: (state, action) => {
      state.bestSelling.isLoading = false;
      state.bestSelling.bestSellingCourses = action.payload;
      state.bestSelling.error = false;
    },
    bestSellingFailure: (state, action) => {
      state.bestSelling.isLoading = false;
      state.bestSelling.error = true;
      state.bestSelling.errorMsg = action.payload;
    },
    // recently added courses
    recentlyAddedStart: (state) => {
      state.recentlyAdded.isLoading = true;
    },
    recentlyAddedSuccess: (state, action) => {
      state.recentlyAdded.isLoading = false;
      state.recentlyAdded.recentlyCourses = action.payload;
      state.recentlyAdded.error = false;
    },
    recentlyAddedFailure: (state, action) => {
      state.recentlyAdded.isLoading = false;
      state.recentlyAdded.error = true;
      state.recentlyAdded.errorMsg = action.payload;
    },
  },
});
export const {
  getCourseStart,
  getCourseSuccess,
  getCourseFailure,
  searchCourseStart,
  searchCourseSuccess,
  searchCourseFailure,
  bestSellingStart,
  bestSellingSuccess,
  bestSellingFailure,
  recentlyAddedStart,
  recentlyAddedSuccess,
  recentlyAddedFailure,
} = courseSlice.actions;
export default courseSlice.reducer;
