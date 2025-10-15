import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Video,
  BookOpen,
  HelpCircle,
  Clock,
  Upload,
  Check,
  GripVertical,
  ChevronRight,
  FileText,
  X,
} from "lucide-react";
import "../../assets/CRUDCourseAndLesson/CourseCurriculum.css";
import ProgressTabs from "./ProgressTabs";
import CustomButton from "../common/CustomButton/CustomButton";

// Mock quiz data - Replace with API call later
const MOCK_QUIZZES = [
  {
    _id: "quiz1",
    title: "Introduction to JavaScript Quiz",
    questions: 10,
    duration: 600,
  },
  {
    _id: "quiz2",
    title: "React Fundamentals Assessment",
    questions: 15,
    duration: 900,
  },
  {
    _id: "quiz3",
    title: "Advanced CSS Techniques",
    questions: 8,
    duration: 480,
  },
  { _id: "quiz4", title: "Node.js Backend Quiz", questions: 12, duration: 720 },
  {
    _id: "quiz5",
    title: "Database Design Principles",
    questions: 10,
    duration: 600,
  },
];

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
    title: `Lesson ${order}`,
    type: type,
    description: "",
    lessonNotes: "",
    order,
    duration: 0,
  };

  switch (type) {
    case "video":
    case "article":
      return { ...baseLesson, materialFile: null };
    case "quiz":
      return { ...baseLesson, title: `Quiz ${order}`, quizIds: [] };
    default:
      return { ...baseLesson, materialFile: null };
  }
}

