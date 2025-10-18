import React, { useState, useEffect, useMemo } from "react";
import { Search } from "lucide-react";
import { DatePicker, ConfigProvider } from "antd";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import {
  getInstructorApplications,
  approveInstructor,
  denyInstructor,
} from "../../services/adminService";
import { resendVerificationLink } from "../../services/authService";
import "../../assets/AdminManageUser/CensorInstructor.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

dayjs.extend(isBetween);

const RejectionModal = ({
  isOpen,
  onClose,
  onSubmit,
  reasons,
  selectedReasons,
  customReason,
  setCustomReason,
  toggleReason,
  isSubmitting,
}) => {
  if (!isOpen) return null;

  return (
    <div className="ci-modal-overlay">
      <div className="ci-modal-content">
        <div className="ci-modal-header">
          <h2 className="ci-modal-title">Reject Application</h2>
          <button
            className="ci-modal-close-btn"
            onClick={onClose}
            disabled={isSubmitting}
          >
            ×
          </button>
        </div>
        <div className="ci-modal-body">
          <div className="ci-modal-section">
            <h3 className="ci-section-title">Select Reasons</h3>
            <div className="ci-expertise-tags">
              {reasons.map((reason, index) => (
                <div
                  key={index}
                  className={`ci-expertise-tag ${
                    selectedReasons.includes(reason) ? "selected" : ""
                  }`}
                  onClick={() => toggleReason(reason)}
                >
                  {reason}
                </div>
              ))}
            </div>
          </div>
          <div className="ci-modal-section">
            <h3 className="ci-section-title">Custom Reason</h3>
            <textarea
              className="ci-search"
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder="Enter custom reason here..."
              disabled={isSubmitting}
            ></textarea>
          </div>
        </div>
        <div className="ci-modal-footer">
          <button
            className="ci-modal-btn ci-modal-btn-secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            className={`ci-modal-btn ci-modal-btn-primary ${
              isSubmitting ? "loading" : ""
            }`}
            onClick={onSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function CensorInstructor() {
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedReasons, setSelectedReasons] = useState([]);
  const [customReason, setCustomReason] = useState("");
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isSubmittingRejection, setIsSubmittingRejection] = useState(false);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getInstructorApplications({ limit: 10000 });
      console.log("API Response:", response.data); // Log the API response
      setApplications(response.data.data || []);
    } catch (err) {
      console.error("API Error:", err); // Log any API errors
      setError("Failed to fetch applications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const filteredApplications = useMemo(() => {
    let filtered = applications;

    if (searchTerm) {
      filtered = filtered.filter((app) =>
        [app.firstName, app.lastName, app.email]
          .filter(Boolean)
          .some((field) =>
            field.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }

    if (dateFilter === "today") {
      filtered = filtered.filter((app) =>
        dayjs(app.createdAt).isSame(dayjs(), "day")
      );
    } else if (dateFilter === "month") {
      filtered = filtered.filter((app) =>
        dayjs(app.createdAt).isSame(dayjs(), "month")
      );
    } else if (dateFilter === "custom" && fromDate && toDate) {
      filtered = filtered.filter((app) =>
        dayjs(app.createdAt).isBetween(fromDate, toDate, "day", "[]")
      );
    }

    return filtered;
  }, [applications, searchTerm, statusFilter, dateFilter, fromDate, toDate]);

  const paginatedApplications = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredApplications.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredApplications, currentPage, itemsPerPage]);

  const totalApplications = filteredApplications.length;
  const totalPages = Math.ceil(totalApplications / itemsPerPage);

  const openModal = (application) => {
    setSelectedApplication(application);
  };

  const closeModal = () => {
    setSelectedApplication(null);
    setShowActionMenu(false);
    setShowRejectModal(false);
    setSelectedReasons([]);
    setCustomReason("");
  };

  const openImageViewer = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const closeImageViewer = () => {
    setSelectedImage(null);
  };

  // Predefined rejection reasons
  const rejectionReasons = [
    "Thông tin cá nhân không đầy đủ hoặc không chính xác",
    "Tài liệu chứng minh chuyên môn không hợp lệ",
    "Kinh nghiệm giảng dạy chưa đáp ứng yêu cầu tối thiểu",
    "Lĩnh vực chuyên môn không phù hợp với nền tảng",
    "Hồ sơ thiếu tài liệu cần thiết",
  ];

  const toggleReason = (reason) => {
    if (selectedReasons.includes(reason)) {
      setSelectedReasons(selectedReasons.filter((r) => r !== reason));
    } else {
      setSelectedReasons([...selectedReasons, reason]);
    }
  };

  const openRejectModal = () => {
    setShowActionMenu(false);
    setShowRejectModal(true);
  };

  const closeRejectModal = () => {
    setShowRejectModal(false);
    setSelectedReasons([]);
    setCustomReason("");
  };

  const handleApprove = async () => {
    if (!selectedApplication) return;

    setIsApproving(true); // Set loading state

    try {
      await approveInstructor({ applicationId: selectedApplication._id });
      toast.success("Application approved successfully!");
      closeModal();
      fetchApplications();
    } catch (error) {
      console.error("Error approving application:", error);
      toast.error("Failed to approve the application. Please try again.");
    } finally {
      setIsApproving(false); // Reset loading state
    }
  };

  const handleReject = async () => {
    if (!selectedApplication) return;

    if (selectedReasons.length === 0 && !customReason.trim()) {
      toast.warn(
        "Please select at least one reason or provide a custom reason."
      );
      openRejectModal(); // Ensure modal opens when validation fails
      return;
    }

    setIsSubmittingRejection(true); // Set loading state for rejection modal submit

    try {
      await denyInstructor({
        applicationId: selectedApplication._id,
        reasons: selectedReasons,
        customReason: customReason.trim(),
      });
      toast.success("Application denied successfully!");
      closeRejectModal();
      closeModal();
      fetchApplications();
    } catch (error) {
      console.error("Error denying application:", error);
      toast.error("Failed to deny the application. Please try again.");
    } finally {
      setIsSubmittingRejection(false); // Reset loading state
    }
  };

  const handleSendVerificationEmail = async () => {
    if (!selectedApplication) return;

    try {
      await resendVerificationLink(selectedApplication.email);
      toast.success("Verification email sent successfully!");
      closeModal();
      fetchApplications();
    } catch (error) {
      console.error("Error sending verification email:", error);
      toast.error("Failed to send verification email. Please try again.");
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#ff6636",
          borderRadius: 8,
        },
      }}
    >
      <div className="amu-container">
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading applications...</p>
          </div>
        )}
        {!loading && error && (
          <div className="error-container">
            <p>{error}</p>
            <button className="retry-button" onClick={fetchApplications}>
              Retry
            </button>
          </div>
        )}
        {!loading && !error && (
          <>
            <div className="amu-toolbar">
              <div className="amu-search-container">
                <Search className="amu-search-icon" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="amu-search-input"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="amu-filter-select"
              >
                <option value="all">All</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="pending">Pending</option>
              </select>
              <div className="amu-date-filter-group">
                <span className="amu-filter-label">Joined Date:</span>
                <div className="amu-date-filter">
                  <button
                    className={`amu-date-filter-btn ${
                      dateFilter === "all" ? "active" : ""
                    }`}
                    onClick={() => setDateFilter("all")}
                  >
                    All
                  </button>
                  <button
                    className={`amu-date-filter-btn ${
                      dateFilter === "today" ? "active" : ""
                    }`}
                    onClick={() => setDateFilter("today")}
                  >
                    Today
                  </button>
                  <button
                    className={`amu-date-filter-btn ${
                      dateFilter === "month" ? "active" : ""
                    }`}
                    onClick={() => setDateFilter("month")}
                  >
                    This Month
                  </button>
                </div>
                <div className="amu-date-range-filter">
                  <DatePicker.RangePicker
                    value={fromDate && toDate ? [fromDate, toDate] : null}
                    onChange={(dates) => {
                      if (dates && dates.length === 2) {
                        setDateFilter("custom");
                        setFromDate(dates[0]);
                        setToDate(dates[1]);
                      } else {
                        setDateFilter("all");
                        setFromDate(null);
                        setToDate(null);
                      }
                    }}
                    allowClear
                  />
                </div>
              </div>
            </div>

            <div className="amu-table-container">
              <table className="amu-table">
                <thead className="amu-table-header">
                  <tr>
                    <th>NO.</th>
                    <th>Applicant</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Date Applied</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedApplications.map((app, index) => {
                    const rowNumber =
                      (currentPage - 1) * itemsPerPage + index + 1;
                    return (
                      <tr key={app._id} className="amu-table-row">
                        <td className="amu-table-cell amu-row-number">
                          {rowNumber}
                        </td>
                        <td className="amu-table-cell">
                          <div className="amu-user-info">
                            <img
                              src={
                                app.userImage || "/images/defaultImageUser.png"
                              }
                              alt={
                                app.firstName || app.lastName || "User Avatar"
                              }
                              className="amu-user-avatar"
                            />
                            <div>
                              <div className="amu-user-name">
                                {app.firstName} {app.lastName}
                              </div>
                              <div className="amu-user-email">{app.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="amu-table-cell amu-user-email">
                          {app.email}
                        </td>
                        <td className="amu-table-cell">
                          <span
                            className={`ci-status-badge ${
                              app.status === "approved"
                                ? "ci-status-approved"
                                : app.status === "rejected"
                                ? "ci-status-rejected"
                                : "ci-status-pending"
                            }`}
                          >
                            {app.status}
                          </span>
                        </td>
                        <td className="amu-table-cell amu-date-joined">
                          {dayjs(app.createdAt).format("DD/MM/YYYY")}
                        </td>
                        <td className="amu-table-cell">
                          <button
                            className="ci-view-details-button"
                            onClick={() => openModal(app)}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="amu-pagination">
              <p className="amu-pagination-info">
                Showing {currentPage * itemsPerPage - itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, totalApplications)} of{" "}
                {totalApplications} results
              </p>
              <div className="amu-pagination-controls">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="amu-pagination-button"
                >
                  Previous
                </button>
                {[...Array(totalPages).keys()].map((num) => (
                  <button
                    key={num + 1}
                    onClick={() => setCurrentPage(num + 1)}
                    className={`amu-pagination-button ${
                      currentPage === num + 1 ? "active" : ""
                    }`}
                  >
                    {num + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="amu-pagination-button"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
        {/* Modal for application details */}
        {selectedApplication && (
          <div className="ci-modal-overlay" onClick={closeModal}>
            <div
              className="ci-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="ci-modal-header">
                <h2 className="ci-modal-title">Application Details</h2>
                <button className="ci-modal-close-btn" onClick={closeModal}>
                  ×
                </button>
              </div>

              <div className="ci-modal-body">
                {/* Personal Information Section */}
                <div className="ci-modal-section">
                  <h3 className="ci-section-title">Personal Information</h3>
                  <div className="ci-info-grid">
                    <div className="ci-info-item">
                      <span className="ci-info-label">Name:</span>
                      <span className="ci-info-value">
                        {selectedApplication.firstName}{" "}
                        {selectedApplication.lastName}
                      </span>
                    </div>
                    <div className="ci-info-item">
                      <span className="ci-info-label">Email:</span>
                      <span className="ci-info-value">
                        {selectedApplication.email}
                      </span>
                    </div>
                    <div className="ci-info-item">
                      <span className="ci-info-label">Phone:</span>
                      <span className="ci-info-value">
                        {selectedApplication.phone}
                      </span>
                    </div>
                    <div className="ci-info-item ci-info-item-full">
                      <span className="ci-info-label">Bio:</span>
                      <span className="ci-info-value">
                        {selectedApplication.bio}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Professional Information Section */}
                <div className="ci-modal-section">
                  <h3 className="ci-section-title">Professional Information</h3>
                  <div className="ci-info-grid">
                    <div className="ci-info-item ci-info-item-full">
                      <span className="ci-info-label">Expertise:</span>
                      <div className="ci-expertise-tags">
                        {(selectedApplication.expertise || []).map(
                          (exp, idx) => (
                            <span key={idx} className="ci-expertise-tag">
                              {exp}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                    <div className="ci-info-item ci-info-item-full">
                      <span className="ci-info-label">Experience:</span>
                      <span className="ci-info-value">
                        {selectedApplication.experience}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Banking Information Section */}
                <div className="ci-modal-section">
                  <h3 className="ci-section-title">Banking Information</h3>
                  <div className="ci-info-grid">
                    <div className="ci-info-item">
                      <span className="ci-info-label">Bank Name:</span>
                      <span className="ci-info-value">
                        {selectedApplication.bankName}
                      </span>
                    </div>
                    <div className="ci-info-item">
                      <span className="ci-info-label">Account Number:</span>
                      <span className="ci-info-value">
                        {selectedApplication.accountNumber}
                      </span>
                    </div>
                    <div className="ci-info-item ci-info-item-full">
                      <span className="ci-info-label">Account Holder:</span>
                      <span className="ci-info-value">
                        {selectedApplication.accountHolderName}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Documents Section */}
                {selectedApplication.documents &&
                  selectedApplication.documents.length > 0 && (
                    <div className="ci-modal-section">
                      <h3 className="ci-section-title">Documents</h3>
                      <div className="ci-documents-grid">
                        {selectedApplication.documents.map((doc, idx) => (
                          <div key={idx} className="ci-document-item">
                            <img
                              src={doc}
                              alt={`Document ${idx + 1}`}
                              className="ci-document-image"
                              onClick={() => openImageViewer(doc)}
                            />
                            <span className="ci-document-label">
                              Document {idx + 1}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Status and Timeline Section */}
                <div className="ci-modal-section">
                  <h3 className="ci-section-title">Status & Timeline</h3>
                  <div className="ci-info-grid">
                    <div className="ci-info-item">
                      <span className="ci-info-label">Status:</span>
                      <span
                        className={`ci-status-badge-modal ${
                          selectedApplication.status === "approved"
                            ? "ci-status-approved"
                            : selectedApplication.status === "rejected"
                            ? "ci-status-rejected"
                            : "ci-status-pending"
                        }`}
                      >
                        {selectedApplication.status}
                      </span>
                    </div>
                    <b></b>
                    <div className="ci-info-item">
                      <span className="ci-info-label">Created At:</span>
                      <span className="ci-info-value">
                        {dayjs(selectedApplication.createdAt).format(
                          "DD/MM/YYYY HH:mm"
                        )}
                      </span>
                    </div>
                    <div className="ci-info-item">
                      <span className="ci-info-label">Updated At:</span>
                      <span className="ci-info-value">
                        {dayjs(selectedApplication.updatedAt).format(
                          "DD/MM/YYYY HH:mm"
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="ci-modal-footer">
                <button
                  className="ci-modal-btn ci-modal-btn-secondary"
                  onClick={closeModal}
                >
                  Close
                </button>
                <div className="ci-action-menu-wrapper">
                  <button
                    className="ci-modal-btn ci-modal-btn-primary"
                    onClick={() => setShowActionMenu(!showActionMenu)}
                  >
                    Take Action
                    <span className="ci-action-menu-arrow">▼</span>
                  </button>
                  {showActionMenu && (
                    <div className="ci-action-menu">
                      {selectedApplication?.status === "emailNotVerified" ? (
                        <button
                          className="ci-action-menu-item ci-action-send-verification"
                          onClick={handleSendVerificationEmail}
                        >
                          <span className="ci-action-icon">✉</span>
                          Send Verification Email
                        </button>
                      ) : (
                        <>
                          <button
                            className={`ci-action-menu-item ci-action-approve ${
                              isApproving ? "loading" : ""
                            }`}
                            onClick={handleApprove}
                            disabled={
                              selectedApplication?.status === "approved" ||
                              isApproving
                            }
                          >
                            {isApproving ? (
                              "Approving..."
                            ) : (
                              <>
                                <span className="ci-action-icon">✓</span>
                                Approve Application
                              </>
                            )}
                          </button>
                          <button
                            className={`ci-action-menu-item ci-action-reject ${
                              isRejecting ? "loading" : ""
                            }`}
                            onClick={openRejectModal}
                            disabled={
                              selectedApplication?.status === "rejected" ||
                              isRejecting
                            }
                          >
                            {isRejecting ? (
                              "Rejecting..."
                            ) : (
                              <>
                                <span className="ci-action-icon">✕</span>
                                Reject Application
                              </>
                            )}
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rejection Reason Modal */}
        <RejectionModal
          isOpen={showRejectModal}
          onClose={closeRejectModal}
          onSubmit={handleReject}
          reasons={rejectionReasons}
          selectedReasons={selectedReasons}
          customReason={customReason}
          setCustomReason={setCustomReason}
          toggleReason={toggleReason}
          isSubmitting={isSubmittingRejection} // Pass loading state to modal
        />

        {/* Image Viewer Modal */}
        {selectedImage && (
          <div className="ci-image-viewer-overlay" onClick={closeImageViewer}>
            <button
              className="ci-image-viewer-close"
              onClick={closeImageViewer}
            >
              ×
            </button>
            <div
              className="ci-image-viewer-container"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage}
                alt="Document Preview"
                className="ci-image-viewer-image"
              />
            </div>
          </div>
        )}
      </div>
    </ConfigProvider>
  );
}
