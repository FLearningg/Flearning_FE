import React, { useState, useEffect } from "react";
import { getQuizHistory } from "../../services/quizService";
import "../../assets/WatchCourse/QuizHistory.css";
import { toast } from "react-toastify";

const QuizHistory = ({ courseId }) => {
  const [quizHistory, setQuizHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalResults: 0,
    limit: 10,
  });
  const [statistics, setStatistics] = useState(null);

  useEffect(() => {
    fetchQuizHistory(1);
  }, [courseId]);

  const fetchQuizHistory = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit: pagination.limit,
      };
      
      if (courseId) {
        params.courseId = courseId;
      }

      const response = await getQuizHistory(params);
      
      if (response.success && response.data) {
        setQuizHistory(response.data.results || []);
        setPagination({
          currentPage: response.data.currentPage || 1,
          totalPages: response.data.totalPages || 1,
          totalResults: response.data.totalResults || 0,
          limit: response.data.limit || 10,
        });
        setStatistics(response.data.statistics || null);
      } else {
        throw new Error(response.message || "Failed to fetch quiz history");
      }
    } catch (err) {
      console.error("Error fetching quiz history:", err);
      setError(err.message || "Failed to load quiz history");
      toast.error(err.message || "Failed to load quiz history");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchQuizHistory(newPage);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading && pagination.currentPage === 1) {
    return (
      <div className="quiz-history-container">
        <div className="quiz-history-loading">Loading quiz history...</div>
      </div>
    );
  }

  if (error && quizHistory.length === 0) {
    return (
      <div className="quiz-history-container">
        <div className="quiz-history-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="quiz-history-container">
      <div className="quiz-history-header">
        <h2>Quiz History</h2>
        {courseId && <p className="filter-notice">Showing results for this course only</p>}
      </div>

      {statistics && (
        <div className="quiz-statistics">
          <div className="stat-card">
            <div className="stat-label">Total Quizzes</div>
            <div className="stat-value">{statistics.totalQuizzes || 0}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Passed</div>
            <div className="stat-value passed">{statistics.passed || 0}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Failed</div>
            <div className="stat-value failed">{statistics.failed || 0}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Average Score</div>
            <div className="stat-value">
              {statistics.averageScore ? `${Math.round(statistics.averageScore)}%` : "N/A"}
            </div>
          </div>
        </div>
      )}

      {quizHistory.length === 0 ? (
        <div className="quiz-history-empty">
          <p>No quiz history found.</p>
          {courseId && <p>You haven't completed any quizzes in this course yet.</p>}
        </div>
      ) : (
        <>
          <div className="quiz-history-list">
            {quizHistory.map((result) => (
              <div key={result._id} className="quiz-history-item">
                <div className="quiz-info">
                  <h3 className="quiz-title">
                    {result.quizId?.title || "Untitled Quiz"}
                  </h3>
                  {result.quizId?.courseId && (
                    <p className="quiz-course">
                      Course: {result.quizId.courseId.title || "Unknown Course"}
                    </p>
                  )}
                  <p className="quiz-date">
                    Completed: {formatDate(result.submittedAt)}
                  </p>
                </div>
                <div className="quiz-score-info">
                  <div
                    className={`quiz-score ${
                      result.passed ? "passed" : "failed"
                    }`}
                  >
                    <span className="score-percentage">
                      {Math.round(result.scorePercentage)}%
                    </span>
                    <span className="score-label">
                      {result.passed ? "Passed" : "Failed"}
                    </span>
                  </div>
                  <div className="quiz-details">
                    <p>
                      {result.correctAnswers} / {result.totalQuestions} correct
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="quiz-history-pagination">
              <button
                className="pagination-btn"
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1 || loading}
              >
                Previous
              </button>
              <span className="pagination-info">
                Page {pagination.currentPage} of {pagination.totalPages}
                <span className="total-results">
                  ({pagination.totalResults} total results)
                </span>
              </span>
              <button
                className="pagination-btn"
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={
                  pagination.currentPage === pagination.totalPages || loading
                }
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default QuizHistory;

