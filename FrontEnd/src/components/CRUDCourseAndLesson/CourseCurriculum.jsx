import { useState, useEffect } from "react";
import CustomButton from "../common/CustomButton/CustomButton";
import Input from "../common/Input";
import {
  BarChart3,
  BookOpen,
  DollarSign,
  MessageSquare,
  Settings,
  LogOut,
  Search,
  Bell,
  Plus,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp,
  Check,
  FileText,
  Video,
  Paperclip,
  Type,
  StickyNote,
} from "lucide-react";
import "../../assets/CRUDCourseAndLesson/CourseCurriculum.css";
import ProgressTabs from "./ProgressTabs";
import apiClient from "../../services/authService";

function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed",
        zIndex: 1000,
        left: 0,
        top: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 8,
          width: 500,
          minWidth: 500,
          maxWidth: 500,
          padding: 32,
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 500 }}>{title}</h3>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: 20,
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// Định nghĩa hàm defaultLesson để tránh lỗi no-undef
function defaultLesson(order = 1) {
  return {
    title: `Lesson ${order}`,
    videoUrl: "",
    captions: "",
    description: "",
    lessonNotes: "",
    order,
  };
}

export default function CourseCurriculum({
  onNext = () => {},
  onPrev = () => {},
  initialData = {},
}) {
  const [expandedLecture, setExpandedLecture] = useState(1);
  const [modal, setModal] = useState({ open: false, type: null });
  const [lessonVideoFile, setLessonVideoFile] = useState(null);
  const [lessonVideoPreview, setLessonVideoPreview] = useState(null);
  const [lessonFile, setLessonFile] = useState(null);
  const [lessonFilePreview, setLessonFilePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState(
    initialData.uploadedFiles || {}
  ); // Track uploaded files by type
  const [captionText, setCaptionText] = useState(""); // State for caption text
  const [descriptionText, setDescriptionText] = useState(""); // State for description text
  const [notesText, setNotesText] = useState(""); // State for notes text
  const [sections, setSections] = useState(
    initialData.curriculum && Array.isArray(initialData.curriculum)
      ? initialData.curriculum.map((section) => ({
          ...section,
          lessons:
            section.lessons && section.lessons.length > 0
              ? section.lessons.map((lesson, idx) => ({
                  ...defaultLesson(idx + 1),
                  ...lesson,
                  order: idx + 1,
                }))
              : [defaultLesson(1)],
        }))
      : [
          {
            name: "Section 1",
            order: 1,
            lessons: [defaultLesson(1)],
          },
        ]
  );
  const [editing, setEditing] = useState({
    sectionIdx: null,
    lessonIdx: null,
    field: null,
  });
  const [modalValue, setModalValue] = useState("");
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [videoUploadError, setVideoUploadError] = useState("");
  const [videoUploadSuccess, setVideoUploadSuccess] = useState("");
  const [selectedVideoFile, setSelectedVideoFile] = useState(null);
  const [selectedVideoPreview, setSelectedVideoPreview] = useState(null);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState("");

  useEffect(() => {
    if (initialData.uploadedFiles) {
      setUploadedFiles(initialData.uploadedFiles);
    }
  }, [initialData]);

  const toggleLecture = (index) => {
    setExpandedLecture(expandedLecture === index ? null : index);
  };

  // Remove redundant button style objects and use only CustomButton for actions

  const inputStyle = {
    width: "100%",
    padding: "12px",
    border: "1px solid #e9eaf0",
    borderRadius: "6px",
    fontSize: "15px",
    marginTop: "8px",
    background: "#fafbfc",
    color: "#1d2026",
    outline: "none",
    boxSizing: "border-box",
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: 100,
    resize: "vertical",
  };

  const fileBoxStyle = {
    border: "1px solid #e9eaf0",
    borderRadius: "6px",
    background: "#fafbfc",
    padding: "24px 0",
    textAlign: "center",
    marginTop: "8px",
    marginBottom: "16px",
  };

  const labelStyle = {
    fontWeight: 500,
    marginBottom: 8,
    display: "block",
    color: "#1d2026",
    fontSize: 14,
  };

  const noteStyle = {
    fontSize: 12,
    color: "#8c94a3",
    marginTop: 4,
    textAlign: "left",
  };

  const modalFooterStyle = {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    marginTop: 16,
  };

  // Handlers for file input
  const handleLessonVideoChange = (e) => {
    const file = e.target.files[0];
    setLessonVideoFile(file);
    setLessonVideoPreview(file ? URL.createObjectURL(file) : null);
  };
  const handleLessonFileChange = (e) => {
    const file = e.target.files[0];
    setLessonFile(file);
    setLessonFilePreview(file ? URL.createObjectURL(file) : null);
  };

  // Handler for uploading lesson video/file and creating lesson
  const handleUploadLessonFile = async () => {
    setUploading(true);
    setUploadError("");
    setUploadSuccess("");
    try {
      let videoUrl, fileUrl;
      if (lessonVideoFile) {
        const formData = new FormData();
        formData.append("file", lessonVideoFile);
        const res = await apiClient.post("/admin/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        videoUrl = res.data.url;
        setUploadedFiles((prev) => ({
          ...prev,
          video: { url: videoUrl, name: lessonVideoFile.name },
        }));
      }
      if (lessonFile) {
        const formData = new FormData();
        formData.append("file", lessonFile);
        const res = await apiClient.post("/admin/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        fileUrl = res.data.url;
        setUploadedFiles((prev) => ({
          ...prev,
          file: { url: fileUrl, name: lessonFile.name },
        }));
      }

      setUploadSuccess("Lesson uploaded successfully!");

      // Close modal after successful upload
      setTimeout(() => {
        setModal({ open: false, type: null });
        setUploadSuccess("");
        setUploadError("");
        // Clear file inputs
        setLessonVideoFile(null);
        setLessonVideoPreview(null);
        setLessonFile(null);
        setLessonFilePreview(null);
      }, 1500);
    } catch (err) {
      setUploadError(
        err.response?.data?.message || err.message || "Failed to upload lesson"
      );
    } finally {
      setUploading(false);
    }
  };

  // Handler for adding caption
  const handleAddCaption = () => {
    if (!captionText.trim()) return;

    setUploadedFiles((prev) => ({
      ...prev,
      caption: { text: captionText.trim() },
    }));

    setUploadSuccess("Caption added successfully!");

    // Close modal after successful add
    setTimeout(() => {
      setModal({ open: false, type: null });
      setUploadSuccess("");
      setUploadError("");
      setCaptionText(""); // Clear caption text
    }, 1500);
  };

  // Handler for adding description
  const handleAddDescription = () => {
    if (!descriptionText.trim()) return;

    setUploadedFiles((prev) => ({
      ...prev,
      description: { text: descriptionText.trim() },
    }));

    setUploadSuccess("Description added successfully!");

    // Close modal after successful add
    setTimeout(() => {
      setModal({ open: false, type: null });
      setUploadSuccess("");
      setUploadError("");
      setDescriptionText(""); // Clear description text
    }, 1500);
  };

  // Handler for adding notes
  const handleAddNotes = () => {
    if (!notesText.trim()) return;

    setUploadedFiles((prev) => ({
      ...prev,
      notes: { text: notesText.trim() },
    }));

    setUploadSuccess("Notes added successfully!");

    // Close modal after successful add
    setTimeout(() => {
      setModal({ open: false, type: null });
      setUploadSuccess("");
      setUploadError("");
      setNotesText(""); // Clear notes text
    }, 1500);
  };

  const renderModalContent = () => {
    switch (modal.type) {
      case "video":
        return (
          <>
            <div>
              <label style={labelStyle}>Upload Video</label>
              <div style={fileBoxStyle}>
                <input
                  type="file"
                  accept="video/*"
                  id="lesson-video-upload"
                  style={{ display: "none" }}
                  onChange={handleLessonVideoChange}
                />
                <CustomButton
                  color="primary"
                  type="normal"
                  size="small"
                  onClick={() =>
                    document.getElementById("lesson-video-upload").click()
                  }
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : "Choose Video File"}
                </CustomButton>
                {lessonVideoPreview && (
                  <video
                    src={lessonVideoPreview}
                    controls
                    style={{ maxWidth: 300, marginTop: 8 }}
                  />
                )}
              </div>
            </div>
            <div style={modalFooterStyle}>
              <CustomButton
                color="transparent"
                type="normal"
                size="medium"
                onClick={() => setModal({ open: false, type: null })}
              >
                Cancel
              </CustomButton>
              <CustomButton
                color="primary"
                type="normal"
                size="medium"
                onClick={handleUploadLessonFile}
                disabled={uploading || (!lessonVideoFile && !lessonFile)}
              >
                {uploading ? "Uploading..." : "Upload Video"}
              </CustomButton>
            </div>
            {uploadError && (
              <div style={{ color: "red", marginTop: 8 }}>{uploadError}</div>
            )}
            {uploadSuccess && (
              <div style={{ color: "green", marginTop: 8 }}>
                {uploadSuccess}
              </div>
            )}
          </>
        );
      case "file":
        return (
          <>
            <div>
              <label style={labelStyle}>Attach File</label>
              <div style={fileBoxStyle}>
                <input
                  type="file"
                  id="lesson-file-upload"
                  style={{ display: "none" }}
                  onChange={handleLessonFileChange}
                />
                <CustomButton
                  color="primary"
                  type="normal"
                  size="small"
                  onClick={() =>
                    document.getElementById("lesson-file-upload").click()
                  }
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : "Choose File"}
                </CustomButton>
                {lessonFilePreview && (
                  <a
                    href={lessonFilePreview}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Preview File
                  </a>
                )}
              </div>
            </div>
            <div style={modalFooterStyle}>
              <CustomButton
                color="transparent"
                type="normal"
                size="medium"
                onClick={() => setModal({ open: false, type: null })}
              >
                Cancel
              </CustomButton>
              <CustomButton
                color="primary"
                type="normal"
                size="medium"
                onClick={handleUploadLessonFile}
                disabled={uploading || (!lessonVideoFile && !lessonFile)}
              >
                {uploading ? "Uploading..." : "Attach File"}
              </CustomButton>
            </div>
            {uploadError && (
              <div style={{ color: "red", marginTop: 8 }}>{uploadError}</div>
            )}
            {uploadSuccess && (
              <div style={{ color: "green", marginTop: 8 }}>
                {uploadSuccess}
              </div>
            )}
          </>
        );
      case "caption":
        return (
          <>
            <div>
              <label style={labelStyle}>Caption</label>
              <textarea
                placeholder="Write your lesson caption here..."
                style={textareaStyle}
                value={captionText}
                onChange={(e) => setCaptionText(e.target.value)}
              />
            </div>
            <div style={modalFooterStyle}>
              <CustomButton
                color="transparent"
                type="normal"
                size="medium"
                onClick={() => setModal({ open: false, type: null })}
              >
                Cancel
              </CustomButton>
              <CustomButton
                color="primary"
                type="normal"
                size="medium"
                onClick={handleAddCaption}
                disabled={!captionText.trim()}
              >
                Add Caption
              </CustomButton>
            </div>
          </>
        );
      case "description":
        return (
          <>
            <div>
              <label style={labelStyle}>Description</label>
              <textarea
                placeholder="Write your Lesson description here..."
                style={textareaStyle}
                value={descriptionText}
                onChange={(e) => setDescriptionText(e.target.value)}
              />
            </div>
            <div style={modalFooterStyle}>
              <CustomButton
                color="transparent"
                type="normal"
                size="medium"
                onClick={() => setModal({ open: false, type: null })}
              >
                Cancel
              </CustomButton>
              <CustomButton
                color="primary"
                type="normal"
                size="medium"
                onClick={handleAddDescription}
                disabled={!descriptionText.trim()}
              >
                Add Description
              </CustomButton>
            </div>
          </>
        );
      case "notes":
        return (
          <>
            <div>
              <label style={labelStyle}>Notes</label>
              <textarea
                placeholder="Write your Lesson Notes here..."
                style={textareaStyle}
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
              />
            </div>
            <div>
              <label style={labelStyle}>Uploads Notes</label>
              <div style={fileBoxStyle}>
                <input
                  type="file"
                  style={{ display: "none" }}
                  id="notes-upload"
                />
                <label
                  htmlFor="notes-upload"
                  style={{
                    ...inputStyle,
                    background: "#fff",
                    cursor: "pointer",
                    border: "none",
                    margin: 0,
                  }}
                >
                  <span style={{ color: "#8c94a3" }}>Upload File</span>
                </label>
                <div style={noteStyle}>
                  Drag an drop a file or{" "}
                  <span style={{ color: "##ff6636", cursor: "pointer" }}>
                    browse file
                  </span>
                </div>
              </div>
            </div>
            <div style={modalFooterStyle}>
              <CustomButton
                color="transparent"
                type="normal"
                size="medium"
                onClick={() => setModal({ open: false, type: null })}
              >
                Cancel
              </CustomButton>
              <CustomButton
                color="primary"
                type="normal"
                size="medium"
                onClick={handleAddNotes}
                disabled={!notesText.trim()}
              >
                Add Notes
              </CustomButton>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  // Section/lesson handlers
  const handleAddSection = () => {
    setSections((prev) => [
      ...prev,
      {
        name: `Section ${prev.length + 1}`,
        order: prev.length + 1,
        lessons: [],
      },
    ]);
  };

  const handleDeleteSection = (sectionIdx) => {
    setSections((prev) => prev.filter((_, idx) => idx !== sectionIdx));
  };

  const handleSectionNameChange = (sectionIdx, name) => {
    setSections((prev) =>
      prev.map((section, idx) =>
        idx === sectionIdx ? { ...section, name } : section
      )
    );
  };

  const handleAddLesson = (sectionIdx) => {
    setSections((prev) =>
      prev.map((section, idx) =>
        idx === sectionIdx
          ? {
              ...section,
              lessons: [
                ...section.lessons,
                defaultLesson(section.lessons.length + 1),
              ],
            }
          : section
      )
    );
  };

  const handleDeleteLesson = (sectionIdx, lessonIdx) => {
    setSections((prev) =>
      prev.map((section, idx) => {
        if (idx !== sectionIdx) return section;
        if (section.lessons.length <= 1) return section; // Không cho xóa lesson cuối cùng
        return {
          ...section,
          lessons: section.lessons.filter((_, lidx) => lidx !== lessonIdx),
        };
      })
    );
  };

  const handleLessonFieldChange = (sectionIdx, lessonIdx, field, value) => {
    setSections((prev) =>
      prev.map((section, idx) =>
        idx === sectionIdx
          ? {
              ...section,
              lessons: section.lessons.map((lesson, lidx) =>
                lidx === lessonIdx ? { ...lesson, [field]: value } : lesson
              ),
            }
          : section
      )
    );
  };

  const handleSaveNext = () => {
    onNext({
      curriculum: sections,
      uploadedFiles: uploadedFiles,
    });
  };

  const openFieldModal = (sectionIdx, lessonIdx, field, value) => {
    setEditing({ sectionIdx, lessonIdx, field });
    setModalValue(value || "");
    setModal({ open: true, type: field });
  };

  const handleSelectVideoFile = (e) => {
    const file = e.target.files[0];
    setSelectedVideoFile(file);
    setSelectedVideoPreview(file ? URL.createObjectURL(file) : null);
    setUploadedVideoUrl("");
    setVideoUploadError("");
    setVideoUploadSuccess("");
  };

  const handleUploadVideoFile = async () => {
    if (!selectedVideoFile) return;
    setUploadingVideo(true);
    setVideoUploadError("");
    setVideoUploadSuccess("");
    try {
      const formData = new FormData();
      formData.append("file", selectedVideoFile);
      formData.append("fileType", "lessonvideo");
      const res = await apiClient.post("/admin/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadedVideoUrl(res.data.url);
      setVideoUploadSuccess("Upload thành công!");
      // Cập nhật luôn videoUrl vào lesson tương ứng trong sections
      if (editing.sectionIdx !== null && editing.lessonIdx !== null) {
        setSections((prev) =>
          prev.map((section, sidx) =>
            sidx === editing.sectionIdx
              ? {
                  ...section,
                  lessons: section.lessons.map((lesson, lidx) =>
                    lidx === editing.lessonIdx
                      ? { ...lesson, videoUrl: res.data.url }
                      : lesson
                  ),
                }
              : section
          )
        );
      }
    } catch (err) {
      setVideoUploadError(
        err.response?.data?.message || err.message || "Upload thất bại"
      );
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleSaveFieldModal = () => {
    if (editing.field !== "videoUrl") {
      handleLessonFieldChange(
        editing.sectionIdx,
        editing.lessonIdx,
        editing.field,
        modalValue
      );
    }
    setModal({ open: false, type: null });
    setEditing({ sectionIdx: null, lessonIdx: null, field: null });
    setModalValue("");
    setSelectedVideoFile(null);
    setSelectedVideoPreview(null);
    setUploadedVideoUrl("");
    setVideoUploadError("");
    setVideoUploadSuccess("");
  };

  return (
    <div className="cf-app-container">
      <div className="cf-content-area">
        <div className="cf-main-content">
          <ProgressTabs activeIndex={2} progressText="7/12" />
          <div className="cf-form-content">
            <div className="cf-form-header">
              <h2 className="cf-form-title">Course Curriculum</h2>
              <div className="cf-form-actions">
                <CustomButton color="primary" type="normal" size="medium">
                  Save
                </CustomButton>
                <CustomButton color="transparent" type="normal" size="medium">
                  Save & Preview
                </CustomButton>
              </div>
            </div>
            {/* Curriculum-specific content */}
            <div className="acc-course-structure">
              {sections.map((section, sectionIdx) => (
                <div className="acc-section-card" key={sectionIdx}>
                  <div className="acc-section-header">
                    <div className="acc-section-title-container">
                      <div className="acc-section-indicator">
                        <div className="acc-section-line"></div>
                        <span className="acc-section-label">
                          Sections {String(section.order).padStart(2, "0")}:
                        </span>
                      </div>
                      <input
                        className="acc-section-name"
                        value={section.name}
                        onChange={(e) =>
                          handleSectionNameChange(sectionIdx, e.target.value)
                        }
                        style={{
                          fontWeight: 600,
                          fontSize: 16,
                          border: "none",
                          background: "transparent",
                        }}
                      />
                    </div>
                    <div className="acc-section-actions">
                      <CustomButton
                        size="sm"
                        variant="ghost"
                        className="acc-action-button"
                        color="transparent"
                        onClick={() => handleAddLesson(sectionIdx)}
                      >
                        <Plus className="acc-icon-xs" />
                      </CustomButton>
                      <CustomButton
                        size="sm"
                        variant="ghost"
                        className="acc-action-button"
                        color="transparent"
                        onClick={() => handleDeleteSection(sectionIdx)}
                      >
                        <Trash2 className="acc-icon-xs" />
                      </CustomButton>
                    </div>
                  </div>
                  {/* Lectures */}
                  <div className="acc-lectures-container">
                    {section.lessons.map((lesson, lessonIdx) => (
                      <div className="acc-lecture-item" key={lessonIdx}>
                        <div className="acc-lecture-content">
                          <div className="acc-lecture-title-container">
                            <div className="acc-lecture-line"></div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                flex: 1,
                                padding: "8px 12px",
                                borderRadius: "6px",
                                background: lesson.title
                                  ? "#f0fdf4"
                                  : "#fafbfc",
                                border: "1px solid #e9eaf0",
                                transition: "all 0.2s ease",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  width: "24px",
                                  height: "24px",
                                  borderRadius: "4px",
                                  background: lesson.title
                                    ? "#10b981"
                                    : "#e5e7eb",
                                  marginRight: "8px",
                                }}
                              >
                                <span
                                  style={{
                                    color: lesson.title ? "#ffffff" : "#6b7280",
                                    fontSize: "12px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {lessonIdx + 1}
                                </span>
                              </div>
                              <input
                                className="acc-lecture-name"
                                value={lesson.title}
                                onChange={(e) =>
                                  handleLessonFieldChange(
                                    sectionIdx,
                                    lessonIdx,
                                    "title",
                                    e.target.value
                                  )
                                }
                                style={{
                                  fontWeight: 500,
                                  fontSize: 15,
                                  border: "none",
                                  background: "transparent",
                                  flex: 1,
                                  color: lesson.title ? "#1d2026" : "#6b7280",
                                }}
                                placeholder="Enter lesson title..."
                              />
                              {lesson.title && (
                                <span
                                  style={{
                                    color: "#10b981",
                                    fontSize: "12px",
                                    fontWeight: "500",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                  }}
                                >
                                  ✓ Title added
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="acc-lecture-actions">
                            {section.lessons.length > 1 && (
                              <CustomButton
                                size="sm"
                                variant="ghost"
                                className="acc-action-button"
                                color="transparent"
                                onClick={() =>
                                  handleDeleteLesson(sectionIdx, lessonIdx)
                                }
                              >
                                <Trash2 className="acc-icon-xs" />
                              </CustomButton>
                            )}
                          </div>
                        </div>
                        {/* Field list, click để mở modal */}
                        <div
                          className="acc-expanded-content"
                          style={{ marginTop: 8, marginBottom: 8 }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 12,
                            }}
                          >
                            {/* Video Field */}
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                cursor: "pointer",
                                padding: "12px",
                                borderRadius: "8px",
                                border: "1px solid #e9eaf0",
                                background: lesson.videoUrl
                                  ? "#f0fdf4"
                                  : "#fafbfc",
                                transition: "all 0.2s ease",
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.background = lesson.videoUrl
                                  ? "#ecfdf5"
                                  : "#f8fafc";
                                e.target.style.borderColor = "#d1d5db";
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.background = lesson.videoUrl
                                  ? "#f0fdf4"
                                  : "#fafbfc";
                                e.target.style.borderColor = "#e9eaf0";
                              }}
                              onClick={(e) => {
                                // Only open modal if not clicking on video preview
                                if (!e.target.closest("[data-video-preview]")) {
                                  openFieldModal(
                                    sectionIdx,
                                    lessonIdx,
                                    "videoUrl",
                                    lesson.videoUrl
                                  );
                                }
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  width: "32px",
                                  height: "32px",
                                  borderRadius: "6px",
                                  background: lesson.videoUrl
                                    ? "#10b981"
                                    : "#e5e7eb",
                                  marginRight: "12px",
                                }}
                              >
                                <Video
                                  size={16}
                                  color={
                                    lesson.videoUrl ? "#ffffff" : "#6b7280"
                                  }
                                />
                              </div>
                              <div
                                style={{ flex: 1 }}
                                onClick={(e) => {
                                  // Only open modal if not clicking on video preview
                                  if (
                                    !e.target.closest("[data-video-preview]")
                                  ) {
                                    openFieldModal(
                                      sectionIdx,
                                      lessonIdx,
                                      "videoUrl",
                                      lesson.videoUrl
                                    );
                                  }
                                }}
                              >
                                <div
                                  style={{
                                    fontWeight: 600,
                                    fontSize: "14px",
                                    color: "#1d2026",
                                    marginBottom: "2px",
                                  }}
                                >
                                  Video
                                </div>
                                {lesson.videoUrl ? (
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "12px",
                                    }}
                                  >
                                    <span
                                      style={{
                                        color: "#10b981",
                                        fontSize: "12px",
                                        fontWeight: "500",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "4px",
                                        background: "#f0fdf4",
                                        padding: "4px 8px",
                                        borderRadius: "12px",
                                        border: "1px solid #dcfce7",
                                      }}
                                    >
                                      ✓ Added
                                    </span>
                                    {lesson.videoUrl.includes("blob:") ||
                                    lesson.videoUrl.startsWith("http") ? (
                                      <div
                                        data-video-preview
                                        style={{
                                          position: "relative",
                                          borderRadius: "8px",
                                          overflow: "hidden",
                                          border: "2px solid #e5e7eb",
                                          background: "#f8fafc",
                                          transition: "all 0.3s ease",
                                          cursor: "pointer",
                                        }}
                                        onMouseEnter={(e) => {
                                          e.target.style.transform =
                                            "scale(1.05)";
                                          e.target.style.borderColor =
                                            "#3b82f6";
                                          e.target.style.boxShadow =
                                            "0 4px 12px rgba(59, 130, 246, 0.15)";
                                        }}
                                        onMouseLeave={(e) => {
                                          e.target.style.transform = "scale(1)";
                                          e.target.style.borderColor =
                                            "#e5e7eb";
                                          e.target.style.boxShadow = "none";
                                        }}
                                        onClick={(e) => {
                                          // Prevent event from bubbling up to parent
                                          e.stopPropagation();
                                          // Open video in new tab for preview
                                          window.open(
                                            lesson.videoUrl,
                                            "_blank"
                                          );
                                        }}
                                      >
                                        <video
                                          src={lesson.videoUrl}
                                          style={{
                                            width: "120px",
                                            height: "68px",
                                            objectFit: "cover",
                                            display: "block",
                                          }}
                                          muted
                                          onLoadedData={(e) => {
                                            // Add a subtle play animation when video loads
                                            e.target.style.opacity = "0.8";
                                            setTimeout(() => {
                                              e.target.style.opacity = "1";
                                            }, 200);
                                          }}
                                        />
                                        <div
                                          style={{
                                            position: "absolute",
                                            top: "0",
                                            left: "0",
                                            right: "0",
                                            bottom: "0",
                                            background:
                                              "linear-gradient(135deg, rgba(59, 130, 246, 0.8) 0%, rgba(147, 51, 234, 0.8) 100%)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            opacity: "0",
                                            transition: "opacity 0.3s ease",
                                          }}
                                          onMouseEnter={(e) => {
                                            e.target.style.opacity = "1";
                                          }}
                                          onMouseLeave={(e) => {
                                            e.target.style.opacity = "0";
                                          }}
                                        >
                                          <div
                                            style={{
                                              background:
                                                "rgba(255, 255, 255, 0.9)",
                                              borderRadius: "50%",
                                              width: "32px",
                                              height: "32px",
                                              display: "flex",
                                              alignItems: "center",
                                              justifyContent: "center",
                                              boxShadow:
                                                "0 2px 8px rgba(0, 0, 0, 0.2)",
                                            }}
                                          >
                                            <span
                                              style={{
                                                color: "#3b82f6",
                                                fontSize: "14px",
                                                fontWeight: "bold",
                                                marginLeft: "2px",
                                              }}
                                            >
                                              ▶
                                            </span>
                                          </div>
                                        </div>
                                        <div
                                          style={{
                                            position: "absolute",
                                            bottom: "4px",
                                            right: "4px",
                                            background: "rgba(0, 0, 0, 0.7)",
                                            color: "#ffffff",
                                            fontSize: "10px",
                                            padding: "2px 6px",
                                            borderRadius: "4px",
                                            fontWeight: "500",
                                          }}
                                        >
                                          Preview
                                        </div>
                                      </div>
                                    ) : (
                                      <div
                                        style={{
                                          background: "#f8fafc",
                                          border: "1px solid #e5e7eb",
                                          borderRadius: "8px",
                                          padding: "8px 12px",
                                          display: "flex",
                                          alignItems: "center",
                                          gap: "8px",
                                          maxWidth: "200px",
                                        }}
                                      >
                                        <Video size={16} color="#6b7280" />
                                        <span
                                          style={{
                                            color: "#6b7280",
                                            fontSize: "12px",
                                            fontFamily: "monospace",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                          }}
                                        >
                                          {lesson.videoUrl.substring(0, 20)}...
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "8px",
                                      color: "#6b7280",
                                      fontSize: "12px",
                                      padding: "6px 10px",
                                      background: "#f9fafb",
                                      borderRadius: "6px",
                                      border: "1px dashed #d1d5db",
                                    }}
                                  >
                                    <Video size={14} />
                                    <span>Click to add video content</span>
                                  </div>
                                )}
                              </div>
                              <div
                                style={{
                                  color: "#9ca3af",
                                  fontSize: "12px",
                                  fontWeight: "500",
                                  cursor: "pointer",
                                  padding: "4px 8px",
                                  borderRadius: "4px",
                                  transition: "all 0.2s ease",
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.background = "#f3f4f6";
                                  e.target.style.color = "#6b7280";
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.background = "transparent";
                                  e.target.style.color = "#9ca3af";
                                }}
                                onClick={(e) => {
                                  // Only open modal if not clicking on video preview
                                  if (
                                    !e.target.closest("[data-video-preview]")
                                  ) {
                                    openFieldModal(
                                      sectionIdx,
                                      lessonIdx,
                                      "videoUrl",
                                      lesson.videoUrl
                                    );
                                  }
                                }}
                              >
                                Edit
                              </div>
                            </div>

                            {/* Captions Field */}
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                cursor: "pointer",
                                padding: "12px",
                                borderRadius: "8px",
                                border: "1px solid #e9eaf0",
                                background: lesson.captions
                                  ? "#f0fdf4"
                                  : "#fafbfc",
                                transition: "all 0.2s ease",
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.background = lesson.captions
                                  ? "#ecfdf5"
                                  : "#f8fafc";
                                e.target.style.borderColor = "#d1d5db";
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.background = lesson.captions
                                  ? "#f0fdf4"
                                  : "#fafbfc";
                                e.target.style.borderColor = "#e9eaf0";
                              }}
                              onClick={() =>
                                openFieldModal(
                                  sectionIdx,
                                  lessonIdx,
                                  "captions",
                                  lesson.captions
                                )
                              }
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  width: "32px",
                                  height: "32px",
                                  borderRadius: "6px",
                                  background: lesson.captions
                                    ? "#10b981"
                                    : "#e5e7eb",
                                  marginRight: "12px",
                                }}
                              >
                                <Type
                                  size={16}
                                  color={
                                    lesson.captions ? "#ffffff" : "#6b7280"
                                  }
                                />
                              </div>
                              <div style={{ flex: 1 }}>
                                <div
                                  style={{
                                    fontWeight: 600,
                                    fontSize: "14px",
                                    color: "#1d2026",
                                    marginBottom: "2px",
                                  }}
                                >
                                  Captions
                                </div>
                                {lesson.captions ? (
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "8px",
                                    }}
                                  >
                                    <span
                                      style={{
                                        color: "#10b981",
                                        fontSize: "12px",
                                        fontWeight: "500",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "4px",
                                      }}
                                    >
                                      ✓ Added
                                    </span>
                                    <span
                                      style={{
                                        color: "#4e5566",
                                        fontSize: "12px",
                                        maxWidth: "200px",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        fontStyle: "italic",
                                      }}
                                    >
                                      "{lesson.captions}"
                                    </span>
                                  </div>
                                ) : (
                                  <span
                                    style={{
                                      color: "#6b7280",
                                      fontSize: "12px",
                                    }}
                                  >
                                    Click to add captions
                                  </span>
                                )}
                              </div>
                              <div
                                style={{
                                  color: "#9ca3af",
                                  fontSize: "12px",
                                  fontWeight: "500",
                                }}
                              >
                                Edit
                              </div>
                            </div>

                            {/* Description Field */}
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                cursor: "pointer",
                                padding: "12px",
                                borderRadius: "8px",
                                border: "1px solid #e9eaf0",
                                background: lesson.description
                                  ? "#f0fdf4"
                                  : "#fafbfc",
                                transition: "all 0.2s ease",
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.background = lesson.description
                                  ? "#ecfdf5"
                                  : "#f8fafc";
                                e.target.style.borderColor = "#d1d5db";
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.background = lesson.description
                                  ? "#f0fdf4"
                                  : "#fafbfc";
                                e.target.style.borderColor = "#e9eaf0";
                              }}
                              onClick={() =>
                                openFieldModal(
                                  sectionIdx,
                                  lessonIdx,
                                  "description",
                                  lesson.description
                                )
                              }
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  width: "32px",
                                  height: "32px",
                                  borderRadius: "6px",
                                  background: lesson.description
                                    ? "#10b981"
                                    : "#e5e7eb",
                                  marginRight: "12px",
                                }}
                              >
                                <StickyNote
                                  size={16}
                                  color={
                                    lesson.description ? "#ffffff" : "#6b7280"
                                  }
                                />
                              </div>
                              <div style={{ flex: 1 }}>
                                <div
                                  style={{
                                    fontWeight: 600,
                                    fontSize: "14px",
                                    color: "#1d2026",
                                    marginBottom: "2px",
                                  }}
                                >
                                  Description
                                </div>
                                {lesson.description ? (
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "8px",
                                    }}
                                  >
                                    <span
                                      style={{
                                        color: "#10b981",
                                        fontSize: "12px",
                                        fontWeight: "500",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "4px",
                                      }}
                                    >
                                      ✓ Added
                                    </span>
                                    <span
                                      style={{
                                        color: "#4e5566",
                                        fontSize: "12px",
                                        maxWidth: "200px",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {lesson.description}
                                    </span>
                                  </div>
                                ) : (
                                  <span
                                    style={{
                                      color: "#6b7280",
                                      fontSize: "12px",
                                    }}
                                  >
                                    Click to add description
                                  </span>
                                )}
                              </div>
                              <div
                                style={{
                                  color: "#9ca3af",
                                  fontSize: "12px",
                                  fontWeight: "500",
                                }}
                              >
                                Edit
                              </div>
                            </div>

                            {/* Lecture Notes Field */}
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                cursor: "pointer",
                                padding: "12px",
                                borderRadius: "8px",
                                border: "1px solid #e9eaf0",
                                background: lesson.lessonNotes
                                  ? "#f0fdf4"
                                  : "#fafbfc",
                                transition: "all 0.2s ease",
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.background = lesson.lessonNotes
                                  ? "#ecfdf5"
                                  : "#f8fafc";
                                e.target.style.borderColor = "#d1d5db";
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.background = lesson.lessonNotes
                                  ? "#f0fdf4"
                                  : "#fafbfc";
                                e.target.style.borderColor = "#e9eaf0";
                              }}
                              onClick={() =>
                                openFieldModal(
                                  sectionIdx,
                                  lessonIdx,
                                  "lessonNotes",
                                  lesson.lessonNotes
                                )
                              }
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  width: "32px",
                                  height: "32px",
                                  borderRadius: "6px",
                                  background: lesson.lessonNotes
                                    ? "#10b981"
                                    : "#e5e7eb",
                                  marginRight: "12px",
                                }}
                              >
                                <FileText
                                  size={16}
                                  color={
                                    lesson.lessonNotes ? "#ffffff" : "#6b7280"
                                  }
                                />
                              </div>
                              <div style={{ flex: 1 }}>
                                <div
                                  style={{
                                    fontWeight: 600,
                                    fontSize: "14px",
                                    color: "#1d2026",
                                    marginBottom: "2px",
                                  }}
                                >
                                  Lesson Notes
                                </div>
                                {lesson.lessonNotes ? (
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "8px",
                                    }}
                                  >
                                    <span
                                      style={{
                                        color: "#10b981",
                                        fontSize: "12px",
                                        fontWeight: "500",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "4px",
                                      }}
                                    >
                                      ✓ Added
                                    </span>
                                    <span
                                      style={{
                                        color: "#4e5566",
                                        fontSize: "12px",
                                        maxWidth: "200px",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {lesson.lessonNotes}
                                    </span>
                                  </div>
                                ) : (
                                  <span
                                    style={{
                                      color: "#6b7280",
                                      fontSize: "12px",
                                    }}
                                  >
                                    Click to add lesson notes
                                  </span>
                                )}
                              </div>
                              <div
                                style={{
                                  color: "#9ca3af",
                                  fontSize: "12px",
                                  fontWeight: "500",
                                }}
                              >
                                Edit
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <CustomButton
                variant="outline"
                className="acc-add-sections-button"
                color="primary"
                onClick={handleAddSection}
              >
                <div className="acc-add-sections-container">
                  <Plus className="acc-icon-sm acc-add-icon" />
                  <span>Add Sections</span>
                </div>
              </CustomButton>
            </div>
            {/* Navigat on Buttons */}
            <div className="cf-form-actions-bottom">
              <CustomButton
                variant="outline"
                className="acc-nav-button"
                color="transparent"
                onClick={() => {
                  const data = {
                    curriculum: sections,
                    uploadedFiles: uploadedFiles,
                  };
                  onPrev(data);
                }}
              >
                Previous
              </CustomButton>
              <CustomButton
                className="acc-nav-button acc-nav-button-primary"
                onClick={handleSaveNext}
              >
                Save & Next
              </CustomButton>
            </div>
          </div>
        </div>
      </div>
      {/* Modal */}
      <Modal
        open={modal.open}
        onClose={() => {
          setModal({ open: false, type: null });
          setEditing({ sectionIdx: null, lessonIdx: null, field: null });
          setModalValue("");
          setSelectedVideoFile(null);
          setSelectedVideoPreview(null);
          setUploadedVideoUrl("");
          setVideoUploadError("");
          setVideoUploadSuccess("");
        }}
        title={
          editing.field === "videoUrl"
            ? "Lesson Video Upload"
            : editing.field === "captions"
            ? "Lesson Captions"
            : editing.field === "description"
            ? "Lesson Description"
            : editing.field === "lessonNotes"
            ? "Lesson Notes"
            : ""
        }
      >
        {editing.field === "videoUrl" ? (
          <>
            <div
              style={{
                border: "2px dashed #d1d5db",
                borderRadius: "12px",
                padding: "32px 24px",
                textAlign: "center",
                background: "#fafbfc",
                marginBottom: "16px",
                transition: "all 0.3s ease",
                cursor: "pointer",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = "#3b82f6";
                e.target.style.background = "#f0f9ff";
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = "#d1d5db";
                e.target.style.background = "#fafbfc";
              }}
              onClick={() =>
                document.getElementById("video-file-input").click()
              }
            >
              <input
                id="video-file-input"
                type="file"
                accept="video/*"
                onChange={handleSelectVideoFile}
                style={{
                  position: "absolute",
                  opacity: 0,
                  pointerEvents: "none",
                }}
              />
              <div style={{ marginBottom: "16px" }}>
                <Video
                  size={48}
                  color="#6b7280"
                  style={{ marginBottom: "8px" }}
                />
              </div>
              <div style={{ marginBottom: "8px" }}>
                <h4
                  style={{
                    margin: "0 0 8px 0",
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#1d2026",
                  }}
                >
                  Upload Video File
                </h4>
                <p
                  style={{
                    margin: 0,
                    fontSize: "14px",
                    color: "#6b7280",
                    lineHeight: "1.5",
                  }}
                >
                  Click to browse or drag and drop your video file here
                </p>
                <p
                  style={{
                    margin: "8px 0 0 0",
                    fontSize: "12px",
                    color: "#9ca3af",
                  }}
                >
                  Supports MP4, AVI, MOV, and other video formats
                </p>
              </div>
            </div>

            {selectedVideoFile && (
              <div
                style={{
                  background: "#f0fdf4",
                  border: "1px solid #dcfce7",
                  borderRadius: "8px",
                  padding: "16px",
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "12px",
                  }}
                >
                  <Video size={20} color="#10b981" />
                  <div>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#1d2026",
                      }}
                    >
                      {selectedVideoFile.name}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#6b7280",
                      }}
                    >
                      {(selectedVideoFile.size / (1024 * 1024)).toFixed(2)} MB
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedVideoPreview && (
              <div
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "16px",
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#1d2026",
                    marginBottom: "12px",
                  }}
                >
                  Video Preview
                </div>
                <div
                  style={{
                    position: "relative",
                    borderRadius: "8px",
                    overflow: "hidden",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <video
                    src={selectedVideoPreview}
                    controls
                    style={{
                      width: "100%",
                      maxHeight: "200px",
                      objectFit: "contain",
                      background: "#000",
                    }}
                  />
                </div>
              </div>
            )}

            <CustomButton
              color="primary"
              onClick={handleUploadVideoFile}
              disabled={uploadingVideo || !selectedVideoFile}
              style={{
                width: "100%",
                marginBottom: "16px",
                padding: "12px 24px",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              {uploadingVideo ? (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <div
                    style={{
                      width: "16px",
                      height: "16px",
                      border: "2px solid #ffffff",
                      borderTop: "2px solid transparent",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                    }}
                  />
                  Uploading...
                </div>
              ) : (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <Video size={16} />
                  Upload Video
                </div>
              )}
            </CustomButton>

            {videoUploadError && (
              <div
                style={{
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: "8px",
                  padding: "12px",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span style={{ color: "#dc2626", fontSize: "16px" }}>⚠</span>
                <span style={{ color: "#dc2626", fontSize: "14px" }}>
                  {videoUploadError}
                </span>
              </div>
            )}

            {videoUploadSuccess && (
              <div
                style={{
                  background: "#f0fdf4",
                  border: "1px solid #dcfce7",
                  borderRadius: "8px",
                  padding: "12px",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span style={{ color: "#10b981", fontSize: "16px" }}>✓</span>
                <span style={{ color: "#10b981", fontSize: "14px" }}>
                  {videoUploadSuccess}
                </span>
              </div>
            )}

            <style>
              {`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}
            </style>
          </>
        ) : (
          <textarea
            value={modalValue}
            onChange={(e) => setModalValue(e.target.value)}
            style={{
              width: "100%",
              padding: 8,
              border: "1px solid #e9eaf0",
              borderRadius: 4,
              minHeight: 80,
            }}
            placeholder={
              editing.field === "captions"
                ? "Captions..."
                : editing.field === "description"
                ? "Description..."
                : "Lesson notes..."
            }
          />
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
            marginTop: 16,
          }}
        >
          <CustomButton
            color="transparent"
            onClick={() => {
              setModal({ open: false, type: null });
              setEditing({ sectionIdx: null, lessonIdx: null, field: null });
              setModalValue("");
              setSelectedVideoFile(null);
              setSelectedVideoPreview(null);
              setUploadedVideoUrl("");
              setVideoUploadError("");
              setVideoUploadSuccess("");
            }}
          >
            Cancel
          </CustomButton>
          <CustomButton
            color="primary"
            onClick={handleSaveFieldModal}
            disabled={editing.field === "videoUrl" && !uploadedVideoUrl}
          >
            Save
          </CustomButton>
        </div>
      </Modal>
    </div>
  );
}
