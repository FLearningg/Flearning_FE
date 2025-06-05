// src/routes/mainRoutes.js
import React from 'react';
import { Route } from 'react-router-dom';

import HomePage from '../components/HomePage/HomePage';
import FaqsPage from '../pages/MainPage/FaqsPage';
// Import các trang khác nếu có

const mainRoutesContent = ( // Đây là JSX, không phải là một component
  <>
    <Route index element={<HomePage />} /> {/* Route cho trang chủ (path "/") */}
    <Route path="faqs" element={<FaqsPage />} />
    {/* <Route path="courses" element={<CoursesPage />} /> */}
    {/* Thêm các route chính khác ở đây */}
  </>
);

export default mainRoutesContent; // Export trực tiếp JSX fragment