import React from "react";
import { Sidebar } from "./Sidebar";
import { HeaderMsg } from "./HeaderMsg";
import "../../assets/AdminHeaderAndSidebar/FinalHeaderAndSidebar.css";

const FinalHeaderAndSidebar = ({ children }) => {
  // If children is a React element, extract its props
  let title = "Dashboard";
  let childWithProps = children;

  if (React.isValidElement(children) && children.props.title) {
    title = children.props.title;
  }

  // Add sidebar open state
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // Handler for hamburger click
  const handleHamburgerClick = () => setSidebarOpen(true);
  // Handler to close sidebar
  const handleSidebarClose = () => setSidebarOpen(false);

  return (
    <div className="admin-layout">
      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        className="Sidebar"
      />
      <div className="main-content">
        <HeaderMsg title={title} onHamburgerClick={handleHamburgerClick} />
        <div className="content-area">{childWithProps}</div>
      </div>
    </div>
  );
};

export default FinalHeaderAndSidebar;
