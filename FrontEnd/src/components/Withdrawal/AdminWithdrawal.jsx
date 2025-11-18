import React, { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
// Dùng chung file CSS
import "../../assets/AdminDiscount/AdminDiscount.css";
import "../../assets/Withdrawal/InstructorWithdraw.css";
// API service
import {
  getInstructorWithdrawals, // Giả định hàm này lấy TẤT CẢ request nếu là Admin
  updateWithdrawalRequest,
} from "../../services/withdrawalService";

// #region =================== ICONS (TỪ REACT-BOOTSTRAP-ICONS) ===================
import {
  Funnel,
  CashStack,
  ClockHistory,
  CheckCircle,
  XCircle,
  CheckLg,
  XLg,
} from "react-bootstrap-icons";
// #endregion ====================================================

// #region =================== HELPER FUNCTIONS ===================
/**
 * Helper: Convert Decimal128 (or string) to float
 */
const toFloat = (decimal) => {
  if (!decimal) return 0;
  if (typeof decimal === "object" && decimal.$numberDecimal) {
    return parseFloat(decimal.$numberDecimal);
  }
  return parseFloat(decimal.toString());
};

/**
 * Helper: Format currency
 */
const formatCurrency = (value) => {
  return toFloat(value).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};

/**
 * Helper: Format date
 */
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const getVietQRBankId = (bankName) => {
  if (!bankName) return null;

  // Ánh xạ dựa trên tên ngân hàng (chuẩn hóa về chữ hoa không dấu để dễ so sánh)
  const normalizedName = bankName
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s/g, "");

  const mapping = {
    VIETCOMBANK: "970436", // Ngân hàng TMCP Ngoại thương Việt Nam
    ACB: "970416", // Ngân hàng TMCP Á Châu
    VIETINBANK: "970415", // Ngân hàng TMCP Công thương Việt Nam
    BIDV: "970418", // Ngân hàng TMCP Đầu tư và Phát triển Việt Nam
    TECHCOMBANK: "970407", // Ngân hàng TMCP Kỹ Thương Việt Nam
    MB: "970422", // Ngân hàng TMCP Quân đội
    VPBANK: "970432", // Ngân hàng TMCP Việt Nam Thịnh Vượng
    TPBANK: "970423", // Ngân hàng TMCP Tiên Phong
    SACCOMBANK: "970403", // Ngân hàng TMCP Sài Gòn Thương Tín
    AGRIBANK: "970400", // Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam
    // ... Thêm các ngân hàng khác nếu cần
  };

  // Nếu người dùng nhập tên đầy đủ, cố gắng tìm mã. Nếu không tìm thấy, trả về null.
  for (const name in mapping) {
    if (normalizedName.includes(name) || name.includes(normalizedName)) {
      return mapping[name];
    }
  }

  // Trường hợp cuối: Nếu bankName đã là mã số (ví dụ: "970436"), sử dụng nó
  if (/^\d{6}$/.test(bankName)) {
    return bankName;
  }

  return null;
};

/**
 * Helper: Format status
 */
const formatStatus = (status) => {
  if (!status) return "N/A";
  return status.charAt(0).toUpperCase() + status.slice(1);
};

/**
 * Helper: Get badge class for status
 */
const getStatusBadge = (status) => {
  switch (status) {
    case "pending":
      return "iw-status-badge iw-status-pending";
    case "approved":
      return "iw-status-badge iw-status-approved";
    case "rejected":
      return "iw-status-badge iw-status-rejected";
    case "cancelled":
      return "iw-status-badge iw-status-cancelled";
    default:
      return "iw-status-badge";
  }
};
// #endregion ====================================================

// #region =================== SUB-COMPONENTS ===================

/**
 * Displays the 4-card stats grid (Không đổi)
 */
