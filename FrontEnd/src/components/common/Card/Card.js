import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import "./Card.css";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../services/cartService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// SVG Components
export const StarIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-label="Star rating"
  >
    <path
      d="M8 12.2l3.09 1.83-.82-3.51L13 8.17l-3.59-.31L8 4.5l-1.41 3.36L3 8.17l2.73 2.35-.82 3.51L8 12.2z"
      fill="#fd8e1f"
      stroke="#fd8e1f"
    />
  </svg>
);

export const UserIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    aria-label="Students"
  >
    <g>
      <circle cx="10" cy="7" r="4" stroke="#7B7B7B" strokeWidth="1.5" />
      <path
        d="M2 18c0-3.87 3.13-7 7-7h2c3.87 0 7 3.13 7 7"
        stroke="#7B7B7B"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </g>
  </svg>
);

export const ClockIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-label="Duration"
  >
    <path
      d="M8 14.6667C11.6819 14.6667 14.6667 11.6819 14.6667 8C14.6667 4.3181 11.6819 1.33334 8 1.33334C4.3181 1.33334 1.33333 4.3181 1.33333 8C1.33333 11.6819 4.3181 14.6667 8 14.6667Z"
      stroke="#6E7A8A"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 4V8L10.6667 9.33333"
      stroke="#6E7A8A"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const LevelIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-label="Level"
  >
    <path
      d="M2 14L2 8.5"
      stroke="#6E7A8A"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M8 14L8 2"
      stroke="#6E7A8A"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M14 14L14 5.5"
      stroke="#6E7A8A"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export const MoreIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    aria-label="More options"
  >
    <circle cx="12" cy="12" r="2" fill="currentColor" />
    <circle cx="12" cy="5" r="2" fill="currentColor" />
    <circle cx="12" cy="19" r="2" fill="currentColor" />
  </svg>
);

const AdminDropdownMenu = ({
  actions,
  onActionClick,
  isOpen,
  onClose,
  triggerRect,
}) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !triggerRect) return null;

  // Calculate menu position with viewport bounds checking
  const menuWidth = 140;
  const menuHeight = 120; // Estimated height for 3 items
  const padding = 8;

  let left = triggerRect.left - menuWidth + triggerRect.width;
  let top = triggerRect.bottom + 5;

  // Adjust if menu would go off the right edge
  if (left < padding) {
    left = triggerRect.right - menuWidth;
  }

  // Adjust if menu would go off the left edge
  if (left < padding) {
    left = padding;
  }

  // Adjust if menu would go off the bottom edge
  if (top + menuHeight > window.innerHeight - padding) {
    top = triggerRect.top - menuHeight - 5;
  }

  // Adjust if menu would go off the top edge
  if (top < padding) {
    top = triggerRect.bottom + 5;
  }

  const menuStyle = {
    position: "fixed",
    top: `${top}px`,
    left: `${left}px`,
    zIndex: 9999,
    minWidth: `${menuWidth}px`,
  };

  const menuContent = (
    <div className="admin-dropdown-menu" ref={menuRef} style={menuStyle}>
      {actions.map((action, index) => (
        <button
          key={index}
          className={`admin-dropdown-item ${action.type || ""}`}
          onClick={(e) => {
            e.stopPropagation();
            onActionClick(action);
            onClose();
          }}
        >
          {action.icon && (
            <span className="admin-dropdown-icon">{action.icon}</span>
          )}
          {action.label}
        </button>
      ))}
    </div>
  );

  return createPortal(menuContent, document.body);
};

