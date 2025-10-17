import React from "react";
import { Routes, Route } from "react-router-dom";

import AppLayout from "../layouts/AppLayout";

import mainRoutesContent from "./mainRoutes";
import { authRoutesWithLayout, authRoutesWithoutLayout } from "./authRoutes";

import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import RoleBasedRoute from "../components/ProtectedRoute/RoleBasedRoute";

import adminRoutesContent from "./adminRoutes";
import instructorRoutesContent from "./instructorRoutes";

import ErrorPage from "../pages/MainPage/ErrorPage";
import InstructorRegisterPage from "../pages/AuthPage/InstructorRegisterPage";

const AppRouter = () => {
  return (
    <Routes>
      {/* Auth routes without layout (verify email, check email, confirmation pages) */}
      {authRoutesWithoutLayout}
      
      <Route path="/" element={<AppLayout />}>
        {/* Main routes */}
        {mainRoutesContent}

        {/* Auth routes with layout (login, signup, forgot password) */}
        {authRoutesWithLayout}
        
        <Route path="*" element={<ErrorPage />} />
      </Route>
      <Route
        path="/admin/*" // Dùng wildcard '*' để khớp với tất cả các đường dẫn con
        element={
          <RoleBasedRoute allowedRoles={["admin"]}>
            {/* Nếu user là admin, AppLayout sẽ được render */}
            <AppLayout />
          </RoleBasedRoute>
        }
      >
        {/* Các route của admin sẽ được render bên trong <Outlet /> của AppLayout */}
        {adminRoutesContent}
      </Route>
      {/* Instructor registration route - No authentication required */}
      <Route path="/instructor/register" element={<AppLayout />}>
        <Route index element={<InstructorRegisterPage />} />
      </Route>
      <Route
        path="/instructor/*" // Dùng wildcard '*' để khớp với tất cả các đường dẫn con
        element={
          <RoleBasedRoute allowedRoles={["instructor"]}>
            {/* Nếu user là instructor, AppLayout sẽ được render */}
            <AppLayout />
          </RoleBasedRoute>
        }
      >
        {/* Các route của instructor sẽ được render bên trong <Outlet /> của AppLayout */}
        {instructorRoutesContent}
      </Route>
      <Route
        path="*"
        element={
          <AppLayout>
            <ErrorPage />
          </AppLayout>
        }
      />
    </Routes>
  );
};

export default AppRouter;
