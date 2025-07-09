import React from "react";
import { Link } from "react-router-dom";

function LogoHeader() {
  const handleLogoClick = () => {
    // Force scroll to top when logo is clicked
    setTimeout(() => {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      window.scrollTo(0, 0);
    }, 100);
  };

  return (
    <>
      <Link
        to={"/"}
        className="navbar-brand navbar--brand"
        onClick={handleLogoClick}
      >
        <img src="/images/Logo.png" alt="" className="logo" />
      </Link>
    </>
  );
}

export default LogoHeader;
