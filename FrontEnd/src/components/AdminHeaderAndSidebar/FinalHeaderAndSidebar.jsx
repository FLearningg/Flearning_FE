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
        <footer className="cf-footer">
          <div className="cf-footer-left">
            © 2021 - Eduguard. Designed by{" "}
            <span className="cf-footer-link"> FLearing</span>. All rights
            reserved
          </div>
          <div className="cf-footer-right">
            <span className="cf-footer-link">FAQs</span>
            <span className="cf-footer-link">Privacy Policy</span>
            <span className="cf-footer-link">Terms & Condition</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default FinalHeaderAndSidebar;
