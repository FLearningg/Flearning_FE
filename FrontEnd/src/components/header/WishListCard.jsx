import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

export const WishListCard = ({
  courseImage,
  courseName,
  rating,
  enrolledCount,
  price,
  oldPrice,
  linkToCourseDetail,
}) => {
  return (
    <>
      <Link to={linkToCourseDetail} className="text-decoration-none text-dark">
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
                <span className="ms-2 text-muted">
                  ({enrolledCount} Enrolled)
                </span>
              </div>
              <h6 className="mb-0">{courseName}</h6>
              <div className="d-flex align-items-center">
                <p
                  className="m-0 p-0 ms-auto fw-bold"
                  style={{ color: "#ff6636" }}
                >
                  {price}$
                </p>
                {oldPrice && (
                  <small className="m-0 p-0 ms-1 text-muted text-decoration-line-through">
                    {oldPrice}$
                  </small>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};
