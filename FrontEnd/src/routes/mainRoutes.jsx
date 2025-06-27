// src/routes/mainRoutes.js
import React from "react";
import { Route } from "react-router-dom";

import HomePage from "../components/HomePage/HomePage";
import FaqsPage from "../pages/MainPage/FaqsPage";
import ProfileRoutes from "./profileRoutes";
import CategoryPage from "../components/Categories/CategoryPage";
import SingleCourse from "../components/CourseDetails/SingleCourse";

const mainRoutesContent = (
  <>
    <Route index element={<HomePage />} />
    <Route path="faqs" element={<FaqsPage />} />
    <Route path="profile/*" element={<ProfileRoutes />} />
    <Route path="category" element={<CategoryPage />} />
    <Route path="coursedetail" element={<SingleCourse />} />
    {/*Course Detail sau khi thêm data sẽ đổi lại thành course/:id */}
    {/* Thêm các route chính khác ở đây */}
    {/* <Route path="courses" element={<CoursesPage />} /> */}
    {/* Thêm các route chính khác ở đây */}
  </>
);

export default mainRoutesContent;
