import "../../assets/AdminHeaderAndSidebar/HeaderMsg.css";
import { FaBars, FaComments } from "react-icons/fa";
import React from "react";
import Notification from "../header/Notification";
import SearchBar from "../header/SearchBar";

export function HeaderMsg({ onHamburgerClick, title = "Dashboard" }) {
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
        <h1 className="title">{title}</h1>
      </div>
      <div className="header-right">
        <div style={{ minWidth: 220, maxWidth: 350, width: 250 }}>
          <SearchBar />
        </div>
        <div style={{ marginLeft: 16 }}>
          <Notification />
        </div>
        <div className="profile-image">
          <img src="/placeholder.svg?height=40&width=40" alt="Profile" />
        </div>
      </div>
    </header>
  );
}
