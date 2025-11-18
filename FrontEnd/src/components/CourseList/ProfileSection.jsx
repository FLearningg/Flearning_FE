import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";
import "../../assets/CourseList/ProfileSection.css";

const DEFAULT_PROFILE_IMAGE = "/images/defaultImageUser.png";

const NAV_ITEMS = [
  { path: "/profile/dashboard", label: "Dashboard" },
  { path: "/profile/courses", label: "My Courses" },
  { path: "/profile/message", label: "Messages" },
  { path: "/profile/wishlist", label: "Wishlist" },
  { path: "/profile/cart", label: "Shopping Cart" },
  { path: "/profile/purchase-history", label: "Purchase History" },
  { path: "/profile/settings", label: "Settings" },
];

const ProfileSection = ({
  activePath,
  wrapperBackground = "#FFEEE8",
  useFullWidthWrapper = true,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Lấy trực tiếp currentUser từ Redux Store
  const { currentUser } = useSelector((state) => state.auth);

  // === 1. HÀM VIẾT HOA CHỮ CÁI ĐẦU ===
  const capitalizeFirstLetter = (string) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Get mobile header title
  const getMobileHeaderTitle = () => {
    const currentItem = NAV_ITEMS.find((item) => item.path === activePath);
    return currentItem ? currentItem.label : "Profile";
  };

  // Xử lý dữ liệu hiển thị từ currentUser
  const displayName = currentUser
    ? `${currentUser.firstName} ${currentUser.lastName}`.trim()
    : "User";

  const userImage = currentUser?.userImage || DEFAULT_PROFILE_IMAGE;
  const userRole = currentUser?.role || "student";

  // Logic lọc Menu: Nếu không phải student -> Chỉ hiện Message & Settings
  const filteredNavItems =
    userRole === "student"
      ? NAV_ITEMS
      : NAV_ITEMS.filter(
          (item) =>
            item.path === "/profile/message" ||
            item.path === "/profile/settings"
        );

  const profileContent = (
    <>
      <div className="course-mobile-header">
        <button
          className="course-mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
        <h2>{getMobileHeaderTitle()}</h2>
      </div>

      <div className="profile-section">
        <div className="profile-content">
          <div className="profile-info">
            {currentUser ? (
              <>
                <img
                  src={userImage}
                  alt={displayName}
                  className="profile-avatar"
                  loading="lazy"
                  onError={(e) => {
                    if (e.target.src !== DEFAULT_PROFILE_IMAGE) {
                      e.target.src = DEFAULT_PROFILE_IMAGE;
                    }
                  }}
                />
                <div>
                  <h4>{displayName}</h4>
                  {/* === 2. ÁP DỤNG HÀM Ở ĐÂY === */}
                  <p>{capitalizeFirstLetter(userRole)}</p>
                </div>
              </>
            ) : (
              <div className="profile-loading">Please login...</div>
            )}
          </div>
        </div>
      </div>

      <div className="course-nav-container">
        <nav
          className={`course-nav ${
            mobileMenuOpen ? "course-nav-mobile-open" : ""
          }`}
          role="navigation"
          aria-label="Main navigation"
        >
          {filteredNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`course-nav-link ${
                activePath === item.path ? "course-nav-link-active" : ""
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );

  if (useFullWidthWrapper) {
    return (
      <>
        <div
          className="profile-section-full-wrapper"
          style={{ backgroundColor: wrapperBackground }}
        >
          <div className="profile-section-inner-container">
            {profileContent}
          </div>
        </div>
        {children && <div className="profile-container">{children}</div>}
      </>
    );
  }

  return profileContent;
};

ProfileSection.propTypes = {
  activePath: PropTypes.string.isRequired,
  wrapperBackground: PropTypes.string,
  useFullWidthWrapper: PropTypes.bool,
  children: PropTypes.node,
};

export default ProfileSection;
