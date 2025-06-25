import React from "react";
import { Route } from "react-router-dom";

import AdminDashboard from "../components/AdminDashboard/AdminDashboard";
import AdminEarning from "../components/AdminEarning/AdminEarning";
import AdminMyCourse from "../components/AdminMyCourse/AdminMyCourse";
import AdminAllCourse from "../components/AdminMyCourse/AdminAllCourse";
import CourseForm from "../components/CRUDCourseAndLesson/CourseForm";
import CourseFormAdvance from "../components/CRUDCourseAndLesson/CourseFormAdvance";
import CourseCurriculum from "../components/CRUDCourseAndLesson/CourseCurriculum";
import AdminDiscount from "../components/AdminDiscount/AdminDiscount";
import CoursePublish from "../components/CRUDCourseAndLesson/CoursePublish";
import AdminManageUser from "../components/AdminManageUser/AdminManageUser";
import CourseWizard from "../components/CRUDCourseAndLesson/CourseWizard";
const adminRoutesContent = (
  <>
    <Route path="dashboard" element={<AdminDashboard />} />
    <Route path="earning" element={<AdminEarning />} />
    <Route path="discounts" element={<AdminDiscount />} />
    <Route path="users" element={<AdminManageUser />} />
    <Route path="courses/new" element={<CourseWizard />} />
    {/* <Route path="courses/advance-information" element={<CourseFormAdvance />} /> */}
    <Route path="courses/all" element={<AdminAllCourse />} />
    <Route path="courses/:id" element={<AdminMyCourse />} />
    <Route path="courses" element={<AdminMyCourse />} />
    {/* <Route path="courses/curriculum" element={<CourseCurriculum />} />
    <Route path="courses/publish" element={<CoursePublish />} /> */}
  </>
);
export default adminRoutesContent;
