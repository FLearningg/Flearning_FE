import { Clock, BarChart3, Users, Book, Subtitles, Layers } from "lucide-react";
import { Copy } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { addToWishlist, getWishlist } from "../../services/wishlistService";
import { toast } from "react-toastify";
import { addToCart } from "../../services/cartService";
import { useState } from "react";
import QRCodePayment from "../ShoppingCart/QRCodePayment";

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

const capitalizeFirstLetter = (str) => {
  if (!str) return "";
  const firstLetterIndex = str.search(/[a-zA-Z]/);
  if (firstLetterIndex > 0) {
    return (
      str.slice(0, firstLetterIndex) +
      str.charAt(firstLetterIndex).toUpperCase() +
      str.slice(firstLetterIndex + 1)
    );
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// --- Modal Component for the QR Code ---
function QRPaymentModal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "8px",
          maxWidth: "450px",
          width: "90%",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "15px",
            border: "none",
            background: "transparent",
            fontSize: "1.75rem",
            cursor: "pointer",
            lineHeight: "1",
          }}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}

const PriceSection = ({ currentPrice, originalPrice, discount, timeLeft }) => (
  <div className="mb-4">
    <div className="d-flex justify-content-between align-items-center mb-3">
      <div className="d-flex align-items-center gap-3">
        <span className="h2 fw-bold text-dark mb-0">
          ${currentPrice?.toFixed(2)}
        </span>
        {originalPrice > currentPrice && (
          <span className="h5 text-muted text-decoration-line-through mb-0">
            ${originalPrice?.toFixed(2)}
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
        {shareButtons.map(({ icon: Icon, label }) => (
          <button
            key={label}
            className="btn btn-outline-secondary btn-sm d-flex align-items-center justify-content-center"
            style={{ width: "40px", height: "40px" }}
            aria-label={label}
          >
            <Icon size={16} />
          </button>
        ))}
      </div>
    </div>
  );
};

const ActionButtons = ({ onBuyNowClick }) => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.auth.currentUser);

  /* cart slice ------------------------------------------------------------ */
  const { isLoading: isLoadingCart, errorMsg: errorMsgCart } = useSelector(
    (state) => state.cart.addItemToCart
  );

  /* wishlist slice -------------------------------------------------------- */
  const { isLoading: isLoadingWishlist, errorMsg: errorMsgWishlist } =
    useSelector((state) => state.wishlist.addItemToWishlist);

  /* helpers ----------------------------------------------------------------*/
  const isEnrolledCourse = (id) => currentUser?.enrolledCourses?.includes(id);

  /* handlers ---------------------------------------------------------------*/
  const handleAddToWishList = async () => {
    if (!currentUser) return navigate("/login");

    try {
      await addToWishlist(currentUser._id, courseId, dispatch);
      await getWishlist(dispatch, currentUser._id);
      toast.success("Added to wishlist successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch {
      toast.error(
        errorMsgWishlist || "Failed to add to wishlist. Please try again.",
        { position: "top-right", autoClose: 3000 }
      );
    }
  };

  const handleAddToCart = async () => {
    if (!currentUser) return navigate("/login");

    try {
      await addToCart(currentUser._id, courseId, dispatch);
      toast.success("Add course to cart success", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch {
      toast.error(
        errorMsgCart || "Error adding course to cart, please try again",
        { position: "top-right", autoClose: 3000 }
      );
    }
  };

  const handleBuyNow = () => {
    if (typeof onBuyNowClick === "function") {
      onBuyNowClick(); // use caller‑supplied handler
    } else {
      handleAddToCart(); // fallback: just add to cart first
      navigate("/cart"); // and push user to checkout page
    }
  };

  /* render -----------------------------------------------------------------*/
  return (
    <div className="mb-4">
      {!isEnrolledCourse(courseId) ? (
        <>
          {/* Add‑to‑Cart ---------------------------------------------------- */}
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
              <span
                className="spinner-border spinner-border-sm text-light"
                role="status"
                aria-hidden="true"
                style={{ verticalAlign: "middle" }}
              />
            ) : (
              "Add To Cart"
            )}
          </button>

          {/* Buy‑Now ------------------------------------------------------- */}
          <button
            className="btn btn-outline w-100 fw-medium py-2 mb-3"
            style={{ borderColor: "#ff6636", color: "#ff6636" }}
            onClick={handleBuyNow}
            disabled={isLoadingCart} /* prevent double click while cart req */
          >
            Buy Now
          </button>
        </>
      ) : (
        /* Already enrolled => show “Go To Course” */
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

      {/* Wishlist / Gift buttons ------------------------------------------- */}
      <div className="row g-2">
        <div className="col-6 col-sm-7">
          <button
            className="btn btn-outline-secondary w-100 wishlist-btn"
            onClick={handleAddToWishList}
            disabled={isLoadingWishlist}
          >
            {isLoadingWishlist ? (
              <span
                className="spinner-border spinner-border-sm text-light"
                role="status"
                aria-hidden="true"
                style={{ verticalAlign: "middle" }}
              />
            ) : (
              "Add To Wishlist"
            )}
          </button>
        </div>
        <div className="col-6 col-sm-5">
          {/* implement your own gift flow later */}
          <button className="btn btn-outline-secondary w-100 gift-btn">
            Gift Course
          </button>
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
  course, // Accept the full course object
}) {
  // State to manage the QR code modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
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
            <ActionButtons onBuyNowClick={() => setIsModalOpen(true)} />
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

      {/* --- Render the Modal with QRCodePayment --- */}
      <QRPaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        {course ? (
          <QRCodePayment
            amount={Math.floor(currentPrice * 25000)}
            // Create a unique transaction content string for "Buy Now"
            content={`COURSE${course._id.slice(-6)}`}
            // For a single purchase, the "cart" is just this one course
            coursesInCart={[course]}
          />
        ) : (
          <div className="text-center p-3">
            <p>Loading payment details...</p>
          </div>
        )}
      </QRPaymentModal>
    </>
  );
}