export default function CourseCurriculum({
  initialData,
  onNext,
  onPrev,
  completedTabs,
  onTabClick,
}) {
  const [sections, setSections] = useState(
    initialData?.sections?.length > 0
      ? initialData.sections
      : [{ name: "Section 1", order: 1, lessons: [defaultLesson(1)] }]
  );
  const [expandedSections, setExpandedSections] = useState(new Set([0]));
  const [expandedLessons, setExpandedLessons] = useState(new Set());
  const [showLessonTypeDropdown, setShowLessonTypeDropdown] = useState({});
  const [showQuizSelector, setShowQuizSelector] = useState({
    open: false,
    sectionIdx: null,
    lessonIdx: null,
  });
  const [availableQuizzes] = useState(MOCK_QUIZZES);

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
      if (lesson.quizIds?.length > 0) completed++;
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
    console.log("handleAddLesson called with sIdx:", sIdx, "type:", type);
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
      console.log("New sections:", newSections);
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
                                  console.log(
                                    "Toggling dropdown for section:",
                                    sIdx
                                  );
                                  console.log(
                                    "Current state:",
                                    showLessonTypeDropdown
                                  );
                                  setShowLessonTypeDropdown((prev) => {
                                    const newState = {
                                      ...prev,
                                      [sIdx]: !prev[sIdx],
                                    };
                                    console.log("New state:", newState);
                                    return newState;
                                  });
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
                                        console.log(
                                          "Adding lesson of type:",
                                          type,
                                          "to section:",
                                          sIdx
                                        );
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
                                                : "Upload Material"}
                                            </span>
                                            {lesson.materialFile && (
                                              <Check
                                                size={14}
                                                className="field-check"
                                              />
                                            )}
                                          </div>
                                          <input
                                            type="file"
                                            className="field-input file-input"
                                            accept={
                                              lesson.type === "video"
                                                ? "video/*"
                                                : "*"
                                            }
                                            onChange={(e) => {
                                              const file =
                                                e.target.files?.[0] || null;
                                              handleLessonFieldChange(
                                                sIdx,
                                                lIdx,
                                                "materialFile",
                                                file
                                              );
                                            }}
                                          />
                                          {lesson.materialFile && (
                                            <div className="field-note">
                                              {lesson.materialFile.name}
                                            </div>
                                          )}
                                        </div>
                                      </div>

                                      {/* Quiz Selection */}
                                      {lesson.type === "quiz" && (
                                        <div className="field-card field-full">
                                          <div className="field-header">
                                            <HelpCircle size={16} />
                                            <span className="field-title">
                                              Quiz Selection
                                            </span>
                                            {lesson.quizIds?.length > 0 && (
                                              <Check
                                                size={14}
                                                className="field-check"
                                              />
                                            )}
                                          </div>

                                          <button
                                            onClick={() =>
                                              setShowQuizSelector({
                                                open: true,
                                                sectionIdx: sIdx,
                                                lessonIdx: lIdx,
                                              })
                                            }
                                            className="quiz-selector-button"
                                          >
                                            <Plus size={16} />
                                            Select Quizzes
                                          </button>

                                          {lesson.quizIds?.length > 0 ? (
                                            <div className="quiz-list">
                                              {lesson.quizIds.map(
                                                (qId, idx) => {
                                                  const quiz =
                                                    availableQuizzes.find(
                                                      (q) => q._id === qId
                                                    );
                                                  return (
                                                    <div
                                                      key={idx}
                                                      className="quiz-item"
                                                    >
                                                      <div className="quiz-info">
                                                        <div className="quiz-title">
                                                          {quiz?.title ||
                                                            `Quiz ${qId}`}
                                                        </div>
                                                        {quiz && (
                                                          <div className="quiz-meta">
                                                            {quiz.questions}{" "}
                                                            questions ·{" "}
                                                            {formatDuration(
                                                              quiz.duration
                                                            )}
                                                          </div>
                                                        )}
                                                      </div>
                                                      <button
                                                        onClick={() => {
                                                          const newQuizIds =
                                                            lesson.quizIds.filter(
                                                              (_, i) =>
                                                                i !== idx
                                                            );
                                                          handleLessonFieldChange(
                                                            sIdx,
                                                            lIdx,
                                                            "quizIds",
                                                            newQuizIds
                                                          );
                                                        }}
                                                        className="quiz-remove"
                                                      >
                                                        <X size={16} />
                                                      </button>
                                                    </div>
                                                  );
                                                }
                                              )}
                                            </div>
                                          ) : (
                                            <div className="empty-state">
                                              No quizzes selected. Click "Select
                                              Quizzes" to add.
                                            </div>
                                          )}
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
                      onClick={() => onNext({ sections })}
                    >
                      Next
                    </CustomButton>
                  </div>
                </div>
              </div>

              {/* Quiz Selector Modal */}
              <Modal
                open={showQuizSelector.open}
                onClose={() =>
                  setShowQuizSelector({
                    open: false,
                    sectionIdx: null,
                    lessonIdx: null,
                  })
                }
                title="Select Quizzes"
              >
                <div className="modal-body">
                  {availableQuizzes.map((quiz) => {
                    const currentLesson =
                      showQuizSelector.sectionIdx !== null &&
                      showQuizSelector.lessonIdx !== null
                        ? sections[showQuizSelector.sectionIdx]?.lessons[
                            showQuizSelector.lessonIdx
                          ]
                        : null;
                    const isSelected = currentLesson?.quizIds?.includes(
                      quiz._id
                    );

                    return (
                      <div
                        key={quiz._id}
                        onClick={() => {
                          const sIdx = showQuizSelector.sectionIdx;
                          const lIdx = showQuizSelector.lessonIdx;
                          if (sIdx !== null && lIdx !== null) {
                            const currentQuizIds = currentLesson?.quizIds || [];
                            const newQuizIds = isSelected
                              ? currentQuizIds.filter((id) => id !== quiz._id)
                              : [...currentQuizIds, quiz._id];
                            // Update quizIds
                            handleLessonFieldChange(
                              sIdx,
                              lIdx,
                              "quizIds",
                              newQuizIds
                            );
                            // Calculate total duration from selected quizzes
                            const totalSec = newQuizIds.reduce((sum, id) => {
                              const q = availableQuizzes.find(
                                (q) => q._id === id
                              );
                              return sum + (q?.duration || 0);
                            }, 0);
                            handleLessonFieldChange(
                              sIdx,
                              lIdx,
                              "duration",
                              totalSec
                            );
                          }
                        }}
                        className={`quiz-option ${
                          isSelected ? "selected" : ""
                        }`}
                      >
                        <div className="quiz-option-content">
                          <div className="quiz-option-info">
                            <div className="quiz-option-title">
                              {quiz.title}
                            </div>
                            <div className="quiz-option-meta">
                              {quiz.questions} questions ·{" "}
                              {formatDuration(quiz.duration)} duration
                            </div>
                          </div>
                          {isSelected && (
                            <div className="quiz-option-check">
                              <Check size={14} style={{ color: "white" }} />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="modal-footer">
                  <button
                    onClick={() =>
                      setShowQuizSelector({
                        open: false,
                        sectionIdx: null,
                        lessonIdx: null,
                      })
                    }
                    className="modal-button"
                  >
                    Done
                  </button>
                </div>
              </Modal>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
