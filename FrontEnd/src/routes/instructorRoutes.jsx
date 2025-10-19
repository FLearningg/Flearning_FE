import React from "react";
import { Route } from "react-router-dom";

import InstructorDashboard from "../components/InstructorDashboard/InstructorDashboard";
import InstructorDiscount from "../components/InstructorDiscount/InstructorDiscount";
import CourseWizard from "../components/CRUDCourseAndLesson/CourseWizard";
import InstructorMyCourse from "../components/InstructorMyCourse/InstructorMyCourse";
import InstructorAllCourses from "../components/InstructorMyCourse/InstructorAllCourses";
import InstructorProfileEdit from "../pages/InstructorProfile/InstructorProfileEdit";

const instructorRoutesContent = (
  <>
    <Route path="dashboard" element={<InstructorDashboard />} />
    <Route path="profile/edit" element={<InstructorProfileEdit />} />
    <Route path="discounts" element={<InstructorDiscount />} />
    <Route path="courses" element={<InstructorAllCourses />} />
    <Route path="courses/:id" element={<InstructorMyCourse />} />
    <Route path="courses/new" element={<CourseWizard />} />
    <Route path="courses/edit/:id" element={<CourseWizard />} />
  </>
);

export default instructorRoutesContent;
