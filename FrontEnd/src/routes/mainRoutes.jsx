// src/routes/mainRoutes.js
import React from "react";
import { Route } from "react-router-dom";

import HomePage from '../components/HomePage/HomePage';
import FaqsPage from '../pages/MainPage/FaqsPage';
import ProfileRoutes from './profileRoutes';

const mainRoutesContent = (
  <>
    <Route index element={<HomePage />} />
    <Route path="faqs" element={<FaqsPage />} />
    <Route path="profile/*" element={<ProfileRoutes />} />
    {/* <Route path="courses" element={<CoursesPage />} /> */}
    {/* Thêm các route chính khác ở đây */}
  </>
);

export default mainRoutesContent;