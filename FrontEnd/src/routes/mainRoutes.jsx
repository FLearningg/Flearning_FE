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
import PaymentSuccessPage from "../components/ShoppingCart/PaymentSuccessPage";
import PaymentCancelledPage from "../components/ShoppingCart/PaymentCancelledPage";
import WatchCourse from "../components/WatchCourse/WatchCourse";
import AboutUs from "../components/AboutPage/AboutUs";
import ContactUs from "../components/Contact/ContactUs";

const mainRoutesContent = (
  <>
    <Route index element={<HomePage />} />
    <Route path="about" element={<AboutUs />} />
    <Route path="contact" element={<ContactUs />} />
    <Route path="faqs" element={<FaqsPage />} />
    <Route path="profile/*" element={<ProfileRoutes />} />
    <Route path="category" element={<CategoryPage />} />
    <Route path="courses" element={<CoursePage />} />
    <Route path="course/:courseId" element={<SingleCourse />} />
    <Route path="checkout" element={<CheckoutPage />} />
    <Route path="watch-course/:courseId" element={<WatchCourse />} />
    <Route path="/payment/success" element={<PaymentSuccessPage />} />
    <Route path="/payment/cancelled" element={<PaymentCancelledPage />} />
    {/* Thêm các route chính khác ở đây */}
  </>
);

export default mainRoutesContent;
