import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import ProfileSection from "../CourseList/ProfileSection";
import { getPurchaseHistory } from "../../services/profileService";
import "../../assets/PurchaseHistory/PurchaseHistory.css";

const CourseItem = ({ course }) => (
  <div className="flearning-course-item">
    <div className="flearning-course-image">
      <img src={course.thumbnail} alt={course.title} />
    </div>
    <div className="flearning-course-info">
      <div className="flearning-course-rating">
        <FaStar className="flearning-star-icon" />
        <span className="flearning-rating-value">{course.rating || 0}</span>
      </div>
      <h4>{course.title}</h4>
      <p className="flearning-course-category">
        Category: {course.category || "Uncategorized"}
      </p>
    </div>
    <div className="flearning-course-price">
      ${course.price?.toFixed(2) || "0.00"}
    </div>
  </div>
);

const PurchaseCard = ({ purchase, isExpanded, onToggle }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  return (
    <div
      className={`flearning-purchase-card ${
        isExpanded ? "flearning-purchase-card-expanded" : ""
      }`}
    >
      <div className="flearning-purchase-header">
        <div className="flearning-purchase-info">
          <div className="flearning-purchase-date">
            {formatDate(purchase.paymentDate)}
          </div>
          <div className="flearning-purchase-meta">
            <span className="flearning-meta-item">
              <img
                src="/icons/PlayCircle.png"
                alt="Course"
                className="flearning-meta-icon"
              />
              1 Course
            </span>
            <span className="flearning-meta-item">
              <img
                src="/icons/CurrencyDollarSimple.png"
                alt="Amount"
                className="flearning-meta-icon"
              />
              {purchase.amount?.toLocaleString("vi-VN")} VND
            </span>
            <span className="flearning-meta-item">
              <img
                src="/icons/CreditCard.png"
                alt="Payment"
                className="flearning-meta-icon"
              />
              {purchase.paymentMethod}
            </span>
          </div>
        </div>
        <button
          className="flearning-purchase-toggle"
          onClick={() => onToggle(purchase.paymentId)}
          aria-label="Toggle purchase details"
        >
          {isExpanded ? "↑" : "↓"}
        </button>
      </div>

      {isExpanded && purchase.course && (
        <div className="flearning-purchase-details">
          <div className="flearning-purchase-details-grid">
            <div className="flearning-courses-list">
              <CourseItem course={purchase.course} />
            </div>

            <div className="flearning-purchase-summary">
              <div className="flearning-summary-date">
                {formatDate(purchase.paymentDate)}
              </div>
              <div className="flearning-summary-details">
                <div className="flearning-summary-item">
                  <img
                    src="/icons/PlayCircle.png"
                    alt="Course"
                    className="flearning-summary-icon"
                  />
                  <span>1 Course</span>
                </div>
                <div className="flearning-summary-item">
                  <img
                    src="/icons/CurrencyDollarSimple.png"
                    alt="Amount"
                    className="flearning-meta-icon"
                  />
                  {purchase.amount?.toLocaleString("vi-VN")} VND
                </div>
                <div className="flearning-summary-item">
                  <img
                    src="/icons/CreditCard.png"
                    alt="Payment"
                    className="flearning-summary-icon"
                  />
                  <span>{purchase.paymentMethod}</span>
                </div>
              </div>
              {purchase.transaction && (
                <div className="flearning-transaction-info">
                  <div className="flearning-transaction-id">
                    <img
                      src="/icons/CreditCard.png"
                      alt="Transaction"
                      className="flearning-transaction-icon"
                    />
                    <span>
                      Transaction ID:{" "}
                      {purchase.transaction.gatewayTransactionId}
                    </span>
                  </div>
                  <span className="flearning-transaction-status">
                    Status: {purchase.transaction.status}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const PurchaseHistory = () => {
  const location = useLocation();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  });

  const fetchPurchases = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getPurchaseHistory(page);
      setPurchases(response.data.data);
      setPagination(response.data.pagination);
      if (response.data.data.length > 0) {
        setExpandedId(response.data.data[0].paymentId);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load purchase history"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  const handlePageChange = (newPage) => {
    fetchPurchases(newPage);
  };

  const handleToggle = (purchaseId) => {
    setExpandedId(expandedId === purchaseId ? null : purchaseId);
  };

  return (
    <ProfileSection activePath={location.pathname}>
      <div className="flearning-purchase-content">
        <div className="flearning-purchase-header-main">
          <h2>Purchase History</h2>
        </div>

        {loading && (
          <div className="flearning-loading">Loading purchase history...</div>
        )}

        {error && <div className="flearning-error">{error}</div>}

        {!loading && !error && (
          <>
            <div className="flearning-purchase-list">
              {purchases.length > 0 ? (
                purchases.map((purchase) => (
                  <PurchaseCard
                    key={purchase.paymentId}
                    purchase={purchase}
                    isExpanded={expandedId === purchase.paymentId}
                    onToggle={handleToggle}
                  />
                ))
              ) : (
                <div className="flearning-no-purchases">
                  No purchase history found.
                </div>
              )}
            </div>

            {purchases.length > 0 && (
              <div className="flearning-pagination">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrev}
                  className="flearning-pagination-btn"
                >
                  Previous
                </button>
                <span className="flearning-pagination-info">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNext}
                  className="flearning-pagination-btn"
                >
                  Next
                </button>
              </div>
            )}

            {purchases.length > 0 && (
              <div className="flearning-purchase-footer">
                <p>
                  Showing {purchases.length} of {pagination.totalPayments}{" "}
                  purchases
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </ProfileSection>
  );
};

export default PurchaseHistory;
