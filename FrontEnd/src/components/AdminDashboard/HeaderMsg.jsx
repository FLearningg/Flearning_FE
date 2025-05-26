import "../../assets/StudentMsg/HeaderMsg.css";
import { FaBars, FaComments } from "react-icons/fa";
import React from "react";

export function HeaderMsg({ onHamburgerClick }) {
  // Responsive check for tablet and below
  const [isTablet, setIsTablet] = React.useState(false);
  React.useEffect(() => {
    function handleResize() {
      setIsTablet(window.innerWidth <= 768 && window.innerHeight <= 683);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="header">
      <div className="header-icon-buttons" style={{ marginRight: 12 }}>
        {isTablet && (
          <>
            <button
              className="icon-btn hamburger-btn"
              onClick={onHamburgerClick}
              aria-label="Open sidebar"
            >
              <FaBars size={24} />
            </button>
          </>
        )}
      </div>
      <div className="header-left">
        <div className="greeting">Good Morning</div>
        <h1 className="title">Message (3)</h1>
      </div>
      <div className="header-right">
        <div className="search-container">
          <svg
            className="search-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" placeholder="Search" className="search-input" />
        </div>
        <div className="notification-container">
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
            className="notification-icon"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          <span className="notification-badge">3</span>
        </div>
        <div className="profile-image">
          <img src="/placeholder.svg?height=40&width=40" alt="Profile" />
        </div>
      </div>
    </header>
  );
}
