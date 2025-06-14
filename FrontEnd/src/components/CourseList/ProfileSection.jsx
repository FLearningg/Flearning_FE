import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import '../../assets/CourseList/ProfileSection.css';

const NAV_ITEMS = [
  { path: '/profile/dashboard', label: 'Dashboard' },
  { path: '/profile/courses', label: 'My Courses' },
  { path: '/profile/message', label: 'Messages' },
  { path: '/profile/wishlist', label: 'Wishlist' },
  { path: '/profile/cart', label: 'Shopping Cart' },
  { path: '/profile/purchase-history', label: 'Purchase History' },
  { path: '/profile/settings', label: 'Settings' }
];

const ProfileSection = ({ 
  avatar, 
  name, 
  title,
  activePath,
  wrapperBackground = "#FFEEE8",
  useFullWidthWrapper = true,
  children
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Tự động tạo mobile header title từ activePath
  const getMobileHeaderTitle = () => {
    const currentItem = NAV_ITEMS.find(item => item.path === activePath);
    return currentItem ? currentItem.label : "Profile";
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
              src={avatar}
              alt={name}
              className="profile-avatar"
              loading="lazy"
            />
            <div>
              <h4>{name}</h4>
              <p>{title}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="course-nav-container">
        <nav
          className={`course-nav ${mobileMenuOpen ? "course-nav-mobile-open" : ""}`}
          role="navigation"
          aria-label="Main navigation"
        >
          {NAV_ITEMS.map(item => (
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
        {children && (
          <div className="profile-container">
            {children}
          </div>
        )}
      </>
    );
  }

  return profileContent;
};

ProfileSection.propTypes = {
  avatar: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  activePath: PropTypes.string.isRequired,
  wrapperBackground: PropTypes.string,
  useFullWidthWrapper: PropTypes.bool,
  children: PropTypes.node
};

export default ProfileSection; 