const StatsGrid = React.memo(({ stats }) => {
  return (
    <div className="admin-discount-stats-grid">
      <div className="admin-discount-stat-card">
        <div className="admin-discount-stat-icon admin-discount-stat-icon-primary">
          <CashStack size={16} />
        </div>
        <div className="admin-discount-stat-content">
          <h3>{stats.total}</h3>
          <p>Total Requests</p>
        </div>
      </div>
      <div className="admin-discount-stat-card">
        <div className="admin-discount-stat-icon admin-discount-stat-icon-warning">
          <ClockHistory size={16} />
        </div>
        <div className="admin-discount-stat-content">
          <h3>{stats.pending}</h3>
          <p>Pending</p>
        </div>
      </div>
      <div className="admin-discount-stat-card">
        <div className="admin-discount-stat-icon admin-discount-stat-icon-success">
          <CheckCircle size={16} />
        </div>
        <div className="admin-discount-stat-content">
          <h3>{stats.approved}</h3>
          <p>Approved</p>
        </div>
      </div>
      <div className="admin-discount-stat-card">
        <div className="admin-discount-stat-icon admin-discount-stat-icon-danger">
          <XCircle size={16} />
        </div>
        <div className="admin-discount-stat-content">
          <h3>{stats.rejected}</h3>
          <p>Rejected</p>
        </div>
      </div>
    </div>
  );
});

/**
 * Displays the table of withdrawal requests
 */
