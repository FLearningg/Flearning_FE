import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiRefreshCw, FiTarget, FiClipboard } from "react-icons/fi";
import {
  fetchLearningPath,
  openSurveyModal,
} from "../../store/learningPathSlice";
import LearningPathPhases from "./LearningPathPhases";
import SurveyModal from "./SurveyModal";
import "../../assets/LearningPath/LearningPathDisplay.css";

const LearningPathDisplay = () => {
  const dispatch = useDispatch();
  const { learningPath, pathLoading, pathError } = useSelector(
    (state) => state.learningPath
  );

  // Fetch learning path on mount
  useEffect(() => {
    dispatch(fetchLearningPath()).catch((error) => {
      console.log("📋 No learning path found, showing empty state");
      // If no path exists (404), do nothing (user needs to create one)
    });
  }, [dispatch]);

  // Handle regenerate
  const handleRegenerate = async () => {
    // Instead of regenerating immediately, open the survey modal so the
    // user can retake the survey and produce a different learning path.
    dispatch(openSurveyModal());
  };

  // Loading state - Show skeleton
  if (pathLoading && !learningPath) {
    return (
      <div className="f-lp-container">
        {/* Skeleton Header */}
        <div className="f-lp-header">
          <div className="f-lp-header-content">
            <div className="f-lp-skeleton f-lp-skeleton-title" />
            <div className="f-lp-skeleton f-lp-skeleton-subtitle" />
          </div>
          <div className="f-lp-header-actions">
            <div className="f-lp-skeleton f-lp-skeleton-button" />
          </div>
        </div>

        {/* Skeleton Summary Cards */}
        <div className="f-lp-summary-cards">
          <div className="f-lp-summary-card">
            <div className="f-lp-skeleton f-lp-skeleton-icon" />
            <div className="f-lp-skeleton f-lp-skeleton-text" />
            <div className="f-lp-skeleton f-lp-skeleton-label" />
          </div>
          <div className="f-lp-summary-card">
            <div className="f-lp-skeleton f-lp-skeleton-icon" />
            <div className="f-lp-skeleton f-lp-skeleton-text" />
            <div className="f-lp-skeleton f-lp-skeleton-label" />
          </div>
          <div className="f-lp-summary-card">
            <div className="f-lp-skeleton f-lp-skeleton-icon" />
            <div className="f-lp-skeleton f-lp-skeleton-text" />
            <div className="f-lp-skeleton f-lp-skeleton-label" />
          </div>
        </div>

        {/* Skeleton Phases */}
        <div className="f-lp-phases-container">
          {[1, 2, 3].map((i) => (
            <div key={i} className="f-lp-phase-card">
              <div className="f-lp-phase-header">
                <div className="f-lp-skeleton f-lp-skeleton-phase-number" />
                <div className="f-lp-skeleton f-lp-skeleton-phase-title" />
              </div>
              <div className="f-lp-skeleton f-lp-skeleton-phase-description" />
              <div className="f-lp-phase-meta">
                <div className="f-lp-skeleton f-lp-skeleton-meta" />
                <div className="f-lp-skeleton f-lp-skeleton-meta" />
                <div className="f-lp-skeleton f-lp-skeleton-meta" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (pathError && !learningPath) {
    return (
      <>
        <div className="f-lp-error">
          <h3>Unable to load learning path</h3>
          <p>{pathError}</p>
          <button
            className="f-lp-btn f-lp-btn-primary"
            onClick={() => dispatch(openSurveyModal())}
          >
            <FiClipboard /> Create new path
          </button>
        </div>
        <SurveyModal />
      </>
    );
  }

  // No path exists yet
  if (!learningPath) {
    return (
      <>
        <div className="f-lp-empty">
          <div className="f-lp-empty-icon">
            <FiTarget size={64} />
          </div>
          <h2>No learning path yet</h2>
          <p>
            Start the survey so AI can generate a personalized learning path for
            you, or create one manually.
          </p>
          <div className="f-lp-empty-actions">
            <button
              className="f-lp-btn f-lp-btn-primary"
              onClick={() => {
                console.log("🔵 Opening Survey Modal...");
                dispatch(openSurveyModal());
              }}
            >
              <FiClipboard /> Start survey
            </button>
          </div>
        </div>
        <SurveyModal />
      </>
    );
  }

  // Display learning path with phases
  return (
    <div className="f-lp-container">
      {/* Header Actions */}
      <div className="f-lp-header">
        <div className="f-lp-header-content">
          <h1>
            <FiTarget size={36} />
            Learning Path
          </h1>
          <p className="f-lp-subtitle">
            A structured path split into clear phases and learning steps
          </p>
        </div>
        <div className="f-lp-header-actions">
          <button
            className="f-lp-btn f-lp-btn-primary"
            onClick={handleRegenerate}
            disabled={pathLoading}
          >
            <FiRefreshCw />
            {pathLoading ? "Regenerating..." : "Regenerate path"}
          </button>
        </div>
      </div>

      {/* Show skeleton overlay when regenerating */}
      {pathLoading && learningPath ? (
        <div className="f-lp-skeleton-overlay">
          {/* Skeleton Summary Cards */}
          <div className="f-lp-summary-cards">
            <div className="f-lp-summary-card">
              <div className="f-lp-skeleton f-lp-skeleton-icon" />
              <div className="f-lp-skeleton f-lp-skeleton-text" />
              <div className="f-lp-skeleton f-lp-skeleton-label" />
            </div>
            <div className="f-lp-summary-card">
              <div className="f-lp-skeleton f-lp-skeleton-icon" />
              <div className="f-lp-skeleton f-lp-skeleton-text" />
              <div className="f-lp-skeleton f-lp-skeleton-label" />
            </div>
            <div className="f-lp-summary-card">
              <div className="f-lp-skeleton f-lp-skeleton-icon" />
              <div className="f-lp-skeleton f-lp-skeleton-text" />
              <div className="f-lp-skeleton f-lp-skeleton-label" />
            </div>
          </div>

          {/* Skeleton Phases */}
          <div className="f-lp-phases-container">
            {[1, 2, 3].map((i) => (
              <div key={i} className="f-lp-phase-card">
                <div className="f-lp-phase-header">
                  <div className="f-lp-skeleton f-lp-skeleton-phase-number" />
                  <div className="f-lp-skeleton f-lp-skeleton-phase-title" />
                </div>
                <div className="f-lp-skeleton f-lp-skeleton-phase-description" />
                <div className="f-lp-phase-meta">
                  <div className="f-lp-skeleton f-lp-skeleton-meta" />
                  <div className="f-lp-skeleton f-lp-skeleton-meta" />
                  <div className="f-lp-skeleton f-lp-skeleton-meta" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Learning Path Phases */
        <LearningPathPhases learningPath={learningPath} />
      )}

      {/* Survey Modal */}
      <SurveyModal />
    </div>
  );
};

export default LearningPathDisplay;
