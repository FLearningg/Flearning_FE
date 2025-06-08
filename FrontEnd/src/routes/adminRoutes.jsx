import React from "react";
import { Route } from "react-router-dom";

import AdminDashboard from "../components/AdminDashboard/AdminDashboard";
import AdminEarning from "../components/AdminEarning/AdminEarning";

const adminRoutesContent = // Đây là JSX, không phải là một component
  <Route path="dashboard" element={<AdminDashboard title="Dashboard" />} />;
  <Route path="earning" element={<AdminEarning title="Earning" />} />;
export default adminRoutesContent; // Export trực tiếp JSX fragment
