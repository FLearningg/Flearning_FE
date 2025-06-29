import React from "react";
import "../../assets/header/header.css";
import SearchBar from "./SearchBar";
import HeaderRight from "./HeaderRight";
import LogoHeader from "./LogoHeader";
import MobileHeader from "./MobileHeader";
import NavigationBar from "./NavigationBar";
import { useSelector } from "react-redux";

function Header() {
  const { currentUser } = useSelector((state) => state.auth);

  return (
    <>
      <div
        className="desktop-view-nav position-fixed w-100"
        style={{ zIndex: 2000 }}
      >
        <NavigationBar />
        <nav className="navbar navbar-light bg-light pb-3 pt-3 border-bottom">
          <div className="container-fluid mx-2">
            <div className="d-flex w-100 align-items-center">
              <LogoHeader />
              <div className="ms-3">
                <SearchBar />
              </div>
              <div className="ms-auto">
                <HeaderRight user={currentUser} />
              </div>
            </div>
          </div>
        </nav>
      </div>
      <div className="position-fixed w-100" style={{ zIndex: 2000 }}>
        <MobileHeader user={currentUser} />
      </div>
    </>
  );
}

export default Header;
