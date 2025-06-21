import React, { useState } from "react";
import {
  Search,
  ChevronDown,
  Plus,
  Users,
  UserCheck,
  UserX,
  UserPlus,
} from "lucide-react";
import { DatePicker, ConfigProvider } from "antd";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import CustomButton from "../common/CustomButton/CustomButton";
import "../../assets/AdminManageUser/AdminManageUser.css";

dayjs.extend(isBetween);

// --- MOCK DATA ---
// In a real application, this data would come from an API
const initialUsers = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@example.com",
    avatar: "https://placehold.co/40x40/E4E4E7/3F3F46?text=JS",
    status: "Active",
    dateJoined: "2024-03-15",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    avatar: "https://placehold.co/40x40/E4E4E7/3F3F46?text=SJ",
    status: "Banned",
    dateJoined: "2024-02-28",
  },
  {
    id: 3,
    name: "Mike Davis",
    email: "mike.davis@example.com",
    avatar: "https://placehold.co/40x40/E4E4E7/3F3F46?text=MD",
    status: "Active",
    dateJoined: "2024-01-12",
  },
  {
    id: 4,
    name: "Emily Wilson",
    email: "emily.wilson@example.com",
    avatar: "https://placehold.co/40x40/E4E4E7/3F3F46?text=EW",
    status: "Banned",
    dateJoined: "2023-12-05",
  },
  {
    id: 5,
    name: "Alex Brown",
    email: "alex.brown@example.com",
    avatar: "https://placehold.co/40x40/E4E4E7/3F3F46?text=AB",
    status: "Active",
    dateJoined: "2023-11-18",
  },
  {
    id: 6,
    name: "Lisa Anderson",
    email: "lisa.anderson@example.com",
    avatar: "https://placehold.co/40x40/E4E4E7/3F3F46?text=LA",
    status: "Banned",
    dateJoined: "2023-10-22",
  },
  // Adding more users for pagination
  {
    id: 7,
    name: "David Martinez",
    email: "david.m@example.com",
    avatar: "https://placehold.co/40x40/E4E4E7/3F3F46?text=DM",
    status: "Active",
    dateJoined: "2023-09-30",
  },
  {
    id: 8,
    name: "Jessica Garcia",
    email: "jessica.g@example.com",
    avatar: "https://placehold.co/40x40/E4E4E7/3F3F46?text=JG",
    status: "Active",
    dateJoined: "2023-09-15",
  },
  {
    id: 9,
    name: "Chris Rodriguez",
    email: "chris.r@example.com",
    avatar: "https://placehold.co/40x40/E4E4E7/3F3F46?text=CR",
    status: "Banned",
    dateJoined: "2023-08-20",
  },
  {
    id: 10,
    name: "Linda Hernandez",
    email: "linda.h@example.com",
    avatar: "https://placehold.co/40x40/E4E4E7/3F3F46?text=LH",
    status: "Active",
    dateJoined: "2023-08-01",
  },
  {
    id: 11,
    name: "James Wilson",
    email: "james.w@example.com",
    avatar: "https://placehold.co/40x40/E4E4E7/3F3F46?text=JW",
    status: "Active",
    dateJoined: "2023-07-11",
  },
  {
    id: 12,
    name: "Patricia Moore",
    email: "patricia.m@example.com",
    avatar: "https://placehold.co/40x40/E4E4E7/3F3F46?text=PM",
    status: "Banned",
    dateJoined: "2023-06-25",
  },
  {
    id: 13,
    name: "New User Today",
    email: "new.user@example.com",
    avatar: "https://placehold.co/40x40/E4E4E7/3F3F46?text=NU",
    status: "Active",
    dateJoined: dayjs().format("YYYY-MM-DD"),
  },
];

export default function AdminManageUser() {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("all");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const handleToggleStatus = (userId) => {
    setUsers(
      users.map((user) =>
        user.id === userId
          ? { ...user, status: user.status === "Active" ? "Banned" : "Active" }
          : user
      )
    );
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
      // Cleared the date range
      setDateFilter("all");
      setFromDate(null);
      setToDate(null);
    }
    setCurrentPage(1);
  };

  const filteredUsers = users
    .filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((user) => statusFilter === "All" || user.status === statusFilter)
    .filter((user) => {
      const joinDate = dayjs(user.dateJoined);
      const today = dayjs();

      switch (dateFilter) {
        case "today":
          return joinDate.isSame(today, "day");
        case "month":
          return joinDate.isSame(today, "month");
        case "custom": {
          if (!fromDate || !toDate) return true;
          return joinDate.isBetween(
            fromDate.startOf("day"),
            toDate.endOf("day"),
            null,
            "[]"
          );
        }
        case "all":
        default:
          return true;
      }
    });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, filteredUsers.length);

  // Stats Calculation
  const totalUsers = users.length;
  const today = dayjs();
  const newUsersToday = users.filter((user) => {
    return dayjs(user.dateJoined).isSame(today, "day");
  }).length;

  const monthName = today.format("MMM");
  const newUsersThisMonth = users.filter((user) => {
    return dayjs(user.dateJoined).isSame(today, "month");
  }).length;

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#ff6636",
          borderRadius: 8,
        },
        components: {
          DatePicker: {
            // Custom styles for DatePicker can go here if needed
          },
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
              <option>All Status</option>
              <option>Active</option>
              <option>Banned</option>
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
                <th>Status</th>
                <th>Date Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user, index) => {
                const isBanned = user.status === "Banned";
                const rowNumber = (currentPage - 1) * itemsPerPage + index + 1;
                return (
                  <tr key={user.id} className="amu-table-row">
                    <td className="amu-table-cell amu-row-number">
                      {rowNumber}
                    </td>
                    <td className="amu-table-cell">
                      <div className="amu-user-info">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="amu-user-avatar"
                        />
                        <div>
                          <div className="amu-user-name">{user.name}</div>
                          <div className="amu-user-email">{user.email}</div>
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
                        {user.status}
                      </span>
                    </td>
                    <td className="amu-table-cell amu-date-joined">
                      {user.dateJoined}
                    </td>
                    <td className="amu-table-cell">
                      <CustomButton
                        size="small"
                        color={isBanned ? "success" : "error"}
                        type="underline"
                        onClick={() => handleToggleStatus(user.id)}
                      >
                        {isBanned ? "Unban User" : "Ban User"}
                      </CustomButton>
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
              Showing {startItem} to {endItem} of {filteredUsers.length} results
            </p>
            <div className="amu-pagination-controls">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="amu-pagination-button"
              >
                Previous
              </button>
              {[...Array(totalPages).keys()].map((num) => (
                <button
                  key={num + 1}
                  onClick={() => handlePageChange(num + 1)}
                  className={`amu-pagination-button ${
                    currentPage === num + 1 ? "active" : ""
                  }`}
                >
                  {num + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
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
      </div>
    </ConfigProvider>
  );
}
