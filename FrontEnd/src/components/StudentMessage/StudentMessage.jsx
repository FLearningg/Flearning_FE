import { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { HeaderMsg } from "./HeaderMsg";
import { ChatInterface } from "./ChatInterface";
import "../../assets/StudentMsg/StudentMsgGlobal.css";

export function StudentMessage() {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <HeaderMsg />
        <div className="main-area">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
}
