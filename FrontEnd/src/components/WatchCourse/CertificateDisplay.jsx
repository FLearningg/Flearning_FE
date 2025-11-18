// src/components/WatchCourse/CertificateDisplay.js
import React from "react";
import "../../assets/WatchCourse/CertificateDisplay.css"; // Import file CSS bạn sẽ tạo ở dưới

const CertificateDisplay = ({ isGenerating, certificate, courseTitle }) => {
  // Trạng thái 1: Đang tải
  if (isGenerating) {
    return (
      <div className="certificate-display-wrapper loading">
        <div className="spinner"></div>
        <p>
          Chúc mừng bạn đã hoàn thành "{courseTitle}"! Đang tạo chứng chỉ...
        </p>
      </div>
    );
  }

  // Trạng thái 2: Lỗi
  if (!certificate) {
    return (
      <div className="certificate-display-wrapper error">
        <p>
          Đã hoàn thành khóa học! Tuy nhiên, đã có lỗi xảy ra khi tạo chứng chỉ.
          Vui lòng tải lại trang.
        </p>
      </div>
    );
  }

  // Trạng thái 3: Thành công (SỬA LẠI HOÀN TOÀN)
  return (
    <div className="certificate-display-wrapper success">
      <h3>Chúc mừng! Đây là chứng chỉ của bạn:</h3>

      {/* DÙNG THẺ IMG THAY VÌ IFRAME */}
      <div className="certificate-image-container">
        <img
          src={certificate.certificateUrl}
          alt={`Certificate for ${courseTitle}`}
          className="certificate-image"
        />
      </div>

      <a
        href={certificate.certificateUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="certificate-button"
      >
        Mở chứng chỉ trong tab mới
      </a>
    </div>
  );
};

export default CertificateDisplay;
