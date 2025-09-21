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
                // Thêm quiz sau mỗi bài học (trừ bài cuối cùng của section)
                const isLastLecture =
                  lectureIndex === section.lectures.length - 1;
                const quizData = {
                  id: `quiz_${lecture.id}`,
                  title: `Quiz: ${lecture.title}`,
                  type: "quiz",
                  questions: [
                    {
                      id: 1,
                      question: "Sample question 1?",
                      options: ["Option A", "Option B", "Option C", "Option D"],
                      correctAnswer: 0,
                    },
                    {
                      id: 2,
                      question: "Sample question 2?",
                      options: ["Option A", "Option B", "Option C", "Option D"],
                      correctAnswer: 1,
                    },
                  ],
                };

                return (
                  <React.Fragment
                    key={lecture.id || lecture._id || lectureIndex}
                  >
                    <div
                      className={`watchcourse-lecture ${
                        currentLesson?.id === lecture.id ? "active" : ""
                      } ${lecture.completed ? "completed" : ""}`}
                      onClick={() => onSelectLesson(lecture)}
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
                          <span className="watchcourse-lecture-title">
                            {lecture.title}
                          </span>
                        </div>
                        <div className="watchcourse-lecture-duration">
                          {currentLesson?.id === lecture.id ? (
                            <span className="watchcourse-now-playing">▐▐</span>
                          ) : (
                            <span className="watchcourse-play-icon">▶</span>
                          )}
                          <span>{lecture.duration || ""}</span>
                        </div>
                      </div>
                    </div>

                    {!isLastLecture && (
                      <div
                        className={`watchcourse-lecture quiz-item ${
                          currentLesson?.id === quizData.id ? "active" : ""
                        } ${lecture.quizCompleted ? "completed" : ""}`}
                        onClick={() => onSelectLesson(quizData)}
                      >
                        <div className="watchcourse-lecture-info">
                          <div className="watchcourse-lecture-status-title">
                            <label className="custom-checkbox-label">
                              <input
                                type="checkbox"
                                checked={!!lecture.quizCompleted}
                                onChange={(e) => e.stopPropagation()}
                                className="watchcourse-lecture-checkbox"
                              />
                              <span className="custom-checkbox"></span>
                            </label>
                            <span className="watchcourse-lecture-title quiz-title">
                              <FaQuestionCircle className="quiz-icon" />
                              {quizData.title}
                            </span>
                          </div>
                          <div className="watchcourse-lecture-duration quiz-duration">
                            <span>5 questions</span>
                          </div>
                        </div>
                      </div>
                    )}
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
