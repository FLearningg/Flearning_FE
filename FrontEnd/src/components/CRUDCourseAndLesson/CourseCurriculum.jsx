import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Video,
  BookOpen,
  HelpCircle,
  Clock,
  Check,
  GripVertical,
  ChevronRight,
  FileText,
} from "lucide-react";
import "../../assets/CRUDCourseAndLesson/CourseCurriculum.css";
import ProgressTabs from "./ProgressTabs";
import CustomButton from "../common/CustomButton/CustomButton";
import { toast } from "react-toastify";
import apiClient from "../../services/authService";
import { uploadFile } from "../../services/uploadService";
import { uploadWordQuiz, updateQuiz, linkQuizToCourse } from "../../services/quizService";
import { deleteLessonFile, updateLessonFile } from "../../services/lessonService";
import QuizEditorModal from "./QuizEditorModal";


function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button onClick={onClose} className="modal-close">
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function defaultLesson(order = 1, type = "video") {
  const baseLesson = {
    title: type === "quiz" ? `Quiz ${order}` : `Lesson ${order}`,
    type: type,
    description: "",
    lessonNotes: "",
    order,
    duration: 0,
    captions: "", // Optional captions
  };

  switch (type) {
    case "video":
      return { 
        ...baseLesson, 
        materialUrl: "", // Video URL
        videoUrl: "", // Backward compatibility
        materialFile: null 
      };
    
    case "article":
      return { 
        ...baseLesson, 
        materialUrl: "", // Article URL
        articleUrl: "", // Clear labeling
        materialFile: null 
      };
    
    case "quiz":
      return { 
        ...baseLesson, 
        quizIds: [],
        quizData: null // Will be populated when quiz is created
      };
    
    default:
      return { 
        ...baseLesson, 
        materialUrl: "",
        materialFile: null 
      };
  }
}

