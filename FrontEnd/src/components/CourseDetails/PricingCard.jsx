import {
  Clock,
  BarChart3,
  Users,
  Book,
  Subtitles,
  Layers,
  Copy,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { addToWishlist, getWishlist } from "../../services/wishlistService";
import { toast } from "react-toastify";
import { addToCart } from "../../services/cartService";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

// THÊM: Import service thanh toán mới để sử dụng trong `ActionButtons`
import { createPayOSLink } from "../../services/paymentService";
import { isUserEnrolled } from "../../services/courseService";
import { getCurrentUserProfile } from "../../services/userService";

const ICON_MAP = {
  Level: BarChart3,
  Duration: Clock,
  "Students enrolled": Users,
  Language: Book,
  "Subtitle language": Subtitles,
};

const formatDiscount = (str) => {
  if (!str) return "";
  const match = str.toLowerCase().match(/(.*?)(off)/);
  return match ? match[1].toUpperCase() + "OFF" : str.toUpperCase();
};

const formatVND = (price) => {
  const number = Number(price) || 0;
  return number.toLocaleString("vi-VN");
};

const capitalizeFirstLetter = (str) => {
  const stringValue = String(str || "");
  if (!stringValue) return "";
  const firstLetterIndex = stringValue.search(/[a-zA-Z]/);
  if (firstLetterIndex > 0) {
    return (
      stringValue.slice(0, firstLetterIndex) +
      stringValue.charAt(firstLetterIndex).toUpperCase() +
      stringValue.slice(firstLetterIndex + 1)
    );
  }
  return stringValue.charAt(0).toUpperCase() + stringValue.slice(1);
};

const PriceSection = ({ currentPrice, originalPrice, discount, timeLeft }) => (
  <div className="mb-4">
    <div className="d-flex justify-content-between align-items-center mb-3">
      <div className="d-flex align-items-center gap-3">
        <span className="h2 fw-bold text-dark mb-0">
          {formatVND(currentPrice)} VND
        </span>
        {originalPrice > currentPrice && (
          <span className="h5 text-muted text-decoration-line-through mb-0">
            {formatVND(originalPrice)} VND
          </span>
        )}
      </div>
      {discount && (
        <span
          className="badge px-3 py-2"
          style={{
            backgroundColor: "#ffeee8",
            color: "#ff6636",
            fontSize: "0.875rem",
            marginBottom: "-3.5rem",
            marginLeft: "-5%",
            borderRadius: "0",
          }}
        >
          {formatDiscount(discount)}
        </span>
      )}
    </div>
    {timeLeft && (
      <div
        className="d-flex align-items-center gap-2"
        style={{ color: "#e34444" }}
      >
        <Clock size={16} />
        <span className="small fw-medium">{timeLeft}</span>
      </div>
    )}
  </div>
);

const CourseDetailsSection = ({ details }) => (
  <div className="mb-4">
    {details?.map(({ label, value }) => {
      const Icon = ICON_MAP[label] || Layers;
      return (
        <div
          key={label}
          className="d-flex justify-content-between align-items-center py-2"
        >
          <div className="d-flex align-items-center gap-3">
            <Icon size={20} className="text-muted" />
            <span className="text-secondary">{label}</span>
          </div>
          <span className="text-muted">{value}</span>
        </div>
      );
    })}
  </div>
);

const CourseIncludesSection = ({ includes }) => (
  <div className="mb-4">
    <h5 className="fw-semibold text-dark mb-3">This course includes:</h5>
    {includes?.map((text, idx) => (
      <div key={idx} className="d-flex align-items-center gap-3 mb-2">
        <Layers size={16} className="text-muted" />
        <span className="text-secondary small">{text}</span>
      </div>
    ))}
  </div>
);

const ShareSection = ({ buttons }) => {
  const shareButtons = [...(buttons || []), { icon: Copy, label: "Copy" }];
  return (
    <div>
      <h5 className="fw-semibold text-dark mb-3">Share this course:</h5>
      <div className="d-flex gap-3">
        {shareButtons.map(({ icon: Icon, label, onClick }) => (
          <button
            key={label}
            className="btn btn-outline-secondary btn-sm d-flex align-items-center justify-content-center"
            style={{ width: "40px", height: "40px" }}
            aria-label={label}
            onClick={onClick}
          >
            <Icon size={16} />
          </button>
        ))}
      </div>
    </div>
  );
};

// Component ActionButtons được cập nhật để xử lý luồng thanh toán mới
const ActionButtons = ({ course }) => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.currentUser);

  const [profile, setProfile] = useState(null);

  const [isBuying, setIsBuying] = useState(false);
  const { isLoading: isLoadingCart } = useSelector(
    (state) => state.cart.addItemToCart
  );
  const { isLoading: isLoadingWishlist } = useSelector(
    (state) => state.wishlist.addItemToWishlist
  );

  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isLoadingEnrollment, setIsLoadingEnrollment] = useState(true);

  // useEffect (giữ nguyên, không đổi)
  useEffect(() => {
    setIsLoadingEnrollment(true);
    setIsEnrolled(false);
    setProfile(null);

    const checkEnrollment = async () => {
      try {
        const enrolled = await isUserEnrolled(currentUser._id, courseId);
        setIsEnrolled(enrolled);
      } catch (error) {
        console.error("Failed to check enrollment status", error);
        setIsEnrolled(false);
      }
    };

    const fetchProfile = async () => {
      try {
        const response = await getCurrentUserProfile();
        setProfile(response.data);
      } catch (error) {
        console.error("Failed to fetch user profile", error);
      }
    };

    if (currentUser?._id && courseId) {
      const fetchAllData = async () => {
        setIsLoadingEnrollment(true);
        await Promise.all([checkEnrollment(), fetchProfile()]);
        setIsLoadingEnrollment(false);
      };

      fetchAllData();
    } else {
      setIsLoadingEnrollment(false);
    }
  }, [currentUser, courseId]);

  const handleAddToWishList = async () => {
    if (!currentUser) return navigate("/login");
    try {
      await addToWishlist(currentUser._id, courseId, dispatch);
      await getWishlist(dispatch, currentUser._id);
      toast.success("Added to wishlist successfully!");
    } catch (err) {
      toast.error("Failed to add to wishlist. Please try again.");
    }
  };

  const handleAddToCart = async () => {
    if (!currentUser) return navigate("/login");
    try {
      await addToCart(currentUser._id, courseId, dispatch);
      toast.success("Add course to cart success");
    } catch (err) {
      toast.error("Error adding course to cart, please try again");
    }
  };

  const handleBuyNow = async () => {
    if (!currentUser) return navigate("/login");
    if (!course) {
      toast.error("Course information is missing.");
      return;
    }

    setIsBuying(true);
    try {
      const paymentData = {
        description: `TT khoa hoc ${course._id.slice(-6)}`,
        // price: course.currentPrice,
        price: 2000, // <-- Tạm thời đặt 2000 để test PayOS
        packageType: "COURSE_PURCHASE",
        courseIds: [course._id],
        cancelUrl: window.location.href,
      };

      const { checkoutUrl } = await createPayOSLink(paymentData);

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        throw new Error("Checkout URL not received.");
      }
    } catch (error) {
      console.error("Error creating payment link:", error);
      setIsBuying(false);
    }
  };

  // ======================================================
  // BẮT ĐẦU SỬA TRONG RETURN
  // ======================================================
  return (
    <div className="mb-4">
      {isLoadingEnrollment ? (
        <div className="text-center my-5">
          <span className="spinner-border spinner-border-sm" />
        </div>
      ) : !isEnrolled ? (
        <>
          {/* === NÚT ADD TO CART === */}
          {profile?.role !== "student" ? (
            // 1. Wrapper (màn bọc) có tooltip khi không phải student
            <span
              className="d-inline-block w-100 mb-3"
              title="You are not a student"
            >
              <button
                className="btn w-100 fw-medium py-2"
                style={{
                  backgroundColor: "#ff6636",
                  borderColor: "#ff6636",
                  color: "white",
                  pointerEvents: "none", // Chìa khóa để span nhận hover
                }}
                type="button"
                disabled // Nút bên trong luôn disabled
              >
                Add To Cart
              </button>
            </span>
          ) : (
            // 2. Nút bình thường cho student
            <button
              className="btn w-100 fw-medium py-2 mb-3"
              style={{
                backgroundColor: "#ff6636",
                borderColor: "#ff6636",
                color: "white",
              }}
              onClick={handleAddToCart}
              disabled={isLoadingCart}
            >
              {isLoadingCart ? (
                <span className="spinner-border spinner-border-sm" />
              ) : (
                "Add To Cart"
              )}
            </button>
          )}

          {/* === NÚT BUY NOW === */}
          {profile?.role !== "student" ? (
            <span
              className="d-inline-block w-100 mb-3"
              title="You are not a student"
            >
              <button
                className="btn btn-outline w-100 fw-medium py-2"
                style={{
                  borderColor: "#ff6636",
                  color: "#ff6636",
                  pointerEvents: "none",
                }}
                type="button"
                disabled
              >
                Buy Now
              </button>
            </span>
          ) : (
            <button
              className="btn btn-outline w-100 fw-medium py-2 mb-3"
              style={{ borderColor: "#ff6636", color: "#ff6636" }}
              onClick={handleBuyNow}
              disabled={isBuying || isLoadingCart}
            >
              {isBuying ? (
                <span className="spinner-border spinner-border-sm" />
              ) : (
                "Buy Now"
              )}
            </button>
          )}
        </>
      ) : (
        // Nút "Go To Course" (giữ nguyên)
        <button
          className="btn w-100 fw-medium py-2 mb-3"
          style={{
            backgroundColor: "#ff6636",
            borderColor: "#ff6636",
            color: "white",
          }}
          onClick={() => navigate(`/watch-course/${courseId}`)}
        >
          Go To Course
        </button>
      )}

      <div className="row g-2">
        <div className="col-6 col-sm-7">
          {/* === NÚT WISHLIST === */}
          {profile?.role !== "student" ? (
            <span
              className="d-inline-block w-100"
              title="You are not a student"
            >
              <button
                className="btn btn-outline-secondary w-100 wishlist-btn"
                style={{ pointerEvents: "none" }}
                type="button"
                disabled
              >
                Add To Wishlist
              </button>
            </span>
          ) : (
            <button
              className="btn btn-outline-secondary w-100 wishlist-btn"
              onClick={handleAddToWishList}
              disabled={isLoadingWishlist}
            >
              {isLoadingWishlist ? (
                <span className="spinner-border spinner-border-sm" />
              ) : (
                "Add To Wishlist"
              )}
            </button>
          )}
        </div>
        <div className="col-6 col-sm-5">
          {/* === NÚT GIFT COURSE === */}
          {profile?.role !== "student" ? (
            <span
              className="d-inline-block w-100"
              title="You are not a student"
            >
              <button
                className="btn btn-outline-secondary w-100 gift-btn"
                style={{ pointerEvents: "none" }}
                type="button"
                disabled
              >
                Gift Course
              </button>
            </span>
          ) : (
            <button className="btn btn-outline-secondary w-100 gift-btn">
              Gift Course
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default function PricingCard({
  currentPrice,
  originalPrice,
  discount,
  timeLeft,
  details,
  includes,
  shareButtons,
  course,
}) {
  return (
    <div className="container-fluid d-flex justify-content-center py-3 course-price">
      <div
        className="card shadow-sm"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <div className="card-body p-4">
          <PriceSection
            currentPrice={currentPrice}
            originalPrice={originalPrice}
            discount={capitalizeFirstLetter(discount)}
            timeLeft={capitalizeFirstLetter(timeLeft)}
          />
          <CourseDetailsSection
            details={details?.map(({ label, value }) => ({
              label: capitalizeFirstLetter(label),
              value: capitalizeFirstLetter(value),
            }))}
          />

          {/* Truyền toàn bộ object `course` vào ActionButtons */}
          <ActionButtons course={course} />

          <p className="small text-muted mb-4">
            Note: all courses have 30-days money-back guarantee
          </p>
          <CourseIncludesSection
            includes={includes?.map(capitalizeFirstLetter)}
          />
          <ShareSection
            buttons={shareButtons?.map((btn) => ({
              ...btn,
              label: capitalizeFirstLetter(btn.label),
            }))}
          />
        </div>
      </div>
    </div>
  );
}
