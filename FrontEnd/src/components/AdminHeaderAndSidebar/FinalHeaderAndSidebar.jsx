import React from "react";
import { useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { HeaderMsg } from "./HeaderMsg";
import "../../assets/AdminHeaderAndSidebar/FinalHeaderAndSidebar.css";

const routeTitleMap = {
  "/admin/dashboard": "Dashboard",
  "/admin/courses/basic-information": "Create New Course",
  "/admin/courses/advance-information": "Create New Course",
  "/admin/courses/curriculum": "Create New Course",
  "/admin/courses/publish": "Create New Course",
  "/admin/courses/all": "My Courses",
  "/admin/courses": "Course Details",
  "/admin/earning": "Earning",
  "/admin/discounts": "Discounts",
  "/admin/users": "Manage Users",
  "/admin/settings": "Settings",
  // Add more mappings as needed
};

function getTitleFromPath(pathname) {
  // Find the best match for the current path
  for (const route in routeTitleMap) {
    if (
      (route.endsWith("/") && pathname.startsWith(route)) ||
      (!route.endsWith("/") && pathname === route) ||
      pathname.startsWith(route)
    ) {
      return routeTitleMap[route];
    }
  }
  return "Dashboard";
}

const FinalHeaderAndSidebar = ({ children }) => {
  const location = useLocation();
  const title = getTitleFromPath(location.pathname);

  // Add sidebar open state
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // Handler for hamburger click
  const handleHamburgerClick = () => setSidebarOpen(true);
  // Handler to close sidebar
  const handleSidebarClose = () => setSidebarOpen(false);

  // Clone children with title prop if needed
  let childWithProps = children;
  if (React.isValidElement(children)) {
    childWithProps = React.cloneElement(children, { title });
  }

  return (
    <div className="ahs-admin-layout">
      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        className="Sidebar"
      />
      <div className="ahs-main-content">
        <HeaderMsg title={title} onHamburgerClick={handleHamburgerClick} />
        <div className="ahs-content-area">{childWithProps}</div>
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
