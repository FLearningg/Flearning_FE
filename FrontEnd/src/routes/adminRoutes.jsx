import React from "react";
import { Route } from "react-router-dom";

import AdminDashboard from "../components/AdminDashboard/AdminDashboard";

const adminRoutesContent = // Đây là JSX, không phải là một component
  <Route path="dashboard" element={<AdminDashboard title="Dashboard" />} />;

export default adminRoutesContent; // Export trực tiếp JSX fragment
