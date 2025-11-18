import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FaStar, FaRegCopy } from "react-icons/fa";
// --- THÊM 2 IMPORT NÀY ---
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
// -------------------------
import ProfileSection from "../CourseList/ProfileSection";
import { getPurchaseHistory } from "../../services/profileService";
import "../../assets/PurchaseHistory/PurchaseHistory.css";

// --- CẤU HÌNH THÔNG TIN TÀI KHOẢN NHẬN TIỀN ---
const ADMIN_BANK_INFO = {
  bankId: "MB",
  accountNumber: "0836040204",
  accountName: "PHAN LE THANH HOANG",
  template: "compact2",
};

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
    return date.toLocaleString("vi-VN", {
      // Đổi sang vi-VN cho biên lai thân thiện hơn
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "#2ecc71";
      case "pending":
        return "#f1c40f";
      case "failed":
        return "#e74c3c";
      case "cancelled":
        return "#95a5a6";
      default:
        return "#34495e";
    }
  };

  const hasCourses = purchase.courses && purchase.courses.length > 0;
  const isPending = purchase.transaction.status === "pending";

  // --- HÀM TẠO LINK VIETQR ---
  const generateQRLink = () => {
    if (!purchase) return "";
    const amount = purchase.amount;
    const addInfo = encodeURIComponent(purchase.description);
    const accountName = encodeURIComponent(ADMIN_BANK_INFO.accountName);
    return `https://img.vietqr.io/image/${ADMIN_BANK_INFO.bankId}-${ADMIN_BANK_INFO.accountNumber}-${ADMIN_BANK_INFO.template}.png?amount=${amount}&addInfo=${addInfo}&accountName=${accountName}`;
  };

  // --- HÀM XỬ LÝ TẢI BIÊN LAI (PDF) ---
  const handleDownloadReceipt = async () => {
    // 1. Tạo phần tử HTML tạm thời chứa nội dung biên lai
    const receiptElement = document.createElement("div");

    // Style cho biên lai đẹp mắt (giống hóa đơn giấy)
    receiptElement.style.cssText = `
      position: absolute; left: -9999px; top: 0;
      width: 600px; padding: 40px;
      font-family: 'Arial', sans-serif;
      background: white; color: #333;
      border: 1px solid #ddd;
    `;

    // Nội dung HTML của biên lai
    receiptElement.innerHTML = `
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #2c3e50; margin: 0; font-size: 24px;">BIÊN LAI THANH TOÁN ĐIỆN TỬ</h1>
        <p style="color: #7f8c8d; margin: 5px 0;">F-Learning Platform</p>
      </div>
      
      <div style="border-top: 2px dashed #ccc; border-bottom: 2px dashed #ccc; padding: 20px 0; margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <strong>Mã giao dịch (Transaction ID):</strong>
          <span>${purchase.gatewayTransactionId || purchase.paymentId}</span>
        </div>
         <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <strong>Mã đơn hàng (Order Code):</strong>
          <span>${purchase.transaction.orderCode || "N/A"}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <strong>Ngày thanh toán:</strong>
          <span>${formatDate(purchase.paymentDate)}</span>
        </div>
         <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <strong>Phương thức:</strong>
          <span>${purchase.paymentMethod}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <strong>Trạng thái:</strong>
          <span style="color: #27ae60; font-weight: bold; text-transform: uppercase;">HOÀN THÀNH</span>
        </div>
      </div>

      <div style="margin-bottom: 20px;">
        <h3 style="border-bottom: 1px solid #eee; padding-bottom: 10px;">Chi tiết khóa học</h3>
        <ul style="list-style: none; padding: 0;">
          ${purchase.courses
            .map(
              (course) => `
            <li style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f9f9f9;">
              <span style="width: 70%;">${course.title}</span>
              <span style="width: 30%; text-align: right;">$${course.price?.toFixed(
                2
              )}</span>
            </li>
          `
            )
            .join("")}
        </ul>
      </div>

      <div style="text-align: right; margin-top: 30px;">
        <h2 style="margin: 0; color: #e74c3c;">Tổng tiền: ${purchase.amount?.toLocaleString(
          "vi-VN"
        )} VND</h2>
      </div>

      <div style="margin-top: 50px; text-align: center; font-size: 12px; color: #999;">
        <p>Cảm ơn bạn đã tin tưởng và sử dụng F-Learning!</p>
        <p>Đây là biên lai điện tử có giá trị xác thực giao dịch.</p>
      </div>
    `;

    document.body.appendChild(receiptElement);

    try {
      // 2. Chụp ảnh phần tử HTML bằng html2canvas
      const canvas = await html2canvas(receiptElement, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      // 3. Tạo PDF bằng jspdf
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 10, pdfWidth, pdfHeight);
      pdf.save(`Bien_lai_${purchase.transaction.orderCode || "GD"}.pdf`);
    } catch (error) {
      console.error("Lỗi khi tạo biên lai:", error);
      alert("Không thể tải biên lai. Vui lòng thử lại.");
    } finally {
      // 4. Dọn dẹp phần tử tạm
      document.body.removeChild(receiptElement);
    }
  };

  return (
    <div
      className={`flearning-purchase-card ${
        isExpanded ? "flearning-purchase-card-expanded" : ""
      }`}
    >
      {/* HEADER CARD */}
      <div className="flearning-purchase-header">
        <div className="flearning-purchase-info">
          <div className="flearning-purchase-date">
            {formatDate(purchase.paymentDate)}
          </div>
          <div className="flearning-purchase-meta">
            {purchase.totalCourses > 0 && (
              <span className="flearning-meta-item">
                <img
                  src="/icons/PlayCircle.png"
                  alt="Course"
                  className="flearning-meta-icon"
                />
                {purchase.totalCourses} Course
                {purchase.totalCourses > 1 ? "s" : ""}
              </span>
            )}
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
            <span
              className="flearning-meta-item"
              style={{
                color: getStatusColor(purchase.transaction.status),
                fontWeight: "bold",
                textTransform: "capitalize",
              }}
            >
              <img
                src="/icons/status.png"
                alt="Status"
                className="flearning-meta-icon"
              />
              {purchase.transaction.status}
            </span>
          </div>
        </div>

        {hasCourses || isPending ? (
          <button
            className="flearning-purchase-toggle"
            onClick={() => onToggle(purchase.paymentId)}
            aria-label="Toggle purchase details"
          >
            {isExpanded ? "↑" : "↓"}
          </button>
        ) : (
          <div style={{ width: "40px" }}></div>
        )}
      </div>

      {/* EXPANDED CONTENT */}
      {isExpanded && (
        <div className="flearning-purchase-details">
          <div className="flearning-purchase-details-grid">
            {/* CỘT TRÁI: KHÓA HỌC */}
            <div className="flearning-courses-list">
              {hasCourses ? (
                purchase.courses.map((course) => (
                  <CourseItem key={course.id} course={course} />
                ))
              ) : (
                <div
                  style={{
                    padding: "20px",
                    color: "#7f8c8d",
                    fontStyle: "italic",
                    textAlign: "center",
                  }}
                >
                  {isPending
                    ? "Khóa học sẽ hiển thị sau khi hệ thống xác nhận thanh toán."
                    : "Không tìm thấy thông tin khóa học."}
                </div>
              )}
            </div>

            {/* CỘT PHẢI: QR CODE HOẶC ACTIONS */}
            <div className="flearning-purchase-actions">
              {isPending ? (
                // === HIỂN THỊ QR CODE ===
                <div className="flearning-qr-container">
                  <h5
                    className="flearning-actions-title"
                    style={{ marginBottom: "10px" }}
                  >
                    Quét mã để thanh toán
                  </h5>
                  <div className="flearning-qr-wrapper">
                    <img
                      src={generateQRLink()}
                      alt="VietQR Payment"
                      className="flearning-qr-image"
                    />
                  </div>
                  <p className="flearning-qr-note">
                    Sử dụng App Ngân hàng hoặc Ví điện tử để quét mã. Hệ thống
                    sẽ tự động cập nhật sau vài phút.
                  </p>
                </div>
              ) : (
                // === CÁC TRẠNG THÁI KHÁC ===
                <>
                  <h5 className="flearning-actions-title">
                    Tuỳ chọn giao dịch
                  </h5>
                  {purchase.transaction.status === "completed" && (
                    <button
                      className="flearning-action-btn flearning-action-btn--primary"
                      onClick={handleDownloadReceipt} // <--- GỌI HÀM TẢI BIÊN LAI Ở ĐÂY
                    >
                      Tải biên lai
                    </button>
                  )}
                  <button
                    className="flearning-action-btn flearning-action-btn--secondary"
                    onClick={() => alert("Đang phát triển tính năng hỗ trợ!")}
                  >
                    Liên hệ hỗ trợ
                  </button>
                </>
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
    totalTransactions: 0,
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
    fetchPurchases(1);
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
