// src/routes/profileRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import CourseList from '../components/CourseList/CourseList';
import StudentDashboard from '../components/StudentDashboard/StudentDashboard';
import PurchaseHistory from '../components/PurchaseHistory/PurchaseHistory';
import { StudentMessage } from '../components/StudentMessage/StudentMessage';
import WishListPage from '../components/StudentWishList/WishListPage';
import ProfileSetting from '../components/ProfileSetting/ProfileSetting';
import CartPage from "../components/StudentCartPage/CartPage";

const ProfileRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<StudentDashboard />} />
      <Route path="courses" element={<CourseList />} />
      <Route path="message" element={<StudentMessage />} />
      <Route path="wishlist" element={<WishListPage />} />
      <Route path="cart" element={<CartPage/>} />
      <Route path="purchase-history" element={<PurchaseHistory />} />
      <Route path="settings" element={<ProfileSetting />} />
    </Routes>
  );
};

export default ProfileRoutes; 