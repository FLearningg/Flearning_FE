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
    title: `Lecture ${order}`,
    videoUrl: "",
    captions: "",
    description: "",
    lectureNotes: "",
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
                placeholder="Write your lecture caption here..."
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
                placeholder="Write your lecture description here..."
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
                placeholder="Write your lecture Notes here..."
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
                  <span style={{ color: "#564ffd", cursor: "pointer" }}>
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
                              }}
                            />
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
                              gap: 8,
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                openFieldModal(
                                  sectionIdx,
                                  lessonIdx,
                                  "videoUrl",
                                  lesson.videoUrl
                                )
                              }
                            >
                              <Video style={{ marginRight: 8 }} size={18} />
                              <span style={{ fontWeight: 500 }}>Video</span>
                              <span
                                style={{
                                  marginLeft: 12,
                                  color: lesson.videoUrl
                                    ? "#1d2026"
                                    : "#8c94a3",
                                }}
                              >
                                {lesson.videoUrl ? "Đã nhập" : "Chưa nhập"}
                              </span>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                cursor: "pointer",
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
                              <Type style={{ marginRight: 8 }} size={18} />
                              <span style={{ fontWeight: 500 }}>Captions</span>
                              <span
                                style={{
                                  marginLeft: 12,
                                  color: lesson.captions
                                    ? "#1d2026"
                                    : "#8c94a3",
                                }}
                              >
                                {lesson.captions ? "Đã nhập" : "Chưa nhập"}
                              </span>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                cursor: "pointer",
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
                              <StickyNote
                                style={{ marginRight: 8 }}
                                size={18}
                              />
                              <span style={{ fontWeight: 500 }}>
                                Description
                              </span>
                              <span
                                style={{
                                  marginLeft: 12,
                                  color: lesson.description
                                    ? "#1d2026"
                                    : "#8c94a3",
                                }}
                              >
                                {lesson.description ? "Đã nhập" : "Chưa nhập"}
                              </span>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                openFieldModal(
                                  sectionIdx,
                                  lessonIdx,
                                  "lectureNotes",
                                  lesson.lectureNotes
                                )
                              }
                            >
                              <FileText style={{ marginRight: 8 }} size={18} />
                              <span style={{ fontWeight: 500 }}>
                                Lecture Notes
                              </span>
                              <span
                                style={{
                                  marginLeft: 12,
                                  color: lesson.lectureNotes
                                    ? "#1d2026"
                                    : "#8c94a3",
                                }}
                              >
                                {lesson.lectureNotes ? "Đã nhập" : "Chưa nhập"}
                              </span>
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
            ? "Lecture Video Upload"
            : editing.field === "captions"
            ? "Lecture Captions"
            : editing.field === "description"
            ? "Lecture Description"
            : editing.field === "lectureNotes"
            ? "Lecture Notes"
            : ""
        }
      >
        {editing.field === "videoUrl" ? (
          <>
            <input
              type="file"
              accept="video/*"
              onChange={handleSelectVideoFile}
              style={{ marginBottom: 8 }}
            />
            {selectedVideoPreview && (
              <video
                src={selectedVideoPreview}
                controls
                style={{ maxWidth: 300, marginBottom: 8 }}
              />
            )}
            <CustomButton
              color="primary"
              onClick={handleUploadVideoFile}
              disabled={uploadingVideo || !selectedVideoFile}
              style={{ marginBottom: 8 }}
            >
              {uploadingVideo ? "Uploading..." : "Upload Video"}
            </CustomButton>
            {videoUploadError && (
              <div style={{ color: "red", marginBottom: 8 }}>
                {videoUploadError}
              </div>
            )}
            {videoUploadSuccess && (
              <div style={{ color: "green", marginBottom: 8 }}>
                {videoUploadSuccess}
              </div>
            )}
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
                : "Lecture notes..."
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
