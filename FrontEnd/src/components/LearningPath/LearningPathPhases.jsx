import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiClock,
  FiStar,
  FiArrowRight,
  FiBookOpen,
  FiZap,
  FiBook,
  FiTarget,
} from "react-icons/fi";
import "../../assets/LearningPath/LearningPathPhases.css";

const LearningPathPhases = ({ learningPath }) => {
  const navigate = useNavigate();
  const [expandedPhase, setExpandedPhase] = useState(0);

  if (!learningPath) {
    return null;
  }

  const { phases, pathSummary } = learningPath;

  // If backend did not return phases but provided recommendedCourses,
  // create a synthetic single phase so the UI can display recommended courses.
  const displayPhases =
    phases && phases.length > 0
      ? phases
      : learningPath.recommendedCourses &&
        learningPath.recommendedCourses.length > 0
      ? [
          {
            // Use a neutral title for the synthetic phase
            title: "Recommended for you",
            phaseRationale: learningPath.learningGoal || "Recommended courses",
            description:
              learningPath.pathSummary?.skillsCovered
                ?.map((s) => s.name)
                .join(", ") || "",
            courses: learningPath.recommendedCourses,
          },
        ]
      : [];

  const togglePhase = (index) => {
    setExpandedPhase(expandedPhase === index ? -1 : index);
  };

  const handleViewCourse = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  const formatDuration = (hours) => {
    if (!hours) return "N/A";
    if (hours < 1) return `${Math.round(hours * 60)} minutes`;
    return `${hours.toFixed(1)} hours`;
  };

  const formatPhaseTime = (phase) => {
    // Use AI-generated estimatedTime format (e.g., "4 tuần", "1 tháng")
    if (phase.estimatedTime) {
      return phase.estimatedTime;
    }

    // Fallback to weeks if estimatedTime not available
    if (phase.estimatedWeeks) {
      return `${phase.estimatedWeeks} tuần`;
    }

    // Last resort: calculate from totalHours
    if (phase.totalHours) {
      const weeks = Math.ceil(phase.totalHours / 5.5);
      return `~${weeks} tuần`;
    }

    return "Not estimated";
  };

  const formatPrice = (price) => {
    if (!price || price === 0) return "Free";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Calculate total hours from all phases
  const calculateTotalHours = () => {
    if (!displayPhases || displayPhases.length === 0) return 0;

    return displayPhases.reduce((total, phase) => {
      // If backend provides totalHours, use it
      if (phase.totalHours && phase.totalHours > 0) {
        return total + phase.totalHours;
      }

      // Otherwise, calculate from courses
      if (phase.courses && phase.courses.length > 0) {
        const phaseHours = phase.courses.reduce((sum, courseRec) => {
          // Try estimatedHours first
          if (courseRec.estimatedHours && courseRec.estimatedHours > 0) {
            return sum + courseRec.estimatedHours;
          }

          // Fallback: parse duration from course.duration (e.g., "10", "25h", "10h 30m")
          if (courseRec.courseId?.duration) {
            const duration = courseRec.courseId.duration;
            const hours = parseFloat(duration);
            if (!isNaN(hours)) {
              return sum + hours;
            }
          }

          return sum;
        }, 0);

        return total + phaseHours;
      }

      return total;
    }, 0);
  };

  // Calculate hours for a single phase
  const calculatePhaseHours = (phase) => {
    // If backend provides totalHours, use it
    if (phase.totalHours && phase.totalHours > 0) {
      return phase.totalHours;
    }

    // Otherwise, calculate from courses
    if (phase.courses && phase.courses.length > 0) {
      return phase.courses.reduce((sum, courseRec) => {
        // Try estimatedHours first
        if (courseRec.estimatedHours && courseRec.estimatedHours > 0) {
          return sum + courseRec.estimatedHours;
        }

        // Fallback: parse duration from course.duration
        if (courseRec.courseId?.duration) {
          const duration = courseRec.courseId.duration;
          const hours = parseFloat(duration);
          if (!isNaN(hours)) {
            return sum + hours;
          }
        }

        return sum;
      }, 0);
    }

    return 0;
  };

  return (
    <div className="f-lp-phases-container">
      {/* Path Title */}
      <div className="f-lp-phases-header">
        <h2>{learningPath.pathTitle || "Learning Path"}</h2>
        {learningPath.learningGoal && (
          <p className="f-lp-phases-goal">
            <FiTarget size={20} />
            {learningPath.learningGoal}
          </p>
        )}
      </div>

      {/* Summary */}
      {pathSummary && (
        <div className="f-lp-phases-summary">
          <div className="f-lp-summary-stat">
            <FiBookOpen className="f-lp-stat-icon" />
            <div>
              <div className="f-lp-stat-value">{phases.length} phases</div>
              <div className="f-lp-stat-label">Phases</div>
            </div>
          </div>
          <div className="f-lp-summary-stat">
            <FiClock className="f-lp-stat-icon" />
            <div>
              <div className="f-lp-stat-value">{calculateTotalHours()}h</div>
              <div className="f-lp-stat-label">Total duration</div>
            </div>
          </div>
          <div className="f-lp-summary-stat">
            <FiStar className="f-lp-stat-icon" />
            <div>
              <div className="f-lp-stat-value">
                {pathSummary.totalCourses} courses
              </div>
              <div className="f-lp-stat-label">Total Courses</div>
            </div>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="f-lp-phases-timeline">
        {displayPhases.map((phase, phaseIndex) => (
          <div key={phaseIndex} className="f-lp-phase-item">
            {/* Phase Header */}
            <div
              className={`f-lp-phase-header ${
                expandedPhase === phaseIndex ? "expanded" : ""
              }`}
              onClick={() => togglePhase(phaseIndex)}
            >
              <div className="f-lp-phase-marker">
                <div className="f-lp-phase-number">{phaseIndex + 1}</div>
                {phaseIndex < phases.length - 1 && (
                  <div className="f-lp-phase-line" />
                )}
              </div>

              <div className="f-lp-phase-info">
                {/* Phase heading: AI-generated title from API */}
                <h3 className="f-lp-phase-title">
                  {phase.title || `Phase ${phaseIndex + 1}`}
                </h3>

                {/* Phase Rationale - AI-generated explanation (yellow highlight) */}
                {phase.phaseRationale && (
                  <div className="f-lp-phase-rationale">
                    <span className="f-lp-rationale-icon">
                      <FiZap size={18} />
                    </span>
                    <p>{phase.phaseRationale}</p>
                  </div>
                )}

                {/* Phase Description - skills covered */}
                {phase.description && (
                  <p className="f-lp-phase-desc">{phase.description}</p>
                )}

                <div className="f-lp-phase-meta">
                  <span className="f-lp-phase-duration">
                    <FiClock size={14} />
                    {formatPhaseTime(phase)}
                  </span>
                  {(() => {
                    const phaseHours = calculatePhaseHours(phase);
                    return phaseHours > 0 ? (
                      <span className="f-lp-phase-hours">
                        <FiClock size={14} />
                        {phaseHours}h
                      </span>
                    ) : null;
                  })()}
                  <span className="f-lp-phase-courses">
                    <FiBook size={14} />
                    {phase.courses.length} khóa học
                  </span>
                </div>
              </div>

              <button className="f-lp-phase-toggle">
                <FiArrowRight
                  className={expandedPhase === phaseIndex ? "rotated" : ""}
                />
              </button>
            </div>

            {/* Phase Courses */}
            {expandedPhase === phaseIndex && (
              <div className="f-lp-phase-courses-list">
                {phase.courses.map((courseRec, courseIndex) => {
                  const course = courseRec.courseId;
                  return (
                    <div key={courseIndex} className="f-lp-phase-course-card">
                      {/* Course Order */}
                      <div className="f-lp-course-order">
                        {phaseIndex + 1}.{courseIndex + 1}
                      </div>

                      {/* Thumbnail */}
                      <div className="f-lp-phase-course-thumb">
                        <img src={course.thumbnail} alt={course.title} />
                        {courseRec.matchScore && (
                          <div className="f-lp-phase-match-badge">
                            {courseRec.matchScore}% phù hợp
                          </div>
                        )}
                      </div>

                      {/* Course Info */}
                      <div className="f-lp-phase-course-info">
                        <h4 className="f-lp-phase-course-title">
                          {course.title}
                        </h4>
                        {course.subTitle && (
                          <p className="f-lp-phase-course-subtitle">
                            {course.subTitle}
                          </p>
                        )}

                        {/* Reason */}
                        {courseRec.reason && (
                          <div className="f-lp-phase-course-reason">
                            <strong>Lý do:</strong> {courseRec.reason}
                          </div>
                        )}

                        {/* Meta */}
                        <div className="f-lp-phase-course-meta">
                          <span>
                            <FiClock size={14} />
                            {course.duration ||
                              formatDuration(courseRec.estimatedHours)}
                          </span>
                          {course.level && (
                            <span className="f-lp-phase-level">
                              {course.level === "beginner" && "Beginner"}
                              {course.level === "intermediate" &&
                                "Intermediate"}
                              {course.level === "advanced" && "Advanced"}
                            </span>
                          )}
                          {course.rating && (
                            <span>
                              <FiStar size={14} />
                              {course.rating.toFixed(1)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="f-lp-phase-course-actions">
                        <div className="f-lp-phase-course-price">
                          {formatPrice(course.price)}
                        </div>
                        <button
                          className="f-lp-phase-course-btn"
                          onClick={() => handleViewCourse(course._id)}
                        >
                          View course
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningPathPhases;
