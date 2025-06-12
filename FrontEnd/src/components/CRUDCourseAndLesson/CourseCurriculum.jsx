import { useState } from "react";
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

export default function CourseCurriculum() {
  const [expandedLecture, setExpandedLecture] = useState(1);
  const [modal, setModal] = useState({ open: false, type: null });

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

  const renderModalContent = () => {
    switch (modal.type) {
      case "video":
        return (
          <>
            <div>
              <label style={labelStyle}>Upload Files</label>
              <div style={fileBoxStyle}>
                <input
                  type="file"
                  style={{ display: "none" }}
                  id="video-upload"
                />
                <label
                  htmlFor="video-upload"
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
                  <b>Note:</b> All files should be at least 720p and less than
                  4.0 GB.
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
                disabled
              >
                Upload Video
              </CustomButton>
            </div>
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
                  style={{ display: "none" }}
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  style={{
                    ...inputStyle,
                    background: "#fff",
                    cursor: "pointer",
                    border: "none",
                    margin: 0,
                  }}
                >
                  <span style={{ color: "#8c94a3" }}>Attach File</span>
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
                disabled
              >
                Attach File
              </CustomButton>
            </div>
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
                disabled
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
                disabled
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
                disabled
              >
                Add Description
              </CustomButton>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="acc-app-container">
      {/* Main Content (CRUDCourse style) */}
      <div className="acc-content-area">
        <div className="acc-main-container">
          <div className="acc-main-content">
            <ProgressTabs activeIndex={2} progressText="7/12" />
            <div className="acc-form-content">
              <div className="acc-form-header">
                <h2 className="acc-form-title">Course Curriculum</h2>
                <div className="acc-form-actions">
                  <CustomButton color="primary" type="normal" size="medium">
                    Save
                  </CustomButton>
                  <CustomButton color="transparent" type="normal" size="medium">
                    Save & Preview
                  </CustomButton>
                </div>
              </div>
              {/* Course Structure (curriculum-specific content) */}
              <div className="acc-course-structure">
                {/* Section */}
                <div className="acc-section-card">
                  <div className="acc-section-header">
                    <div className="acc-section-title-container">
                      <div className="acc-section-indicator">
                        <div className="acc-section-line"></div>
                        <span className="acc-section-label">Sections 01:</span>
                      </div>
                      <span className="acc-section-name">Section name</span>
                    </div>
                    <div className="acc-section-actions">
                      <CustomButton
                        size="sm"
                        variant="ghost"
                        className="acc-action-button"
                        color="transparent"
                      >
                        <Plus className="acc-icon-xs" />
                      </CustomButton>
                      <CustomButton
                        size="sm"
                        variant="ghost"
                        className="acc-action-button"
                        color="transparent"
                      >
                        <Edit className="acc-icon-xs" />
                      </CustomButton>
                      <CustomButton
                        size="sm"
                        variant="ghost"
                        className="acc-action-button"
                        color="transparent"
                      >
                        <Trash2 className="acc-icon-xs" />
                      </CustomButton>
                    </div>
                  </div>
                  {/* Lectures */}
                  <div className="acc-lectures-container">
                    {/* Lecture 1 */}
                    <div className="acc-lecture-item">
                      <div className="acc-lecture-content">
                        <div className="acc-lecture-title-container">
                          <div className="acc-lecture-line"></div>
                          <span className="acc-lecture-name">Lecture 1</span>
                        </div>
                        <div className="acc-lecture-actions">
                          <span
                            className="acc-contents-button"
                            onClick={() => toggleLecture(1)}
                            style={{ cursor: "pointer" }}
                          >
                            Contents{" "}
                            {expandedLecture === 1 ? (
                              <ChevronUp className="acc-icon-xs acc-chevron" />
                            ) : (
                              <ChevronDown className="acc-icon-xs acc-chevron" />
                            )}
                          </span>
                          <CustomButton
                            size="sm"
                            variant="ghost"
                            className="acc-action-button"
                            color="transparent"
                          >
                            <Edit className="acc-icon-xs" />
                          </CustomButton>
                          <CustomButton
                            size="sm"
                            variant="ghost"
                            className="acc-action-button"
                            color="transparent"
                          >
                            <Trash2 className="acc-icon-xs" />
                          </CustomButton>
                        </div>
                      </div>
                      {/* Expanded Content for Lecture 1 */}
                      {expandedLecture === 1 && (
                        <div className="acc-expanded-content">
                          <div className="acc-content-options">
                            <div
                              className="acc-content-option"
                              onClick={() =>
                                setModal({ open: true, type: "video" })
                              }
                            >
                              <Video className="acc-icon-xs" />
                              <span>Video</span>
                            </div>
                            <div
                              className="acc-content-option"
                              onClick={() =>
                                setModal({ open: true, type: "file" })
                              }
                            >
                              <Paperclip className="acc-icon-xs" />
                              <span>Attach File</span>
                            </div>
                            <div
                              className="acc-content-option"
                              onClick={() =>
                                setModal({ open: true, type: "caption" })
                              }
                            >
                              <Type className="acc-icon-xs" />
                              <span>Captions</span>
                            </div>
                            <div
                              className="acc-content-option"
                              onClick={() =>
                                setModal({ open: true, type: "description" })
                              }
                            >
                              <FileText className="acc-icon-xs" />
                              <span>Description</span>
                            </div>
                            <div
                              className="acc-content-option"
                              onClick={() =>
                                setModal({ open: true, type: "notes" })
                              }
                            >
                              <StickyNote className="acc-icon-xs" />
                              <span>Lecture Notes</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Lecture 2 */}
                    <div className="acc-lecture-item">
                      <div className="acc-lecture-content">
                        <div className="acc-lecture-title-container">
                          <div className="acc-lecture-line"></div>
                          <span className="acc-lecture-name">Lecture 2</span>
                        </div>
                        <div className="acc-lecture-actions">
                          <span
                            className="acc-contents-button"
                            onClick={() => toggleLecture(2)}
                            style={{ cursor: "pointer" }}
                          >
                            Contents{" "}
                            {expandedLecture === 2 ? (
                              <ChevronUp className="acc-icon-xs acc-chevron" />
                            ) : (
                              <ChevronDown className="acc-icon-xs acc-chevron" />
                            )}
                          </span>
                          <CustomButton
                            size="sm"
                            variant="ghost"
                            className="acc-action-button"
                            color="transparent"
                          >
                            <Edit className="acc-icon-xs" />
                          </CustomButton>
                          <CustomButton
                            size="sm"
                            variant="ghost"
                            className="acc-action-button"
                            color="transparent"
                          >
                            <Trash2 className="acc-icon-xs" />
                          </CustomButton>
                        </div>
                      </div>
                      {/* Expanded Content for Lecture 2 */}
                      {expandedLecture === 2 && (
                        <div className="acc-expanded-content">
                          <div className="acc-content-options">
                            <div
                              className="acc-content-option"
                              onClick={() =>
                                setModal({ open: true, type: "video" })
                              }
                            >
                              <Video className="acc-icon-xs" />
                              <span>Video</span>
                            </div>
                            <div
                              className="acc-content-option"
                              onClick={() =>
                                setModal({ open: true, type: "file" })
                              }
                            >
                              <Paperclip className="acc-icon-xs" />
                              <span>Attach File</span>
                            </div>
                            <div
                              className="acc-content-option"
                              onClick={() =>
                                setModal({ open: true, type: "caption" })
                              }
                            >
                              <Type className="acc-icon-xs" />
                              <span>Captions</span>
                            </div>
                            <div
                              className="acc-content-option"
                              onClick={() =>
                                setModal({ open: true, type: "description" })
                              }
                            >
                              <FileText className="acc-icon-xs" />
                              <span>Description</span>
                            </div>
                            <div
                              className="acc-content-option"
                              onClick={() =>
                                setModal({ open: true, type: "notes" })
                              }
                            >
                              <StickyNote className="acc-icon-xs" />
                              <span>Lecture Notes</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* Add Sections Button */}
                <CustomButton
                  variant="outline"
                  className="acc-add-sections-button"
                  color="primary"
                >
                  <div className="acc-add-sections-container">
                    <Plus className="acc-icon-sm acc-add-icon" />
                    <span>Add Sections</span>
                  </div>
                </CustomButton>
              </div>
              {/* Navigation Buttons */}
              <div className="acc-navigation-buttons">
                <CustomButton
                  variant="outline"
                  className="acc-nav-button"
                  color="transparent"
                >
                  Previous
                </CustomButton>
                <CustomButton className="acc-nav-button acc-nav-button-primary">
                  Save & Next
                </CustomButton>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modal */}
      <Modal
        open={modal.open}
        onClose={() => setModal({ open: false, type: null })}
        title={
          modal.type === "video"
            ? "Lecture Video"
            : modal.type === "file"
            ? "Attach File"
            : modal.type === "caption"
            ? "Add Lecture Caption"
            : modal.type === "description"
            ? "Add Lecture Description"
            : modal.type === "notes"
            ? "Add Lecture Notes"
            : ""
        }
      >
        {renderModalContent()}
      </Modal>
    </div>
  );
}
