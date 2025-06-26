import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { getProfile } from "../../services/profileService";
import "../../assets/CourseList/ProfileSection.css";

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
  const [profileData, setProfileData] = useState({
    userImage: "/images/defaultImageUser.png",
    firstName: "",
    lastName: "",
    userName: "Loading...",
    email: "",
    biography: "Loading..."
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        if (response.data.success) {
          const { data } = response.data;
          setProfileData({
            userImage: data.userImage || "/images/defaultImageUser.png",
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            userName: data.userName || "No Username",
            email: data.email || "",
            biography: data.biography || "No biography available"
          });
        } else {
          throw new Error(response.data.message || "Failed to fetch profile");
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        setProfileData({
          userImage: "/images/defaultImageUser.png",
          firstName: "",
          lastName: "",
          userName: "Error loading profile",
          email: "",
          biography: "Could not load profile information"
        });
      }
    };

    fetchProfile();
  }, []);

  // Tự động tạo mobile header title từ activePath
  const getMobileHeaderTitle = () => {
    const currentItem = NAV_ITEMS.find((item) => item.path === activePath);
    return currentItem ? currentItem.label : "Profile";
  };

  const getFullName = () => {
    if (profileData.firstName && profileData.lastName) {
      return `${profileData.firstName} ${profileData.lastName}`;
    } else if (profileData.firstName) {
      return profileData.firstName;
    } else if (profileData.lastName) {
      return profileData.lastName;
    }
    return profileData.userName;
  };

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
            <img
              src={profileData.userImage}
              alt={getFullName()}
              className="profile-avatar"
              loading="lazy"
              onError={(e) => {
                e.target.src = "/images/defaultImageUser.png";
              }}
            />
            <div>
              <h4>{getFullName()}</h4>
              <p>{profileData.biography}</p>
            </div>
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
