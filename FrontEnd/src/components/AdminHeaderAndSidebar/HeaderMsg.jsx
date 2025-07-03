import "../../assets/AdminHeaderAndSidebar/HeaderMsg.css";
import {
  FaBars,
  FaComments,
  FaUser,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/authSlice";
import Notification from "../header/Notification";
import SearchBar from "../header/SearchBar";

export function HeaderMsg({ onHamburgerClick, title = "Dashboard", isMobile }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.auth);

  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [greeting, setGreeting] = useState("Good Morning");

  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const toggleUserDropdown = () => {
    setShowUserDropdown(!showUserDropdown);
  };

  const handleClickOutside = (e) => {
    if (!e.target.closest(".ahs-profile-dropdown")) {
      setShowUserDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const displayName = currentUser
    ? `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim() ||
      currentUser.userName ||
      "User"
    : "User";

  return (
    <header className="ahs-header">
      <div className="ahs-header-icon-buttons" style={{ marginRight: 12 }}>
        {isMobile && (
          <button
            className="ahs-icon-btn ahs-hamburger-btn"
            onClick={onHamburgerClick}
            aria-label="Open sidebar"
          >
            <FaBars size={24} />
          </button>
        )}
      </div>

      <div className="ahs-header-left">
        <div className="ahs-greeting">
          {greeting}, {displayName}
        </div>
        <h1 className="ahs-title">{title}</h1>
      </div>

      <div className="ahs-header-right">
        <div className="ahs-search-container">
          <SearchBar />
        </div>

        <div className="ahs-notification-container">
          <Notification />
        </div>

        <div className="ahs-profile-dropdown">
          <div className="ahs-profile-image" onClick={toggleUserDropdown}>
            <img
              src={currentUser?.userImage || "/images/defaultImageUser.png"}
              alt="Profile"
              onError={(e) => {
                e.target.src = "/images/defaultImageUser.png";
              }}
            />
            <div className="ahs-profile-status"></div>
          </div>

          {showUserDropdown && (
            <div className="ahs-user-dropdown-menu">
              <div className="ahs-dropdown-header">
                <div className="ahs-dropdown-avatar">
                  <img
                    src={
                      currentUser?.userImage || "/images/defaultImageUser.png"
                    }
                    alt="Profile"
                    onError={(e) => {
                      e.target.src = "/images/defaultImageUser.png";
                    }}
                  />
                </div>
                <div className="ahs-dropdown-user-info">
                  <div className="ahs-dropdown-user-name">{displayName}</div>
                  <div className="ahs-dropdown-user-email">
                    {currentUser?.email || "user@example.com"}
                  </div>
                </div>
              </div>

              <div className="ahs-dropdown-divider"></div>

              <div className="ahs-dropdown-actions">
                <button
                  className="ahs-dropdown-action-item"
                  onClick={() => {
                    navigate("/profile/dashboard");
                    setShowUserDropdown(false);
                  }}
                >
                  <FaUser size={16} />
                  <span>Profile</span>
                </button>

                <button
                  className="ahs-dropdown-action-item"
                  onClick={() => {
                    navigate("/profile/settings");
                    setShowUserDropdown(false);
                  }}
                >
                  <FaCog size={16} />
                  <span>Settings</span>
                </button>

                <div className="ahs-dropdown-divider"></div>

                <button
                  className="ahs-dropdown-action-item ahs-logout"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
