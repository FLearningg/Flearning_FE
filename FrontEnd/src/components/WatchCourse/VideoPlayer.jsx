import React, { useState } from "react";
import { summarizeMaterial } from "../../services/aiSummaryService";
import SummaryModal from "./SummaryModal";
import "../../assets/WatchCourse/VideoPlayer.css";
import { toast } from "react-toastify";

const VideoPlayer = ({ 
  videoUrl, 
  onProgress, 
  onEnded, 
  lessonTitle = "",
  lessonId = null 
}) => {
  const [summaryModal, setSummaryModal] = useState({
    isOpen: false,
    loading: false,
    summary: null,
    error: null,
  });

  const handleSummarizeVideo = async () => {
    if (!videoUrl) {
      toast.error("Không có video để tóm tắt");
      return;
    }

    setSummaryModal({
      isOpen: true,
      loading: true,
      summary: null,
      error: null,
    });

    try {
      const response = await summarizeMaterial(videoUrl, "video", lessonId);
      
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
          toast.success("🤖 Tóm tắt video đã được tạo thành công và lưu vào thiết bị");
        }
      } else {
        throw new Error(response.message || "Không thể tạo tóm tắt video");
      }
    } catch (error) {
      console.error("Error summarizing video:", error);
      
      let errorMessage = "Không thể tạo tóm tắt video. Vui lòng thử lại sau.";
      
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

  if (!videoUrl)
    return <div className="f-video-player">No video available.</div>;
    
  return (
    <>
      <div className="f-video-player">
        <video
          src={videoUrl}
          controls
          controlsList="nodownload"
          className="f-video"
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
          onEnded={onEnded}
        />
        
        {/* Summary Button */}
        <div className="video-summary-controls">
          <button 
            className="video-summary-button"
            onClick={handleSummarizeVideo}
            disabled={summaryModal.loading}
            title="Tóm tắt nội dung video bằng AI"
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
        </div>
      </div>

      {/* Summary Modal */}
      <SummaryModal
        isOpen={summaryModal.isOpen}
        onClose={closeSummaryModal}
        summary={summaryModal.summary}
        loading={summaryModal.loading}
        error={summaryModal.error}
        lessonTitle={lessonTitle}
        lessonType="video"
      />
    </>
  );
};

export default VideoPlayer;
