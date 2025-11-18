import React, { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
// Use your shared CSS file
import "../../assets/AdminDiscount/AdminDiscount.css";
import "../../assets/Withdrawal/InstructorWithdraw.css";
import {
  getCurrentUserProfile,
  // getPayoutDetails, // No longer used directly, profile has it
  updatePayoutDetails,
} from "../../services/userService";
import {
  getInstructorWithdrawals,
  createWithdrawalRequest,
  updateWithdrawalRequest,
} from "../../services/withdrawalService";
import {
  CurrencyDollar,
  Bank,
  PencilSquare,
  Trash,
  Funnel,
  CashStack,
  ClockHistory,
  CheckCircle,
  XCircle,
} from "react-bootstrap-icons";

// --- End Helper Icons ---

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

const VIETQR_BANKS = [
  { name: "Vietcombank", acqId: "970436" },
  { name: "ACB", acqId: "970416" },
  { name: "Techcombank", acqId: "970407" },
  { name: "MBBank", acqId: "970422" },
  { name: "BIDV", acqId: "970418" },
  { name: "VietinBank", acqId: "970415" },
  { name: "TPBank", acqId: "970423" },
  { name: "Sacombank", acqId: "970403" },
  { name: "Agribank", acqId: "970400" },
  // Thêm các ngân hàng khác vào đây.
  // Ghi chú: Giá trị value trong select sẽ là Mã acqId.
];
// #endregion ====================================================

// #region =================== SUB-COMPONENTS ===================

/**
 * Displays Balance and Payout Info Cards
 */
const BalanceInfo = React.memo(
  ({ currentBalance, payoutDetails, onEditPayout }) => {
    // Lấy tên hiển thị từ Mã VietQR (payoutDetails.bankName đang chứa acqId)
    const bankDisplayName = getBankNameFromAcqId(payoutDetails.bankName);
    return (
      <div className="instructor-balance-section instructor-balance-section-withdrawal">
        <div className="instructor-balance-card instructor-balance-card-withdrawal">
          <div className="admin-discount-stat-icon admin-discount-stat-icon-primary admin-discount-stat-icon-withdrawal">
            <CurrencyDollar size={20} />
          </div>
          <div className="admin-discount-stat-content admin-discount-stat-content-withdrawal">
            <h3>{formatCurrency(currentBalance)}</h3>
            <p>Available Balance</p>
          </div>
        </div>

        <div className="instructor-balance-card instructor-balance-card-withdrawal">
          <div className="admin-discount-stat-icon admin-discount-stat-icon-info admin-discount-stat-icon-withdrawal">
            <Bank size={20} />
          </div>
          <div className="admin-discount-stat-content admin-discount-stat-content-withdrawal">
            {payoutDetails.bankName ? (
              <>
                <h3 className="payout-details-text">
                  {bankDisplayName} {/* HIỂN THỊ TÊN NGÂN HÀNG */}
                </h3>
                <p>
                  {payoutDetails.accountNumber} -{" "}
                  {payoutDetails.accountHolderName}
                </p>
              </>
            ) : (
              <>
                <h3 className="payout-details-text-missing">Not Updated</h3>
                <p>Please add your bank information</p>
              </>
            )}
          </div>
          <button
            className="instructor-payout-edit-btn instructor-payout-edit-btn-withdrawal"
            onClick={onEditPayout}
          >
            <PencilSquare size={16} />
          </button>
        </div>
      </div>
    );
  }
);

/**
 * Displays the 4-card stats grid
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
const RequestsTable = React.memo(({ requests, loading, onCancelClick }) => {
  return (
    <div className="admin-discount-table-container">
      <div className="admin-discount-table-responsive">
        <table className="admin-discount-table">
          <thead>
            <tr>
              <th>Amount</th>
              <th>Status</th>
              <th>Request Date</th>
              <th>Processed Date</th>
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
                  <td>{formatDate(req.updatedAt)}</td>
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
                    {req.status === "pending" ? (
                      <div className="admin-discount-action-buttons admin-discount-action-buttons-withdrawal">
                        <button
                          className="admin-discount-action-btn admin-discount-delete-btn"
                          onClick={() => onCancelClick(req._id)}
                          title="Cancel request"
                        >
                          <Trash size={16} />
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
          <CurrencyDollar size={24} />
          <h3>No Requests Found</h3>
          <p>
            No requests match the current filter, or you haven't made any
            requests.
          </p>
        </div>
      )}
    </div>
  );
});

/**
 * Modal for Creating a new withdrawal request
 */
const RequestWithdrawalModal = ({
  show,
  onClose,
  onSubmit,
  loading,
  currentBalance,
}) => {
  const [amount, setAmount] = useState("");

  if (!show) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount)) {
      toast.error("Please enter a valid amount.");
      return;
    }
    // onSubmit prop handles the rest of the validation and API call
    onSubmit(numericAmount);
  };

  return (
    <div className="admin-discount-modal-overlay" onClick={onClose}>
      <div
        className="admin-discount-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="admin-discount-modal-header">
          <h2>Request Withdrawal</h2>
          <button className="admin-discount-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form className="admin-discount-form" onSubmit={handleSubmit}>
          <div className="admin-discount-form-grid-single">
            <div className="admin-discount-form-group">
              <label>Available Balance</label>
              <input
                className="admin-discount-form-control"
                type="text"
                value={formatCurrency(currentBalance)}
                disabled
              />
            </div>
            <div className="admin-discount-form-group">
              <label htmlFor="amount">Amount to withdraw (VND)</label>
              <input
                className="admin-discount-form-control"
                name="amount"
                type="number"
                placeholder="Enter amount"
                max={toFloat(currentBalance)}
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="admin-discount-modal-footer">
            <button
              className="admin-discount-cancel-btn"
              type="button"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="admin-discount-submit-btn"
              type="submit"
              disabled={loading}
            >
              {loading ? "Processing..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const getBankNameFromAcqId = (acqId) => {
  const bank = VIETQR_BANKS.find((b) => b.acqId === acqId);
  return bank ? bank.name : "Unknown Bank";
};

/**
 * Modal for Updating Payout (Bank) Details
 */
const UpdatePayoutModal = ({
  show,
  onClose,
  onSubmit,
  loading,
  initialData,
}) => {
  // initialData.bankName bây giờ sẽ chứa Mã VietQR (acqId)
  const [details, setDetails] = useState({
    bankName: "", // Chứa Mã VietQR (acqId)
    accountNumber: "",
    accountHolderName: "",
  });

  // Sync state with prop when modal opens
  useEffect(() => {
    if (initialData) {
      setDetails(initialData);
    }
  }, [initialData, show]); // Re-sync if 'show' changes (modal opens)

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!details.bankName) {
      toast.error("Vui lòng chọn tên ngân hàng.");
      return;
    }
    // Gửi details.bankName (là Mã VietQR) lên server
    onSubmit(details);
  };

  return (
    <div className="admin-discount-modal-overlay" onClick={onClose}>
      <div
        className="admin-discount-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="admin-discount-modal-header">
          <h2>Update Payout Information</h2>
          <button className="admin-discount-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form className="admin-discount-form" onSubmit={handleSubmit}>
          <div className="admin-discount-form-grid-single">
            <div className="admin-discount-form-group">
              <label htmlFor="bankName">Bank Name (Chọn Ngân hàng)</label>
              <select
                className="admin-discount-form-control"
                name="bankName"
                value={details.bankName} // Value là Mã VietQR (acqId)
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  -- Select Bank --
                </option>
                {VIETQR_BANKS.map((bank) => (
                  <option key={bank.acqId} value={bank.acqId}>
                    {bank.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-discount-form-group">
              <label htmlFor="accountNumber">Account Number</label>
              <input
                className="admin-discount-form-control"
                name="accountNumber"
                type="text"
                placeholder="Enter account number"
                value={details.accountNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div className="admin-discount-form-group">
              <label htmlFor="accountHolderName">Account Holder Name</label>
              <input
                className="admin-discount-form-control"
                name="accountHolderName"
                type="text"
                placeholder="NGUYEN VAN A (Uppercase, no accents)"
                value={details.accountHolderName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="admin-discount-modal-footer">
            <button
              className="admin-discount-cancel-btn"
              type="button"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="admin-discount-submit-btn"
              type="submit"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/**
 * Modal to confirm cancellation of a request
 */
const ConfirmCancelModal = ({ show, onClose, onConfirm }) => {
  if (!show) return null;

  return (
    <div className="admin-discount-modal-overlay" onClick={onClose}>
      <div
        className="admin-discount-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "400px", padding: "20px" }}
      >
        <div className="admin-discount-modal-header">
          <h2>Confirm Cancellation</h2>
        </div>
        <div style={{ padding: "20px" }}>
          Are you sure you want to cancel this withdrawal request?
        </div>
        <div className="admin-discount-modal-footer">
          <button
            className="admin-discount-cancel-btn"
            type="button"
            onClick={onClose}
          >
            No
          </button>
          <button
            className="admin-discount-submit-btn"
            style={{ backgroundColor: "#dc2626" }}
            onClick={onConfirm}
          >
            Yes, Cancel Request
          </button>
        </div>
      </div>
    </div>
  );
};
// #endregion ====================================================

// #region =================== MAIN COMPONENT ===================
const InstructorWithdrawal = ({ title = "Withdrawal Management" }) => {
  // Data State
  const [allRequests, setAllRequests] = useState([]); // Master list
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    cancelled: 0,
  });
  const [currentBalance, setCurrentBalance] = useState(0);
  const [payoutDetails, setPayoutDetails] = useState({
    bankName: "",
    accountNumber: "",
    accountHolderName: "",
  });

  // Loading State
  const [loading, setLoading] = useState(true);
  const [loadingRequest, setLoadingRequest] = useState(false);
  const [loadingPayout, setLoadingPayout] = useState(false);

  // Filter State
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Modal State
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState(null); // Stores the ID of request to cancel

  /**
   * Fetch all data
   */
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const params = { status: "all" }; // Always fetch all

      const [profileRes, requestsRes] = await Promise.all([
        getCurrentUserProfile(),
        getInstructorWithdrawals(params),
      ]);

      // 1. Handle Profile
      const profileData = profileRes.data;
      setCurrentBalance(toFloat(profileData.moneyLeft));
      if (profileData.payoutDetails) {
        setPayoutDetails(profileData.payoutDetails);
      }

      // 2. Handle Withdrawal Requests
      const withdrawalData = requestsRes.data || [];
      setAllRequests(withdrawalData); // Set the master list

      // 3. Calculate Stats
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

  /**
   * Handle withdrawal request submission
   */
  const handleRequestSubmit = async (amount) => {
    if (amount > currentBalance) {
      toast.error("The requested amount exceeds the available balance.");
      return;
    }
    if (amount <= 0) {
      toast.error("The amount must be greater than 0.");
      return;
    }
    if (!payoutDetails.bankName) {
      toast.error("Please update your payout information before withdrawing.");
      setShowRequestModal(false); // Close this modal
      setShowPayoutModal(true); // Open the other one
      return;
    }

    setLoadingRequest(true);
    try {
      await createWithdrawalRequest({ amount });
      toast.success("Withdrawal request submitted successfully!");
      setShowRequestModal(false);
      fetchData(); // Reload data
    } catch (error) {
      console.error("Operation failed:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to submit request."
      );
    } finally {
      setLoadingRequest(false);
    }
  };

  /**
   * Handle payout details update
   */
  const handlePayoutSubmit = async (details) => {
    setLoadingPayout(true);
    try {
      const response = await updatePayoutDetails(details);
      setPayoutDetails(response.data.payoutDetails);
      toast.success("Payout information updated successfully!");
      setShowPayoutModal(false);
    } catch (error) {
      console.error("Operation failed:", error);
      toast.error(
        error.response?.data?.message || error.message || "Update failed."
      );
    } finally {
      setLoadingPayout(false);
    }
  };

  /**
   * Handle request cancellation
   */
  const handleCancelRequest = async () => {
    if (!showConfirmCancel) return; // ID is stored in state
    const requestId = showConfirmCancel;

    try {
      await updateWithdrawalRequest(requestId, { status: "cancelled" });
      toast.success("Withdrawal request cancelled.");
      setShowConfirmCancel(null);
      fetchData(); // Reload data
    } catch (error) {
      console.error("Operation failed:", error);
      toast.error(
        error.response?.data?.message || error.message || "Cancellation failed."
      );
    }
  };

  return (
    <div className="admin-discount">
      {/* Header */}
      <div className="admin-discount-header">
        <div className="admin-discount-header-left">
          <h1 className="admin-discount-page-title">{title}</h1>
          <p className="admin-discount-page-subtitle">
            Manage your balance and withdrawal requests
          </p>
        </div>
        <div className="admin-discount-header-right">
          <button
            className="admin-discount-submit-btn"
            onClick={() => setShowRequestModal(true)}
            disabled={!payoutDetails.bankName}
            title={
              !payoutDetails.bankName
                ? "Update payout information to withdraw"
                : "Create new request"
            }
          >
            Request Withdrawal
          </button>
        </div>
      </div>

      {/* Balance & Payout Info Section */}
      <BalanceInfo
        currentBalance={currentBalance}
        payoutDetails={payoutDetails}
        onEditPayout={() => setShowPayoutModal(true)}
      />

      {/* Stats Cards */}
      <StatsGrid stats={stats} />

      {/* Filters (Simplified) */}
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
        </div>
      </div>

      {/* Discounts Table */}
      <RequestsTable
        requests={filteredRequests} // Use the memoized list
        loading={loading}
        onCancelClick={(id) => setShowConfirmCancel(id)}
      />

      {/* --- MODALS --- */}

      <RequestWithdrawalModal
        show={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        onSubmit={handleRequestSubmit}
        loading={loadingRequest}
        currentBalance={currentBalance}
      />

      <UpdatePayoutModal
        show={showPayoutModal}
        onClose={() => setShowPayoutModal(false)}
        onSubmit={handlePayoutSubmit}
        loading={loadingPayout}
        initialData={payoutDetails}
      />

      <ConfirmCancelModal
        show={!!showConfirmCancel}
        onClose={() => setShowConfirmCancel(null)}
        onConfirm={handleCancelRequest}
      />
    </div>
  );
};
// #endregion ====================================================

export default InstructorWithdrawal;
