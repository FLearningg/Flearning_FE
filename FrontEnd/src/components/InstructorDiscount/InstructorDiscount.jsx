import React, { useState, useEffect } from "react";
import CustomButton from "../common/CustomButton/CustomButton";
import Input from "../common/Input";
import SearchBox from "../common/search/SearchBox/SearchBox";
import {
  getInstructorDiscounts,
  createInstructorDiscount,
  updateInstructorDiscount,
} from "../../services/discountService";
import { getInstructorCourses } from "../../services/instructorService";
import "../../assets/AdminDiscount/AdminDiscount.css";
import { toast } from "react-toastify";

const InstructorDiscount = ({ title = "Discount Management" }) => {
  const [discounts, setDiscounts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [instructorCourses, setInstructorCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [courseSearchQuery, setCourseSearchQuery] = useState("");
  const [currentCoursePage, setCurrentCoursePage] = useState(1);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const COURSES_PER_PAGE = 5;

  // Fetch instructor's courses
  const fetchInstructorCourses = async () => {
    try {
      const response = await getInstructorCourses();
      // Handle different response structures
      const coursesData = response.data?.data || response.data || [];
      console.log("Instructor courses:", coursesData);
      setInstructorCourses(Array.isArray(coursesData) ? coursesData : []);
    } catch (error) {
      console.error("Failed to fetch instructor courses:", error);
      setInstructorCourses([]);
    }
  };

  // Fetch discounts and stats
  const fetchData = async () => {
    try {
      setLoading(true);

      // Build filter parameters
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (selectedStatus !== "all") params.status = selectedStatus;
      if (selectedType !== "all") params.type = selectedType;
      if (selectedCategory !== "all") params.category = selectedCategory;

      const discountsResponse = await getInstructorDiscounts(params);

      setDiscounts(discountsResponse.data?.discounts || []);

      // Calculate stats from instructor's discounts
      const instructorDiscounts = discountsResponse.data?.discounts || [];
      const calculatedStats = {
        overview: {
          total: instructorDiscounts.length,
          active: instructorDiscounts.filter(d => d.status === "active").length,
          expired: instructorDiscounts.filter(d => d.status === "expired").length,
          inactive: instructorDiscounts.filter(d => d.status === "inActive").length,
        }
      };
      setStats(calculatedStats);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      // Set empty data if API fails to show UI without breaking
      setDiscounts([]);
      setStats({ overview: { total: 0, active: 0, expired: 0, inactive: 0 } });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructorCourses();
    fetchData();
  }, [searchQuery, selectedStatus, selectedType, selectedCategory]);

  // Icons
  const FilterIcon = () => (
    <svg
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"
      />
    </svg>
  );

  const EditIcon = () => (
    <svg
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
      />
    </svg>
  );

  const DeleteIcon = () => (
    <svg
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  );

  const CopyIcon = () => (
    <svg
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  );

  const TagIcon = () => (
    <svg
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
      />
    </svg>
  );

  // Handle search and filters
  const handleSearchSelect = (selectedItem) => {
    setSearchQuery(selectedItem.label);
  };

  const handleCategoryBrowse = () => {
    console.log("Category browse clicked");
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    const discountData = {
      discountCode: formData.get("discountCode"),
      description: formData.get("description"),
      category: formData.get("category"),
      type: formData.get("type"),
      value: Number(formData.get("value")),
      usageLimit: Number(formData.get("usageLimit")) || 0,
      minimumOrder: Number(formData.get("minimumOrder")) || 0,
      maximumDiscount: Number(formData.get("maximumDiscount")) || 0,
      startDate: formData.get("startDate") || null,
      endDate: formData.get("endDate") || null,
      status: formData.get("status") || "active",
      applyCourses: selectedCourses, // Add selected courses
    };

    try {
      if (editingDiscount) {
        await updateInstructorDiscount(editingDiscount._id, discountData);
        toast.success("Discount updated successfully!");
      } else {
        await createInstructorDiscount(discountData);
        toast.success("Discount created successfully!");
      }
      setShowCreateModal(false);
      setEditingDiscount(null);
      setSelectedCourses([]);
      fetchData();
    } catch (error) {
      console.error("Operation failed:", error);
      toast.error(error.message || "Operation failed");
    }
  };

  const handleEdit = (discount) => {
    setEditingDiscount(discount);
    // Extract course IDs from applyCourses (handle both object and string formats)
    const courseIds = (discount.applyCourses || []).map(course =>
      typeof course === 'string' ? course : course._id
    );
    setSelectedCourses(courseIds);
    setCourseSearchQuery("");
    setCurrentCoursePage(1);
    setShowCreateModal(true);
  };

  const handleCourseToggle = (courseId) => {
    setSelectedCourses((prev) => {
      if (prev.includes(courseId)) {
        return prev.filter((id) => id !== courseId);
      } else {
        return [...prev, courseId];
      }
    });
  };

  // Filter and paginate courses
  const getFilteredCourses = () => {
    let filtered = instructorCourses;

    // Filter by search query
    if (courseSearchQuery.trim()) {
      filtered = filtered.filter((course) =>
        course.title?.toLowerCase().includes(courseSearchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const getPaginatedCourses = () => {
    const filtered = getFilteredCourses();
    const startIndex = (currentCoursePage - 1) * COURSES_PER_PAGE;
    const endIndex = startIndex + COURSES_PER_PAGE;
    return filtered.slice(startIndex, endIndex);
  };

  const totalCoursePages = Math.ceil(getFilteredCourses().length / COURSES_PER_PAGE);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.info(`Discount code "${code}" copied to clipboard!`);
  };

  // Get status badge class
  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return "admin-discount-status-badge admin-discount-status-active";
      case "expired":
        return "admin-discount-status-badge admin-discount-status-expired";
      case "inactive":
      case "inActive":
        return "admin-discount-status-badge admin-discount-status-inactive";
      default:
        return "admin-discount-status-badge";
    }
  };

  // Calculate usage percentage
  const getUsagePercentage = (used, limit) => {
    return limit > 0 ? Math.round((used / limit) * 100) : 0;
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  // Create search data from current discounts
  const searchData = discounts.map((d) => ({
    id: d._id,
    label: d.discountCode,
    type: "code",
  }));

  return (
    <div className="admin-discount">
      {/* Header */}
      <div className="admin-discount-header">
        <div className="admin-discount-header-left">
          <h1 className="admin-discount-page-title">{title}</h1>
          <p className="admin-discount-page-subtitle">
            Manage discount codes and promotions
          </p>
        </div>
        <div className="admin-discount-header-right">
          <CustomButton
            size="medium"
            color="primary"
            onClick={() => {
              setEditingDiscount(null);
              setSelectedCourses([]);
              setCourseSearchQuery("");
              setCurrentCoursePage(1);
              setShowCreateModal(true);
            }}
          >
            Create Discount
          </CustomButton>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="admin-discount-stats-grid">
        <div className="admin-discount-stat-card">
          <div className="admin-discount-stat-icon admin-discount-stat-icon-primary">
            <TagIcon />
          </div>
          <div className="admin-discount-stat-content">
            <h3>{stats?.overview?.total || 0}</h3>
            <p>Total Discounts</p>
          </div>
        </div>
        <div className="admin-discount-stat-card">
          <div className="admin-discount-stat-icon admin-discount-stat-icon-success">
            <TagIcon />
          </div>
          <div className="admin-discount-stat-content">
            <h3>{stats?.overview?.active || 0}</h3>
            <p>Active Discounts</p>
          </div>
        </div>
        <div className="admin-discount-stat-card">
          <div className="admin-discount-stat-icon admin-discount-stat-icon-warning">
            <TagIcon />
          </div>
          <div className="admin-discount-stat-content">
            <h3>{stats?.overview?.expired || 0}</h3>
            <p>Expired Discounts</p>
          </div>
        </div>
        <div className="admin-discount-stat-card">
          <div className="admin-discount-stat-icon admin-discount-stat-icon-info">
            <TagIcon />
          </div>
          <div className="admin-discount-stat-content">
            <h3>{stats?.overview?.inactive || 0}</h3>
            <p>Inactive Discounts</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="admin-discount-search-filter-section">
        <div className="admin-discount-search-container">
          <SearchBox
            data={searchData}
            placeholder="Search discounts by code, description, or category..."
            onSelect={handleSearchSelect}
            onCategoryClick={handleCategoryBrowse}
            categoryLabel="Categories"
            containerClassName="admin-discount-search-box"
          />
        </div>

        {/* Filter Controls */}
        <div className="admin-discount-filter-controls">
          <div className="admin-discount-filter-group">
            <FilterIcon />
            <select
              className="admin-discount-filter-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="inActive">Inactive</option>
            </select>
          </div>

          <div className="admin-discount-filter-group">
            <select
              className="admin-discount-filter-select"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="percent">Percentage</option>
              <option value="fixedAmount">Fixed Amount</option>
            </select>
          </div>

          <div className="admin-discount-filter-group">
            <select
              className="admin-discount-filter-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="course">Course</option>
              <option value="subscription">Subscription</option>
            </select>
          </div>

          <button
            className="admin-discount-clear-all-btn"
            onClick={() => {
              setSearchQuery("");
              setSelectedStatus("all");
              setSelectedType("all");
              setSelectedCategory("all");
            }}
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Search Results Info */}
      <div className="admin-discount-search-results-info">
        <span className="admin-discount-results-count">
          {discounts.length} discounts {loading && "(Loading...)"}
        </span>
      </div>

      {/* Discounts Table */}
      <div className="admin-discount-table-container">
        <div className="admin-discount-table-responsive">
          <table className="admin-discount-table">
            <thead>
              <tr>
                <th>Discount Code</th>
                <th>Description</th>
                <th>Category</th>
                <th>Type</th>
                <th>Value</th>
                <th>Usage</th>
                <th>Status</th>
                <th>Valid Period</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {discounts.map((discount) => (
                <tr key={discount._id}>
                  <td>
                    <div className="admin-discount-code">
                      <span className="admin-discount-code-text">
                        {discount.discountCode}
                      </span>
                      <button
                        className="admin-discount-copy-btn"
                        onClick={() => handleCopyCode(discount.discountCode)}
                        title="Copy code"
                      >
                        <CopyIcon />
                      </button>
                    </div>
                  </td>
                  <td>
                    <div className="admin-discount-description">
                      <span className="admin-discount-description-text">
                        {discount.description}
                      </span>
                      <div className="admin-discount-description-meta">
                        Min order: {(discount.minimumOrder || 0).toLocaleString('vi-VN')} VND
                        {discount.maximumDiscount > 0 &&
                          ` • Max: ${discount.maximumDiscount.toLocaleString('vi-VN')} VND`}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`admin-discount-category-badge admin-discount-category-${discount.category}`}
                    >
                      {discount.category}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`admin-discount-type-badge admin-discount-type-${discount.type}`}
                    >
                      {discount.type === "percent" ? "%" : "$"}
                    </span>
                  </td>
                  <td>
                    <span className="admin-discount-value-text">
                      {discount.type === "percent"
                        ? `${discount.value}%`
                        : `${discount.value.toLocaleString('vi-VN')} VND`}
                    </span>
                  </td>
                  <td>
                    <div className="admin-discount-usage-info">
                      <div className="admin-discount-usage-stats">
                        <span>
                          {discount.usage || 0} / {discount.usageLimit || "∞"}
                        </span>
                      </div>
                      <div className="admin-discount-usage-bar">
                        <div
                          className="admin-discount-usage-progress"
                          style={{
                            width: `${getUsagePercentage(
                              discount.usage || 0,
                              discount.usageLimit
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={getStatusBadge(discount.status)}>
                      {discount.status}
                    </span>
                  </td>
                  <td>
                    <div className="admin-discount-date-range">
                      <div>{formatDate(discount.startDate)}</div>
                      <div>{formatDate(discount.endDate)}</div>
                    </div>
                  </td>
                  <td>
                    <div className="admin-discount-action-buttons">
                      <button
                        className="admin-discount-action-btn admin-discount-edit-btn"
                        onClick={() => handleEdit(discount)}
                        title="Edit discount"
                      >
                        <EditIcon />
                        <span className="admin-discount-fallback-text">✎</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {discounts.length === 0 && !loading && (
          <div className="admin-discount-empty-state">
            <TagIcon />
            <h3>No discounts found</h3>
            <p>No discounts available</p>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div
          className="admin-discount-modal-overlay"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="admin-discount-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-discount-modal-header">
              <h2>
                {editingDiscount ? "Edit Discount" : "Create New Discount"}
              </h2>
              <button
                className="admin-discount-close-btn"
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingDiscount(null);
                  setSelectedCourses([]);
                  setCourseSearchQuery("");
                  setCurrentCoursePage(1);
                }}
              >
                ×
              </button>
            </div>

            <form className="admin-discount-form" onSubmit={handleSubmit}>
              <div className="admin-discount-form-grid">
                <Input
                  variant="label"
                  text="Discount Code"
                  name="discountCode"
                  placeholder="Enter discount code"
                  defaultValue={editingDiscount?.discountCode}
                  required
                />

                <Input
                  variant="label"
                  text="Description"
                  name="description"
                  placeholder="Enter description"
                  defaultValue={editingDiscount?.description}
                  required
                />

                <div className="admin-discount-form-group">
                  <label>Category</label>
                  <select
                    className="admin-discount-form-control"
                    name="category"
                    defaultValue={editingDiscount?.category || "general"}
                    required
                  >
                    <option value="general">General</option>
                    <option value="seasonal">Seasonal</option>
                    <option value="welcome">Welcome</option>
                    <option value="special">Special</option>
                  </select>
                </div>

                <div className="admin-discount-form-group">
                  <label>Discount Type</label>
                  <select
                    className="admin-discount-form-control"
                    name="type"
                    defaultValue={editingDiscount?.type || "percent"}
                    required
                  >
                    <option value="percent">Percentage</option>
                    <option value="fixedAmount">Fixed Amount</option>
                  </select>
                </div>

                <Input
                  variant="label"
                  text="Value (% or VND)"
                  name="value"
                  type="number"
                  placeholder="Enter value (e.g., 10 for 10% or 50000 for 50,000 VND)"
                  defaultValue={editingDiscount?.value}
                  required
                />

                <Input
                  variant="label"
                  text="Minimum Order (VND)"
                  name="minimumOrder"
                  type="number"
                  placeholder="Enter minimum order amount in VND"
                  defaultValue={editingDiscount?.minimumOrder}
                />

                <Input
                  variant="label"
                  text="Maximum Discount (VND)"
                  name="maximumDiscount"
                  type="number"
                  placeholder="Enter maximum discount amount in VND"
                  defaultValue={editingDiscount?.maximumDiscount}
                />

                <Input
                  variant="label"
                  text="Usage Limit"
                  name="usageLimit"
                  type="number"
                  placeholder="Enter usage limit (0 for unlimited)"
                  defaultValue={editingDiscount?.usageLimit}
                />

                <Input
                  variant="label"
                  text="Start Date"
                  name="startDate"
                  type="date"
                  defaultValue={
                    editingDiscount?.startDate
                      ? new Date(editingDiscount.startDate)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                />

                <Input
                  variant="label"
                  text="End Date"
                  name="endDate"
                  type="date"
                  defaultValue={
                    editingDiscount?.endDate
                      ? new Date(editingDiscount.endDate)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                />

                <div className="admin-discount-form-group">
                  <label>Status</label>
                  <select
                    className="admin-discount-form-control"
                    name="status"
                    defaultValue={editingDiscount?.status || "active"}
                  >
                    <option value="active">Active</option>
                    <option value="inActive">Inactive</option>
                  </select>
                </div>

                {/* Course Selection Section */}
                <div className="admin-discount-form-group" style={{ gridColumn: '1 / -1' }}>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '10px',
                    display: 'block',
                    color: '#1f2937'
                  }}>
                    Apply to Courses
                    <span style={{
                      fontSize: '12px',
                      fontWeight: '400',
                      color: '#6b7280',
                      marginLeft: '8px'
                    }}>
                      ({selectedCourses.length === 0 ? 'No courses selected - discount will not be visible' : `${selectedCourses.length} selected`})
                    </span>
                  </label>

                  {/* Warning message when no courses selected */}
                  {selectedCourses.length === 0 && (
                    <div style={{
                      padding: '12px',
                      backgroundColor: '#fef3c7',
                      border: '1px solid #fbbf24',
                      borderRadius: '6px',
                      marginBottom: '12px',
                      fontSize: '13px',
                      color: '#92400e'
                    }}>
                      ⚠️ <strong>Important:</strong> You must select at least one course for this discount to be available to students. If no courses are selected, this discount will not appear at checkout.
                    </div>
                  )}

                  {/* Search Box */}
                  <div style={{ marginBottom: '12px' }}>
                    <input
                      type="text"
                      placeholder="Search courses..."
                      value={courseSearchQuery}
                      onChange={(e) => {
                        setCourseSearchQuery(e.target.value);
                        setCurrentCoursePage(1);
                      }}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  {/* Course List - Max 5 courses visible */}
                  <div style={{
                    maxHeight: '240px',
                    overflowY: 'auto',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '8px',
                    backgroundColor: '#fafafa'
                  }}>
                    {getPaginatedCourses().length === 0 ? (
                      <div style={{
                        textAlign: 'center',
                        padding: '20px',
                        color: '#6b7280',
                        fontSize: '14px'
                      }}>
                        No courses found
                      </div>
                    ) : (
                      getPaginatedCourses().map((course) => (
                        <div
                          key={course._id}
                          onClick={() => handleCourseToggle(course._id)}
                          style={{
                            padding: '10px',
                            marginBottom: '6px',
                            border: '1px solid #e5e7eb',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            backgroundColor: selectedCourses.includes(course._id) ? '#eff6ff' : '#fff',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                          }}
                          onMouseEnter={(e) => {
                            if (!selectedCourses.includes(course._id)) {
                              e.currentTarget.style.backgroundColor = '#f9fafb';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!selectedCourses.includes(course._id)) {
                              e.currentTarget.style.backgroundColor = '#fff';
                            }
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={selectedCourses.includes(course._id)}
                            onChange={() => handleCourseToggle(course._id)}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              width: '16px',
                              height: '16px',
                              cursor: 'pointer'
                            }}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{
                              fontWeight: '500',
                              fontSize: '13px',
                              color: '#1f2937',
                              marginBottom: '2px'
                            }}>
                              {course.title}
                            </div>
                            {course.price && (
                              <div style={{
                                fontSize: '11px',
                                color: '#6b7280'
                              }}>
                                Price: ${course.price}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Pagination */}
                  {totalCoursePages > 1 && (
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '10px',
                      fontSize: '13px'
                    }}>
                      <button
                        type="button"
                        onClick={() => setCurrentCoursePage(prev => Math.max(1, prev - 1))}
                        disabled={currentCoursePage === 1}
                        style={{
                          padding: '5px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          backgroundColor: currentCoursePage === 1 ? '#f3f4f6' : '#fff',
                          cursor: currentCoursePage === 1 ? 'not-allowed' : 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Previous
                      </button>
                      <span style={{ color: '#6b7280' }}>
                        Page {currentCoursePage} of {totalCoursePages}
                      </span>
                      <button
                        type="button"
                        onClick={() => setCurrentCoursePage(prev => Math.min(totalCoursePages, prev + 1))}
                        disabled={currentCoursePage === totalCoursePages}
                        style={{
                          padding: '5px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          backgroundColor: currentCoursePage === totalCoursePages ? '#f3f4f6' : '#fff',
                          cursor: currentCoursePage === totalCoursePages ? 'not-allowed' : 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Next
                      </button>
                    </div>
                  )}

                  {/* Clear All Button */}
                  {selectedCourses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedCourses([])}
                      style={{
                        marginTop: '10px',
                        padding: '8px 12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        backgroundColor: '#fff',
                        cursor: 'pointer',
                        fontSize: '12px',
                        color: '#dc2626',
                        width: '100%'
                      }}
                    >
                      Clear All Selections
                    </button>
                  )}
                </div>
              </div>

              <div className="admin-discount-modal-footer">
                <button
                  className="admin-discount-cancel-btn"
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingDiscount(null);
                    setSelectedCourses([]);
                    setCourseSearchQuery("");
                    setCurrentCoursePage(1);
                  }}
                >
                  Cancel
                </button>
                <button className="admin-discount-submit-btn" type="submit">
                  {editingDiscount ? "Update" : "Create"} Discount
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorDiscount;
