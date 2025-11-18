// src/services/certificateService.js

// Import apiClient đã được cấu hình đầy đủ từ authService
import apiClient from "./authService";

/**
 * Gọi API để tạo chứng chỉ cho khóa học
 * @param {string} courseId - ID của khóa học
 */
export const generateCertificate = (courseId) => {
  // Dùng apiClient, nó sẽ tự động gắn token và xử lý 401
  return apiClient.post(`/courses/${courseId}/generate-certificate`);
};

const certificateService = {
  generateCertificate,
};

export default certificateService;
