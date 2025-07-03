import "../../assets/AdminHeaderAndSidebar/Sidebar.css";
import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/authSlice";

export function Sidebar({ open, setOpen, isMobile }) {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.auth);

  // Debug logs
  useEffect(() => {
    console.log("Sidebar state:", { open, isMobile });
  }, [open, isMobile]);

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

  const displayName = currentUser
    ? `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim() ||
      currentUser.userName ||
      "Admin"
    : "Admin";

  // Build class names
  const sidebarClasses = ["ahs-sidebar", isMobile && open ? "ahs-open" : ""]
    .filter(Boolean)
    .join(" ");

  console.log("Sidebar classes:", sidebarClasses);

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
          <NavLink to="/" className="ahs-logo-link" onClick={handleNavClick}>
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
                <div className="ahs-mobile-user-role">Administrator</div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="ahs-sidebar-nav">
          <ul className="ahs-nav-list">
            <NavItem
              href="/admin/dashboard"
              icon="bar-chart"
              label="Dashboard"
              active={location.pathname.startsWith("/admin/dashboard")}
              onClick={handleNavClick}
            />
            <NavItem
              href="/admin/courses/new"
              icon="plus-circle"
              label="Create New Course"
              active={location.pathname.startsWith("/admin/courses/new")}
              onClick={handleNavClick}
            />
            <NavItem
              href="/admin/courses/all"
              icon="book"
              label="My Courses"
              active={location.pathname.endsWith("/admin/courses/all")}
              onClick={handleNavClick}
            />
            <NavItem
              href="/admin/earning"
              icon="dollar-sign"
              label="Earning"
              active={location.pathname.startsWith("/admin/earning")}
              onClick={handleNavClick}
            />
            <NavItem
              href="/admin/discounts"
              icon="tag"
              label="Discounts"
              active={location.pathname.startsWith("/admin/discounts")}
              onClick={handleNavClick}
            />
            <NavItem
              href="/admin/users"
              icon="users"
              label="Manage Users"
              active={location.pathname.startsWith("/admin/users")}
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
          {icon === "users" && (
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
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          )}
        </span>
        <span className="ahs-nav-label">{label}</span>
        {badge && <div className="ahs-nav-badge">{badge}</div>}
      </NavLink>
    </li>
  );
}
