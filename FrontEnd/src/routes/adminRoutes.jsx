import React from "react";
import { Route } from "react-router-dom";

import AdminDashboard from "../components/AdminDashboard/AdminDashboard";
import AdminEarning from "../components/AdminEarning/AdminEarning";
import AdminMyCourse from "../components/AdminMyCourse/AdminMyCourse";
import CourseForm from "../components/CRUDCourseAndLesson/CourseForm";
import CourseFormAdvance from "../components/CRUDCourseAndLesson/CourseFormAdvance";
import CourseCurriculum from "../components/CRUDCourseAndLesson/CourseCurriculum";
const adminRoutesContent = (
  <>
    <Route path="dashboard" element={<AdminDashboard title="Dashboard" />} />
    <Route path="earning" element={<AdminEarning title="Earning" />} />
    <Route
      path="courses/basic-information"
      element={<CourseForm title="Basic Information" />}
    />
    <Route
      path="courses/advance-information"
      element={<CourseFormAdvance title="Advance Information" />}
    />
    <Route path="courses" element={<AdminMyCourse title="My Courses" />} />
    <Route
      path="courses/curriculum"
      element={<CourseCurriculum title="Course Curriculum" />}
    />
  </>
);
export default adminRoutesContent;
