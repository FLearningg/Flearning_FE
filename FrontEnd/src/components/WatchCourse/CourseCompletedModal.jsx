// src/components/WatchCourse/CourseCompletedModal.js
import React from "react";
import "./CourseCompletedModal.css"; // Import file CSS bạn sẽ tạo ở dưới

const CourseCompletedModal = ({
  isOpen,
  onClose,
  isGenerating,
  certificate,
  courseTitle,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="course-complete modal-overlay">
      <div className="modal-content">
        <h2>Chúc Mừng!</h2>
        <p>Bạn đã hoàn thành xuất sắc khoá học "{courseTitle}".</p>

        {/* Trạng thái 1: Đang loading */}
        {isGenerating && (
          <div className="modal-loading">
            <div className="spinner"></div>
            <p>Đang tạo chứng chỉ của bạn, vui lòng chờ...</p>
          </div>
        )}

        {/* Trạng thái 2: Thành công */}
        {!isGenerating && certificate && (
          <div className="modal-actions">
            <a
              href={certificate.certificateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="modal-button primary"
            >
              Xem Chứng Chỉ
            </a>
            <button onClick={onClose} className="modal-button secondary">
              Đóng
            </button>
          </div>
        )}

        {/* Trạng thái 3: Lỗi */}
        {!isGenerating && !certificate && (
          <div className="modal-error">
            <p>Rất tiếc, đã có lỗi xảy ra khi tạo chứng chỉ của bạn.</p>
            <button onClick={onClose} className="modal-button secondary">
              Đóng
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCompletedModal;
