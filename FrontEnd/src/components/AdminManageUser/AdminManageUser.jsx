import React, { useState, useEffect } from "react";
import {
  Search,
  ChevronDown,
  Plus,
  Users,
  UserCheck,
  UserX,
  UserPlus,
} from "lucide-react";
import { DatePicker, ConfigProvider, message } from "antd";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import CustomButton from "../common/CustomButton/CustomButton";
import { getAllUsers, updateUserStatus } from "../../services/adminService";
import "../../assets/AdminManageUser/AdminManageUser.css";

dayjs.extend(isBetween);

export default function AdminManageUser() {
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("all");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allUsers, setAllUsers] = useState([]); // For stats

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm || undefined,
        status: statusFilter !== "All" ? statusFilter : undefined,
        fromDate:
          dateFilter === "custom" && fromDate
            ? fromDate.format("YYYY-MM-DD")
            : undefined,
        toDate:
          dateFilter === "custom" && toDate
            ? toDate.format("YYYY-MM-DD")
            : undefined,
        dateFilter:
          dateFilter !== "all" && dateFilter !== "custom"
            ? dateFilter
            : undefined,
      };
      const res = await getAllUsers(params);
      setUsers(res.data.data || []);
      setTotalUsers(res.data.pagination?.totalUsers || 0);
    } catch (err) {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // Fetch all users for stats (no pagination)
  const fetchAllUsersForStats = async () => {
    try {
      const res = await getAllUsers({}); // No pagination params
      setAllUsers(res.data.data || []);
    } catch (err) {
      // Ignore error for stats
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchAllUsersForStats(); // Only on mount
    // eslint-disable-next-line
  }, [searchTerm, statusFilter, dateFilter, fromDate, toDate, currentPage]);

  const handleToggleStatus = async (userId, currentStatus) => {
    // Map UI status to backend status
    let newStatus;
    if (currentStatus === "banned" || currentStatus === "Banned") {
      newStatus = "verified"; // Unban user
    } else {
      newStatus = "banned"; // Ban user
    }
    try {
      setLoading(true);
      await updateUserStatus(userId, newStatus);
      message.success(`User status updated to ${newStatus}`);
      fetchUsers();
    } catch (err) {
      message.error("Failed to update user status");
    } finally {
      setLoading(false);
    }
  };

  const handleDateButtonClick = (filter) => {
    setDateFilter(filter);
    setFromDate(null);
    setToDate(null);
    setCurrentPage(1);
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
    setCurrentPage(1);
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalUsers);
  const totalPages = Math.ceil(totalUsers / itemsPerPage);

  // Stats Calculation (based on all users, not just current page)
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
        {/* Stats Grid */}
        <div className="amu-stats-grid">
          <div className="amu-stat-card">
            <div className="amu-stat-icon-wrapper amu-color-purple">
              <Users className="amu-stat-icon" />
            </div>
            <div className="amu-stat-info">
              <span className="amu-stat-value">{totalUsers}</span>
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
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="amu-search-input"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
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
          {loading ? (
            <div className="amu-loading-state">Loading users...</div>
          ) : error ? (
            <div className="amu-error-state">{error}</div>
          ) : (
            <table className="amu-table">
              <thead className="amu-table-header">
                <tr>
                  <th>NO.</th>
                  <th>User</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Date Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => {
                  // Normalize status for UI
                  const isBanned =
                    user.status === "banned" || user.status === "Banned";
                  const statusLabel =
                    user.status === "banned" || user.status === "Banned"
                      ? "Banned"
                      : user.status === "verified" || user.status === "Verified"
                      ? "Active"
                      : user.status;
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
                            isBanned ? "amu-status-banned" : "amu-status-active"
                          }`}
                        >
                          {statusLabel}
                        </span>
                      </td>
                      <td className="amu-table-cell amu-date-joined">
                        {dayjs(user.createdAt).format("DD/MM/YYYY")}
                      </td>
                      <td className="amu-table-cell">
                        <CustomButton
                          size="small"
                          color={isBanned ? "success" : "error"}
                          type="underline"
                          onClick={() =>
                            handleToggleStatus(user._id, user.status)
                          }
                        >
                          {isBanned ? "Unban User" : "Ban User"}
                        </CustomButton>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {users.length > 0 && !loading && !error && (
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
        {users.length === 0 && !loading && !error && (
          <div className="amu-empty-state">No users found.</div>
        )}
      </div>
    </ConfigProvider>
  );
}
