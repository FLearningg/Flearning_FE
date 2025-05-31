import React from "react";
import { Sidebar } from "./Sidebar";
import { HeaderMsg } from "./HeaderMsg";
import "../../assets/AdminHeaderAndSidebar/FinalHeaderAndSidebar.css";
const FinalHeaderAndSidebar = ({ children }) => {
  return (
    <div className="admin-layout">
      <Sidebar className="Sidebar" />
      <div className="main-content">
        <HeaderMsg />
        <div className="content-area">{children}</div>
      </div>
    </div>
  );
};

export default FinalHeaderAndSidebar;
