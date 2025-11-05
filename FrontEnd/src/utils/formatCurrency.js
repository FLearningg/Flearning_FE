/**
 * Format number to Vietnamese Dong (VND) currency
 * @param {number} amount - Amount to format
 * @param {boolean} showSymbol - Whether to show VND symbol (default: true)
 * @returns {string} Formatted currency string
 */
export const formatVND = (amount, showSymbol = true) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return showSymbol ? '0 VND' : '0';
  }

  const formatted = Number(amount).toLocaleString('vi-VN');
  return showSymbol ? `${formatted} VND` : formatted;
};

/**
 * Format price with original and discounted price
 * @param {number} originalPrice - Original price
 * @param {number} discountedPrice - Discounted price (optional)
 * @returns {object} Object with formatted prices
 */
export const formatPriceWithDiscount = (originalPrice, discountedPrice) => {
  const original = formatVND(originalPrice);
  const discounted = discountedPrice ? formatVND(discountedPrice) : null;
  const hasDiscount = discountedPrice && discountedPrice < originalPrice;

  return {
    original,
    discounted,
    hasDiscount,
    display: hasDiscount ? discounted : original
  };
};

/**
 * Compact format for large numbers (e.g., 1.5M VND, 350K VND)
 * @param {number} amount - Amount to format
 * @returns {string} Compact formatted currency
 */
export const formatVNDCompact = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0 VND';
  }

  const num = Number(amount);

  if (num >= 1000000000) {
    return `${(num / 1000000000).toFixed(1)}B VND`;
  }
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M VND`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(0)}K VND`;
  }

  return `${num.toLocaleString('vi-VN')} VND`;
};

export default formatVND;
