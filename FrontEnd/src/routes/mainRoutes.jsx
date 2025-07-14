// src/routes/mainRoutes.js
import React from "react";
import { Route } from "react-router-dom";

import HomePage from "../components/HomePage/HomePage";
import FaqsPage from "../pages/MainPage/FaqsPage";
import ProfileRoutes from "./profileRoutes";
import CategoryPage from "../components/Categories/CategoryPage";
import CoursePage from "../components/Categories/CoursePage";
import SingleCourse from "../components/CourseDetails/SingleCourse";
import CheckoutPage from "../components/ShoppingCart/CheckoutPage";

const mainRoutesContent = (
  <>
    <Route index element={<HomePage />} />
    <Route path="faqs" element={<FaqsPage />} />
    <Route path="profile/*" element={<ProfileRoutes />} />
    <Route path="category" element={<CategoryPage />} />
    <Route path="courses" element={<CoursePage />} />
    <Route path="course/:courseId" element={<SingleCourse />} />
    <Route path="checkout" element={<CheckoutPage />} />
    {/* Thêm các route chính khác ở đây */}
  </>
);

export default mainRoutesContent;
