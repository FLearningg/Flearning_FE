import React, { useState } from "react";
import "../../assets/WatchCourse/CourseContents.css";
import { FaQuestionCircle } from "react-icons/fa";

const CourseContents = ({
  contents,
  currentLesson,
  progress,
  onSelectLesson,
}) => {
  const [expandedSections, setExpandedSections] = useState(new Set([0])); // First section expanded by default

  const toggleSection = (index) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <div className="watchcourse-course-contents">
      <div className="watchcourse-course-contents-header">
        <h2>Course Contents</h2>
        <div className="watchcourse-progress-info">
          <div className="watchcourse-progress-bar">
            <div
              className="watchcourse-progress-fill"
              style={{ width: `${progress || 0}%` }}
            />
          </div>
          <span>{progress || 0}% Completed</span>
        </div>
      </div>

      <div className="watchcourse-sections-list">
        {contents?.map((section, index) => (
          <div key={section._id || index} className="watchcourse-section">
            <div
              className="watchcourse-section-header"
              onClick={() => toggleSection(index)}
            >
              <div className="watchcourse-section-title">
                <span className="watchcourse-section-arrow">
                  {expandedSections.has(index) ? "▾" : "▸"}
                </span>
                <span className="watchcourse-section-name">
                  {section.title || "Untitled Section"}
                </span>
              </div>
            </div>

            <div
              className={`watchcourse-lectures-list ${
                expandedSections.has(index) ? "expanded" : ""
              }`}
            >
              {section.lectures?.map((lecture, lectureIndex) => {
                const isLocked = !!lecture.locked && !lecture.completed;
                return (
                  <React.Fragment
                    key={lecture.id || lecture._id || lectureIndex}
                  >
                    <div
                      className={`watchcourse-lecture ${
                        ((currentLesson?._id || currentLesson?.id) === lecture.id) ? "active" : ""
                      } ${lecture.completed ? "completed" : ""} ${isLocked ? "locked" : ""}`}
                      onClick={() => !isLocked && onSelectLesson(lecture)}
                    >
                      <div className="watchcourse-lecture-info">
                        <div className="watchcourse-lecture-status-title">
                          <label className="custom-checkbox-label">
                            <input
                              type="checkbox"
                              checked={!!lecture.completed}
                              onChange={(e) => e.stopPropagation()}
                              className="watchcourse-lecture-checkbox"
                            />
                            <span className="custom-checkbox"></span>
                          </label>
                          <span className="watchcourse-lecture-title">{lecture.title}</span>
                        </div>
                        <div className={"watchcourse-lecture-duration"}>
                          {lecture.type !== "quiz" ? (
                            currentLesson?.id === lecture.id ? (
                              <span className="watchcourse-now-playing">▐▐</span>
                            ) : (
                              <span className="watchcourse-play-icon">▶</span>
                            )
                          ) : null}
                          {(() => {
                            if (lecture.type === "quiz") {
                              const count =
                                lecture.questionsCount ||
                                (Array.isArray(lecture.questions) ? lecture.questions.length : 0) ||
                                (lecture.quizData?.questions?.length || 0) ||
                                (lecture.quiz?.questionsCount || 0) ||
                                (lecture.quizQuestionsCount || 0);
                              return <span>{count > 0 ? `${count} questions` : ""}</span>;
                            }
                            return <span>{lecture.duration || ""}</span>;
                          })()}
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseContents;
