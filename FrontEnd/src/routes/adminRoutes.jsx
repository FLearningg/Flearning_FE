import React from "react";
import { Route } from "react-router-dom";

import AdminDashboard from "../components/AdminDashboard/AdminDashboard";
// import AdminEarning from "../components/AdminEarning/AdminEarning";
import AdminMyCourse from "../components/AdminMyCourse/AdminMyCourse";
import AdminAllCourse from "../components/AdminMyCourse/AdminAllCourse";
import AdminDiscount from "../components/AdminDiscount/AdminDiscount";
import AdminManageUser from "../components/AdminManageUser/AdminManageUser";
import CensorInstructor from "../components/AdminManageUser/CensorInstructor";
import CourseWizard from "../components/CRUDCourseAndLesson/CourseWizard";
const adminRoutesContent = (
  <>
    <Route path="dashboard" element={<AdminDashboard />} />
    {/* <Route path="earning" element={<AdminEarning />} /> */}
    <Route path="discounts" element={<AdminDiscount />} />
    <Route path="users" element={<AdminManageUser />} />
    <Route path="censor-instructor" element={<CensorInstructor />} />
    <Route path="courses/edit/:id" element={<CourseWizard />} />
    <Route path="courses/all" element={<AdminAllCourse />} />
    <Route path="courses/:id" element={<AdminMyCourse />} />
    <Route path="courses" element={<AdminMyCourse />} />
  </>
);
export default adminRoutesContent;
