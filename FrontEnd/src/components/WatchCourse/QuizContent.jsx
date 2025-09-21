import React, { useState, useEffect } from "react";
import "../../assets/WatchCourse/QuizContent.css";

const QuizContent = ({ lessonId, onQuizComplete }) => {
  const [quizData, setQuizData] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Quiz configuration
  const PASS_THRESHOLD = 70; // 70% to pass
  const TIME_LIMIT = 15; // 15 minutes

  useEffect(() => {
    if (!lessonId) return;
    // Reset states when lesson changes
    setSelectedAnswers({});
    setQuizResult(null);
    setLoading(true);
    setError(null);

    // TODO: Replace with actual API call
    // Simulated API call for now
    setTimeout(() => {
      setQuizData({
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
      });
      setLoading(false);
    }, 1000);
  }, [lessonId]);

  const handleAnswerSelect = (questionId, answerIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Calculate results
      const totalQuestions = quizData.questions.length;
      let correctAnswers = 0;

      quizData.questions.forEach((question) => {
        if (selectedAnswers[question.id] === question.correctAnswer) {
          correctAnswers++;
        }
      });

      const score = (correctAnswers / totalQuestions) * 100;

      setQuizResult({
        score,
        correctAnswers,
        totalQuestions,
      });

      if (onQuizComplete) {
        onQuizComplete({
          lessonId,
          score,
          completed: score >= 70, // Pass threshold
        });
      }
    } catch (err) {
      setError("Failed to submit quiz. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestion = (question, index) => {
    const isAnswered = selectedAnswers[question.id] !== undefined;
    const showCorrectAnswer = quizResult !== null;

    return (
      <div key={question.id} className="quiz-question">
        <h4>Question {index + 1}</h4>
        <p>{question.question}</p>
        <div className="quiz-options">
          {question.options.map((option, optIndex) => {
            const isSelected = selectedAnswers[question.id] === optIndex;
            const isCorrect =
              showCorrectAnswer && optIndex === question.correctAnswer;
            const isWrong = showCorrectAnswer && isSelected && !isCorrect;

            return (
              <div
                key={optIndex}
                className={`quiz-option ${isSelected ? "selected" : ""} 
                           ${isCorrect ? "correct" : ""} 
                           ${isWrong ? "wrong" : ""}`}
                onClick={() =>
                  !quizResult && handleAnswerSelect(question.id, optIndex)
                }
              >
                <span className="option-label">
                  {String.fromCharCode(65 + optIndex)}
                </span>
                <span className="option-text">{option}</span>
                {showCorrectAnswer && isCorrect && (
                  <span className="correct-indicator">✓</span>
                )}
                {showCorrectAnswer && isWrong && (
                  <span className="wrong-indicator">✗</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Scroll to top when changing questions
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentQuestionIndex]);

  if (loading) return <div className="quiz-loading">Loading quiz...</div>;
  if (error) return <div className="quiz-error">{error}</div>;
  if (!quizData)
    return <div className="quiz-empty">No quiz available for this lesson.</div>;

  const totalQuestions = quizData.questions.length;
  const requiredCorrect = Math.ceil((PASS_THRESHOLD / 100) * totalQuestions);
  const allQuestionsAnswered = quizData.questions.every(
    (q) => selectedAnswers[q.id] !== undefined
  );

  if (!hasStarted) {
    return (
      <div className="quiz-intro">
        <h3>Quiz Information</h3>
        <div className="quiz-info-list">
          <div className="quiz-info-item">
            <span className="label">Total Questions:</span>
            <span className="value">{totalQuestions}</span>
          </div>
          <div className="quiz-info-item">
            <span className="label">Pass Threshold:</span>
            <span className="value">{PASS_THRESHOLD}%</span>
          </div>
          <div className="quiz-info-item">
            <span className="label">Required Correct:</span>
            <span className="value">
              {requiredCorrect} out of {totalQuestions}
            </span>
          </div>
          <div className="quiz-info-item">
            <span className="label">Time Limit:</span>
            <span className="value">{TIME_LIMIT} minutes</span>
          </div>
        </div>

        <div className="quiz-rules">
          <h4>Rules:</h4>
          <ul>
            <li>You must answer all questions to submit the quiz</li>
            <li>You need to score at least {PASS_THRESHOLD}% to pass</li>
            <li>You can review your answers before submitting</li>
            <li>Results will be shown immediately after submission</li>
            <li>You can retake the quiz if you don't pass</li>
          </ul>
        </div>

        <button className="start-quiz-btn" onClick={() => setHasStarted(true)}>
          Start Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      {quizResult && (
        <div
          className={`quiz-result ${quizResult.score >= 70 ? "pass" : "fail"}`}
        >
          <h3>Quiz Result</h3>
          <div className="score-display">
            <span className="score-number">
              {Math.round(quizResult.score)}%
            </span>
            <span className="score-label">
              {quizResult.score >= 70 ? "Passed!" : "Failed"}
            </span>
          </div>
          <p>
            Correct answers: {quizResult.correctAnswers} /{" "}
            {quizResult.totalQuestions}
          </p>
          {quizResult.score < 70 && (
            <button
              className="try-again-btn"
              onClick={() => {
                setQuizResult(null);
                setSelectedAnswers({});
                setCurrentQuestionIndex(0);
              }}
            >
              Try Again
            </button>
          )}
        </div>
      )}

      {!quizResult && (
        <div className="quiz-main-content">
          <div className="quiz-questions-nav">
            <div className="questions-list">
              {quizData.questions.map((question, index) => (
                <div
                  key={question.id}
                  className={`question-item ${
                    index === currentQuestionIndex ? "active" : ""
                  } ${
                    selectedAnswers[question.id] !== undefined ? "answered" : ""
                  }`}
                  onClick={() => setCurrentQuestionIndex(index)}
                >
                  {index + 1}
                </div>
              ))}
            </div>
          </div>

          <div className="quiz-answer-section">
            <div className="current-question">
              <h3>Question {currentQuestionIndex + 1}</h3>
              <p>{quizData.questions[currentQuestionIndex].question}</p>

              <div className="answer-grid">
                {quizData.questions[currentQuestionIndex].options.map(
                  (option, optIndex) => {
                    const isSelected =
                      selectedAnswers[
                        quizData.questions[currentQuestionIndex].id
                      ] === optIndex;

                    return (
                      <div
                        key={optIndex}
                        className={`answer-option ${
                          isSelected ? "selected" : ""
                        }`}
                        onClick={() =>
                          handleAnswerSelect(
                            quizData.questions[currentQuestionIndex].id,
                            optIndex
                          )
                        }
                      >
                        <span className="option-label">
                          {String.fromCharCode(65 + optIndex)}
                        </span>
                        <span className="option-text">{option}</span>
                      </div>
                    );
                  }
                )}
              </div>

              <div className="question-actions">
                {currentQuestionIndex < quizData.questions.length - 1 ? (
                  <button
                    className="next-question-btn"
                    onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                    disabled={
                      selectedAnswers[
                        quizData.questions[currentQuestionIndex].id
                      ] === undefined
                    }
                  >
                    Next Question
                  </button>
                ) : (
                  <button
                    className="submit-quiz"
                    disabled={!allQuestionsAnswered || isSubmitting}
                    onClick={handleSubmit}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Quiz"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizContent;
