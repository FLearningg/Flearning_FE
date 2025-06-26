import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Spin } from "antd";

const RoleBasedRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  const { isAuthenticated, isLoading, currentUser } = useSelector(
    (state) => state.auth
  );

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/404-not-found" replace />; // Bạn có thể dùng bất kỳ đường dẫn nào không tồn tại
  }

  // Nếu hợp lệ, cho phép truy cập
  return children;
};

export default RoleBasedRoute;
