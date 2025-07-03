import { useEffect, useState } from "react";
import ProfileSection from "../CourseList/ProfileSection";
import { Link, useLocation } from "react-router-dom";
import "../../assets/StudentCartPage/StudentCart.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimesCircle,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import CartPagePagination from "./CartPagePagination";
import { useDispatch, useSelector } from "react-redux";
import { getCart, removeFromCart } from "../../services/cartService";
import LoaddingComponent from "../common/Loadding/LoaddingComponent";
import { toast } from "react-toastify";

function CartPage() {
  const location = useLocation();
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.auth.currentUser);
  const Cart_DATA_1 = useSelector((state) => state.cart.getCart.items);
  const isLoading = useSelector((state) => state.cart.getCart.isLoading);
  const isLoadingRemove = useSelector(
    (state) => state.cart.removeItemFromCart.isLoading
  );
  const errorMsg = useSelector(
    (state) => state.cart.removeItemFromCart.errorMsg
  );
  useEffect(() => {
    const fetchCartData = async () => {
      await getCart(dispatch, currentUser._id);
    };
    fetchCartData();
  }, [dispatch, currentUser]);

  const Cart_DATA =
    Cart_DATA_1?.map((course) => {
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
        price: finalPrice,
        oldPrice: course.discountId ? course.price : null,
        courseAuthor: course.author || "Admin",
      };
    }) || [];

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(Cart_DATA.length / itemsPerPage);

  // Get current page data
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentData = Cart_DATA.slice(startIdx, startIdx + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const toggleHeart = async (courseId) => {
    try {
      await removeFromCart(currentUser._id, courseId, dispatch);
      await getCart(dispatch, currentUser._id);
      toast.success("Remove from cart success", {
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
      <div className="cart-container">
        <div className="cart-content">
          <div className="dashboard-header">
            <h2>Cart ({Cart_DATA?.length})</h2>
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
                {isLoading || !Cart_DATA || isLoadingRemove ? (
                  <tr>
                    <td colSpan="3" className="text-center">
                      <LoaddingComponent />
                    </td>
                  </tr>
                ) : currentData.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center p-3">
                      <div className="d-flex">
                        <img
                          style={{ width: 250 }}
                          className="img-fluid mb-2 mx-auto"
                          src="/images/empty_cart.png"
                          alt="No items found"
                        />
                      </div>
                      <p className="text-muted h5">
                        No items found in your cart.
                      </p>
                    </td>
                  </tr>
                ) : (
                  currentData.map((item, index) => (
                    <tr key={startIdx + index}>
                      <td className="p-3">
                        <div className="d-flex align-items-start gap-3 flex-nowrap">
                          <img
                            src={item.courseImage}
                            className="cart-course-img"
                            alt="course"
                          />
                          <div
                            className="flex-shrink-1"
                            style={{ minWidth: 0 }}
                          >
                            <div className="cart-rating-star mb-1">
                              <FontAwesomeIcon icon={faStar} /> {item.rating}{" "}
                              <span className="text-muted">
                                ({item.enrolledCount} Enrolled)
                              </span>
                            </div>
                            <Link
                              className="text-decoration-none text-reset"
                              to={`/course/${item.courseId}`}
                            >
                              <div className="text-truncate fw-semibold">
                                {item.courseName}
                              </div>
                            </Link>
                            <div className="cart-course-author">
                              Course by: {item.courseAuthor}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="text-start p-3">
                        <span className="cart-price-current">
                          ${item.price.toFixed(2)}
                        </span>
                        {item.oldPrice && (
                          <span className="cart-price-old ms-2">
                            ${item.oldPrice.toFixed(2)}
                          </span>
                        )}
                      </td>
                      <td className="text-end p-3">
                        <div className="d-flex gap-2 flex-nowrap">
                          <button className="btn btn-light cart-button-buy-now border border-1 rounded-0">
                            Buy Now
                          </button>
                          <button
                            className="btn cart-btn-fav rounded-0 p-2"
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
          <CartPagePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}

export default CartPage;
