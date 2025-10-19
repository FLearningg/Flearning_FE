// src/components/Checkout/CheckoutComponents.jsx

import React from "react";
import { Home, ShoppingCart, CreditCard, Check } from "lucide-react";

// Helper function retained in this file as requested
const toNumber = (price) => {
  if (typeof price === "number") return price;
  const numericString = String(price).replace(/[^0-9.]/g, "");
  return parseFloat(numericString) || 0;
};

const formatVND = (price) => {
  const number = Number(price) || 0;
  return number.toLocaleString("vi-VN");
};

// --- Component 1: Breadcrumb ---
export function Breadcrumb() {
  return (
    <div className="breadcrumb-section">
      <div className="container text-center">
        <h1 className="breadcrumb-title">Checkout</h1>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb justify-content-center">
            <li className="breadcrumb-item">
              <a href="/">
                <Home size={14} /> Home
              </a>
            </li>
            <li className="breadcrumb-item">
              <a href="/cart">
                <ShoppingCart size={14} /> Shopping Cart
              </a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Checkout
            </li>
          </ol>
        </nav>
      </div>
    </div>
  );
}

// --- Component 2: PaymentCard ---
export function PaymentCard({
  brand,
  lastDigits,
  expiry,
  owner,
  description,
  isSelected,
  onClick,
}) {
  return (
    <div
      className={`payment-card${isSelected ? " is-selected" : ""}`}
      onClick={onClick}
    >
      <div className="payment-card__details">
        <div className="payment-card__brand" style={brand.style}>
          {brand.label}
        </div>
        {lastDigits ? (
          <div>
            <div className="payment-card__digits">{lastDigits}</div>
            <small className="payment-card__expiry">{expiry}</small>
          </div>
        ) : (
          <small className="payment-card__description">{description}</small>
        )}
      </div>
      {owner && <small className="payment-card__owner">{owner}</small>}
      {isSelected && (
        <div className="payment-card__selected-indicator">
          <Check size={16} className="text-white" />
        </div>
      )}
    </div>
  );
}

// --- Component 3: NewCardForm ---
export function NewCardForm() {
  return (
    <div className="new-card-form">
      <div className="form-group">
        <label htmlFor="name" className="form-label">
          Name
        </label>
        <input
          type="text"
          className="form-control"
          id="name"
          placeholder="Name on card"
        />
      </div>
      <div className="form-group">
        <label htmlFor="card-number" className="form-label">
          Card Number
        </label>
        <div className="input-with-icon">
          <CreditCard className="input-icon" size={20} />
          <input
            type="text"
            className="form-control"
            id="card-number"
            placeholder="0000 1234 5678 9012"
          />
        </div>
      </div>
      <div className="row g-3">
        <div className="col-6">
          <div className="form-group">
            <label htmlFor="expiry" className="form-label">
              MM / YY
            </label>
            <input
              type="text"
              className="form-control"
              id="expiry"
              placeholder="MM / YY"
            />
          </div>
        </div>
        <div className="col-6">
          <div className="form-group">
            <label htmlFor="cvc" className="form-label">
              CVC
            </label>
            <input
              type="text"
              className="form-control"
              id="cvc"
              placeholder="Security Code"
            />
          </div>
        </div>
      </div>
      <div className="form-check">
        <input className="form-check-input" type="checkbox" id="remember" />
        <label className="form-check-label" htmlFor="remember">
          Remember this card, save it on my card list
        </label>
      </div>
    </div>
  );
}

// --- Component 4: CourseItem ---
// This must be defined before OrderSummary or imported if in separate files.
function CourseItem({
  instructor,
  thumbnail,
  title,
  currentPrice,
  originalPrice,
}) {
  return (
    <div className="course-item">
      <img
        src={thumbnail || "/images/default-thumbnail.jpg"}
        alt={title}
        className="course-item__image"
      />
      <div className="course-item__details">
        <small className="course-item__instructor">
          Course by: {instructor || "Thien Huynh"}
        </small>
        <div className="course-item__title">{title}</div>
        <div className="course-item__price">
          {formatVND(currentPrice)} VND
          {originalPrice && originalPrice > currentPrice && (
            <small className="course-item__original-price">
              {formatVND(originalPrice)} VND
            </small>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Component 5: OrderSummary ---
export function OrderSummary({
  courses = [],
  subtotal,
  discountAmount,
  total,
  selectedDiscount,
  onRemoveDiscount,
  onCompletePayment,
  isLoading,
}) {
  return (
    <div className="order-summary-card">
      <div className="card-body">
        <h3 className="order-summary__title">
          Courses ({courses.length.toString().padStart(2, "0")})
        </h3>
        <div className="order-summary__course-list">
          {courses.map((course) => (
            <CourseItem
              key={course._id || course.id}
              title={course.title}
              instructor={course.instructors?.[0]?.name}
              thumbnail={course.thumbnail}
              currentPrice={course.currentPrice}
              originalPrice={course.originalPrice}
            />
          ))}
        </div>
        <div className="order-summary__breakdown">
          <h4 className="order-summary__subtitle">Order Summary</h4>
          <div className="summary-row">
            <small>Subtotal</small>
            <small>{formatVND(subtotal)} VND</small>
          </div>

          {/* Display selected discount */}
          {selectedDiscount && (
            <div className="summary-row discount-row">
              <small>
                Discount ({selectedDiscount.discountCode})
                {onRemoveDiscount && (
                  <button
                    onClick={onRemoveDiscount}
                    className="remove-discount-btn"
                    title="Remove discount"
                  >
                    ×
                  </button>
                )}
              </small>
              <small className="discount-value">
                -{formatVND(discountAmount)} VND
              </small>
            </div>
          )}
        </div>
        <div className="order-summary__total">
          <span>Total:</span>
          <span className="total-amount">{formatVND(total)} VND</span>
        </div>
        <button
          className="btn-complete-payment"
          onClick={onCompletePayment}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Complete Payment"}
        </button>
      </div>
    </div>
  );
}
