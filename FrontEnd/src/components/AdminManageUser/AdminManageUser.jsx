import React, { useState, useEffect, useMemo } from "react";
import { Search, Users, UserPlus } from "lucide-react";
import { DatePicker, ConfigProvider, message, Modal } from "antd";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import CustomButton from "../common/CustomButton/CustomButton";
import { getAllUsers, updateUserStatus } from "../../services/adminService";
import { useSelector } from "react-redux";
import "../../assets/AdminManageUser/AdminManageUser.css";

dayjs.extend(isBetween);

export default function AdminManageUser() {
  const { currentUser } = useSelector((state) => state.auth);
  const [allUsers, setAllUsers] = useState([]); // Store all users
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("all");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userActionLoading, setUserActionLoading] = useState({}); // Loading state for individual users
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [userToToggle, setUserToToggle] = useState(null);

  // Client-side filtering and pagination
  const filteredUsers = useMemo(() => {
    let filtered = [...allUsers];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "All") {
      filtered = filtered.filter((user) => user.status === statusFilter);
    }

    // Date filter
    if (dateFilter === "today") {
      filtered = filtered.filter((user) =>
        dayjs(user.createdAt).isSame(dayjs(), "day")
      );
    } else if (dateFilter === "month") {
      filtered = filtered.filter((user) =>
        dayjs(user.createdAt).isSame(dayjs(), "month")
      );
    } else if (dateFilter === "custom" && fromDate && toDate) {
      filtered = filtered.filter((user) =>
        dayjs(user.createdAt).isBetween(fromDate, toDate, "day", "[]")
      );
    }

    return filtered;
  }, [allUsers, searchTerm, statusFilter, dateFilter, fromDate, toDate]);

  // Paginated users
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, currentPage, itemsPerPage]);

  // Total count and pagination info
  const totalUsers = filteredUsers.length;
  const totalPages = Math.ceil(totalUsers / itemsPerPage);
  const startItem = totalUsers > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(currentPage * itemsPerPage, totalUsers);

  // Fetch all users once
  const fetchAllUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch with a large limit to get all users
      const res = await getAllUsers({ limit: 10000 }); // Adjust limit as needed
      setAllUsers(res.data.data || []);
    } catch (err) {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []); // Only fetch once on mount

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, dateFilter, fromDate, toDate]);

  const handleToggleStatus = async (userId, currentStatus) => {
    // Map UI status to backend status
    let newStatus;
    if (currentStatus === "banned" || currentStatus === "Banned") {
      newStatus = "verified"; // Unban user
    } else {
      newStatus = "banned"; // Ban user
    }

    try {
      // Set loading state for this specific user
      setUserActionLoading((prev) => ({ ...prev, [userId]: true }));

      // Optimistic update - update allUsers array
      setAllUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, status: newStatus } : user
        )
      );

      // Make API call
      await updateUserStatus(userId, newStatus);
      message.success(
        `User status updated to ${
          newStatus === "verified" ? "Active" : "Banned"
        }`
      );
    } catch (err) {
      // Revert optimistic update on error
      setAllUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, status: currentStatus } : user
        )
      );

      message.error("Action failed. No changes were made to the database.");
    } finally {
      // Remove loading state for this specific user
      setUserActionLoading((prev) => {
        const newState = { ...prev };
        delete newState[userId];
        return newState;
      });
    }
  };

  const handleToggleStatusClick = (userId, currentStatus, userName) => {
    // Check if this is a ban action (not unban)
    if (currentStatus !== "banned" && currentStatus !== "Banned") {
      // Check if admin is trying to ban their own account
      if (currentUser && userId === currentUser._id) {
        message.error("You cannot perform this action on your own account.");
        return;
      }
      
      // Show confirmation modal for ban action
      setUserToToggle({ userId, currentStatus, userName });
      setConfirmModalVisible(true);
    } else {
      // Directly execute unban action
      handleToggleStatus(userId, currentStatus);
    }
  };

  const confirmToggleStatus = () => {
    if (userToToggle) {
      handleToggleStatus(userToToggle.userId, userToToggle.currentStatus);
      setConfirmModalVisible(false);
      setUserToToggle(null);
    }
  };

  const cancelToggleStatus = () => {
    setConfirmModalVisible(false);
    setUserToToggle(null);
  };

  // Instructor approval moved to Censor Instructor page

  const handleDateButtonClick = (filter) => {
    setDateFilter(filter);
    setFromDate(null);
    setToDate(null);
  };

  const handleDateChange = (dates) => {
    if (dates && dates.length === 2) {
      setDateFilter("custom");
      setFromDate(dates[0]);
      setToDate(dates[1]);
    } else {
      setDateFilter("all");
      setFromDate(null);
      setToDate(null);
    }
  };

  // Stats Calculation (based on all users)
  const today = dayjs();
  const newUsersToday = allUsers.filter((user) =>
    dayjs(user.dateJoined || user.createdAt).isSame(today, "day")
  ).length;
  const monthName = today.format("MMM");
  const newUsersThisMonth = allUsers.filter((user) =>
    dayjs(user.dateJoined || user.createdAt).isSame(today, "month")
  ).length;

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#ff6636",
          borderRadius: 8,
        },
        components: {
          DatePicker: {},
        },
      }}
    >
      <div className="amu-container">
        {/* Loading State */}
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading users...</p>
          </div>
        )}
        {/* Error State */}
        {!loading && error && (
          <div className="error-container">
            <p>{error}</p>
            <button className="retry-button" onClick={fetchAllUsers}>
              Retry
            </button>
          </div>
        )}
        {/* Main Content */}
        {!loading && !error && (
          <>
            {/* Stats Grid */}
            <div className="amu-stats-grid">
              <div className="amu-stat-card">
                <div className="amu-stat-icon-wrapper amu-color-purple">
                  <Users className="amu-stat-icon" />
                </div>
                <div className="amu-stat-info">
                  <span className="amu-stat-value">{allUsers.length}</span>
                  <span className="amu-stat-label">Total Users</span>
                </div>
              </div>
              <div className="amu-stat-card">
                <div className="amu-stat-icon-wrapper amu-color-green">
                  <UserPlus className="amu-stat-icon" />
                </div>
                <div className="amu-stat-info">
                  <span className="amu-stat-value">{newUsersToday}</span>
                  <span className="amu-stat-label">New Users Today</span>
                </div>
              </div>
              <div className="amu-stat-card">
                <div className="amu-stat-icon-wrapper amu-color-orange">
                  <UserPlus className="amu-stat-icon" />
                </div>
                <div className="amu-stat-info">
                  <span className="amu-stat-value">{newUsersThisMonth}</span>
                  <span className="amu-stat-label">{`New in ${monthName}`}</span>
                </div>
              </div>
            </div>

            {/* Toolbar */}
            <div className="amu-toolbar">
              <div className="amu-toolbar-left">
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
                  <option value="All">All</option>
                  <option value="verified">Active</option>
                  <option value="banned">Banned</option>
                  <option value="unverified">Unverified</option>
                </select>
              </div>
              <div className="amu-toolbar-right">
                <div className="amu-date-filter-group">
                  <span className="amu-filter-label">Joined Date:</span>
                  <div className="amu-date-filter">
                    <button
                      className={`amu-date-filter-btn ${
                        dateFilter === "all" ? "active" : ""
                      }`}
                      onClick={() => handleDateButtonClick("all")}
                    >
                      All
                    </button>
                    <button
                      className={`amu-date-filter-btn ${
                        dateFilter === "today" ? "active" : ""
                      }`}
                      onClick={() => handleDateButtonClick("today")}
                    >
                      Today
                    </button>
                    <button
                      className={`amu-date-filter-btn ${
                        dateFilter === "month" ? "active" : ""
                      }`}
                      onClick={() => handleDateButtonClick("month")}
                    >
                      This Month
                    </button>
                  </div>
                  <div className="amu-date-range-filter">
                    <DatePicker.RangePicker
                      value={fromDate && toDate ? [fromDate, toDate] : null}
                      onChange={handleDateChange}
                      allowClear
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="amu-table-container">
              <table className="amu-table">
                <thead className="amu-table-header">
                  <tr>
                    <th>NO.</th>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Date Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((user, index) => {
                    // Normalize status for UI
                    const isBanned =
                      user.status === "banned" || user.status === "Banned";
                    const statusLabel =
                      user.status === "banned" || user.status === "Banned"
                        ? "Banned"
                        : user.status === "verified" ||
                          user.status === "Verified"
                        ? "Active"
                        : user.status;
                    const isInstructor = user.role === "instructor";
                    const isAdmin = user.role === "admin";
                    const rowNumber =
                      (currentPage - 1) * itemsPerPage + index + 1;
                    return (
                      <tr key={user._id} className="amu-table-row">
                        <td className="amu-table-cell amu-row-number">
                          {rowNumber}
                        </td>
                        <td className="amu-table-cell">
                          <div className="amu-user-info">
                            <img
                              src={
                                user.userImage || "/images/defaultImageUser.png"
                              }
                              alt={user.name || user.userName || "User Avatar"}
                              className="amu-user-avatar"
                            />
                            <div>
                              <div className="amu-user-name">
                                {user.firstName} {user.lastName}
                              </div>
                              <div className="amu-user-email">
                                {user.userName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="amu-table-cell amu-user-email">
                          {user.email}
                        </td>
                        <td className="amu-table-cell">
                          <span
                            className={`amu-status-badge ${
                              isAdmin
                                ? "amu-role-admin"
                                : isInstructor
                                ? "amu-role-instructor"
                                : "amu-role-student"
                            }`}
                          >
                            {user.role
                              ? user.role.charAt(0).toUpperCase() +
                                user.role.slice(1)
                              : "Student"}
                          </span>
                        </td>
                        <td className="amu-table-cell">
                          <span
                            className={`amu-status-badge ${
                              isBanned
                                ? "amu-status-banned"
                                : "amu-status-active"
                            }`}
                          >
                            {statusLabel}
                          </span>
                        </td>
                        <td className="amu-table-cell amu-date-joined">
                          {dayjs(user.createdAt).format("DD/MM/YYYY")}
                        </td>
                        <td className="amu-table-cell">
                          <div
                            style={{
                              display: "flex",
                              gap: "8px",
                              flexDirection: "column",
                            }}
                          >
                            <CustomButton
                              size="small"
                              color={isBanned ? "success" : "error"}
                              type="underline"
                              disabled={
                                userActionLoading[user._id] ||
                                (currentUser && user._id === currentUser._id && !isBanned)
                              }
                              onClick={() =>
                                handleToggleStatusClick(
                                  user._id,
                                  user.status,
                                  `${user.firstName} ${user.lastName}`
                                )
                              }
                            >
                              {userActionLoading[user._id]
                                ? isBanned
                                  ? "Unbanning..."
                                  : "Banning..."
                                : isBanned
                                ? "Unban User"
                                : "Ban User"}
                            </CustomButton>
                            {/* Instructor approval moved to Censor Instructor page */}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {paginatedUsers.length > 0 && (
              <div className="amu-pagination">
                <p className="amu-pagination-info">
                  Showing {startItem} to {endItem} of {totalUsers} results
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
            )}
            {paginatedUsers.length === 0 && (
              <div className="amu-empty-state">No users found.</div>
            )}
          </>
        )}
        
        {/* Confirmation Modal */}
        <Modal
          title="Confirm Ban User"
          open={confirmModalVisible}
          onOk={confirmToggleStatus}
          onCancel={cancelToggleStatus}
          okText="Ban"
          cancelText="Cancel"
          okButtonProps={{ danger: true }}
        >
          <p>
            Are you sure you want to ban user{" "}
            <strong>{userToToggle?.userName}</strong>?
          </p>
          <p>This action will prevent the user from accessing the system and send them a notification email.</p>
        </Modal>
      </div>
    </ConfigProvider>
  );
}