const Card = ({
  image,
  category,
  categoryBgColor,
  categoryTextColor,
  price,
  title,
  rating,
  students,
  variant = "normal", // "normal", "large", "auto", "custom", "admin"
  customWidth,
  customHeight,
  customImageHeight,
  onMenuAction,
  menuActions = [],
  linkToCourseDetail, 
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [triggerRect, setTriggerRect] = useState(null);
  const menuTriggerRef = useRef(null);
  const navigate = useNavigate();
  const handleMenuToggle = (e) => {
    e.stopPropagation();

    if (!dropdownOpen && menuTriggerRef.current) {
      const rect = menuTriggerRef.current.getBoundingClientRect();
      setTriggerRect(rect);
    }

    setDropdownOpen(!dropdownOpen);
  };

  const handleMenuAction = (action) => {
    if (onMenuAction) {
      onMenuAction(action);
    }
  };

  // Calculate container styles based on variant
  const getContainerStyles = () => {
    const baseStyles = {};

    switch (variant) {
      case "auto":
        return {
          ...baseStyles,
          width: "100%",
          maxWidth: "none",
          minWidth: "200px",
        };
      case "custom":
        return {
          ...baseStyles,
          width: customWidth || "240px",
          height: customHeight || "auto",
          maxWidth: customWidth || "240px",
          minHeight: customHeight || "auto",
        };
      case "large":
        return baseStyles;
      case "normal":
      default:
        return baseStyles;
    }
  };

  // Calculate image container styles based on variant
  const getImageStyles = () => {
    if (variant === "custom" && customImageHeight) {
      return { height: customImageHeight };
    }
    return {};
  };

  // Generate CSS class names based on variant
  const getContainerClasses = () => {
    const baseClass = "modern-card-container";

    switch (variant) {
      case "auto":
        return `${baseClass} modern-card-auto`;
      case "custom":
        return `${baseClass} modern-card-custom`;
      case "large":
        return `${baseClass} modern-card-large`;
      case "admin":
        return `${baseClass} modern-card-admin`;
      case "normal":
      default:
        return `${baseClass} modern-card-normal`;
    }
  };

  return (
    <div
      className={getContainerClasses()}
      style={getContainerStyles()}
      role="article"
      tabIndex="0"
      onClick={() => {
        if (linkToCourseDetail) {
          navigate(linkToCourseDetail);
        }
      }}
    >
      <div className="modern-card-image-container" style={getImageStyles()}>
        <img
          src={image || "/api/placeholder/240/140"}
          alt={title}
          className="modern-card-image"
          loading="lazy"
        />
      </div>
      <div className="modern-card-content">
        <div className="modern-card-header">
          <span
            className="modern-category-badge"
            style={{
              backgroundColor: categoryBgColor || "#ffeee8",
              color: categoryTextColor || "#993d20",
            }}
          >
            {category}
          </span>
          <div className="modern-card-header-right">
            <span className="modern-card-price">{price}</span>
            {variant === "admin" && menuActions.length > 0 && (
              <div className="admin-menu-container">
                <button
                  ref={menuTriggerRef}
                  className="admin-menu-trigger"
                  onClick={handleMenuToggle}
                  aria-label="More options"
                >
                  <MoreIcon />
                </button>
                <AdminDropdownMenu
                  actions={menuActions}
                  onActionClick={handleMenuAction}
                  isOpen={dropdownOpen}
                  onClose={() => {
                    setDropdownOpen(false);
                    setTriggerRect(null);
                  }}
                  triggerRect={triggerRect}
                />
              </div>
            )}
          </div>
        </div>
        <h3 className="modern-card-title" title={title}>
          {title}
        </h3>
        <div className="modern-card-footer">
          <div className="modern-rating" aria-label={`Rating: ${rating} stars`}>
            <StarIcon />
            <span>
              {typeof rating === "number" ? rating.toFixed(1) : rating}
            </span>
          </div>
          <span
            className="modern-students"
            aria-label={`${students} students enrolled`}
          >
            <span className="modern-students-number">{students}</span> students
          </span>
        </div>
      </div>
    </div>
  );
};

Card.propTypes = {
  image: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  categoryBgColor: PropTypes.string,
  categoryTextColor: PropTypes.string,
  price: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  students: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  variant: PropTypes.oneOf(["normal", "large", "auto", "custom", "admin"]),
  customWidth: PropTypes.string,
  customHeight: PropTypes.string,
  customImageHeight: PropTypes.string,
  onMenuAction: PropTypes.func,
  menuActions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      type: PropTypes.string,
      icon: PropTypes.node,
    })
  ),
  linkToCourseDetail: PropTypes.string,
};

Card.defaultProps = {
  image: "/api/placeholder/240/140",
  category: "Course",
  categoryBgColor: "#ffeee8",
  categoryTextColor: "#993d20",
  price: "Free",
  title: "Course Title",
  rating: 0.0,
  students: "0",
  variant: "normal",
  customWidth: null,
  customHeight: null,
  customImageHeight: null,
};

