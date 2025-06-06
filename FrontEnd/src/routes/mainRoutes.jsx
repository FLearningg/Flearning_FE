// src/routes/mainRoutes.js
import React from "react";
import { Route } from "react-router-dom";
import { useLocation } from "react-router-dom";

import HomePage from "../components/HomePage/HomePage";
import FaqsPage from "../pages/MainPage/FaqsPage";
import CourseList from "../components/CourseList/CourseList";
import StudentDashboard from "../components/StudentDashboard/StudentDashboard";
import PurchaseHistory from "../components/PurchaseHistory/PurchaseHistory";
import { StudentMessage } from "../components/StudentMessage/StudentMessage";
import ProfileSection from "../components/CourseList/ProfileSection";
import FinalHeaderAndSidebar from "../components/AdminHeaderAndSidebar/FinalHeaderAndSidebar";
import CourseFormAdvance from "../components/CRUDCourseAndLesson/CourseFormAdvance";
import AdminDashboard from "../components/AdminDashboard/AdminDashboard";
import AdminEarning from "../components/AdminEarning/AdminEarning";
import CourseForm from "../components/CRUDCourseAndLesson/CourseForm";
// Import các trang khác nếu có

// Temporary placeholder components cho các trang chưa có
const Teachers = () => {
  const location = useLocation();
  return (
    <div className="profile-container">
      <ProfileSection
        avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80"
        name="Kevin Gilbert"
        title="Web Designer & Best-Selling Instructor"
        activePath={location.pathname}
        showMobileHeader={false}
      />
      <div className="page-content">
        <h1>Teachers</h1>
        <p>Teachers page coming soon...</p>
      </div>
    </div>
  );
};

const Wishlist = () => {
  const location = useLocation();
  return (
    <div className="profile-container">
      <ProfileSection
        avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80"
        name="Kevin Gilbert"
        title="Web Designer & Best-Selling Instructor"
        activePath={location.pathname}
        showMobileHeader={false}
      />
      <div className="page-content">
        <h1>Wishlist</h1>
        <p>Wishlist page coming soon...</p>
      </div>
    </div>
  );
};

const Settings = () => {
  const location = useLocation();
  return (
    <div className="profile-container">
      <ProfileSection
        avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80"
        name="Kevin Gilbert"
        title="Web Designer & Best-Selling Instructor"
        activePath={location.pathname}
        showMobileHeader={false}
      />
      <div className="page-content">
        <h1>Settings</h1>
        <p>Settings page coming soon...</p>
      </div>
    </div>
  );
};

const mainRoutesContent = // Đây là JSX, không phải là một component
  (
    <>
      <Route index element={<HomePage />} />{" "}
      {/* Route cho trang chủ (path "/") */}
      <Route path="faqs" element={<FaqsPage />} />
      <Route path="profile/dashboard" element={<StudentDashboard />} />
      <Route path="profile/courses" element={<CourseList />} />
      <Route path="profile/teachers" element={<Teachers />} />
      <Route path="profile/message" element={<StudentMessage />} />
      <Route path="profile/wishlist" element={<Wishlist />} />
      <Route path="profile/purchase-history" element={<PurchaseHistory />} />
      <Route path="profile/settings" element={<Settings />} />
      <Route
        path="admin/dashboard"
        element={
          <FinalHeaderAndSidebar>
            <AdminDashboard title="Dashboard" />
          </FinalHeaderAndSidebar>
        }
      />
      <Route
        path="admin/earning"
        element={
          <FinalHeaderAndSidebar>
            <AdminEarning title="Earning" />
          </FinalHeaderAndSidebar>
        }
      />
      <Route
        path="admin/courses/basic-information"
        element={
          <FinalHeaderAndSidebar>
            <CourseForm title="Create New Course" />
          </FinalHeaderAndSidebar>
        }
      />
      <Route
        path="admin/courses/advance-information"
        element={
          <FinalHeaderAndSidebar>
            <CourseFormAdvance title="Create New Course" />
          </FinalHeaderAndSidebar>
        }
      />
      {/* <Route path="courses" element={<CoursesPage />} /> */}
      {/* Thêm các route chính khác ở đây */}
    </>
  );

export default mainRoutesContent; // Export trực tiếp JSX fragment
