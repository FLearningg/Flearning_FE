import React from "react";
import "../../assets/WatchCourse/SummaryModal.css";

const SummaryModal = ({ 
  isOpen, 
  onClose, 
  summary, 
  loading, 
  error, 
  lessonTitle,
  lessonType 
}) => {
  if (!isOpen) return null;

  const getModalTitle = () => {
    const typeText = lessonType === 'video' ? 'Video' : 'Tài liệu';
    return `Tóm tắt ${typeText}${lessonTitle ? `: ${lessonTitle}` : ''}`;
  };

  const getLoadingText = () => {
    return lessonType === 'video' 
      ? 'Đang phân tích video và tạo tóm tắt...' 
      : 'Đang phân tích tài liệu và tạo tóm tắt...';
  };

  const getDownloadFileName = () => {
    const now = new Date().toISOString().split('T')[0];
    const lessonTypeSlug = lessonType === 'video' ? 'video' : 'tai-lieu';
    const titleSlug = lessonTitle
      ? lessonTitle
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
      : 'bai-hoc';
    return `tom-tat-${lessonTypeSlug}-${titleSlug || 'bai-hoc'}-${now}.txt`;
  };

  // Enhanced summary formatting function
  const formatSummaryContent = (summaryText) => {
    if (!summaryText) return null;

    // Split by double newlines to get sections
    const sections = summaryText.split('\n\n').filter(section => section.trim());
    
    return sections.map((section, sectionIndex) => {
      const lines = section.split('\n').filter(line => line.trim());
      
      // Check if this section has a title (usually the first line)
      const hasTitle = lines.length > 1 && (
        lines[0].includes(':') || 
        lines[0].length < 100 ||
        lines[0].match(/^[A-Z\u00C0-\u017F][^.!?]*:?$/) ||
        lines[0].includes('Tóm tắt') ||
        lines[0].includes('Nội dung') ||
        lines[0].includes('Điểm chính')
      );

      if (hasTitle && lines.length > 1) {
        const title = lines[0].replace(':', '');
        const content = lines.slice(1);
        
        // Check if content is a list (starts with -, •, numbers, etc.)
        const isList = content.some(line => 
          line.trim().match(/^[-•*]\s/) || 
          line.trim().match(/^\d+\.\s/) ||
          line.trim().match(/^[a-zA-Z]\.\s/)
        );

        const sectionIcon = getSectionIcon(title, sectionIndex);

        return (
          <div key={sectionIndex} className="summary-section">
            <h3 className="summary-section-title">
              <span className="summary-section-icon">{sectionIcon}</span>
              {title}
            </h3>
            {isList ? (
              <ul className="summary-list">
                {content.map((item, itemIndex) => (
                  <li key={itemIndex} className="summary-list-item">
                    <span className="summary-bullet">•</span>
                    <span className="summary-item-content">
                      {highlightKeywords(item.replace(/^[-•*]\s*/, '').replace(/^\d+\.\s*/, ''))}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              content.map((paragraph, pIndex) => (
                <p key={pIndex} className="summary-paragraph">
                  {highlightKeywords(paragraph)}
                </p>
              ))
            )}
          </div>
        );
      } else {
        // Single paragraph or no clear title
        return (
          <div key={sectionIndex} className="summary-section">
            {lines.map((paragraph, pIndex) => (
              <p key={pIndex} className="summary-paragraph">
                {highlightKeywords(paragraph)}
              </p>
            ))}
          </div>
        );
      }
    });
  };

  // Get appropriate icon for section
  const getSectionIcon = (title, index) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('tóm tắt') || titleLower.includes('overview')) return '📋';
    if (titleLower.includes('nội dung') || titleLower.includes('content')) return '📖';
    if (titleLower.includes('điểm chính') || titleLower.includes('key') || titleLower.includes('point')) return '🎯';
    if (titleLower.includes('kết luận') || titleLower.includes('conclusion')) return '✅';
    if (titleLower.includes('ví dụ') || titleLower.includes('example')) return '💡';
    if (titleLower.includes('lưu ý') || titleLower.includes('note')) return '⚠️';
    
    // Default icons based on position
    const icons = ['📌', '🔍', '💭', '📝', '🎓', '⭐'];
    return icons[index % icons.length];
  };

  // Highlight important keywords
  const highlightKeywords = (text) => {
    if (!text) return text;
    
    // Common important terms to highlight
    const keywords = [
      'quan trọng', 'chính', 'cần thiết', 'cơ bản', 'then chốt',
      'đặc biệt', 'lưu ý', 'chú ý', 'nhấn mạnh', 'trọng tâm'
    ];
    
    let highlightedText = text;
    
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      highlightedText = highlightedText.replace(regex, `<span class="summary-highlight">${keyword}</span>`);
    });
    
    return <span dangerouslySetInnerHTML={{ __html: highlightedText }} />;
  };

  const handleDownloadSummary = () => {
    if (!summary) return;

    const header = [
      getModalTitle(),
      `Loại bài học: ${lessonType === 'video' ? 'Video' : 'Tài liệu'}`,
      `Ngày tải xuống: ${new Date().toLocaleString('vi-VN')}`
    ].join('\n');

    const fileContent = `${header}\n\n------------------------------\n\n${summary}`;
    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = getDownloadFileName();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="summary-modal-overlay" onClick={onClose}>
      <div className="summary-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="summary-modal-header">
          <h2 className="summary-modal-title">
            {getModalTitle()}
          </h2>
          <button className="summary-modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="summary-modal-body">
          {loading && (
            <div className="summary-loading">
              <div className="summary-spinner"></div>
              <p>{getLoadingText()}</p>
              <small>Quá trình này có thể mất vài phút...</small>
            </div>
          )}

          {error && (
            <div className="summary-error">
              <div className="error-icon">⚠️</div>
              <h3>Không thể tạo tóm tắt</h3>
              <p>{error}</p>
              <button className="retry-button" onClick={() => window.location.reload()}>
                Thử lại
              </button>
            </div>
          )}

          {!loading && !error && summary && (
            <div className="summary-content">
              <div className="summary-text">
                {formatSummaryContent(summary)}
              </div>
              
              <div className="summary-footer">
                <div className="summary-info">
                  <span className="summary-badge">
                    🤖 Được tạo bởi AI
                  </span>
                  <span className="summary-note">
                    Tóm tắt này được tạo tự động và có thể không hoàn toàn chính xác
                  </span>
                </div>
              </div>
            </div>
          )}

          {!loading && !error && !summary && (
            <div className="summary-empty">
              <p>Không có nội dung tóm tắt</p>
            </div>
          )}
        </div>

        <div className="summary-modal-actions">
          {!loading && !error && summary && (
            <button 
              className="summary-download-button"
              onClick={handleDownloadSummary}
              title="Tải bản tóm tắt dạng tệp TXT"
            >
              Tải xuống
            </button>
          )}
          <button className="summary-close-button" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default SummaryModal;
