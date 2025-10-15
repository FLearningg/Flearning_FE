import "../../assets/AdminHeaderAndSidebar/Sidebar.css";
import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/authSlice";

export function InstructorSidebar({ open, setOpen, isMobile }) {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    if (isMobile) {
      setOpen(false);
    }
  };

  const handleNavClick = () => {
    if (isMobile) {
      setOpen(false);
    }
  };

  const handleLogoClick = () => {
    // Force scroll to top when logo is clicked
    setTimeout(() => {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      window.scrollTo(0, 0);
    }, 100);

    // Also call the existing nav click handler
    handleNavClick();
  };

  const displayName = currentUser
    ? `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim() ||
      currentUser.userName ||
      "Instructor"
    : "Instructor";

  // Build class names
  const sidebarClasses = ["ahs-sidebar", isMobile && open ? "ahs-open" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && open && (
        <div className="ahs-sidebar-overlay" onClick={() => setOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={sidebarClasses}>
        {/* Sidebar Header */}
        <div className="ahs-sidebar-header">
          <NavLink to="/" className="ahs-logo-link" onClick={handleLogoClick}>
            <div className="ahs-logo-icon">
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
            <span className="ahs-logo-text">F-Learning</span>
          </NavLink>

          {/* User Info for Mobile */}
          {isMobile && (
            <div className="ahs-mobile-user-info">
              <div className="ahs-mobile-user-avatar">
                <img
                  src={currentUser?.userImage || "/images/defaultImageUser.png"}
                  alt="Profile"
                  onError={(e) => {
                    e.target.src = "/images/defaultImageUser.png";
                  }}
                />
              </div>
              <div className="ahs-mobile-user-details">
                <div className="ahs-mobile-user-name">{displayName}</div>
                <div className="ahs-mobile-user-role">Instructor</div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="ahs-sidebar-nav">
          <ul className="ahs-nav-list">
            <NavItem
              href="/instructor/dashboard"
              icon="bar-chart"
              label="Dashboard"
              active={location.pathname.startsWith("/instructor/dashboard")}
              onClick={handleNavClick}
            />
            <NavItem
              href="/instructor/courses/new"
              icon="plus-circle"
              label="Create New Course"
              active={location.pathname.startsWith("/instructor/courses/new")}
              onClick={handleNavClick}
            />
            <NavItem
              href="/instructor/courses"
              icon="book"
              label="My Courses"
              active={location.pathname.startsWith("/instructor/courses") && !location.pathname.includes("/new")}
              onClick={handleNavClick}
            />
            <NavItem
              href="/instructor/discounts"
              icon="tag"
              label="Discounts"
              active={location.pathname.startsWith("/instructor/discounts")}
              onClick={handleNavClick}
            />
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="ahs-sidebar-footer">
          <button className="ahs-sign-out-button" onClick={handleLogout}>
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
    <li className={`ahs-nav-item ${active ? "ahs-active" : ""}`}>
      <NavLink to={href} className="ahs-nav-link" onClick={onClick}>
        <span className="ahs-nav-icon">
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
          {icon === "tag" && (
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
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
              <line x1="7" y1="7" x2="7.01" y2="7"></line>
            </svg>
          )}
        </span>
        <span className="ahs-nav-label">{label}</span>
        {badge && <div className="ahs-nav-badge">{badge}</div>}
      </NavLink>
    </li>
  );
}
