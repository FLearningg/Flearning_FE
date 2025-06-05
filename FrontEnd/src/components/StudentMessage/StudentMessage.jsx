import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ChatInterface } from "./ChatInterface";
import ProfileSection from "../CourseList/ProfileSection";
import "../../assets/StudentMsg/StudentMsgGlobal.css";
import { FaComments } from "react-icons/fa";

export function StudentMessage() {
  const location = useLocation();
  const [chatListOpen, setChatListOpen] = useState(false);
  // Responsive: close sidebar on resize if not mobile
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
    <div className="profile-container">
      <ProfileSection 
        avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80"
        name="Kevin Gilbert"
        title="Web Designer & Best-Selling Instructor"
        activePath={location.pathname}
        showMobileHeader={false}
      />
      
      <div className="app-container">
        <div className="main-area">
          {isTablet && (
            <>
              <button
                className="icon-btn chat-btn"
                onClick={() => setChatListOpen(true)}
                aria-label="Open chat list"
              >
                <FaComments size={24} />
              </button>
            </>
          )}
          <ChatInterface
            chatListOpen={chatListOpen}
            setChatListOpen={setChatListOpen}
          />
        </div>
      </div>
    </div>
  );
}
