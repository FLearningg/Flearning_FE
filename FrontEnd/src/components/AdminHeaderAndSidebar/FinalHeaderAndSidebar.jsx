import React from "react";
import { Sidebar } from "./Sidebar";
import { HeaderMsg } from "./HeaderMsg";
import "../../assets/AdminHeaderAndSidebar/FinalHeaderAndSidebar.css";

const FinalHeaderAndSidebar = ({ children }) => {
  // If children is a React element, extract its props
  let title = "Dashboard";
  let childWithProps = children;

  if (React.isValidElement(children) && children.props.title) {
    title = children.props.title;
  }

  // Add sidebar open state
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // Handler for hamburger click
  const handleHamburgerClick = () => setSidebarOpen(true);
  // Handler to close sidebar
  const handleSidebarClose = () => setSidebarOpen(false);

  return (
    <div className="admin-layout">
      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        className="Sidebar"
      />
      <div className="main-content">

        <HeaderMsg title={title} onHamburgerClick={handleHamburgerClick} />
        <div className="content-area">{childWithProps}</div>
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
