import { useEffect, useState } from "react";
import ProfileSection from "../CourseList/ProfileSection";
import { Link, useLocation } from "react-router-dom";
import "../../assets/StudentWishList/StudentWishList.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import WishListPagination from "./WishListPagination";
import { useDispatch, useSelector } from "react-redux";
import {
  getWishlist,
  removeFromWishlist,
} from "../../services/wishlistService";
import LoaddingComponent from "../common/Loadding/LoaddingComponent";
import { toast } from "react-toastify";
function WishListPage() {
  const location = useLocation();
  const currentUser = useSelector((state) => state.auth.currentUser);
  const dispatch = useDispatch();
  const wishlistData = useSelector((state) => state.wishlist.getWishlist.items);
  const isLoading = useSelector(
    (state) => state.wishlist.getWishlist.isLoading
  );
  const isLoadingRemove = useSelector(
    (state) => state.wishlist.removeItemFromWishlist.isLoading
  );
  const errorMsg = useSelector(
    (state) => state.wishlist.removeItemFromWishlist.errorMsg
  );
  useEffect(() => {
    const fetchWishlist = async () => {
      if (currentUser) {
        await getWishlist(dispatch, currentUser._id);
      }
    };
    fetchWishlist();
  }, [dispatch, currentUser]);
  const WishList_DATA = wishlistData?.map((course) => {
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
      courseId: course._id,
      courseImage: course.thumbnail,
      courseName: course.title,
      rating: course.rating,
      enrolledCount: course.studentsEnrolled.length,
      price: finalPrice, // it should be a number
      oldPrice: course.discountId ? course.price : null, // it should be a number or null
      courseAuthor: course.author || "Admin", // Add if needed
    };
  });
  const isEnrolledCourse = (courseId) => {
    return currentUser?.enrolledCourses?.includes(courseId);
  };
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(WishList_DATA?.length / itemsPerPage);

  // Get current page data
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentData = WishList_DATA?.slice(startIdx, startIdx + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const toggleHeart = async (courseId) => {
    try {
      await removeFromWishlist(currentUser._id, courseId, dispatch);
      await getWishlist(dispatch, currentUser._id);
      toast.success("Remove from wishlist success", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      toast.error(errorMsg, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };
  return (
    <div>
      <ProfileSection
        avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80"
        name="Kevin Gilbert"
        title="Web Designer & Best-Selling Instructor"
        activePath={location.pathname}
        showMobileHeader={false}
      />
      <div className="wishlist-container">
        <div className="wishlist-content">
          <div className="dashboard-header">
            <h2>Wishlist ({WishList_DATA?.length})</h2>
          </div>

          <div className="table-responsive">
            <table className="table align-middle">
              <thead className="table-light">
                <tr>
                  <th scope="col" className="text-secondary fw-medium p-3">
                    COURSE
                  </th>
                  <th scope="col" className="text-secondary fw-medium p-3">
                    PRICE
                  </th>
                  <th scope="col" className="text-secondary fw-medium p-3">
                    ACTION
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading || !WishList_DATA || isLoadingRemove ? (
                  <tr>
                    <td colSpan="3" className="text-center">
                      <LoaddingComponent />
                    </td>
                  </tr>
                ) : currentData?.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center p-3">
                      <div className="d-flex">
                        <img
                          style={{ width: 250 }}
                          className="img-fluid mb-2 mx-auto"
                          src="/images/empty-wishlist.png"
                          alt="No items found"
                        />
                      </div>
                      <p className="text-muted h5">
                        No items found in your wishlist.
                      </p>
                    </td>
                  </tr>
                ) : (
                  currentData?.map((item, index) => (
                    <tr key={startIdx + index}>
                      <td className="p-3">
                        <div className="d-flex align-items-start gap-3 flex-nowrap">
                          <img
                            src={item.courseImage}
                            className="wishlist-course-img"
                            alt="course"
                          />
                          <div
                            className="flex-shrink-1"
                            style={{ minWidth: 0 }}
                          >
                            <div className="wl-rating-star mb-1">
                              <FontAwesomeIcon icon={faStar} /> {item.rating}{" "}
                              <span className="text-muted">
                                ({item.enrolledCount} Enrolled)
                              </span>
                            </div>
                            {/* Link to course details page */}
                            <Link
                              className="text-decoration-none text-reset"
                              to={"#"}
                            >
                              <div className="text-truncate fw-semibold">
                                {item.courseName}
                              </div>
                            </Link>
                            <div className="wl-course-author">
                              Course by: {item.courseAuthor}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="text-start p-3">
                        <span className="wl-price-current">
                          ${item.price.toFixed(2)}
                        </span>
                        {item.oldPrice && (
                          <span className="wl-price-old ms-2">
                            ${item.oldPrice.toFixed(2)}
                          </span>
                        )}
                      </td>
                      <td className="text-end p-3">
                        <div className="d-flex gap-2 flex-nowrap align-items-center">
                          {!isEnrolledCourse(item.courseId) ? (
                            <>
                              <button className="btn btn-light wishlist-button-buy-now border border-1 rounded-0">
                                Buy Now
                              </button>
                              <button className="btn wl-btn-cart rounded-0">
                                Add To Cart
                              </button>
                            </>
                          ) : (
                            <Link to={`/course/${item.courseId}`}>
                              <button className="btn btn-light wishlist-button-buy-now border border-1 rounded-0">
                                View Course
                              </button>
                            </Link>
                          )}
                          <button
                            className="btn wl-btn-fav rounded-0 p-2"
                            onClick={() => toggleHeart(item.courseId)}
                            style={{ minWidth: 40 }}
                          >
                            <FontAwesomeIcon icon={faTimesCircle} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination controls */}
          <WishListPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}

export default WishListPage;
