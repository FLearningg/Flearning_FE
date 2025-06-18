import React, { useState } from "react";
import CustomButton from "../common/CustomButton/CustomButton";
import Input from "../common/Input";
import SearchBox from "../common/search/SearchBox/SearchBox";
import "../../assets/AdminDiscount/AdminDiscount.css";

const AdminDiscount = ({ title = "Discount Management" }) => {
  // Sample data for UI display
  const discounts = [
    {
      id: 1,
      code: "SUMMER2024",
      description: "Summer Sale Discount",
      type: "percentage",
      value: 25,
      minOrder: 100,
      maxDiscount: 50,
      usageLimit: 100,
      usedCount: 45,
      startDate: "2024-06-01",
      endDate: "2024-08-31",
      status: "active",
      category: "seasonal"
    },
    {
      id: 2,
      code: "NEWUSER10",
      description: "New User Welcome Discount",
      type: "fixed",
      value: 10,
      minOrder: 50,
      maxDiscount: 10,
      usageLimit: 500,
      usedCount: 234,
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      status: "active",
      category: "welcome"
    },
    {
      id: 3,
      code: "EXPIRED2023",
      description: "End Year Sale",
      type: "percentage",
      value: 30,
      minOrder: 200,
      maxDiscount: 100,
      usageLimit: 50,
      usedCount: 50,
      startDate: "2023-12-01",
      endDate: "2023-12-31",
      status: "expired",
      category: "seasonal"
    }
  ];

  // Simple search data for SearchBox
  const searchData = [
    { id: 1, label: "SUMMER2024", type: "code" },
    { id: 2, label: "NEWUSER10", type: "code" },
    { id: 3, label: "EXPIRED2023", type: "code" },
    { id: 4, label: "Summer Sale Discount", type: "description" },
    { id: 5, label: "seasonal", type: "category" },
    { id: 6, label: "welcome", type: "category" }
  ];

  // Simple modal state
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Icons
  const FilterIcon = () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
    </svg>
  );

  const EditIcon = () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  );

  const DeleteIcon = () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );

  const CopyIcon = () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  );

  const TagIcon = () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  );

  // Simple handlers for UI interactions (backend will implement logic)
  const handleSearchSelect = (selectedItem) => {
    console.log('Search selected:', selectedItem);
  };

  const handleCategoryBrowse = () => {
    console.log('Category browse clicked');
  };

  // Simple UI handlers (backend will implement actual logic)
  const handleEdit = (discount) => {
    console.log('Edit discount:', discount);
    setShowCreateModal(true);
  };

  const handleDelete = (id) => {
    console.log('Delete discount:', id);
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    alert(`Discount code "${code}" copied to clipboard!`);
  };

  // Get status badge class with proper prefix
  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return "admin-discount-status-badge admin-discount-status-active";
      case "expired":
        return "admin-discount-status-badge admin-discount-status-expired";
      case "inactive":
        return "admin-discount-status-badge admin-discount-status-inactive";
      default:
        return "admin-discount-status-badge";
    }
  };

  // Calculate usage percentage
  const getUsagePercentage = (used, limit) => {
    return limit > 0 ? Math.round((used / limit) * 100) : 0;
  };

  return (
    <div className="admin-discount">
      {/* Header */}
      <div className="admin-discount-header">
        <div className="admin-discount-header-left">
          <h1 className="admin-discount-page-title">{title}</h1>
          <p className="admin-discount-page-subtitle">Manage discount codes and promotions</p>
        </div>
        <div className="admin-discount-header-right">
          <CustomButton
            size="medium"
            color="primary"
            onClick={() => setShowCreateModal(true)}
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
            <h3>{discounts.length}</h3>
            <p>Total Discounts</p>
          </div>
        </div>
        <div className="admin-discount-stat-card">
          <div className="admin-discount-stat-icon admin-discount-stat-icon-success">
            <TagIcon />
          </div>
          <div className="admin-discount-stat-content">
            <h3>{discounts.filter(d => d.status === "active").length}</h3>
            <p>Active Discounts</p>
          </div>
        </div>
        <div className="admin-discount-stat-card">
          <div className="admin-discount-stat-icon admin-discount-stat-icon-warning">
            <TagIcon />
          </div>
          <div className="admin-discount-stat-content">
            <h3>{discounts.reduce((sum, d) => sum + d.usedCount, 0)}</h3>
            <p>Total Uses</p>
          </div>
        </div>
        <div className="admin-discount-stat-card">
          <div className="admin-discount-stat-icon admin-discount-stat-icon-info">
            <TagIcon />
          </div>
          <div className="admin-discount-stat-content">
            <h3>${discounts.reduce((sum, d) => sum + (d.usedCount * (d.type === "fixed" ? d.value : 0)), 0)}</h3>
            <p>Total Saved</p>
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
            <select className="admin-discount-filter-select">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="admin-discount-filter-group">
            <select className="admin-discount-filter-select">
              <option value="all">All Types</option>
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
            </select>
          </div>

          <div className="admin-discount-filter-group">
            <select className="admin-discount-filter-select">
              <option value="all">All Categories</option>
              <option value="seasonal">Seasonal</option>
              <option value="welcome">Welcome</option>
              <option value="special">Special</option>
              <option value="general">General</option>
            </select>
          </div>

          <button className="admin-discount-clear-all-btn">
            Clear All
          </button>
        </div>
      </div>

      {/* Search Results Info */}
      <div className="admin-discount-search-results-info">
        <span className="admin-discount-results-count">
          {discounts.length} discounts
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
                <tr key={discount.id}>
                  <td>
                    <div className="admin-discount-code">
                      <span className="admin-discount-code-text">{discount.code}</span>
                      <button 
                        className="admin-discount-copy-btn"
                        onClick={() => handleCopyCode(discount.code)}
                        title="Copy code"
                      >
                        <CopyIcon />
                      </button>
                    </div>
                  </td>
                  <td>
                    <div className="admin-discount-description">
                      <span className="admin-discount-description-text">{discount.description}</span>
                      <div className="admin-discount-description-meta">
                        Min order: ${discount.minOrder}
                        {discount.maxDiscount && ` • Max: $${discount.maxDiscount}`}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`admin-discount-category-badge admin-discount-category-${discount.category}`}>
                      {discount.category}
                    </span>
                  </td>
                  <td>
                    <span className={`admin-discount-type-badge admin-discount-type-${discount.type}`}>
                      {discount.type === "percentage" ? "%" : "$"}
                    </span>
                  </td>
                  <td>
                    <span className="admin-discount-value-text">
                      {discount.type === "percentage" ? `${discount.value}%` : `$${discount.value}`}
                    </span>
                  </td>
                  <td>
                    <div className="admin-discount-usage-info">
                      <div className="admin-discount-usage-stats">
                        <span>{discount.usedCount} / {discount.usageLimit}</span>
                      </div>
                      <div className="admin-discount-usage-bar">
                        <div 
                          className="admin-discount-usage-progress"
                          style={{ width: `${getUsagePercentage(discount.usedCount, discount.usageLimit)}%` }}
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
                      <div>{discount.startDate}</div>
                      <div>{discount.endDate}</div>
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
                      <button 
                        className="admin-discount-action-btn admin-discount-delete-btn"
                        onClick={() => handleDelete(discount.id)}
                        title="Delete discount"
                      >
                        <DeleteIcon />
                        <span className="admin-discount-fallback-text">✕</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {discounts.length === 0 && (
          <div className="admin-discount-empty-state">
            <TagIcon />
            <h3>No discounts found</h3>
            <p>No discounts available</p>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="admin-discount-modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="admin-discount-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="admin-discount-modal-header">
              <h2>Create New Discount</h2>
              <button 
                className="admin-discount-close-btn"
                onClick={() => setShowCreateModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="admin-discount-form">
              <div className="admin-discount-form-grid">
                <Input
                  variant="label"
                  text="Discount Code"
                  placeholder="Enter discount code"
                />
                
                <Input
                  variant="label"
                  text="Description"
                  placeholder="Enter description"
                />
                
                <div className="admin-discount-form-group">
                  <label>Category</label>
                  <select className="admin-discount-form-control">
                    <option value="general">General</option>
                    <option value="seasonal">Seasonal</option>
                    <option value="welcome">Welcome</option>
                    <option value="special">Special</option>
                  </select>
                </div>
                
                <div className="admin-discount-form-group">
                  <label>Discount Type</label>
                  <select className="admin-discount-form-control">
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                
                <Input
                  variant="label"
                  text="Value"
                  type="number"
                  placeholder="Enter value"
                />
                
                <Input
                  variant="label"
                  text="Minimum Order ($)"
                  type="number"
                  placeholder="Enter minimum order amount"
                />
                
                <Input
                  variant="label"
                  text="Maximum Discount ($)"
                  type="number"
                  placeholder="Enter maximum discount amount"
                />
                
                <Input
                  variant="label"
                  text="Usage Limit"
                  type="number"
                  placeholder="Enter usage limit"
                />
                
                <Input
                  variant="label"
                  text="Start Date"
                  type="date"
                />
                
                <Input
                  variant="label"
                  text="End Date"
                  type="date"
                />
              </div>
              
              <div className="admin-discount-modal-footer">
                <CustomButton
                  color="gray"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </CustomButton>
                <CustomButton
                  color="primary"
                  onClick={() => {
                    console.log('Create discount clicked');
                    setShowCreateModal(false);
                  }}
                >
                  Create Discount
                </CustomButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDiscount;
