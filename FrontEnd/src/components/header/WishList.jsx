import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { faListAlt } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { WishListCard } from "./WishListCard";
import { useDispatch, useSelector } from "react-redux";
import { getWishlist } from "../../services/wishlistService";
function WishList() {
  // const courseData = [
  //   {
  //     courseImage: "/images/CourseImages.png",
  //     courseName: "The Ultimate Drawing Course - Beginner to Advanced",
  //     rating: 4.5,
  //     reviewCount: 10,
  //     price: 99,
  //   },
  //   {
  //     courseImage: "/images/CourseImages.png",
  //     courseName: "The Complete JavaScript Course 2023: From Zero to Expert!",
  //     rating: 4.0,
  //     reviewCount: 5,
  //     price: 99,
  //   },
  // ];
  const currentUser = useSelector((state) => state.auth.currentUser);
  const dispatch = useDispatch();
  const wishlistData = useSelector((state) => state.wishlist.getWishlist.items);
  useEffect(() => {
    const fetchWishlist = async () => {
      if (currentUser) {
        await getWishlist(dispatch, currentUser._id);
      }
    };
    fetchWishlist();
  }, [dispatch, currentUser]);
  console.log("wishlistData", wishlistData);
  const courseData = wishlistData?.map((course) => {
    let finalPrice = course.price;
    // let discountText = "";
    if (course.discountId) {
      if (course.discountId.typee === "fixedAmount") {
        finalPrice = Math.max(0, course.price - course.discountId.value);
        // discountText = `-${course.discountId.value}$`;
      } else if (course.discountId.typee === "percent") {
        finalPrice = Math.max(
          0,
          course.price * (1 - course.discountId.value / 100)
        );
        // discountText = `-${course.discountId.value}%`;
      }
    }
    return {
      courseImage: course.thumbnail,
      courseName: course.title,
      rating: course.rating,
      enrolledCount: course.studentsEnrolled.length,
      price: `${finalPrice}`,
      oldPrice: course.discountId ? `${course.price}` : "",
    };
  });
  return (
    <>
      <div className="dropdown">
        <button
          className="btn btn-light rounded-circle icon-btn"
          type="button"
          id="dropdownMenuButton1"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <img src="/icons/heart.png" className="icon" alt="" />
        </button>
        <ul
          className="dropdown-menu dropdown-menu-center"
          style={{ width: "376px" }}
          aria-labelledby="dropdownMenuButton1"
        >
          <div
            className="position-fixed bg-white p-2 px-3 border-3 border-bottom "
            style={{ width: "374px", zIndex: 1000 }}
          >
            <div className="d-flex align-items-center">
              <h5 className="text-start fw-bold mb-0">WishList</h5>
              <Link to={"/profile/wishlist"} className="ms-auto see-all-link">
                <small>See all</small>
              </Link>
            </div>
          </div>
          <div>
            <div className="dropdown-container">
              {courseData?.length > 0 ? (
                courseData.map((course, index) => (
                  <WishListCard
                    key={index}
                    courseImage={course.courseImage}
                    courseName={course.courseName}
                    rating={course.rating}
                    enrolledCount={course.enrolledCount}
                    price={course.price}
                    oldPrice={course.oldPrice}
                  />
                ))
              ) : (
                <div className="text-muted text-center p-3">
                  <FontAwesomeIcon
                    icon={faListAlt}
                    style={{ fontSize: "24px" }}
                  />
                  <p className="mb-0 mt-2">Nothing in your wishlist yet</p>
                </div>
              )}
            </div>
          </div>
        </ul>
      </div>
    </>
  );
}

export default WishList;
