import { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { HeaderMsg } from "./HeaderMsg";
import { ChatInterface } from "./ChatInterface";
import "../../assets/StudentMsg/StudentMsgGlobal.css";

export function StudentMessage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatListOpen, setChatListOpen] = useState(false);
  // Responsive: close sidebar on resize if not mobile
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 600) setSidebarOpen(false);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div className="app-container">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="main-content">
        <HeaderMsg
          onHamburgerClick={() => setSidebarOpen((v) => !v)}
          onChatToggle={() => setChatListOpen((v) => !v)}
        />
        <div className="main-area">
          <ChatInterface
            chatListOpen={chatListOpen}
            setChatListOpen={setChatListOpen}
          />
        </div>
      </div>
    </div>
  );
}
