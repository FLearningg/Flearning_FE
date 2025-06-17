import { faCog, faSignOutAlt, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth"; 
import Notification from "./Notification";
import WishList from "./WishList";

function HeaderRight({ user: currentUser }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); 
    navigate('/login'); 
  };

  return (
    <>
      <div className="d-flex align-items-center gap-1">
        {currentUser ? (
          <>
            <Notification />
            <WishList />
            <Link to="/profile/cart">
              <button className="btn btn-light rounded-circle icon-btn">
                <img src="/icons/cart.png" className="icon" alt="" />
              </button>
            </Link>
          </>
        ) : (
          <></>
        )}
        {currentUser ? (
          <div className="ms-2 dropdown">
            <img
              src={currentUser.userImage || '/images/defaultImageUser.png'}
              alt=""
              className="rounded-circle"
              style={{ width: "40px", height: "40px", cursor: "pointer", objectFit: 'cover' }}
              id="userDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            />
            <ul
              className="dropdown-menu dropdown-menu-end fade"
              aria-labelledby="userDropdown"
            >
              <li>
                <Link to={"#"} className="dropdown-item dropdown-item-hover">
                  <FontAwesomeIcon icon={faUser} className="me-2" /> Profile
                </Link>
              </li>
              <li>
                <Link to={"#"} className="dropdown-item dropdown-item-hover">
                  <FontAwesomeIcon icon={faCog} className="me-2" />
                  Settings
                </Link>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <button onClick={handleLogout} className="dropdown-item dropdown-item-hover">
                  <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                  Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <div className="ms-2 mt-3 mt-md-0">
            <Link to="/signup">
              <button className="create-account-btn p-2 px-3 mb-2">
                Create account
              </button>
            </Link>
            <Link to="/login">
              <button className="sign-in-btn p-2 px-3 ms-2">Sign in</button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

export default HeaderRight;