import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import ProfileSection from "../CourseList/ProfileSection";
import { getPurchaseHistory } from "../../services/profileService";
import "../../assets/PurchaseHistory/PurchaseHistory.css";

// CourseItem không cần thay đổi
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

// SỬA LẠI PURCHASE CARD
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
            {/* SỬA 1: HIỂN THỊ TỔNG SỐ COURSE ĐỘNG */}
            <span className="flearning-meta-item">
              <img
                src="/icons/PlayCircle.png"
                alt="Course"
                className="flearning-meta-icon"
              />
              {purchase.totalCourses} Course
              {purchase.totalCourses > 1 ? "s" : ""}
            </span>

            {/* SỬA 2: SỬA LỖI HIỂN THỊ TIỀN TỆ (NẾU CÓ) */}
            <span className="flearning-meta-item">
              <img
                src="/icons/CurrencyDollarSimple.png"
                alt="Amount"
                className="flearning-meta-icon"
              />
              {/* Giả sử backend trả về 'amount' là VND */}
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

            <span className="flearning-meta-item">
              <img
                src="/icons/status.png"
                alt="Status"
                className="flearning-meta-icon"
              />
              {purchase.transaction.status}
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

      {/* SỬA 3: KIỂM TRA MẢNG 'courses' */}
      {isExpanded && purchase.courses && purchase.courses.length > 0 && (
        <div className="flearning-purchase-details">
          <div className="flearning-purchase-details-grid">
            {/* CỘT 1: Danh sách khóa học (Giữ nguyên) */}
            <div className="flearning-courses-list">
              {purchase.courses.map((course) => (
                <CourseItem key={course.id} course={course} />
              ))}
            </div>

            {/* ======================================= */}
            {/* BƯỚC 1: THÊM KHỐI HÀNH ĐỘNG NÀY VÀO */}
            <div className="flearning-purchase-actions">
              <h5 className="flearning-actions-title">Tuỳ chọn giao dịch</h5>
              <button
                className="flearning-action-btn flearning-action-btn--primary"
                onClick={() => alert("Đang phát triển tính năng tải biên lai!")}
              >
                Tải biên lai
              </button>
              <button
                className="flearning-action-btn flearning-action-btn--secondary"
                onClick={() => alert("Đang phát triển tính năng hỗ trợ!")}
              >
                Liên hệ hỗ trợ
              </button>
            </div>
            {/* ======================================= */}
          </div>
        </div>
      )}
    </div>
  );
};

// Component PurchaseHistory không cần thay đổi logic
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
      // Gọi service (đã được sửa ở backend)
      const response = await getPurchaseHistory(page);
      console.log("Purchase history response:", response.data.data);

      // Dữ liệu mới đã có 'courses' (mảng) và 'totalCourses' (số)
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
    fetchPurchases(1); // Fetch trang đầu tiên khi tải
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchPurchases(newPage);
    }
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

            {purchases.length > 0 && pagination.totalPages > 1 && (
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
                  Showing {purchases.length} of {pagination.totalTransactions}{" "}
                  transactions
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
