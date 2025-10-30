import React, { useState, useEffect } from 'react';
import { 
  getAllSummaryCache, 
  clearAllSummaryCache, 
  removeSummaryFromCache,
  cleanupExpiredCache 
} from '../../services/summaryStorageService';
import './SummaryCacheManager.css';

const SummaryCacheManager = ({ isOpen, onClose }) => {
  const [cacheList, setCacheList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCache, setSelectedCache] = useState(null);

  // Load cache list khi component mount hoặc modal mở
  useEffect(() => {
    if (isOpen) {
      loadCacheList();
    }
  }, [isOpen]);

  const loadCacheList = () => {
    setLoading(true);
    try {
      const list = getAllSummaryCache();
      setCacheList(list);
    } catch (error) {
      console.error('Lỗi khi tải danh sách cache:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tất cả tóm tắt đã lưu?')) {
      const removedCount = clearAllSummaryCache();
      alert(`Đã xóa ${removedCount} tóm tắt`);
      loadCacheList();
    }
  };

  const handleRemoveCache = (materialUrl, type) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tóm tắt này?')) {
      const success = removeSummaryFromCache(materialUrl, type);
      if (success) {
        loadCacheList();
        setSelectedCache(null);
      }
    }
  };

  const handleCleanupExpired = () => {
    const removedCount = cleanupExpiredCache();
    if (removedCount > 0) {
      alert(`Đã dọn dẹp ${removedCount} tóm tắt hết hạn`);
      loadCacheList();
    } else {
      alert('Không có tóm tắt hết hạn nào để dọn dẹp');
    }
  };

  const formatFileSize = (url) => {
    // Ước tính kích thước dựa trên độ dài URL (không chính xác 100%)
    const estimatedSize = url.length * 2; // bytes
    if (estimatedSize < 1024) return `${estimatedSize} B`;
    if (estimatedSize < 1024 * 1024) return `${(estimatedSize / 1024).toFixed(1)} KB`;
    return `${(estimatedSize / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('vi-VN');
  };

  const getFileName = (url) => {
    try {
      const urlObj = new URL(url);
      const path = urlObj.pathname;
      const fileName = path.substring(path.lastIndexOf('/') + 1);
      return decodeURIComponent(fileName) || 'Unknown file';
    } catch {
      return 'Unknown file';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="cache-manager-overlay">
      <div className="cache-manager-modal">
        <div className="cache-manager-header">
          <h2>🗂️ Quản lý Tóm tắt đã lưu</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="cache-manager-content">
          <div className="cache-stats">
            <div className="stat-item">
              <span className="stat-label">Tổng số tóm tắt:</span>
              <span className="stat-value">{cacheList.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Còn hiệu lực:</span>
              <span className="stat-value valid">{cacheList.filter(c => c.isValid).length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Hết hạn:</span>
              <span className="stat-value expired">{cacheList.filter(c => !c.isValid).length}</span>
            </div>
          </div>

          <div className="cache-actions">
            <button 
              className="action-button refresh"
              onClick={loadCacheList}
              disabled={loading}
            >
              🔄 Làm mới
            </button>
            <button 
              className="action-button cleanup"
              onClick={handleCleanupExpired}
            >
              🧹 Dọn dẹp hết hạn
            </button>
            <button 
              className="action-button danger"
              onClick={handleClearAll}
            >
              🗑️ Xóa tất cả
            </button>
          </div>

          <div className="cache-list-container">
            {loading ? (
              <div className="loading">Đang tải...</div>
            ) : cacheList.length === 0 ? (
              <div className="empty-state">
                <p>📭 Chưa có tóm tắt nào được lưu</p>
              </div>
            ) : (
              <div className="cache-list">
                {cacheList.map((cache, index) => (
                  <div 
                    key={cache.key} 
                    className={`cache-item ${!cache.isValid ? 'expired' : ''} ${selectedCache?.key === cache.key ? 'selected' : ''}`}
                    onClick={() => setSelectedCache(cache)}
                  >
                    <div className="cache-item-header">
                      <span className="cache-type">
                        {cache.type === 'video' ? '🎥' : '📄'} {cache.type.toUpperCase()}
                      </span>
                      <span className={`cache-status ${cache.isValid ? 'valid' : 'expired'}`}>
                        {cache.isValid ? '✅ Còn hiệu lực' : '⏰ Hết hạn'}
                      </span>
                    </div>
                    
                    <div className="cache-item-info">
                      <div className="file-name" title={cache.materialUrl}>
                        {getFileName(cache.materialUrl)}
                      </div>
                      <div className="cache-meta">
                        <span>Lưu lúc: {formatDate(cache.timestamp)}</span>
                        <span>Kích thước: {formatFileSize(cache.materialUrl)}</span>
                      </div>
                    </div>

                    <div className="cache-item-actions">
                      <button 
                        className="remove-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveCache(cache.materialUrl, cache.type);
                        }}
                        title="Xóa tóm tắt này"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedCache && (
            <div className="cache-details">
              <h3>Chi tiết tóm tắt</h3>
              <div className="detail-row">
                <strong>Loại:</strong> {selectedCache.type}
              </div>
              <div className="detail-row">
                <strong>Trạng thái:</strong> 
                <span className={selectedCache.isValid ? 'valid' : 'expired'}>
                  {selectedCache.isValid ? 'Còn hiệu lực' : 'Hết hạn'}
                </span>
              </div>
              <div className="detail-row">
                <strong>Lưu lúc:</strong> {selectedCache.cachedAt || formatDate(selectedCache.timestamp)}
              </div>
              <div className="detail-row">
                <strong>URL:</strong> 
                <div className="url-display" title={selectedCache.materialUrl}>
                  {selectedCache.materialUrl}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SummaryCacheManager;
