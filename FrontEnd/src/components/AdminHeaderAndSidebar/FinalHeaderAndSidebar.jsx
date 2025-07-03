import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { HeaderMsg } from "./HeaderMsg";
import "../../assets/AdminHeaderAndSidebar/FinalHeaderAndSidebar.css";

const routeTitleMap = {
  "/admin/dashboard": "Dashboard",
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

      console.log("Resize detected:", {
        width,
        newIsMobile,
        currentIsMobile: isMobileRef.current,
      });

      // Only update if mobile state actually changed
      if (newIsMobile !== isMobileRef.current) {
        setIsMobile(newIsMobile);

        // Only auto-close sidebar when switching from desktop to mobile
        if (newIsMobile && !isMobileRef.current && sidebarOpenRef.current) {
          console.log("Auto-closing sidebar due to resize (desktop to mobile)");
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
      console.log("Route changed, closing sidebar");
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Handler for hamburger click (only for mobile)
  const handleHamburgerClick = () => {
    console.log(
      "Hamburger clicked!",
      "isMobile:",
      isMobile,
      "current sidebarOpen:",
      sidebarOpen,
      "will set to:",
      !sidebarOpen
    );

    if (isMobile) {
      const newState = !sidebarOpen;
      console.log("Setting sidebarOpen to:", newState);
      setSidebarOpen(newState);
    } else {
      console.log("Not mobile, ignoring hamburger click");
    }
  };

  // Debug effect to track state changes
  useEffect(() => {
    console.log("Sidebar state changed:", { sidebarOpen, isMobile });
  }, [sidebarOpen, isMobile]);

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

export default FinalHeaderAndSidebar;
