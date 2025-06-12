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

export default function CourseCurriculum() {
  const [expandedLecture, setExpandedLecture] = useState(1);

  const toggleLecture = (index) => {
    setExpandedLecture(expandedLecture === index ? null : index);
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
                            <div className="acc-content-option">
                              <Video className="acc-icon-xs" />
                              <span>Video</span>
                            </div>
                            <div className="acc-content-option">
                              <Paperclip className="acc-icon-xs" />
                              <span>Attach File</span>
                            </div>
                            <div className="acc-content-option">
                              <Type className="acc-icon-xs" />
                              <span>Captions</span>
                            </div>
                            <div className="acc-content-option">
                              <FileText className="acc-icon-xs" />
                              <span>Description</span>
                            </div>
                            <div className="acc-content-option">
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
                            <div className="acc-content-option">
                              <Video className="acc-icon-xs" />
                              <span>Video</span>
                            </div>
                            <div className="acc-content-option">
                              <Paperclip className="acc-icon-xs" />
                              <span>Attach File</span>
                            </div>
                            <div className="acc-content-option">
                              <Type className="acc-icon-xs" />
                              <span>Captions</span>
                            </div>
                            <div className="acc-content-option">
                              <FileText className="acc-icon-xs" />
                              <span>Description</span>
                            </div>
                            <div className="acc-content-option">
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
    </div>
  );
}
