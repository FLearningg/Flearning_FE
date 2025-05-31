import React, { useState, useEffect } from "react";
import { ChatInterface } from "./ChatInterface";
import "../../assets/StudentMsg/StudentMsgGlobal.css";
import { FaComments } from "react-icons/fa";

export function StudentMessage() {
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
  );
}
