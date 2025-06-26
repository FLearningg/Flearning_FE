import React from "react";
import { Routes, Route } from "react-router-dom";

import AppLayout from "../layouts/AppLayout";

import mainRoutesContent from "./mainRoutes";
import authRoutesContent from "./authRoutes";

import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import RoleBasedRoute from "../components/ProtectedRouteRoleBasedRoute";

import adminRoutesContent from "./adminRoutes";

import ErrorPage from "../pages/MainPage/ErrorPage";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        {/* Nhúng trực tiếp JSX của mainRoutesContent */}
        {mainRoutesContent}

        {/* Nhúng trực tiếp JSX của authRoutesContent */}
        {authRoutesContent}
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
