import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { InstructorSidebar } from "./InstructorSidebar";
import { HeaderMsg } from "../AdminHeaderAndSidebar/HeaderMsg";
import "../../assets/AdminHeaderAndSidebar/FinalHeaderAndSidebar.css";

const routeTitleMap = {
  "/instructor/dashboard": "Dashboard",
  "/instructor/profile/edit": "Profile",
  "/instructor/discounts": "Discounts",
  "/instructor/courses/new": "Create New Course",
  "/instructor/courses": "My Courses",
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

const InstructorLayout = ({ children }) => {
  const location = useLocation();
  const title = getTitleFromPath(location.pathname);

  // Add sidebar open state and responsive detection
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Use refs to avoid infinite loops
  const sidebarOpenRef = useRef(sidebarOpen);
  const isMobileRef = useRef(isMobile);

  // Update refs when state changes
  useEffect(() => {
    sidebarOpenRef.current = sidebarOpen;
  }, [sidebarOpen]);

  useEffect(() => {
    isMobileRef.current = isMobile;
  }, [isMobile]);

  // Handle resize events
  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      const newIsMobile = width <= 768;

      // Only update if mobile state actually changed
      if (newIsMobile !== isMobileRef.current) {
        setIsMobile(newIsMobile);

        // Only auto-close sidebar when switching from desktop to mobile
        if (newIsMobile && !isMobileRef.current && sidebarOpenRef.current) {
          setSidebarOpen(false);
        }
      }
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []); // No dependencies to prevent infinite loops

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Handler for hamburger click (only for mobile)
  const handleHamburgerClick = () => {
    if (isMobile) {
      const newState = !sidebarOpen;
      setSidebarOpen(newState);
    }
  };

  // Clone children with title prop if needed
  let childWithProps = children;
  if (React.isValidElement(children)) {
    childWithProps = React.cloneElement(children, { title });
  }

  return (
    <div className="ahs-admin-layout">
      <InstructorSidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        className="ahs-sidebar"
        isMobile={isMobile}
      />
      <div className="ahs-main-content">
        <HeaderMsg
          title={title}
          onHamburgerClick={handleHamburgerClick}
          isMobile={isMobile}
        />
        <div className="ahs-content-area">{childWithProps}</div>
        <footer className="ahs-footer">
          <div className="ahs-footer-left">
            © 2021 - Eduguard. Designed by{" "}
            <span className="ahs-footer-link"> FLearing</span>. All rights
            reserved
          </div>
          <div className="ahs-footer-right">
            <span className="ahs-footer-link">FAQs</span>
            <span className="ahs-footer-link">Privacy Policy</span>
            <span className="ahs-footer-link">Terms & Condition</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default InstructorLayout;