export const DetailedCard = ({
  courseId,
  title,
  author,
  authorAvatar,
  rating,
  ratingCount,
  students,
  level,
  duration,
  price,
  oldPrice,
  discount,
  learnList,
}) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.currentUser);
  const isLoading = useSelector((state) => state.cart.addItemToCart.isLoading);
  const errorMsg = useSelector((state) => state.cart.addItemToCart.errorMsg);
  const navigate = useNavigate();
  const AddCourseToCart = async () => {
    if (!currentUser) {
      navigate("/login");
    } else {
      try {
        await addToCart(currentUser._id, courseId, dispatch);
        toast.success("Add course to cart success", {
          position: "top-right",
          autoClose: 3000,
        });
      } catch (err) {
        toast.error(errorMsg || "Error adding course to cart", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };
  return (
    <div className="detailed-card-container" role="article" tabIndex="0">
      <div className="detailed-card-body">
        <h3 className="detailed-title">{title}</h3>
        <div className="author-row">
          <div className="author-info">
            <div
              className="author-avatar"
              style={{ backgroundImage: `url(${authorAvatar})` }}
              role="img"
              aria-label={`${author}'s profile picture`}
            />
            <div className="author-name">
              Course by
              <strong>{author}</strong>
            </div>
          </div>
          <div
            className="rating-info"
            aria-label={`Rating: ${rating} stars from ${ratingCount} reviews`}
          >
            <StarIcon />
            {rating}
            <span style={{ color: "#6E7A8A" }}>({ratingCount})</span>
          </div>
        </div>

        <div className="stats-row">
          <div
            className="stat-item"
            aria-label={`${students} students enrolled`}
          >
            <UserIcon />
            {students} students
          </div>

          <div className="stat-item" aria-label={`Difficulty level: ${level}`}>
            <LevelIcon />
            {level}
          </div>

          <div
            className="stat-item"
            aria-label={`Course duration: ${duration}`}
          >
            <ClockIcon />
            {duration}
          </div>
        </div>

        <div className="price-row">
          <div className="current-price" aria-label={`Current price: ${price}`}>
            <span className="orange-gradient">{price}</span>
          </div>
          {oldPrice && (
            <div
              className="old-price"
              aria-label={`Original price: ${oldPrice}`}
            >
              {oldPrice}
            </div>
          )}
          {discount && (
            <div className="discount" aria-label={`Discount: ${discount}`}>
              {discount}
            </div>
          )}
        </div>

        <div>
          <div
            style={{
              fontSize: "16px",
              fontWeight: 600,
              marginBottom: "16px",
              color: "#1d2026",
            }}
          >
            What you'll learn
          </div>
          <ul className="learn-list">
            {learnList &&
              learnList.map((item, index) => (
                <li key={`learn-item-${index}`} className="learn-item">
                  {item}
                </li>
              ))}
          </ul>
        </div>

        <button
          className="card-button"
          aria-label={`Add ${title} to cart`}
          type="button"
          onClick={AddCourseToCart}
          disabled={isLoading}
        >
          {isLoading ? (
            <span
              className="spinner-border spinner-border-sm text-light"
              role="status"
              aria-hidden="true"
              style={{ verticalAlign: "middle" }}
            ></span>
          ) : (
            <>Add To Cart</>
          )}
        </button>
        <button
          className="card-detail-button"
          aria-label={`View details for ${title}`}
          type="button"
          onClick={() => {
            navigate(`/course/${courseId}`);
          }}
        >
          Course Detail
        </button>
      </div>
    </div>
  );
};

DetailedCard.propTypes = {
  courseId: PropTypes.string,
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  authorAvatar: PropTypes.string,
  rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  ratingCount: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  students: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  level: PropTypes.string.isRequired,
  duration: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  oldPrice: PropTypes.string,
  discount: PropTypes.string,
  learnList: PropTypes.arrayOf(PropTypes.string),
};

DetailedCard.defaultProps = {
  authorAvatar: "/api/placeholder/36/36",
  oldPrice: null,
  discount: null,
  learnList: [],
};

export default Card;