const RequestsTable = React.memo(
  ({ requests, loading, onApproveClick, onRejectClick }) => {
    return (
      <div className="admin-discount-table-container">
        <div className="admin-discount-table-responsive">
          <table className="admin-discount-table">
            <thead>
              <tr>
                {/* THÊM CỘT MỚI */}
                <th>Instructor</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Request Date</th>
                <th>Admin Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan="6" className="iw-loading-text">
                    Loading data...
                  </td>
                </tr>
              )}
              {!loading &&
                requests.map((req) => (
                  <tr key={req._id}>
                    <td>
                      {/* Bọc bằng Link component */}
                      {req.instructorId ? (
                        <Link
                          to={`/public/instructor/${req.instructorId._id}`}
                          className="iw-instructor-link" // Thêm class để bỏ style
                          target="_blank" // Mở tab mới
                          rel="noopener noreferrer"
                        >
                          <div className="iw-instructor-info iw-instructor-link">
                            <span>
                              {[
                                req.instructorId?.firstName,
                                req.instructorId?.lastName,
                              ]
                                .filter(Boolean) // Thêm filter(Boolean) để loại bỏ tên null/undefined
                                .join(" ") || "N/A"}
                            </span>
                          </div>
                        </Link>
                      ) : (
                        // Fallback nếu instructorId bị null
                        <div className="iw-instructor-info">
                          <span>N/A</span>
                          <small>@N/A</small>
                        </div>
                      )}
                    </td>
                    <td>
                      <span className="iw-amount-text">
                        {formatCurrency(req.amount)}
                      </span>
                    </td>
                    <td>
                      <span className={getStatusBadge(req.status)}>
                        {formatStatus(req.status)}
                      </span>
                    </td>
                    <td>{formatDate(req.createdAt)}</td>
                    <td>
                      {req.status === "rejected" ? (
                        <span className="iw-admin-notes">
                          {req.adminNotes || "N/A"}
                        </span>
                      ) : (
                        "---"
                      )}
                    </td>
                    <td>
                      {/* THAY ĐỔI ACTIONS */}
                      {req.status === "pending" ? (
                        <div className="admin-discount-action-buttons admin-discount-action-buttons-withdrawal">
                          <button
                            className="admin-discount-action-btn iw-approve-btn"
                            onClick={() => onApproveClick(req._id)}
                            title="Approve request"
                          >
                            <CheckLg size={16} />
                          </button>
                          <button
                            className="admin-discount-action-btn iw-reject-btn"
                            onClick={() => onRejectClick(req._id)}
                            title="Reject request"
                          >
                            <XLg size={16} />
                          </button>
                        </div>
                      ) : (
                        "---"
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {!loading && requests.length === 0 && (
          <div className="admin-discount-empty-state">
            <CashStack size={24} />
            <h3>No Requests Found</h3>
            <p>No withdrawal requests match the current filters.</p>
          </div>
        )}
      </div>
    );
  }
);

/**
 * Modal to confirm Approval
 */
const ApprovePaymentModal = ({
  show,
  onClose,
  onConfirm,
  loading,
  requestDetail,
}) => {
  // === KHAI BÁO BIẾN CẦN THIẾT (SỬ DỤNG SAFE NAVIGATION) ===

  // 1. Lấy thông tin thanh toán từ field "payoutDetails" của User
  const payoutDetails = requestDetail?.instructorId?.payoutDetails || {};

  // 2. Lấy thông tin cần thiết từ payoutDetails
  const vietQRBankName = payoutDetails.bankName;
  const accountNumber = payoutDetails.accountNumber;
  const accountName = payoutDetails.accountHolderName; // Tên chủ tài khoản

  console.log("VietQR Bank Name:", vietQRBankName);
  console.log("Account Number:", accountNumber);
  console.log("Account Name:", accountName);

  // 3. Tính toán các giá trị khác
  const amount = toFloat(requestDetail?.amount);
  const formatAmount = Math.round(amount);

  const instructorName = requestDetail?.instructorId
    ? [
        requestDetail.instructorId.firstName,
        requestDetail.instructorId.lastName,
      ]
        .filter(Boolean)
        .join(" ")
    : "INSTRUCTOR";

  const withdrawalIdSuffix = requestDetail?._id
    ? requestDetail._id.substring(requestDetail._id.length - 4)
    : "N/A";

  // Tính toán nội dung chuyển khoản
  const paymentNarrative = `THANHTOAN cho ${instructorName} RUTTIEN${withdrawalIdSuffix}`;

  // 4. Lấy Mã VietQR (acqId) từ tên ngân hàng
  const bankId = getVietQRBankId(vietQRBankName);

  // Tạo URL VietQR (HOOK LUÔN PHẢI GỌI TRƯỚC LỆNH RETURN SỚM)
  const vietQRLink = useMemo(() => {
    // Nếu thiếu Mã Ngân hàng, Số TK, hoặc Số tiền <= 0, không tạo link.
    if (!bankId || !accountNumber || formatAmount <= 0) {
      return null;
    }

    // === THAY ĐỔI URL CƠ SỞ ===
    const vietQRBaseUrl = "https://img.vietqr.io/image"; // URL mới
    const template = "compact"; // Chọn template (ví dụ: 'compact' hoặc 'qr_only')

    // Tạo URL theo định dạng mới
    // Định dạng: https://img.vietqr.io/image/<BANK_ID>-<ACCOUNT_NO>-<TEMPLATE>.png
    let url = `${vietQRBaseUrl}/${bankId}-${accountNumber}-${template}.png`;

    // Thêm Query Parameters
    const params = new URLSearchParams({
      amount: formatAmount,
      addInfo: paymentNarrative,
      accountName: accountName, // Thêm accountName vào query param nếu API hỗ trợ
    });

    return `${url}?${params.toString()}`;
  }, [bankId, accountNumber, formatAmount, paymentNarrative, accountName]);

  // === LỆNH RETURN SỚM SAU KHI CÁC HOOK ĐÃ ĐƯỢC GỌI ===
  if (!show || !requestDetail) return null;

  return (
    <div className="admin-discount-modal-overlay" onClick={onClose}>
      <div
        className="admin-discount-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "500px", padding: "20px" }}
      >
        <div className="admin-discount-modal-header">
          <h2>Xác Nhận Thanh Toán (VietQR)</h2>
        </div>

        {/* Thông tin Thanh toán */}
        <div style={{ padding: "20px 0", borderBottom: "1px solid #eee" }}>
          <h3
            style={{ marginTop: "0", marginBottom: "15px", fontSize: "1.2em" }}
          >
            Chi Tiết Thanh Toán
          </h3>
          <p>Người thụ hưởng: {accountName || "Chưa có thông tin"}</p>
          <p>
            Ngân hàng: {vietQRBankName || "N/A"}
            {/* Hiển thị mã ngân hàng VietQR nếu có */}
            {bankId && (
              <small style={{ marginLeft: "5px", color: "#6b7280" }}>
                ({bankId} - Mã VietQR)
              </small>
            )}
          </p>
          <p>Số tài khoản: {accountNumber || "Chưa có thông tin"}</p>
          <p>
            Số tiền rút:{" "}
            <span style={{ color: "#ef4444", fontWeight: "bold" }}>
              {formatCurrency(amount)}
            </span>
          </p>
          <p>Nội dung chuyển khoản: {paymentNarrative}</p>

          {/* Cảnh báo nếu thiếu thông tin */}
          {!bankId || !accountNumber ? (
            <div
              style={{
                padding: "10px",
                backgroundColor: "#fee2e2",
                color: "#991b1b",
                borderRadius: "4px",
                marginTop: "10px",
              }}
            >
              LƯU Ý QUAN TRỌNG: Thiếu thông tin ngân hàng cần thiết (Mã Ngân
              hàng VietQR hoặc Số TK). Vui lòng thực hiện chuyển khoản thủ công
              và xác nhận phê duyệt.
            </div>
          ) : null}
        </div>

        {/* QR Code */}
        {vietQRLink && (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <h3 style={{ margin: "0 0 15px", fontSize: "1.2em" }}>Mã VietQR</h3>
            <div
              style={{
                border: "1px solid #ddd",
                padding: "10px",
                display: "inline-block",
                borderRadius: "8px",
              }}
            >
              <img
                src={vietQRLink}
                alt={`Mã VietQR cho ${accountName}`}
                style={{ width: "250px", height: "250px", display: "block" }}
              />
            </div>
            <p
              style={{ fontSize: "0.9em", color: "#6b7280", marginTop: "10px" }}
            >
              Sử dụng app ngân hàng quét mã để chuyển khoản.
            </p>
          </div>
        )}

        {/* Footer actions */}
        <div className="admin-discount-modal-footer">
          <button
            className="admin-discount-cancel-btn"
            type="button"
            onClick={onClose}
            disabled={loading}
          >
            Đóng
          </button>
          <button
            className="admin-discount-submit-btn"
            onClick={onConfirm}
            disabled={loading}
            style={{ backgroundColor: "#10b981" }} // Green button
          >
            {loading ? "Đang Cập Nhật..." : "Đã Thanh Toán & Phê Duyệt"}
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Modal for Rejecting a request (requires notes)
 */
const RejectRequestModal = ({ show, onClose, onSubmit, loading }) => {
  const [adminNotes, setAdminNotes] = useState("");

  if (!show) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!adminNotes.trim()) {
      toast.error("Please provide a reason for rejection.");
      return;
    }
    onSubmit(adminNotes);
    setAdminNotes(""); // Reset form sau khi submit
  };

  const handleClose = () => {
    setAdminNotes(""); // Reset form khi đóng
    onClose();
  };

  return (
    <div className="admin-discount-modal-overlay" onClick={handleClose}>
      <div
        className="admin-discount-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="admin-discount-modal-header">
          <h2>Reject Withdrawal Request</h2>
          <button className="admin-discount-close-btn" onClick={handleClose}>
            ×
          </button>
        </div>

        <form className="admin-discount-form" onSubmit={handleSubmit}>
          <div className="admin-discount-form-grid-single">
            <div className="admin-discount-form-group">
              <label htmlFor="adminNotes">Reason for Rejection</label>
              <textarea
                className="admin-discount-form-control"
                name="adminNotes"
                rows="4"
                placeholder="Enter reason (e.g., incorrect bank info...)"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="admin-discount-modal-footer">
            <button
              className="admin-discount-cancel-btn"
              type="button"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="admin-discount-submit-btn"
              type="submit"
              disabled={loading}
              style={{ backgroundColor: "#dc2626" }} // Red button
            >
              {loading ? "Rejecting..." : "Reject Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
// #endregion ====================================================

// #region =================== MAIN COMPONENT ===================
const AdminWithdrawal = ({ title = "Withdrawal Management" }) => {
  // Data State
  const [allRequests, setAllRequests] = useState([]); // Master list
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    cancelled: 0,
  });

  // Loading State
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false); // Loading state for approve/reject

  // Filter State
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Modal State
  const [showApproveModal, setShowApproveModal] = useState(null); // Stores ID
  const [requestToApprove, setRequestToApprove] = useState(null); // Stores the request object
  const [showRejectModal, setShowRejectModal] = useState(null); // Stores ID

  /**
   * Fetch all data
   */
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const params = { status: "all" }; // Always fetch all

      // Admin only needs the withdrawal list
      const requestsRes = await getInstructorWithdrawals(params);

      const withdrawalData = requestsRes.data || [];
      setAllRequests(withdrawalData); // Set the master list

      // Calculate Stats
      const calculatedStats = {
        total: withdrawalData.length,
        pending: withdrawalData.filter((r) => r.status === "pending").length,
        approved: withdrawalData.filter((r) => r.status === "approved").length,
        rejected: withdrawalData.filter((r) => r.status === "rejected").length,
        cancelled: withdrawalData.filter((r) => r.status === "cancelled")
          .length,
      };
      setStats(calculatedStats);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []); // useCallback with empty dependency array

  // Effect to fetch data on mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // DERIVED STATE: Calculate filtered list using useMemo
  const filteredRequests = useMemo(() => {
    if (selectedStatus === "all") {
      return allRequests;
    }
    return allRequests.filter((request) => request.status === selectedStatus);
  }, [selectedStatus, allRequests]);

  const handleApproveClick = (requestId) => {
    const request = allRequests.find((r) => r._id === requestId);
    if (request) {
      setRequestToApprove(request);
      setShowApproveModal(requestId);
    } else {
      toast.error("Request details not found.");
    }
  };

  /**
   * Handle request approval
   */
  const handleApproveRequest = async () => {
    const requestId = showApproveModal;
    if (!requestId) return;

    setActionLoading(true);
    try {
      // Cập nhật trạng thái sang "approved" sau khi đã thanh toán thành công
      await updateWithdrawalRequest(requestId, { status: "approved" });
      toast.success("Thanh toán hoàn tất và yêu cầu đã được phê duyệt!");
      setShowApproveModal(null);
      setRequestToApprove(null); // Reset detail
      fetchData(); // Reload data
    } catch (error) {
      console.error("Operation failed:", error);
      toast.error(
        error.response?.data?.message || error.message || "Phê duyệt thất bại."
      );
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Handle request rejection
   */
  const handleRejectRequest = async (adminNotes) => {
    const requestId = showRejectModal;
    if (!requestId) return;

    setActionLoading(true);
    try {
      await updateWithdrawalRequest(requestId, {
        status: "rejected",
        adminNotes,
      });
      toast.success("Request rejected successfully.");
      setShowRejectModal(null);
      fetchData(); // Reload data
    } catch (error) {
      console.error("Operation failed:", error);
      toast.error(
        error.response?.data?.message || error.message || "Rejection failed."
      );
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="admin-discount">
      {/* Header */}
      <div className="admin-discount-header">
        <div className="admin-discount-header-left">
          <h1 className="admin-discount-page-title">{title}</h1>
          <p className="admin-discount-page-subtitle">
            Approve or reject instructor withdrawal requests
          </p>
        </div>
        {/* Admin doesn't need a "create" button */}
      </div>

      {/* Stats Cards */}
      <StatsGrid stats={stats} />

      {/* Filters */}
      <div className="admin-discount-search-filter-section">
        <div className="admin-discount-filter-controls">
          <div className="admin-discount-filter-group">
            <Funnel size={16} />
            <select
              className="admin-discount-filter-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          {/* TODO: Add a filter for instructors if needed */}
        </div>
      </div>

      {/* Requests Table */}
      <RequestsTable
        requests={filteredRequests} // Use the memoized list
        loading={loading}
        onApproveClick={handleApproveClick}
        onRejectClick={(id) => setShowRejectModal(id)}
      />

      {/* --- MODALS --- */}

      <ApprovePaymentModal
        show={!!showApproveModal}
        onClose={() => {
          setShowApproveModal(null);
          setRequestToApprove(null);
        }}
        onConfirm={handleApproveRequest}
        loading={actionLoading}
        requestDetail={requestToApprove} // Truyền chi tiết request
      />

      <RejectRequestModal
        show={!!showRejectModal}
        onClose={() => setShowRejectModal(null)}
        onSubmit={handleRejectRequest}
        loading={actionLoading}
      />
    </div>
  );
};
// #endregion ====================================================

export default AdminWithdrawal;
