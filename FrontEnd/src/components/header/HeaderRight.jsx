import { faCog, faSignOutAlt, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTachometerAlt } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";
import Notification from "./Notification";
import WishList from "./WishList";

function HeaderRight({ user: currentUser }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is in instructor dashboard area
  const isInInstructorArea = location.pathname.startsWith("/instructor");

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <>
      <div className="d-flex align-items-center gap-1">
        {currentUser ? (
          <>
            <div className="d-none d-sm-block">
              <Notification />
            </div>
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
              src={currentUser.userImage || "/images/defaultImageUser.png"}
              alt=""
              className="rounded-circle"
              style={{
                width: "40px",
                height: "40px",
                cursor: "pointer",
                objectFit: "cover",
              }}
              id="userDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            />
            <ul
              className="dropdown-menu dropdown-menu-end fade"
              aria-labelledby="userDropdown"
            >
              {/* Admin always sees Dashboard */}
              {currentUser.role === "admin" && (
                <li>
                  <Link
                    to="/admin/dashboard"
                    className="dropdown-item dropdown-item-hover"
                  >
                    <FontAwesomeIcon icon={faTachometerAlt} className="me-2" />{" "}
                    Dashboard
                  </Link>
                </li>
              )}
              
              {/* Instructor sees Dashboard ONLY when NOT in instructor area */}
              {currentUser.role === "instructor" && !isInInstructorArea && (
                <li>
                  <Link
                    to="/instructor/dashboard"
                    className="dropdown-item dropdown-item-hover"
                  >
                    <FontAwesomeIcon icon={faTachometerAlt} className="me-2" />{" "}
                    Dashboard
                  </Link>
                </li>
              )}
              
              {/* Student sees Profile and Settings */}
              {currentUser.role === "student" && (
                <>
                  <li>
                    <Link
                      to="/profile/dashboard"
                      className="dropdown-item dropdown-item-hover"
                    >
                      <FontAwesomeIcon icon={faUser} className="me-2" /> Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/profile/settings"
                      className="dropdown-item dropdown-item-hover"
                    >
                      <FontAwesomeIcon icon={faCog} className="me-2" />
                      Settings
                    </Link>
                  </li>
                </>
              )}
              
              {/* Divider only if there are items above */}
              {(currentUser.role === "admin" || 
                currentUser.role === "student" || 
                (currentUser.role === "instructor" && !isInInstructorArea)) && (
                <li>
                  <hr className="dropdown-divider" />
                </li>
              )}
              
              <li>
                <button
                  onClick={handleLogout}
                  className="dropdown-item dropdown-item-hover"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                  Sign Out
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