export default function CourseCurriculum({
  initialData,
  onNext,
  onPrev,
  completedTabs,
  onTabClick,
  courseId,
}) {
  // Transform backend sections data to frontend format
  const transformSectionsData = (backendSections) => {
    if (!backendSections || !Array.isArray(backendSections) || backendSections.length === 0) {
      return [{ name: "Section 1", order: 1, lessons: [defaultLesson(1)] }];
    }

    return backendSections.map((section, sIdx) => ({
      ...section,
      name: section.name || section.title || `Section ${sIdx + 1}`,
      order: section.order || sIdx + 1,
      lessons: section.lessons?.length > 0 
        ? section.lessons.map((lesson, lIdx) => {
            const transformedLesson = {
              ...lesson,
              title: lesson.title || `Lesson ${lIdx + 1}`,
              type: lesson.type || "video",
              description: lesson.description || "",
              lessonNotes: lesson.lessonNotes || lesson.notes || "",
              order: lesson.order || lIdx + 1,
              duration: lesson.duration || 0,
              captions: lesson.captions || "",
            };

            // Type-specific URL handling and file info
            switch (lesson.type) {
              case "video":
                transformedLesson.materialUrl = lesson.materialUrl || lesson.videoUrl || "";
                transformedLesson.videoUrl = lesson.videoUrl || lesson.materialUrl || ""; // Backward compatibility
                transformedLesson.fileInfo = lesson.fileInfo || null; // File details from backend
                break;
              
              case "article":
                transformedLesson.materialUrl = lesson.materialUrl || lesson.articleUrl || "";
                transformedLesson.articleUrl = lesson.articleUrl || lesson.materialUrl || ""; // Clear labeling
                transformedLesson.fileInfo = lesson.fileInfo || null; // File details from backend
                break;
              
              default:
                transformedLesson.materialUrl = lesson.materialUrl || "";
                transformedLesson.fileInfo = lesson.fileInfo || null;
                break;
            }

            // Handle quiz data if lesson type is quiz
            if (lesson.type === "quiz") {
              if (lesson.quizData) {
                // Use quizData directly from backend
                const backendQuizData = lesson.quizData;
                
                // Transform backend quiz format to frontend format
                const transformedQuestions = backendQuizData.questions?.map(q => ({
                  question: q.content || q.question,
                  options: q.answers?.map(a => a.content) || q.options || [],
                  correctAnswer: q.answers?.findIndex(a => a.isCorrect) || 0,
                  score: q.score || 1
                })) || [];

                transformedLesson.quizData = {
                  _id: backendQuizData._id || lesson.quizIds?.[0],
                  title: backendQuizData.title || lesson.title,
                  description: backendQuizData.description || lesson.description,
                  questions: transformedQuestions,
                  estimatedDuration: backendQuizData.estimatedDuration || 0,
                  roleCreated: backendQuizData.roleCreated || "instructor",
                  userId: backendQuizData.userId,
                  isTemporary: false,
                  backendQuizId: backendQuizData._id || lesson.quizIds?.[0]
                };
              } else if (lesson.quizIds?.length > 0) {
                // Fallback: create basic quiz data structure for old format
                transformedLesson.quizData = {
                  _id: lesson.quizIds[0],
                  title: lesson.title || `Quiz ${lIdx + 1}`,
                  description: lesson.description || "",
                  questions: [], // Will be loaded separately if needed
                  isTemporary: false,
                  backendQuizId: lesson.quizIds[0]
                };
              }
            }

            return transformedLesson;
          })
        : [defaultLesson(1)]
    }));
  };

  const [sections, setSections] = useState(() => 
    transformSectionsData(initialData?.sections)
  );
  const [expandedSections, setExpandedSections] = useState(new Set([0]));
  const [expandedLessons, setExpandedLessons] = useState(new Set());
  const [showLessonTypeDropdown, setShowLessonTypeDropdown] = useState({});
  const [showQuizEditor, setShowQuizEditor] = useState({
    open: false,
    sectionIdx: null,
    lessonIdx: null,
    quizData: null,
  });
  const [isSavingCourse, setIsSavingCourse] = useState(false);

  // Update sections when initialData changes (for course switching)
  useEffect(() => {
    if (initialData?.sections) {
      const transformedSections = transformSectionsData(initialData.sections);
      setSections(transformedSections);
    }
  }, [initialData?.sections]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setShowLessonTypeDropdown({});
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const formatDuration = (seconds) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  const getLessonIcon = (type) => {
    switch (type) {
      case "video":
        return Video;
      case "article":
        return BookOpen;
      case "quiz":
        return HelpCircle;
      default:
        return Video;
    }
  };

  const getLessonProgress = (lesson) => {
    let completed = 0,
      total = 0;

    total++;
    if (lesson.title?.trim()) completed++;
    total++;
    if (lesson.duration > 0) completed++;
    total++;
    if (lesson.description?.trim()) completed++;
    total++;
    if (lesson.lessonNotes?.trim()) completed++;

    if (lesson.type === "video" || lesson.type === "article") {
      total++;
      if (lesson.materialUrl?.trim()) completed++;
    } else if (lesson.type === "quiz") {
      total++;
      if (lesson.quizData && lesson.quizData.questions?.length > 0) completed++;
    }

    return {
      completed,
      total,
      percentage: Math.round((completed / total) * 100),
    };
  };

  const toggleSection = (idx) => {
    const newExpanded = new Set(expandedSections);
    newExpanded.has(idx) ? newExpanded.delete(idx) : newExpanded.add(idx);
    setExpandedSections(newExpanded);
  };

  const toggleLesson = (sIdx, lIdx) => {
    const key = `${sIdx}-${lIdx}`;
    const newExpanded = new Set(expandedLessons);
    newExpanded.has(key) ? newExpanded.delete(key) : newExpanded.add(key);
    setExpandedLessons(newExpanded);
  };

  const handleAddSection = () => {
    setSections((prev) => [
      ...prev,
      {
        name: `Section ${prev.length + 1}`,
        order: prev.length + 1,
        lessons: [defaultLesson(1)],
      },
    ]);
  };

  const handleDeleteSection = (idx) => {
    setSections((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSectionNameChange = (idx, value) => {
    setSections((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, name: value } : s))
    );
  };

  const handleAddLesson = (sIdx, type = "video") => {
    setSections((prev) => {
      const newSections = prev.map((s, i) =>
        i === sIdx
          ? {
              ...s,
              lessons: [
                ...s.lessons,
                defaultLesson(s.lessons.length + 1, type),
              ],
            }
          : s
      );
      return newSections;
    });
    setShowLessonTypeDropdown({});
  };

  const handleDeleteLesson = (sIdx, lIdx) => {
    setSections((prev) =>
      prev.map((s, i) => {
        if (i !== sIdx || s.lessons.length <= 1) return s;
        return { ...s, lessons: s.lessons.filter((_, li) => li !== lIdx) };
      })
    );
  };

  const handleLessonFieldChange = (sIdx, lIdx, field, value) => {
    setSections((prev) =>
      prev.map((s, i) =>
        i === sIdx
          ? {
              ...s,
              lessons: s.lessons.map((l, li) =>
                li === lIdx ? { ...l, [field]: value } : l
              ),
            }
          : s
      )
    );
  };

  // Handle deleting lesson file
  const handleDeleteLessonFile = async (sIdx, lIdx) => {
    const lesson = sections[sIdx].lessons[lIdx];
    
    if (!lesson._id) {
      // For new lessons, just clear the file info
      handleLessonFieldChange(sIdx, lIdx, "materialUrl", "");
      handleLessonFieldChange(sIdx, lIdx, "videoUrl", "");
      handleLessonFieldChange(sIdx, lIdx, "articleUrl", "");
      handleLessonFieldChange(sIdx, lIdx, "fileInfo", null);
      handleLessonFieldChange(sIdx, lIdx, "materialFile", null);
      toast.success("File removed");
      return;
    }

    try {
      await deleteLessonFile(lesson._id);
      
      // Clear file info in state
      handleLessonFieldChange(sIdx, lIdx, "materialUrl", "");
      handleLessonFieldChange(sIdx, lIdx, "videoUrl", "");
      handleLessonFieldChange(sIdx, lIdx, "articleUrl", "");
      handleLessonFieldChange(sIdx, lIdx, "fileInfo", null);
      handleLessonFieldChange(sIdx, lIdx, "materialFile", null);
      
      toast.success("File deleted successfully");
    } catch (error) {
      console.error("Error deleting lesson file:", error);
      toast.error(`Failed to delete file: ${error.message}`);
    }
  };

  // Function to link temporary quizzes to course
  const saveTemporaryQuizzes = async (actualCourseId, sectionsData) => {
    
    if (!actualCourseId) return sectionsData;

    const temporaryQuizzes = [];
    
    // Find all temporary quizzes in sections
    sectionsData.forEach((section, sIdx) => {
      section.lessons.forEach((lesson, lIdx) => {
        
        if (lesson.type === "quiz" && lesson.quizData) {
          // Check if quiz needs to be processed
          const quizId = lesson.quizData._id ? lesson.quizData._id.toString() : "";
          const backendQuizId = lesson.quizData.backendQuizId ? lesson.quizData.backendQuizId.toString() : "";
          
          const isTempId = quizId.startsWith("temp");
          const hasTempBackendId = backendQuizId.startsWith("temp");
          
          // Check if quiz was already saved via quiz editor
          const isAlreadySaved = !lesson.quizData.isTemporary && 
                                !isTempId && 
                                !hasTempBackendId &&
                                lesson.quizData._id &&
                                lesson.quizData._id.length > 15; // Real MongoDB ID
          
          
          // Process quiz only if it's still temporary (not saved yet)
          if ((isTempId || hasTempBackendId) && !isAlreadySaved) {
            temporaryQuizzes.push({
              sectionIdx: sIdx,
              lessonIdx: lIdx,
              sectionId: section._id || section.id,
              lesson: lesson,
              quizData: lesson.quizData
            });
          }
        }
      });
    });

    if (temporaryQuizzes.length === 0) return sectionsData;

    // Process each quiz (save new ones or link existing ones)
    for (const quizInfo of temporaryQuizzes) {
      try {
        let realQuizId = null;

        // Check if quiz has real backend ID (not temp)
        const backendQuizId = quizInfo.quizData.backendQuizId ? quizInfo.quizData.backendQuizId.toString() : "";
        const quizId = quizInfo.quizData._id ? quizInfo.quizData._id.toString() : "";
        
        const hasRealBackendId = backendQuizId && 
          !backendQuizId.startsWith("temp") &&
          backendQuizId !== quizId;
        
        if (hasRealBackendId) {
          // Use linkQuizToCourse API to link existing quiz
          try {
            const linkResponse = await linkQuizToCourse(quizInfo.quizData.backendQuizId, actualCourseId);
            realQuizId = quizInfo.quizData.backendQuizId;
          } catch (linkError) {
            console.error("Failed to link quiz to course:", linkError);
            throw linkError;
          }
        } else {
          // Create new quiz in database using create-from-data API
          
          // Call create-from-data API directly instead of upload-word
          const requestData = {
            title: quizInfo.quizData.title,
            description: quizInfo.quizData.description,
            courseId: actualCourseId,
            questionPoolSize: quizInfo.quizData.questionPoolSize || null, // Add questionPoolSize support
            questions: quizInfo.quizData.questions.map(q => ({
              content: q.question,
              type: "multiple-choice",
              score: q.score || 1,
              answers: q.options.map((option, idx) => ({
                content: option,
                isCorrect: idx === q.correctAnswer
              }))
            })),
            firebaseUrl: quizInfo.quizData.firebaseUrl,
            userId: JSON.parse(localStorage.getItem("currentUser") || "{}")._id,
            sectionId: quizInfo.sectionId,
            autoCreateLesson: 'true'
          };
          
          const response = await apiClient.post("quiz/create-from-data", requestData);
          
          if (response.data.success && response.data.data) {
            realQuizId = response.data.data.quizId;
          } else {
            throw new Error(response.data.message || "Failed to save quiz to database");
          }
        }

        // Update lesson with real quiz ID
        const realQuizData = {
          ...quizInfo.quizData,
          _id: realQuizId,
          isTemporary: false
        };
        
        // Update the lesson in sectionsData
        sectionsData[quizInfo.sectionIdx].lessons[quizInfo.lessonIdx].quizData = realQuizData;
        
      } catch (error) {
        console.error(`Failed to process quiz for lesson ${quizInfo.lesson.title}:`, error);
        toast.error(`Failed to process quiz: ${quizInfo.quizData.title}`);
      }
    }

    if (temporaryQuizzes.length > 0) {
      toast.success(`Successfully saved ${temporaryQuizzes.length} quiz(es) to database!`);
    }
    
    return sectionsData;
  };

  return (
    <div className="cf-app-container">
      <div className="cf-content-area">
        <div className="cf-main-content">
          <ProgressTabs
            activeIndex={2}
            completedTabs={completedTabs}
            onTabClick={onTabClick}
          />
          <div className="cf-form-content">
            <div className="cf-form-header">
              <h2 className="cf-form-title">Course Curriculum</h2>
            </div>
            <div className="curriculum-container">
              <div className="curriculum-header">
                <h2 className="curriculum-title">Course Curriculum</h2>

                {/* Stats Overview */}
                <div className="stats-overview">
                  <div className="stat-item">
                    <div className="stat-number">{sections.length}</div>
                    <div className="stat-label">Sections</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">
                      {sections.reduce((acc, s) => acc + s.lessons.length, 0)}
                    </div>
                    <div className="stat-label">Lessons</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">
                      {formatDuration(
                        sections.reduce(
                          (acc, s) =>
                            acc +
                            s.lessons.reduce(
                              (sum, l) => sum + (l.duration || 0),
                              0
                            ),
                          0
                        )
                      )}
                    </div>
                    <div className="stat-label">Total Duration</div>
                  </div>
                </div>

                {/* Sections List */}
                <div className="sections-container">
                  {sections.map((section, sIdx) => {
                    const isExpanded = expandedSections.has(sIdx);

                    return (
                      <div key={sIdx} className="section-card">
                        {/* Section Header */}
                        <div
                          className="section-header"
                          onClick={() => toggleSection(sIdx)}
                        >
                          <div className="section-left">
                            <ChevronRight
                              size={20}
                              className={`section-chevron ${
                                isExpanded ? "expanded" : ""
                              }`}
                            />
                            <div className="section-info">
                              <div className="section-title-row">
                                <span className="section-number">
                                  Section {sIdx + 1}
                                </span>
                                <input
                                  value={section.name}
                                  onChange={(e) =>
                                    handleSectionNameChange(
                                      sIdx,
                                      e.target.value
                                    )
                                  }
                                  onClick={(e) => e.stopPropagation()}
                                  className="section-title-input"
                                  placeholder="Enter section title..."
                                />
                              </div>
                              <div className="section-meta">
                                {section.lessons.length} lessons ·{" "}
                                {formatDuration(
                                  section.lessons.reduce(
                                    (sum, l) => sum + (l.duration || 0),
                                    0
                                  )
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="section-right">
                            <div className="dropdown-container">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setShowLessonTypeDropdown((prev) => ({
                                      ...prev,
                                      [sIdx]: !prev[sIdx],
                                  }));
                                }}
                                className={`action-button ${
                                  showLessonTypeDropdown[sIdx] ? "active" : ""
                                }`}
                                aria-label="Add lesson"
                              >
                                <Plus size={20} />
                              </button>
                              {showLessonTypeDropdown[sIdx] && (
                                <div
                                  className="lesson-type-dropdown"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {[
                                    {
                                      type: "video",
                                      icon: Video,
                                      label: "Video",
                                    },
                                    {
                                      type: "article",
                                      icon: BookOpen,
                                      label: "Article",
                                    },
                                    {
                                      type: "quiz",
                                      icon: HelpCircle,
                                      label: "Quiz",
                                    },
                                  ].map(({ type, icon: Icon, label }) => (
                                    <button
                                      key={type}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleAddLesson(sIdx, type);
                                      }}
                                      className="dropdown-item"
                                      type="button"
                                    >
                                      <Icon size={16} />
                                      <span>{label}</span>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>

                            {sections.length > 1 && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleDeleteSection(sIdx);
                                }}
                                className="action-button delete"
                                style={{ border: "none", outline: "none" }}
                                aria-label="Delete section"
                              >
                                <Trash2 size={20} />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Lessons */}
                        {isExpanded && (
                          <div className="lessons-container">
                            {section.lessons.map((lesson, lIdx) => {
                              const LessonIcon = getLessonIcon(lesson.type);
                              // const progress = getLessonProgress(lesson); (removed since percentage hidden)
                              const lessonKey = `${sIdx}-${lIdx}`;
                              const isLessonExpanded =
                                expandedLessons.has(lessonKey);

                              return (
                                <div key={lIdx} className="lesson-item">
                                  <div
                                    className="lesson-header"
                                    onClick={() => toggleLesson(sIdx, lIdx)}
                                  >
                                    <div className="lesson-drag-handle">
                                      <GripVertical size={16} />
                                    </div>
                                    <div className="lesson-icon">
                                      <LessonIcon size={20} />
                                    </div>

                                    <div className="lesson-info">
                                      <div className="lesson-title-row">
                                        <span className="lesson-number">
                                          {lesson.type === "quiz"
                                            ? "Quiz"
                                            : "Lesson"}{" "}
                                          {lIdx + 1}
                                        </span>
                                        <input
                                          value={lesson.title}
                                          onChange={(e) =>
                                            handleLessonFieldChange(
                                              sIdx,
                                              lIdx,
                                              "title",
                                              e.target.value
                                            )
                                          }
                                          onClick={(e) => e.stopPropagation()}
                                          className="lesson-title-input"
                                          placeholder="Enter lesson title..."
                                        />
                                      </div>
                                      <div className="lesson-meta">
                                        {lesson.type} ·{" "}
                                        {formatDuration(lesson.duration)}
                                      </div>
                                    </div>

                                    <div className="lesson-actions">
                                      <ChevronRight
                                        size={16}
                                        className={`lesson-chevron ${
                                          isLessonExpanded ? "expanded" : ""
                                        }`}
                                      />
                                      {/* Progress display removed */}
                                      {section.lessons.length > 1 && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteLesson(sIdx, lIdx);
                                          }}
                                          className="action-button delete"
                                        >
                                          <Trash2 size={16} />
                                        </button>
                                      )}
                                    </div>
                                  </div>

                                  {/* Lesson Fields */}
                                  {isLessonExpanded && (
                                    <div className="lesson-fields">
                                      {/* Description */}
                                      <div className="field-card">
                                        <div className="field-header">
                                          <FileText size={16} />
                                          <span className="field-title">
                                            Description
                                          </span>
                                          {lesson.description?.trim() && (
                                            <Check
                                              size={14}
                                              className="field-check"
                                            />
                                          )}
                                        </div>
                                        <textarea
                                          value={lesson.description || ""}
                                          onChange={(e) =>
                                            handleLessonFieldChange(
                                              sIdx,
                                              lIdx,
                                              "description",
                                              e.target.value
                                            )
                                          }
                                          className="field-textarea"
                                          rows={3}
                                          placeholder="Enter lesson description..."
                                        />
                                      </div>

                                      {/* Lesson Notes */}
                                      <div className="field-card">
                                        <div className="field-header">
                                          <BookOpen size={16} />
                                          <span className="field-title">
                                            Lesson Notes
                                          </span>
                                          {lesson.lessonNotes?.trim() && (
                                            <Check
                                              size={14}
                                              className="field-check"
                                            />
                                          )}
                                        </div>
                                        <textarea
                                          value={lesson.lessonNotes || ""}
                                          onChange={(e) =>
                                            handleLessonFieldChange(
                                              sIdx,
                                              lIdx,
                                              "lessonNotes",
                                              e.target.value
                                            )
                                          }
                                          className="field-textarea"
                                          rows={4}
                                          placeholder="Enter lesson notes (supports Markdown)..."
                                        />
                                      </div>

                                      <div className="fields-grid">
                                        {/* Duration */}
                                        <div className="field-card">
                                          <div className="field-header">
                                            <Clock size={16} />
                                            <span className="field-title">
                                              Duration
                                            </span>
                                            {lesson.duration > 0 && (
                                              <Check
                                                size={14}
                                                className="field-check"
                                              />
                                            )}
                                          </div>
                                          <input
                                            type="number"
                                            value={lesson.duration || ""}
                                            onChange={(e) =>
                                              handleLessonFieldChange(
                                                sIdx,
                                                lIdx,
                                                "duration",
                                                parseInt(e.target.value) || 0
                                              )
                                            }
                                            className="field-input"
                                            placeholder="Seconds (e.g. 300)"
                                          />
                                          {lesson.duration > 0 && (
                                            <div className="field-note">
                                              {formatDuration(lesson.duration)}
                                            </div>
                                          )}
                                        </div>

                                        {/* Material File Upload */}
                                        <div className="field-card">
                                          <div className="field-header">
                                            <LessonIcon size={16} />
                                            <span className="field-title">
                                              {lesson.type === "video"
                                                ? "Upload Video"
                                                : lesson.type === "quiz"
                                                ? "Upload Quiz Document"
                                                : "Upload Material"}
                                            </span>
                                            {((lesson.type === "quiz" && lesson.quizData) || 
                                              (lesson.type !== "quiz" && (lesson.materialFile || lesson.fileInfo || lesson.materialUrl))) && (
                                              <Check
                                                size={14}
                                                className="field-check"
                                              />
                                            )}
                                          </div>

                                          {/* Show existing file if available */}
                                          {lesson.type !== "quiz" && (lesson.materialUrl || lesson.videoUrl || lesson.articleUrl) && (
                                            <div className="existing-file-container">
                                              <div className="existing-file-info">
                                                <FileText size={16} />
                                                <span className="file-name">
                                                  {lesson.fileInfo?.fileName || "Uploaded File"}
                                                </span>
                                                {lesson.fileInfo?.uploadedAt && (
                                                  <small className="upload-date">
                                                    Uploaded: {new Date(lesson.fileInfo.uploadedAt).toLocaleDateString()}
                                                  </small>
                                                )}
                                              </div>
                                              <button
                                                type="button"
                                                className="file-remove-btn"
                                                onClick={() => handleDeleteLessonFile(sIdx, lIdx)}
                                                title="Remove file"
                                                style={{
                                                  background: '#dc3545',
                                                  color: 'white',
                                                  border: 'none',
                                                  borderRadius: '4px',
                                                  padding: '8px 10px',
                                                  cursor: 'pointer',
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                  justifyContent: 'center',
                                                  minWidth: '32px',
                                                  minHeight: '32px',
                                                  zIndex: 1000
                                                }}
                                              >
                                                <Trash2 size={16} />
                                              </button>
                                            </div>
                                          )}
                                          
                                          {lesson.type === "quiz" && (
                                            <div className="upload-instructions">
                                              <p>Upload a Word document (.docx) containing your quiz questions</p>
                                              <small>The system will automatically process and extract questions from your document</small>
                                              <div style={{ marginTop: "10px" }}>
                                                <a
                                                  href="https://firebasestorage.googleapis.com/v0/b/flearning-7f88f.firebasestorage.app/o/TempleteQuiz.docx?alt=media&token=ee0e4ca8-9e17-4981-a684-6854086eccfe"
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="template-download-btn"
                                                >
                                                  Download Template
                                                </a>
                                              </div>
                                            </div>
                                          )}
                                          
                                          {/* Show upload input if no file exists or for quiz type */}
                                          {(lesson.type === "quiz" || (!lesson.materialUrl && !lesson.videoUrl && !lesson.articleUrl)) && (
                                            <div>
                                              {lesson.type !== "quiz" && (
                                                <p className="upload-instruction">
                                                  {lesson.type === "video" 
                                                    ? "Choose a video file to upload" 
                                                    : "Choose a file to upload"}
                                                </p>
                                              )}
                                          <input
                                            type="file"
                                            className="field-input file-input"
                                            accept={
                                              lesson.type === "video"
                                                ? "video/*"
                                                    : lesson.type === "quiz"
                                                    ? ".docx,.doc"
                                                : "*"
                                            }
                                            onChange={async (e) => {
                                              const file = e.target.files?.[0];
                                              if (!file) return;

                                              if (lesson.type === "quiz") {
                                                // Quiz upload logic - Parse only, don't save to DB yet
                                                handleLessonFieldChange(sIdx, lIdx, "uploadingQuiz", true);

                                                try {
                                                  // Upload file using uploadService (auto-detects role)
                                                  const uploadResponse = await uploadFile(file, {
                                                    courseId: courseId,
                                                    fileType: "quiz",
                                                  });

                                                  if (!uploadResponse || !uploadResponse.url) {
                                                    throw new Error("Failed to upload quiz file");
                                                  }

                                                  // Create quiz data structure for frontend state only
                                                  const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
                                                  const title = fileName || "Untitled Quiz";
                                                  const description = `Quiz created from ${file.name}`;

                                                  try {
                                                    // Parse Word document to extract quiz questions without saving to database
                                                    const parseResponse = await uploadWordQuiz(file, null, title, description);
                                                    
                                                    if (parseResponse.success && parseResponse.data) {
                                                      // Use parsed quiz data
                                                      const parsedQuiz = parseResponse.data;

                                                      // Extract questions from backend response
                                                      const backendQuestions = 
                                                        parsedQuiz.quizData?.questions || 
                                                        parsedQuiz.questions || 
                                                        parsedQuiz.data?.questions ||
                                                        [];

                                                      // Transform backend questions to frontend format
                                                      const transformedQuestions = backendQuestions.map(q => ({
                                                        question: q.content || q.question,
                                                        options: q.answers ? q.answers.map(a => a.content) : (q.options || []),
                                                        correctAnswer: q.answers ? q.answers.findIndex(a => a.isCorrect) : (q.correctAnswer || 0),
                                                        score: q.score || 1
                                                      }));

                                                      // Check if backend already created a quiz with real ID
                                                      const hasRealQuizId = parsedQuiz.tempQuizId && !parsedQuiz.tempQuizId.startsWith("temp-quiz-");
                                                      
                                                      // Reuse existing quiz ID if lesson already has quiz, otherwise create new
                                                      const existingQuizId = lesson.quizData?._id;
                                                      const quizData = {
                                                        _id: hasRealQuizId ? parsedQuiz.tempQuizId : (existingQuizId || `temp-quiz-${Date.now()}`), // Reuse existing ID
                                                        title: title,
                                                        description: description,
                                                        fileName: file.name,
                                                        firebaseUrl: uploadResponse.url, // ✅ Fixed: uploadService already returns response.data
                                                        isTemporary: !hasRealQuizId, // Not temporary if has real ID
                                                        questions: transformedQuestions,
                                                        questionPoolSize: null, // Default null for Word upload
                                                        estimatedDuration: transformedQuestions.length * 60,
                                                        // Store backend quiz info
                                                        backendQuizId: parsedQuiz.tempQuizId, // Store backend quiz ID
                                                        // Store original file data for later processing
                                                        originalFile: {
                                                          name: file.name,
                                                          size: file.size,
                                                          type: file.type,
                                                          url: uploadResponse.url // ✅ Fixed: uploadService already returns response.data
                                                        }
                                                      };

                                                      // Update lesson with quiz data (state only)
                                                      handleLessonFieldChange(sIdx, lIdx, "quizData", quizData);
                                                      handleLessonFieldChange(sIdx, lIdx, "duration", quizData.estimatedDuration);
                                                      
                                                      // Auto-expand the lesson to show the Edit button
                                                      const lessonKey = `${sIdx}-${lIdx}`;
                                                      setExpandedLessons(prev => new Set([...prev, lessonKey]));
                                                      
                                                      // Mark as newly created for animation
                                                      handleLessonFieldChange(sIdx, lIdx, "newlyCreatedQuiz", true);
                                                      
                                                      // Remove the newly created flag after animation
                                                      setTimeout(() => {
                                                        handleLessonFieldChange(sIdx, lIdx, "newlyCreatedQuiz", false);
                                                      }, 2000);
                                                        
                                                      toast.success(`Quiz parsed successfully! ${quizData.questions.length} questions found. Quiz will be saved when you save the course.`);
                                                      return; // Exit successfully
                                                    }
                                                  } catch (parseError) {
                                                  }

                                                  // Fallback: Create empty quiz structure for manual editing
                                                  // Reuse existing quiz ID if lesson already has quiz, otherwise create new
                                                  const existingQuizId = lesson.quizData?._id;
                                                  const quizData = {
                                                    _id: existingQuizId || `temp-quiz-${Date.now()}`, // Reuse existing ID
                                                    title: title,
                                                    description: description,
                                                    fileName: file.name,
                                                    firebaseUrl: uploadResponse.url, // ✅ Fixed: uploadService already returns response.data
                                                    isTemporary: true, // Mark as temporary (not saved to DB)
                                                    questions: [], // Empty questions for manual editing
                                                    questionPoolSize: null, // Default null for Word upload
                                                    estimatedDuration: 0,
                                                    // Store original file data for later processing
                                                    originalFile: {
                                                      name: file.name,
                                                      size: file.size,
                                                      type: file.type,
                                                      url: uploadResponse.url // ✅ Fixed: uploadService already returns response.data
                                                    }
                                                  };

                                                  // Update lesson with quiz data (state only)
                                                  handleLessonFieldChange(sIdx, lIdx, "quizData", quizData);
                                                  handleLessonFieldChange(sIdx, lIdx, "duration", quizData.estimatedDuration);
                                                  
                                                  // Auto-expand the lesson to show the Edit button
                                                  const lessonKey = `${sIdx}-${lIdx}`;
                                                  setExpandedLessons(prev => new Set([...prev, lessonKey]));
                                                  
                                                  // Mark as newly created for animation
                                                  handleLessonFieldChange(sIdx, lIdx, "newlyCreatedQuiz", true);
                                                  
                                                  // Remove the newly created flag after animation
                                                  setTimeout(() => {
                                                    handleLessonFieldChange(sIdx, lIdx, "newlyCreatedQuiz", false);
                                                  }, 2000);
                                                    
                                                  toast.success(`Quiz document uploaded! ${quizData.questions.length} questions ready. Click Edit to modify questions. Quiz will be saved when you save the course.`);
                                                } catch (error) {
                                                  console.error("Quiz upload error:", error);
                                                  toast.error(error.message || "Failed to upload quiz");
                                                } finally {
                                                  handleLessonFieldChange(sIdx, lIdx, "uploadingQuiz", false);
                                                }
                                              } else {
                                                // Regular file upload logic (video/article)
                                                try {
                                                  if (lesson._id) {
                                                    // Existing lesson - use update API
                                                    const response = await updateLessonFile(lesson._id, file);
                                                    
                                                    if (response.success && response.data) {
                                                      // Update lesson with new file info
                                                      handleLessonFieldChange(sIdx, lIdx, "materialUrl", response.data.materialUrl);
                                                      handleLessonFieldChange(sIdx, lIdx, "videoUrl", response.data.materialUrl);
                                                      handleLessonFieldChange(sIdx, lIdx, "fileInfo", response.data.fileInfo);
                                                      
                                                      toast.success("File updated successfully");
                                                    } else {
                                                      throw new Error(response.message || "Failed to update file");
                                                    }
                                                  } else {
                                                    // New lesson - upload using uploadService (auto-detects role)
                                                    const uploadResponse = await uploadFile(file, {
                                                      courseId: courseId,
                                                      fileType: "lesson",
                                                    });

                                                    if (!uploadResponse || !uploadResponse.url) {
                                                      throw new Error("Failed to upload file");
                                                    }

                                                    // Update lesson with new URL and file info
                                                    handleLessonFieldChange(sIdx, lIdx, "materialUrl", uploadResponse.url);
                                                    handleLessonFieldChange(sIdx, lIdx, "videoUrl", uploadResponse.url);
                                                    handleLessonFieldChange(sIdx, lIdx, "materialFile", file);
                                                    
                                                    // Create temporary file info for display
                                                    const fileInfo = {
                                                      fileName: file.name,
                                                      url: uploadResponse.url,
                                                      uploadedAt: new Date().toISOString(),
                                                      canDelete: true
                                                    };
                                                    handleLessonFieldChange(sIdx, lIdx, "fileInfo", fileInfo);
                                                    
                                                    toast.success("File uploaded successfully");
                                                  }
                                                } catch (error) {
                                                  console.error("File upload error:", error);
                                                  toast.error(error.message || "Failed to upload file");
                                                }
                                              }
                                            }}
                                                disabled={lesson.uploadingQuiz}
                                              />
                                            </div>
                                          )}
                                          {lesson.type === "quiz" ? (
                                            lesson.quizData ? (
                                            <div className="field-note">
                                                Quiz uploaded: {lesson.quizData.questions?.length || 0} questions
                                            </div>
                                            ) : lesson.uploadingQuiz ? (
                                              <div className="field-note">
                                                Processing quiz document...
                                              </div>
                                            ) : null
                                          ) : (
                                            lesson.materialUrl && (
                                              <div className="field-note">
                                                File uploaded successfully
                                              </div>
                                            )
                                          )}
                                        </div>
                                      </div>

                                      {/* Quiz Management */}
                                      {lesson.type === "quiz" && lesson.quizData && (
                                        <div className="field-card field-full">
                                          <div className="field-header">
                                            <HelpCircle size={16} />
                                            <span className="field-title">
                                              Quiz Management
                                            </span>
                                              <Check
                                                size={14}
                                                className="field-check"
                                              />
                                          </div>

                                          {/* Quiz management section when quiz exists */}
                                          <div className="quiz-management-section">
                                            <div className="quiz-info-card">
                                              <div className="quiz-info">
                                                <div className="quiz-title">
                                                  {lesson.quizData.title || "Untitled Quiz"}
                                                </div>
                                                <div className="quiz-meta">
                                                  {lesson.quizData.questions?.length || 0} questions
                                                  {lesson.quizData.estimatedDuration && (
                                                    <> · {formatDuration(lesson.quizData.estimatedDuration)}</>
                                                  )}
                                                </div>
                                                <div className="quiz-description">
                                                  {lesson.quizData.description || "No description provided"}
                                                </div>
                                          </div>

                                              <div className="curriculum-quiz-actions">
                                          <button
                                                  type="button"
                                                  onClick={() => {
                                                    setShowQuizEditor({
                                                open: true,
                                                sectionIdx: sIdx,
                                                lessonIdx: lIdx,
                                                      quizData: lesson.quizData
                                                    });
                                                  }}
                                                  className={`curriculum-quiz-edit-btn ${lesson.newlyCreatedQuiz ? 'newly-created' : ''}`}
                                                  title="Edit Quiz"
                                                >
                                                  <FileText size={18} />
                                          </button>

                                                      <button
                                                  type="button"
                                                        onClick={() => {
                                                    if (window.confirm("Are you sure you want to remove this quiz? This action cannot be undone.")) {
                                                      handleLessonFieldChange(sIdx, lIdx, "quizData", null);
                                                      handleLessonFieldChange(sIdx, lIdx, "duration", 0);
                                                    }
                                                  }}
                                                  className="curriculum-quiz-remove-btn"
                                                >
                                                  <Trash2 size={16} />
                                                      </button>
                                                    </div>
                                            </div>
                                            </div>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Add Section Button */}
                  <button
                    onClick={handleAddSection}
                    className="add-section-button"
                  >
                    <Plus size={20} />
                    <span>Add New Section</span>
                  </button>
                  <div className="acc-navigation-buttons">
                    <CustomButton
                      color="transparent"
                      type="normal"
                      size="large"
                      onClick={() => onPrev({ sections })}
                    >
                      Previous
                    </CustomButton>
                    <CustomButton
                      color="primary"
                      type="normal"
                      size="large"
                      onClick={async () => {
                        if (isSavingCourse) return; // Prevent multiple clicks
                        
                        setIsSavingCourse(true);
                        try {
                          // Save temporary quizzes to database if courseId is available
                          let updatedSections = sections;
                          if (courseId && courseId !== "undefined" && courseId !== "null") {
                            updatedSections = await saveTemporaryQuizzes(courseId, sections);
                          }
                          onNext({ sections: updatedSections });
                        } catch (error) {
                          console.error("Error saving course:", error);
                          toast.error("Failed to save course");
                        } finally {
                          setIsSavingCourse(false);
                        }
                      }}
                      disabled={isSavingCourse}
                    >
                      Next
                    </CustomButton>
                  </div>
                </div>
              </div>

              {/* Quiz Editor Modal */}
              <QuizEditorModal
                isOpen={showQuizEditor.open}
                onClose={() =>
                  setShowQuizEditor({
                    open: false,
                    sectionIdx: null,
                    lessonIdx: null,
                    quizData: null,
                  })
                }
                quizData={showQuizEditor.quizData}
                sectionIdx={showQuizEditor.sectionIdx}
                lessonIdx={showQuizEditor.lessonIdx}
                onQuizUpdate={(sectionIdx, lessonIdx, updatedQuizData) => {
                  handleLessonFieldChange(sectionIdx, lessonIdx, "quizData", updatedQuizData);
                }}
              />
                            </div>
                            </div>
                          </div>
      </div>
    </div>
  );
}
