import { useState, useCallback } from 'react';
import { 
  getAllSummaryCache, 
  getSummaryFromCache,
  saveSummaryToCache,
  removeSummaryFromCache,
  clearAllSummaryCache,
  cleanupExpiredCache
} from '../services/summaryStorageService';

/**
 * Custom hook để quản lý summary cache
 * Cung cấp các hàm tiện ích để làm việc với localStorage cache
 */
export const useSummaryCache = () => {
  const [cacheStats, setCacheStats] = useState({
    total: 0,
    valid: 0,
    expired: 0
  });

  // Cập nhật thống kê cache
  const updateCacheStats = useCallback(() => {
    const allCache = getAllSummaryCache();
    const validCache = allCache.filter(cache => cache.isValid);
    const expiredCache = allCache.filter(cache => !cache.isValid);
    
    setCacheStats({
      total: allCache.length,
      valid: validCache.length,
      expired: expiredCache.length
    });
    
    return {
      total: allCache.length,
      valid: validCache.length,
      expired: expiredCache.length,
      list: allCache
    };
  }, []);

  // Kiểm tra xem có cache cho material không
  const hasCachedSummary = useCallback((materialUrl, type) => {
    const cached = getSummaryFromCache(materialUrl, type);
    return cached !== null;
  }, []);

  // Lấy summary từ cache
  const getCachedSummary = useCallback((materialUrl, type) => {
    return getSummaryFromCache(materialUrl, type);
  }, []);

  // Lưu summary vào cache
  const cacheSummary = useCallback((materialUrl, type, summary, metadata = {}) => {
    const success = saveSummaryToCache(materialUrl, type, summary, metadata);
    if (success) {
      updateCacheStats();
    }
    return success;
  }, [updateCacheStats]);

  // Xóa một cache cụ thể
  const removeCache = useCallback((materialUrl, type) => {
    const success = removeSummaryFromCache(materialUrl, type);
    if (success) {
      updateCacheStats();
    }
    return success;
  }, [updateCacheStats]);

  // Xóa tất cả cache
  const clearAllCache = useCallback(() => {
    const removedCount = clearAllSummaryCache();
    updateCacheStats();
    return removedCount;
  }, [updateCacheStats]);

  // Dọn dẹp cache hết hạn
  const cleanupExpired = useCallback(() => {
    const removedCount = cleanupExpiredCache();
    if (removedCount > 0) {
      updateCacheStats();
    }
    return removedCount;
  }, [updateCacheStats]);

  // Lấy danh sách tất cả cache
  const getAllCache = useCallback(() => {
    return getAllSummaryCache();
  }, []);

  // Tính toán kích thước cache (ước tính)
  const getCacheSize = useCallback(() => {
    const allCache = getAllSummaryCache();
    let totalSize = 0;
    
    allCache.forEach(cache => {
      // Ước tính kích thước dựa trên JSON string
      const cacheString = JSON.stringify(cache);
      totalSize += new Blob([cacheString]).size;
    });
    
    return {
      bytes: totalSize,
      kb: (totalSize / 1024).toFixed(2),
      mb: (totalSize / (1024 * 1024)).toFixed(2)
    };
  }, []);

  // Format thời gian cache
  const formatCacheTime = useCallback((timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days > 0) return `${days} ngày trước`;
    if (hours > 0) return `${hours} giờ trước`;
    if (minutes > 0) return `${minutes} phút trước`;
    return 'Vừa xong';
  }, []);

  // Kiểm tra cache có hết hạn không
  const isCacheExpired = useCallback((timestamp) => {
    const now = Date.now();
    const expiryTime = 72 * 60 * 60 * 1000; // 3 ngày (72 hours)
    return (now - timestamp) > expiryTime;
  }, []);

  return {
    // State
    cacheStats,
    
    // Actions
    updateCacheStats,
    hasCachedSummary,
    getCachedSummary,
    cacheSummary,
    removeCache,
    clearAllCache,
    cleanupExpired,
    getAllCache,
    
    // Utilities
    getCacheSize,
    formatCacheTime,
    isCacheExpired
  };
};

export default useSummaryCache;
