import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { getProfile } from "../../services/profileService";
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

// Cache for profile data

const ProfileSection = ({
  activePath,
  wrapperBackground = "#FFEEE8",
  useFullWidthWrapper = true,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    biography: "",
    userImage: DEFAULT_PROFILE_IMAGE,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch profile data
  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await getProfile();
      const data = response.data.data;

      const newProfileData = {
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        biography: data.biography || "",
        userImage: data.userImage || DEFAULT_PROFILE_IMAGE,
      };

      setProfileData(newProfileData);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError("Failed to load profile data");
      setProfileData((prev) => ({
        ...prev,
        userImage: DEFAULT_PROFILE_IMAGE,
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // Luôn fetch profile khi mount
  useEffect(() => {
    fetchProfileData();
  }, []);

  // Get mobile header title
  const getMobileHeaderTitle = () => {
    const currentItem = NAV_ITEMS.find((item) => item.path === activePath);
    return currentItem ? currentItem.label : "Profile";
  };

  const displayName =
    profileData.firstName || profileData.lastName
      ? `${profileData.firstName} ${profileData.lastName}`.trim()
      : "User";

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
            {isLoading ? (
              <div className="profile-loading">Loading...</div>
            ) : error ? (
              <div className="profile-error">{error}</div>
            ) : (
              <>
                <img
                  src={profileData.userImage || DEFAULT_PROFILE_IMAGE}
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
                  <p>{profileData.biography || "Student"}</p>
                </div>
              </>
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
          {NAV_ITEMS.map((item) => (
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
