import "../../assets/AdminHeaderAndSidebar/Sidebar.css";
import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export function Sidebar({ open, setOpen }) {
  const location = useLocation();
  const [activeHref, setActiveHref] = useState("/admin/dashboard");
  // Only show overlay on tablet/mobile screens
  const isMobile =
    typeof window !== "undefined" &&
    window.innerWidth <= 768 &&
    window.innerHeight <= 683;

  // Update activeHref when the URL changes
  useEffect(() => {
    setActiveHref(location.pathname);
  }, [location.pathname]);

  return (
    <>
      {isMobile && open && (
        <div
          className="sidebar-overlay"
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.2)",
            zIndex: 999,
          }}
        />
      )}
      <div
        className={`sidebar${isMobile && open ? " open" : ""}`}
        style={isMobile && !open ? { width: 0, minWidth: 0 } : {}}
      >
        <div className="sidebar-header">
          <NavLink to="/" className="logo-link">
            <div className="logo-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
            </div>
            <span className="logo-text">F-Learning</span>
          </NavLink>
        </div>

        <nav className="sidebar-nav">
          <ul className="nav-list">
            <NavItem
              href="/admin/dashboard"
              icon="bar-chart"
              label="Dashboard"
              active={activeHref === "/admin/dashboard"}
              onClick={() => setActiveHref("/admin/dashboard")}
            />
            <NavItem
              href="/admin/courses/basic-information"
              icon="plus-circle"
              label="Create New Course"
              active={activeHref === "/admin/courses/basic-information"}
              onClick={() => setActiveHref("/admin/courses/basic-information")}
            />
            <NavItem
              href="/admin/my-courses"
              icon="book"
              label="My Courses"
              active={activeHref === "/admin/my-courses"}
              onClick={() => setActiveHref("/admin/my-courses")}
            />
            <NavItem
              href="/admin/earning"
              icon="dollar-sign"
              label="Earning"
              active={activeHref === "/admin/earning"}
              onClick={() => setActiveHref("/admin/earning")}
            />
            <NavItem
              href="/admin/message"
              icon="message-circle"
              label="Message"
              active={activeHref === "/admin/message"}
              badge="3"
              onClick={() => setActiveHref("/admin/message")}
            />
            <NavItem
              href="/admin/settings"
              icon="settings"
              label="Settings"
              active={activeHref === "/admin/settings"}
              onClick={() => setActiveHref("/admin/settings")}
            />
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button className="sign-out-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>Sign-out</span>
          </button>
        </div>
      </div>
    </>
  );
}
function NavItem({ href, icon, label, active, badge, onClick }) {
  return (
    <li className={`nav-item ${active ? "active" : ""}`} onClick={onClick}>
      <NavLink to={href} className="nav-link">
        <span className="nav-icon">
          {icon === "bar-chart" && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="20" x2="18" y2="10"></line>
              <line x1="12" y1="20" x2="12" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="14"></line>
            </svg>
          )}
          {icon === "plus-circle" && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
          )}
          {icon === "book" && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
          )}
          {icon === "dollar-sign" && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          )}
          {icon === "message-circle" && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
          )}
          {icon === "settings" && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          )}
        </span>
        <span className="nav-label">{label}</span>
        {badge && <div className="nav-badge">{badge}</div>}
      </NavLink>
    </li>
  );
}
