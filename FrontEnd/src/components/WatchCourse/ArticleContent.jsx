import React, { useEffect, useState } from "react";
import { summarizeMaterial } from "../../services/aiSummaryService";
import SummaryModal from "./SummaryModal";
import "../../assets/WatchCourse/ArticleContent.css";
import { toast } from "react-toastify";

const getFileName = (url) => {
  try {
    if (!url) return null;
    const u = new URL(url);
    const path = u.pathname;
    const last = path.substring(path.lastIndexOf("/") + 1);
    return decodeURIComponent(last || "Download file");
  } catch {
    return url;
  }
};

const ArticleContent = ({ 
  title, 
  description, 
  lessonNotes, 
  materialUrl, 
  onNext, 
  onAutoComplete,
  lessonId = null 
}) => {
  const hasDownload = typeof materialUrl === "string" && materialUrl.trim() !== "";
  const fileName = hasDownload ? getFileName(materialUrl) : null;

  const [summaryModal, setSummaryModal] = useState({
    isOpen: false,
    loading: false,
    summary: null,
    error: null,
  });

  // Auto-complete after 5 seconds on screen
  useEffect(() => {
    if (!onAutoComplete) return;
    const timer = setTimeout(() => {
      onAutoComplete();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onAutoComplete]);

  const handleSummarizeArticle = async () => {
    if (!materialUrl) {
      toast.error("Không có tài liệu để tóm tắt");
      return;
    }

    setSummaryModal({
      isOpen: true,
      loading: true,
      summary: null,
      error: null,
    });

    try {
      const response = await summarizeMaterial(materialUrl, "article", lessonId);
      
      if (response.success && response.data?.summary) {
        setSummaryModal(prev => ({
          ...prev,
          loading: false,
          summary: response.data.summary,
          error: null,
        }));

        // Show success toast with appropriate message
        if (response.data.cached) {
          if (response.data.cacheSource === 'localStorage') {
            toast.success("📱 Đã tải tóm tắt từ bộ nhớ thiết bị (localStorage)");
          } else {
            toast.success("Đã tải tóm tắt từ bộ nhớ đệm");
          }
        } else {
          toast.success("🤖 Tóm tắt tài liệu đã được tạo thành công và lưu vào thiết bị");
        }
      } else {
        throw new Error(response.message || "Không thể tạo tóm tắt tài liệu");
      }
    } catch (error) {
      console.error("Error summarizing article:", error);
      
      let errorMessage = "Không thể tạo tóm tắt tài liệu. Vui lòng thử lại sau.";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setSummaryModal(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));

      toast.error(errorMessage);
    }
  };

  const closeSummaryModal = () => {
    setSummaryModal({
      isOpen: false,
      loading: false,
      summary: null,
      error: null,
    });
  };

  return (
    <>
      <div className="article-container">
        <div className="article-header">
          <h1 className="article-hero-title">{title || "Article"}</h1>
          
          {/* Summary Button */}
          {hasDownload && (
            <button 
              className="article-summary-button"
              onClick={handleSummarizeArticle}
              disabled={summaryModal.loading}
              title="Tóm tắt nội dung tài liệu bằng AI"
            >
              {summaryModal.loading ? (
                <>
                  <span className="summary-spinner-small"></span>
                  Đang tóm tắt...
                </>
              ) : (
                <>
                  🤖 Tóm tắt AI
                </>
              )}
            </button>
          )}
        </div>

        {description && (
          <p className="article-subtext">{description}</p>
        )}

        {hasDownload && (
          <a className="article-file-card" href={materialUrl} target="_blank" rel="noopener noreferrer">
            <div className="file-icon">📄</div>
            <div className="file-info">
            <div className="file-name" title={fileName}>Download Material</div>
              <div className="file-type">Resource File</div>
            </div>
          </a>
        )}

        {lessonNotes && (
          <div className="article-notes-block">
            {lessonNotes}
          </div>
        )}

        {/* Footer removed as requested */}
      </div>

      {/* Summary Modal */}
      <SummaryModal
        isOpen={summaryModal.isOpen}
        onClose={closeSummaryModal}
        summary={summaryModal.summary}
        loading={summaryModal.loading}
        error={summaryModal.error}
        lessonTitle={title}
        lessonType="article"
      />
    </>
  );
};

export default ArticleContent;


