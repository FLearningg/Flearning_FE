import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import '../../assets/CourseList/ProfileSection.css';

const NAV_ITEMS = [
  { path: '/profile/dashboard', label: 'Dashboard' },
  { path: '/profile/courses', label: 'Courses' },
  { path: '/profile/teachers', label: 'Teachers' },
  { path: '/profile/message', label: 'Message' },
  { path: '/profile/wishlist', label: 'Wishlist' },
  { path: '/profile/purchase-history', label: 'Purchase History' },
  { path: '/profile/settings', label: 'Settings' }
];

const ProfileSection = ({ 
  avatar, 
  name, 
  title,
  activePath,
  showMobileHeader = false
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {showMobileHeader && (
        <div className="course-mobile-header">
          <button
            className="course-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
          <h2>My Courses</h2>
        </div>
      )}

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
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
};

ProfileSection.propTypes = {
  avatar: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  activePath: PropTypes.string.isRequired,
  showMobileHeader: PropTypes.bool
};

export default ProfileSection; 