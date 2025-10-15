import React from "react";
import { Route } from "react-router-dom";

import InstructorDashboard from "../components/InstructorDashboard/InstructorDashboard";
import InstructorDiscount from "../components/InstructorDiscount/InstructorDiscount";
import CourseWizard from "../components/CRUDCourseAndLesson/CourseWizard";

const instructorRoutesContent = (
  <>
    <Route path="dashboard" element={<InstructorDashboard />} />
    <Route path="discounts" element={<InstructorDiscount />} />
    <Route path="courses/new" element={<CourseWizard />} />
    <Route path="courses/edit/:id" element={<CourseWizard />} />
  </>
);

export default instructorRoutesContent;
