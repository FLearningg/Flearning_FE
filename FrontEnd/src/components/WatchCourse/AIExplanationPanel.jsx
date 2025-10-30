import React, { useState } from "react";
import "../../assets/WatchCourse/AIExplanationPanel.css";

const AIExplanationPanel = ({
  items = [],
  loading,
  error,
  onRetry,
  mode = "wrong-only",
  onToggleMode,
  quizResult = null, // Add quizResult prop
  showModal = false,
  onClose,
}) => {
  const [expanded, setExpanded] = useState({});

  const toggle = (idx) => {
    setExpanded((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Only show early return for loading/error if NOT in modal mode
  if (loading && !showModal) {
    return (
      <div className="ai-panel-loading">
        <div className="ai-loading-spinner"></div>
        <p>Generating AI explanations...</p>
      </div>
    );
  }

  if (error && !showModal) {
    return (
      <div className="ai-panel-error">
        <div>{error}</div>
        <button className="ai-retry-btn" onClick={onRetry}>
          Try again
        </button>
      </div>
    );
  }

  const safeItems = items || [];
  const filtered = safeItems.filter((it) =>
    mode === "all" ? true : !it.isCorrect
  );

  const correctCount = safeItems.filter((it) => it.isCorrect).length;
  const wrongCount = safeItems.length - correctCount;

  // If showModal is true, render as modal
  if (showModal) {
    return (
      <div className="ai-modal-overlay" onClick={onClose}>
        <div className="ai-modal" onClick={(e) => e.stopPropagation()}>
          <div className="ai-modal-header">
            <h3>
              {quizResult && quizResult.passed
                ? "🤖 AI Explanations"
                : "📝 Quiz Answers"}
            </h3>
            <div className="ai-modal-actions">
              {quizResult && quizResult.passed && (
                <button
                  className="ai-refresh-btn"
                  onClick={() => {
                    onRetry(true); // Pass skipCache = true
                  }}
                  title="Refresh AI explanations"
                >
                  🔄
                </button>
              )}
              <button className="ai-modal-close" onClick={onClose}>
                ✕
              </button>
            </div>
          </div>

          <div className="ai-modal-body">
            {/* Show loading first if loading */}
            {loading ? (
              <div className="ai-panel-loading">
                <div className="ai-loading-spinner"></div>
                <p>Generating AI explanations...</p>
              </div>
            ) : error ? (
              <div className="ai-panel-error">
                <div>{error}</div>
                <button onClick={onRetry} className="ai-retry-btn">
                  Try again
                </button>
              </div>
            ) : /* If PASSED: Show AI explanations */
            quizResult && quizResult.passed ? (
              safeItems && safeItems.length > 0 ? (
                <>
                  {/* Stats Summary */}
                  <div className="ai-stats-summary">
                    <div className="ai-stat-card">
                      <div className="ai-stat-value">{safeItems.length}</div>
                      <div className="ai-stat-label">Total Questions</div>
                    </div>
                    <div className="ai-stat-card">
                      <div
                        className="ai-stat-value"
                        style={{ color: "#48bb78" }}
                      >
                        {safeItems.filter((it) => it.isCorrect).length}
                      </div>
                      <div className="ai-stat-label">Correct</div>
                    </div>
                    <div className="ai-stat-card">
                      <div
                        className="ai-stat-value"
                        style={{ color: "#f56565" }}
                      >
                        {safeItems.filter((it) => !it.isCorrect).length}
                      </div>
                      <div className="ai-stat-label">Incorrect</div>
                    </div>
                  </div>

                  {/* Explanation Items */}
                  {safeItems.map((it, idx) => (
                    <div
                      key={it.questionIndex}
                      className={`ai-explanation-item ${
                        it.isCorrect ? "correct" : "wrong"
                      }`}
                    >
                      <div className="ai-item-header">
                        <div className="ai-item-number">
                          Question {it.questionIndex}
                        </div>
                        <div className="ai-item-status">
                          {it.isCorrect ? "Correct" : "Incorrect"}
                        </div>
                      </div>

                      <div className="ai-item-body">
                        <div className="ai-item-question">
                          {it.questionText || it.questionContent || it.question}
                        </div>

                        <div className="ai-item-answers">
                          <div className="ai-answer-box user-answer">
                            <div className="ai-answer-label">Your Answer</div>
                            <div className="ai-answer-text">
                              {it.userAnswerText || "—"}
                            </div>
                          </div>
                          <div className="ai-answer-box correct-answer">
                            <div className="ai-answer-label">
                              Correct Answer
                            </div>
                            <div className="ai-answer-text">
                              {it.correctAnswerText || "—"}
                            </div>
                          </div>
                        </div>

                        <div className="ai-item-explanation">
                          <div
                            className="ai-explanation-content"
                            style={{ marginTop: 0 }}
                          >
                            {it.explanation}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="ai-empty">
                  <p>No explanations available.</p>
                </div>
              )
            ) : /* If FAILED: Show only answers without status and explanation */
            quizResult &&
              quizResult.questionResults &&
              quizResult.questionResults.length > 0 ? (
              <div className="failed-answers-list">
                {quizResult.questionResults.map((detail, idx) => (
                  <div key={idx} className="failed-answer-item">
                    <div className="failed-item-header">
                      <div className="ai-item-number">
                        Question {detail.questionIndex + 1}
                      </div>
                    </div>
                    <div className="failed-item-body">
                      <div className="ai-item-question">
                        {detail.questionContent ||
                          `Question ${detail.questionIndex + 1}`}
                      </div>
                      <div className="ai-item-answers">
                        <div className="ai-answer-box user-answer">
                          <div className="ai-answer-label">Your Answer</div>
                          <div className="ai-answer-text">
                            {detail.userAnswers && detail.userAnswers.length > 0
                              ? detail.userAnswers
                                  .map((a) => a.content)
                                  .join(", ")
                              : "—"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="ai-empty">
                <p>No answer details available.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Original panel rendering (for backward compatibility)
  return (
    <div className="ai-explanations">
      {/* Stats Summary */}
      {safeItems.length > 0 && (
        <div className="ai-stats-summary">
          <div className="ai-stat-card">
            <div className="ai-stat-value">{safeItems.length}</div>
            <div className="ai-stat-label">Total Questions</div>
          </div>
          <div className="ai-stat-card">
            <div className="ai-stat-value" style={{ color: "#48bb78" }}>
              {correctCount}
            </div>
            <div className="ai-stat-label">Correct</div>
          </div>
          <div className="ai-stat-card">
            <div className="ai-stat-value" style={{ color: "#f56565" }}>
              {wrongCount}
            </div>
            <div className="ai-stat-label">Incorrect</div>
          </div>
        </div>
      )}

      {/* Filter Controls */}
      <div className="ai-filter-controls">
        <div className="ai-filter-label">
          Showing {filtered.length} of {safeItems.length} questions
        </div>
        <button className="ai-toggle-mode" onClick={onToggleMode}>
          {mode === "all" ? "Show only incorrect" : "Show all questions"}
        </button>
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="ai-empty">
          <p>
            {mode === "all"
              ? "No questions available."
              : "No incorrect answers to explain. Great job! 🎉"}
          </p>
        </div>
      )}

      {/* Explanation Items */}
      {filtered.map((it, idx) => (
        <div
          key={it.questionIndex}
          className={`ai-explanation-item ${
            it.isCorrect ? "correct" : "wrong"
          }`}
        >
          <div className="ai-item-header">
            <div className="ai-item-number">
              Question {it.questionIndex + 1}
            </div>
            <div className="ai-item-status">
              {it.isCorrect ? "Correct" : "Incorrect"}
            </div>
          </div>

          <div className="ai-item-body">
            <div className="ai-item-question">
              {it.questionText || it.questionContent || it.question}
            </div>

            <div className="ai-item-answers">
              <div className="ai-answer-box user-answer">
                <div className="ai-answer-label">Your Answer</div>
                <div className="ai-answer-text">{it.userAnswerText ?? "—"}</div>
              </div>
              <div className="ai-answer-box correct-answer">
                <div className="ai-answer-label">Correct Answer</div>
                <div className="ai-answer-text">
                  {it.correctAnswerText ?? "—"}
                </div>
              </div>
            </div>

            <div className="ai-item-explanation">
              <button
                className={`ai-expand-btn ${expanded[idx] ? "expanded" : ""}`}
                onClick={() => toggle(idx)}
              >
                {expanded[idx] ? "Hide explanation" : "Show explanation"}
              </button>
              {expanded[idx] && (
                <div className="ai-explanation-content">
                  {it.explanation || "No explanation provided."}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AIExplanationPanel;
