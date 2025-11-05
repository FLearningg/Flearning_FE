/**
 * Service để quản lý lưu trữ tóm tắt AI trong localStorage
 * Thay thế NodeCache ở backend bằng localStorage ở frontend
 */

const STORAGE_PREFIX = 'ai_summary_';
const CACHE_EXPIRY_HOURS = 72; // Tóm tắt có hiệu lực trong 3 ngày (72 giờ)

/**
 * Tạo cache key từ material URL và loại tài liệu
 * @param {string} materialUrl - URL của tài liệu
 * @param {string} type - Loại tài liệu ('video' hoặc 'article')
 * @returns {string} Cache key
 */
const generateCacheKey = (materialUrl, type) => {
  // Tạo hash đơn giản từ URL để làm key
  const hash = btoa(materialUrl).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
  return `${STORAGE_PREFIX}${type}_${hash}`;
};

/**
 * Kiểm tra xem cache có hết hạn không
 * @param {number} timestamp - Timestamp khi lưu cache
 * @returns {boolean} True nếu cache còn hiệu lực
 */
const isCacheValid = (timestamp) => {
  const now = Date.now();
  const expiryTime = CACHE_EXPIRY_HOURS * 60 * 60 * 1000; // Convert to milliseconds
  return (now - timestamp) < expiryTime;
};

/**
 * Lưu tóm tắt vào localStorage
 * @param {string} materialUrl - URL của tài liệu
 * @param {string} type - Loại tài liệu ('video' hoặc 'article')
 * @param {string} summary - Nội dung tóm tắt
 * @param {Object} metadata - Thông tin metadata bổ sung
 */
export const saveSummaryToCache = (materialUrl, type, summary, metadata = {}) => {
  try {
    const cacheKey = generateCacheKey(materialUrl, type);
    const cacheData = {
      summary,
      materialUrl,
      type,
      timestamp: Date.now(),
      metadata: {
        ...metadata,
        cachedAt: new Date().toISOString(),
      }
    };
    
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    console.log(`✅ Đã lưu tóm tắt ${type} vào localStorage:`, cacheKey);
    return true;
  } catch (error) {
    console.error('❌ Lỗi khi lưu tóm tắt vào localStorage:', error);
    return false;
  }
};

/**
 * Lấy tóm tắt từ localStorage
 * @param {string} materialUrl - URL của tài liệu
 * @param {string} type - Loại tài liệu ('video' hoặc 'article')
 * @returns {Object|null} Dữ liệu tóm tắt hoặc null nếu không tìm thấy/hết hạn
 */
export const getSummaryFromCache = (materialUrl, type) => {
  try {
    const cacheKey = generateCacheKey(materialUrl, type);
    const cachedData = localStorage.getItem(cacheKey);
    
    if (!cachedData) {
      console.log(`📭 Không tìm thấy cache cho ${type}:`, cacheKey);
      return null;
    }
    
    const parsedData = JSON.parse(cachedData);
    
    // Kiểm tra cache có hết hạn không
    if (!isCacheValid(parsedData.timestamp)) {
      console.log(`⏰ Cache đã hết hạn cho ${type}:`, cacheKey);
      // Xóa cache hết hạn
      localStorage.removeItem(cacheKey);
      return null;
    }
    
    console.log(`✅ Tìm thấy cache hợp lệ cho ${type}:`, cacheKey);
    return parsedData;
  } catch (error) {
    console.error('❌ Lỗi khi đọc cache từ localStorage:', error);
    return null;
  }
};

/**
 * Xóa tóm tắt khỏi localStorage
 * @param {string} materialUrl - URL của tài liệu
 * @param {string} type - Loại tài liệu ('video' hoặc 'article')
 * @returns {boolean} True nếu xóa thành công
 */
export const removeSummaryFromCache = (materialUrl, type) => {
  try {
    const cacheKey = generateCacheKey(materialUrl, type);
    localStorage.removeItem(cacheKey);
    console.log(`🗑️ Đã xóa cache cho ${type}:`, cacheKey);
    return true;
  } catch (error) {
    console.error('❌ Lỗi khi xóa cache:', error);
    return false;
  }
};

/**
 * Xóa tất cả cache tóm tắt (dọn dẹp)
 * @returns {number} Số lượng cache đã xóa
 */
export const clearAllSummaryCache = () => {
  try {
    let removedCount = 0;
    const keys = Object.keys(localStorage);
    
    keys.forEach(key => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
        removedCount++;
      }
    });
    
    console.log(`🧹 Đã xóa ${removedCount} cache tóm tắt`);
    return removedCount;
  } catch (error) {
    console.error('❌ Lỗi khi xóa tất cả cache:', error);
    return 0;
  }
};

/**
 * Lấy danh sách tất cả cache tóm tắt
 * @returns {Array} Danh sách các cache với thông tin cơ bản
 */
export const getAllSummaryCache = () => {
  try {
    const cacheList = [];
    const keys = Object.keys(localStorage);
    
    keys.forEach(key => {
      if (key.startsWith(STORAGE_PREFIX)) {
        try {
          const data = JSON.parse(localStorage.getItem(key));
          cacheList.push({
            key,
            type: data.type,
            materialUrl: data.materialUrl,
            timestamp: data.timestamp,
            isValid: isCacheValid(data.timestamp),
            cachedAt: data.metadata?.cachedAt,
          });
        } catch (error) {
          console.warn('⚠️ Cache không hợp lệ:', key);
        }
      }
    });
    
    return cacheList;
  } catch (error) {
    console.error('❌ Lỗi khi lấy danh sách cache:', error);
    return [];
  }
};

/**
 * Dọn dẹp cache hết hạn
 * @returns {number} Số lượng cache hết hạn đã xóa
 */
export const cleanupExpiredCache = () => {
  try {
    let removedCount = 0;
    const keys = Object.keys(localStorage);
    
    keys.forEach(key => {
      if (key.startsWith(STORAGE_PREFIX)) {
        try {
          const data = JSON.parse(localStorage.getItem(key));
          if (!isCacheValid(data.timestamp)) {
            localStorage.removeItem(key);
            removedCount++;
          }
        } catch (error) {
          // Xóa cache không hợp lệ
          localStorage.removeItem(key);
          removedCount++;
        }
      }
    });
    
    if (removedCount > 0) {
      console.log(`🧹 Đã dọn dẹp ${removedCount} cache hết hạn`);
    }
    
    return removedCount;
  } catch (error) {
    console.error('❌ Lỗi khi dọn dẹp cache:', error);
    return 0;
  }
};

// Tự động dọn dẹp cache hết hạn khi load service
cleanupExpiredCache();
