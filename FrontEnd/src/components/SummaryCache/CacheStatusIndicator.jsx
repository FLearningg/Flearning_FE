import React, { useState, useEffect } from 'react';
import { useSummaryCache } from '../../hooks/useSummaryCache';
import SummaryCacheManager from './SummaryCacheManager';
import './CacheStatusIndicator.css';

/**
 * Component hiển thị trạng thái cache và nút mở Cache Manager
 * Có thể được đặt ở header hoặc sidebar của ứng dụng
 */
const CacheStatusIndicator = ({ className = '' }) => {
  const { cacheStats, updateCacheStats } = useSummaryCache();
  const [showManager, setShowManager] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Cập nhật stats khi component mount
  useEffect(() => {
    updateCacheStats();
  }, [updateCacheStats]);

  const handleToggleManager = () => {
    setShowManager(!showManager);
  };

  const handleCloseManager = () => {
    setShowManager(false);
    // Cập nhật lại stats sau khi đóng manager
    updateCacheStats();
  };

  const handleToggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <div className={`cache-status-indicator ${className}`}>
        <div 
          className="cache-status-button"
          onClick={handleToggleExpanded}
          title="Trạng thái cache tóm tắt"
        >
          <span className="cache-icon">🗂️</span>
          <span className="cache-count">{cacheStats.total}</span>
          {cacheStats.expired > 0 && (
            <span className="cache-expired-badge">{cacheStats.expired}</span>
          )}
        </div>

        {isExpanded && (
          <div className="cache-status-dropdown">
            <div className="cache-status-header">
              <h4>📱 Tóm tắt đã lưu</h4>
            </div>
            
            <div className="cache-status-stats">
              <div className="stat-row">
                <span className="stat-label">Tổng số:</span>
                <span className="stat-value">{cacheStats.total}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Còn hiệu lực:</span>
                <span className="stat-value valid">{cacheStats.valid}</span>
              </div>
              {cacheStats.expired > 0 && (
                <div className="stat-row">
                  <span className="stat-label">Hết hạn:</span>
                  <span className="stat-value expired">{cacheStats.expired}</span>
                </div>
              )}
            </div>

            <div className="cache-status-actions">
              <button 
                className="manage-button"
                onClick={handleToggleManager}
              >
                ⚙️ Quản lý
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Cache Manager Modal */}
      <SummaryCacheManager 
        isOpen={showManager}
        onClose={handleCloseManager}
      />
    </>
  );
};

export default CacheStatusIndicator;
