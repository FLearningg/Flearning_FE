import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";

export const WishListCard = ({
  courseImage,
  courseName,
  rating,
  reviewCount,
}) => {
  return (
    <>
      <Link to={"/"} className="text-decoration-none text-dark">
        <div className="notification-card my-2 p-2">
          <div className="d-flex">
            <img
              src={courseImage}
              alt="Course"
              className="mx-2 me-3"
              style={{ width: "110px", objectFit: "cover" }}
            />
            <div className="notification-title">
              <div>
                <FontAwesomeIcon icon={faStar} color="orange" />
                <span className="ms-1">{rating}</span>
                <span className="ms-2 text-muted">({reviewCount} reviews)</span>
              </div>
              <h6>{courseName}</h6>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};
