import React, { useState, useEffect } from "react";
import "../../assets/WatchCourse/QuizContent.css";
import apiClient from "../../services/authService";
import { submitQuiz, getQuizResult, getQuizById } from "../../services/quizService";
import { toast } from "react-toastify";

const QuizContent = ({ lessonId, quizData: propQuizData, onQuizComplete, quizId: propQuizId, duration: propDurationSeconds }) => {
  const [quizData, setQuizData] = useState(null);
  const [quizId, setQuizId] = useState(propQuizId || null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [allowRetake, setAllowRetake] = useState(true);
  const [timeLimitSeconds, setTimeLimitSeconds] = useState(
    typeof propDurationSeconds === 'number'
      ? propDurationSeconds
      : (propDurationSeconds ? Number(propDurationSeconds) : null)
  );
  const [showExplanation, setShowExplanation] = useState(false);

  const PASS_THRESHOLD = 80;
  const DEFAULT_TIME_LIMIT_MIN = 15;

  useEffect(() => {
    if (!lessonId && !propQuizId) return;
    
    setSelectedAnswers({});
    setQuizResult(null);
    setLoading(true);
    setError(null);
    setAlreadySubmitted(false);
    setHasStarted(false);
    setShowExplanation(false);

    const fetchQuizData = async () => {
      try {
        let quiz = null;
        let fetchedQuizId = propQuizId;

        if (propQuizData && propQuizData.questions) {
          quiz = propQuizData;
          if (propQuizData._id) {
            fetchedQuizId = propQuizData._id;
          }
          setAllowRetake(true);
        }
        else if (propQuizId) {
          const response = await getQuizById(propQuizId);
          quiz = response.data;
          setAllowRetake(true);
          fetchedQuizId = propQuizId;
        }
        else if (lessonId) {
          try {
            const quizResponse = await apiClient.get(`quiz/by-lesson/${lessonId}`);
            if (quizResponse.data?.success && quizResponse.data?.data) {
              quiz = quizResponse.data.data;
              fetchedQuizId = quiz._id;
              setAllowRetake(true);
              const rawDuration = quizResponse.data?.data?.lessonInfo?.duration;
              if (timeLimitSeconds == null && (typeof rawDuration === 'number' || (typeof rawDuration === 'string' && rawDuration.trim() !== ''))) {
                setTimeLimitSeconds(Math.max(0, Math.floor(Number(rawDuration))));
              }
            } else if (quizResponse.data && quizResponse.data.isQuizLesson === false) {
              setError("This lesson is not a quiz");
              setLoading(false);
              return;
            }
          } catch (e) {}

          if (!quiz) {
            try {
              const lessonResponse = await apiClient.get(`watch-course/lesson/${lessonId}`);
              if (lessonResponse.data && lessonResponse.data.quizData) {
                quiz = lessonResponse.data.quizData;
                if (quiz._id) {
                  fetchedQuizId = quiz._id;
                }
                setAllowRetake(true);
                const rawDuration = lessonResponse.data?.data?.lessonInfo?.duration || lessonResponse.data?.lessonInfo?.duration;
                if (timeLimitSeconds == null && (typeof rawDuration === 'number' || (typeof rawDuration === 'string' && rawDuration.trim() !== ''))) {
                  setTimeLimitSeconds(Math.max(0, Math.floor(Number(rawDuration))));
                }
              } else if (lessonResponse.data && lessonResponse.data.type && lessonResponse.data.type !== 'quiz') {
                setError("This lesson is not a quiz");
                setLoading(false);
                return;
              }
            } catch (e) {}
          }
        }

        if (!quiz) {
          setError("No quiz available for this lesson");
          setLoading(false);
          return;
        }

        setQuizId(fetchedQuizId);
          
        const transformedQuiz = {
          _id: quiz._id,
          title: quiz.title,
          description: quiz.description,
          questions: quiz.questions.map((q, index) => ({
            _id: q._id,
            id: index + 1,
            question: q.question || q.content,
            explanation: q.explanation || "",
            options: (q.options && q.options.map((opt, i) => ({
              id: opt._id || i,
              content: typeof opt === 'string' ? opt : (opt.content || ''),
            }))) || (q.answers?.map((a, i) => ({ id: a._id || i, content: a.content }))) || [],
            correctAnswer: q.correctAnswer !== undefined 
              ? q.correctAnswer 
              : q.answers?.findIndex(a => a.isCorrect) || 0,
          }))
        };
          
        setQuizData(transformedQuiz);

        if (fetchedQuizId) {
          try {
            const resultResponse = await getQuizResult(fetchedQuizId);
            if (resultResponse.success && resultResponse.data) {
              const result = resultResponse.data;
              const totalQuestions = result.details?.totalQuestions ?? result.totalQuestions;
              const correctAnswers = result.details?.correctAnswers ?? result.correctAnswers;
              const score = typeof result.score === 'number' ? result.score : (result.details?.scorePercentage ?? 0);
              setQuizResult({
                score,
                correctAnswers,
                totalQuestions,
                passed: !!result.passed,
                questionResults: result.details?.questionResults || [],
                details: result.details || null,
              });
              setAlreadySubmitted(true);
              setHasStarted(true);
            }
          } catch (resultError) {
            console.log("No previous quiz result found");
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
        setError(error.message || "Failed to load quiz data");
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [lessonId, propQuizData, propQuizId]);

  useEffect(() => {
    const refetchResultIfNeeded = async () => {
      if (!quizId) return;
      try {
        const resultResponse = await getQuizResult(quizId);
        if (resultResponse.success && resultResponse.data) {
          const result = resultResponse.data;
          const totalQuestions = result.details?.totalQuestions ?? result.totalQuestions;
          const correctAnswers = result.details?.correctAnswers ?? result.correctAnswers;
          const score = typeof result.score === 'number' ? result.score : (result.details?.scorePercentage ?? 0);
          setQuizResult({
            score,
            correctAnswers,
            totalQuestions,
            passed: !!result.passed,
            questionResults: result.details?.questionResults || [],
            details: result.details || null,
          });
          setAlreadySubmitted(true);
          setHasStarted(true);
        }
      } catch (e) {}
    };
    refetchResultIfNeeded();
  }, [quizId]);

  const effectiveTimeLimitSeconds = timeLimitSeconds ?? DEFAULT_TIME_LIMIT_MIN * 60;
  const [remainingSeconds, setRemainingSeconds] = useState(effectiveTimeLimitSeconds);

  useEffect(() => {
    if (!hasStarted) setRemainingSeconds(effectiveTimeLimitSeconds);
  }, [effectiveTimeLimitSeconds, hasStarted]);

  useEffect(() => {
    if (!hasStarted || quizResult) return;
    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (!quizResult) {
            // Force submit when time is up
            handleSubmit();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [hasStarted, quizResult, handleSubmit]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    if (quizResult) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }));
  };

  async function handleSubmit() {
    if (!quizId) {
      toast.error("Quiz ID is missing. Cannot submit.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formattedAnswers = quizData.questions.map((question, qIdx) => {
        const selectedIndex = selectedAnswers[question.id];
        return {
          questionIndex: qIdx,
          selectedAnswers: typeof selectedIndex === 'number' ? [selectedIndex] : []
        };
      });

      const response = await submitQuiz(quizId, formattedAnswers, { retake: allowRetake && alreadySubmitted });

      if (response.success && response.data) {
        const result = response.data;
        
        setQuizResult({
          score: result.score,
          correctAnswers: result.correctAnswers,
          totalQuestions: result.totalQuestions,
          passed: result.passed,
          questionResults: result.questionResults || []
        });

        setAlreadySubmitted(true);

        if (result.passed) {
          toast.success(`🎉 Congratulations! You passed with ${Math.round(result.score)}%`);
        } else {
          toast.warning(`📝 You scored ${Math.round(result.score)}%. You need ${PASS_THRESHOLD}% to pass.`);
        }

        if (onQuizComplete) {
          onQuizComplete({
            lessonId,
            quizId,
            score: result.score,
            completed: result.passed,
            passed: result.passed
          });
        }
      } else {
        throw new Error(response.message || "Failed to submit quiz");
      }
    } catch (err) {
      console.error("Error submitting quiz:", err);
      if (err.status === 400 && (err.data?.code === 'QUIZ_ALREADY_SUBMITTED' || /already submitted/i.test(err.message))) {
        try {
          const resultResponse = await getQuizResult(quizId);
          if (resultResponse.success && resultResponse.data) {
            const result = resultResponse.data;
            setQuizResult({
              score: result.score,
              correctAnswers: result.details?.correctAnswers ?? result.correctAnswers,
              totalQuestions: result.details?.totalQuestions ?? result.totalQuestions,
              passed: result.passed,
              questionResults: result.details?.questionResults || []
            });
            setAlreadySubmitted(true);
            toast.info("📋 You have already submitted this quiz. Showing your result.");
            if (onQuizComplete) {
              onQuizComplete({ lessonId, quizId, score: result.score, completed: result.passed, passed: result.passed });
            }
            return;
          }
        } catch (_) {}
      }
      const errorMessage = err.message || "Failed to submit quiz. Please try again.";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  const getQuestionResultForIndex = (questionIndex) => {
    if (!quizResult) return null;
    const fromQR = Array.isArray(quizResult.questionResults)
      ? quizResult.questionResults.find((d) => d.questionIndex === questionIndex)
      : null;
    if (fromQR) return fromQR;
    const fromDetails = Array.isArray(quizResult.details)
      ? quizResult.details.find((d) => d.questionIndex === questionIndex)
      : null;
    return fromDetails || null;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentQuestionIndex]);

  if (loading) return (
    <div className="quiz-loading">
      <div className="loading-spinner"></div>
      <p>Loading quiz content...</p>
    </div>
  );
  
  if (error) return (
    <div className="quiz-error">
      <div className="error-icon">⚠️</div>
      <h3>Unable to load quiz</h3>
      <p>{error}</p>
      <button className="retry-btn" onClick={() => window.location.reload()}>
        Try Again
      </button>
    </div>
  );
  
  if (!quizData) return (
    <div className="quiz-empty">
      <div className="empty-icon">📝</div>
      <h3>No Quiz Available</h3>
      <p>There is no quiz available for this lesson at the moment.</p>
    </div>
  );

  const totalQuestions = quizData.questions.length;
  const requiredCorrect = Math.ceil((PASS_THRESHOLD / 100) * totalQuestions);
  const allQuestionsAnswered = quizData.questions.every(
    (q) => selectedAnswers[q.id] !== undefined
  );

  const currentQuestion = quizData.questions[currentQuestionIndex];
  // const resultDetail = quizResult ? getQuestionResultForIndex(currentQuestionIndex) : null;

  if (!hasStarted) {
    return (
      <div className="quiz-intro">
        <h2 className="intro-title">Quiz</h2>
        <div className="intro-info">
          <div className="intro-row"><span>Total questions:</span><strong>{totalQuestions}</strong></div>
          <div className="intro-row"><span>Time limit:</span><strong>{Math.ceil(effectiveTimeLimitSeconds / 60)} minutes</strong></div>
        </div>

        <div className="quiz-instructions">
          <h3>Instructions</h3>
          <ul>
            <li>Answer all questions before submitting.</li>
            <li>Pass threshold: <strong>{PASS_THRESHOLD}%</strong>.</li>
            <li>Timer starts when you begin the quiz.</li>
          </ul>
        </div>

        <div className="quiz-actions">
          <button className="start-quiz-btn" onClick={() => { setRemainingSeconds(effectiveTimeLimitSeconds); setHasStarted(true); }}>Start Quiz</button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      {quizResult && (
        <div className={`quiz-result ${quizResult.passed ? "pass" : "fail"}`}>
          <div className="result-header">
            <div className={`result-icon ${quizResult.passed ? "pass" : "fail"}`}>
              {quizResult.passed ? "🎉" : "📝"}
            </div>
            <h2>{quizResult.passed ? "Congratulations!" : "Keep Learning!"}</h2>
            <p>{quizResult.passed ? "You have successfully passed the quiz!" : "Don't worry, you can try again!"}</p>
          </div>
          
          <div className="result-stats">
            <div className="score-circle">
              <div className="circle-background"></div>
              <div className="circle-content">
                <span className="score-percent">{Math.round(quizResult.score)}%</span>
                <span className="score-text">Score</span>
              </div>
            </div>
            
            <div className="result-details">
              <div className="detail-item">
                <span className="detail-label">Correct Answers</span>
                <span className="detail-value">{quizResult.correctAnswers}/{quizResult.totalQuestions}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Status</span>
                <span className={`detail-value status ${quizResult.passed ? "passed" : "failed"}`}>
                  {quizResult.passed ? "Passed" : "Failed"}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Required</span>
                <span className="detail-value">{PASS_THRESHOLD}%</span>
              </div>
            </div>
          </div>

          {allowRetake && (
            <div className="result-actions">
              <button
                className="try-again-btn"
                onClick={() => {
                  setQuizResult(null);
                  setSelectedAnswers({});
                  setCurrentQuestionIndex(0);
                  setShowExplanation(false);
                  setRemainingSeconds(effectiveTimeLimitSeconds);
                  setHasStarted(true);
                }}
              >
                <span className="btn-icon">🔄</span>
                Retake Quiz
              </button>
            </div>
          )}
        </div>
      )}

      {!quizResult && (
        <div className="quiz-main-content">
          {/* Header */}
          <div className="quiz-header-bar">
            <div className="quiz-progress">
              <div className="progress-info">
                <span className="progress-count">{formatTime(remainingSeconds)}</span>
              </div>
              <div className="progress-bar">
                <div 
                  className={`progress-fill ${
                    remainingSeconds / effectiveTimeLimitSeconds <= 0.2 ? "danger" :
                    remainingSeconds / effectiveTimeLimitSeconds <= 0.5 ? "warning" : "safe"
                  }`} 
                  style={{ width: `${(remainingSeconds / effectiveTimeLimitSeconds) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className={`quiz-timer ${
              remainingSeconds / effectiveTimeLimitSeconds <= 0.2 ? "danger" : 
              remainingSeconds / effectiveTimeLimitSeconds <= 0.4 ? "warning" : ""
            }`}>
              <div className="timer-content">
                <div className="timer-text">{formatTime(remainingSeconds)}</div>
                <div className="timer-label">Time Remaining</div>
              </div>
            </div>
          </div>

          <div className="quiz-content-wrapper">
            {/* Questions Navigation */}
            <div className="quiz-questions-nav">
              <div className="nav-header">
                <h4>Questions</h4>
                <span className="answered-count">
                  {Object.keys(selectedAnswers).length}/{totalQuestions}
                </span>
              </div>
              
              <div className="questions-grid">
                {quizData.questions.map((question, index) => {
                  return (
                    <div
                      key={question.id}
                      className={`question-indicator ${index === currentQuestionIndex ? "active" : ""} ${selectedAnswers[question.id] !== undefined ? "answered" : ""}`}
                      onClick={() => setCurrentQuestionIndex(index)}
                    >
                      {index + 1}
                    </div>
                  );
                })}
              </div>
              <div className="sidebar-submit">
                <button
                  className="submit-quiz-btn"
                  disabled={!allQuestionsAnswered || isSubmitting}
                  onClick={handleSubmit}
                >
                  {isSubmitting ? (<><span className="submit-spinner"></span> Submitting...</>) : 'Submit Quiz'}
                </button>
              </div>
            </div>

            {/* Question & Answers */}
            <div className="quiz-answer-section">
              <div className="current-question">
                <div className="question-content">
                  <h3 className="question-title">
                    <span className="question-number">Question {currentQuestionIndex + 1}</span>
                    {currentQuestion.question}
                  </h3>

                  <div className="answer-options">
                    {currentQuestion.options.map((option, optIndex) => {
                      const isSelected = selectedAnswers[currentQuestion.id] === optIndex;
                      const resultDetail = getQuestionResultForIndex(currentQuestionIndex);
                      const showResult = quizResult !== null;
                      const isCorrectOption = !!(resultDetail && Array.isArray(resultDetail.correctAnswers) && resultDetail.correctAnswers.some(a => a.index === optIndex));
                      const isWrongSelection = !!(resultDetail && Array.isArray(resultDetail.userAnswers) && resultDetail.userAnswers.some(a => a.index === optIndex) && !resultDetail.isCorrect);

                      return (
                        <div
                          key={optIndex}
                          className={`answer-option ${
                            isSelected ? "selected" : ""
                          } ${
                            showResult && isCorrectOption ? "correct" : ""
                          } ${
                            showResult && isWrongSelection ? "wrong" : ""
                          }`}
                          onClick={() => handleAnswerSelect(currentQuestion.id, optIndex)}
                        >
                          <div className="option-selector">
                            <div className={`option-circle ${isSelected ? "selected" : ""}`}>
                              {showResult && isCorrectOption && <span className="indicator correct">✓</span>}
                              {showResult && isWrongSelection && <span className="indicator wrong">✗</span>}
                              {!showResult && isSelected && <span className="indicator selected">•</span>}
                            </div>
                            <span className="option-letter">
                              {String.fromCharCode(65 + optIndex)}
                            </span>
                          </div>
                          <span className="option-text">{typeof option === 'string' ? option : option.content}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  {quizResult && currentQuestion.explanation && (
                    <div className="question-explanation">
                      <div className="explanation-header">
                        <h4>💡 Explanation</h4>
                        <button 
                          className="explanation-toggle"
                          onClick={() => setShowExplanation(!showExplanation)}
                        >
                          {showExplanation ? "Hide" : "Show"} Explanation
                        </button>
                      </div>
                      {showExplanation && (
                        <div className="explanation-content">
                          {currentQuestion.explanation}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Navigation Buttons */}
                {!quizResult && (
                  <div className="question-navigation">
                    <button
                      className="nav-btn prev-btn"
                      onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                      disabled={currentQuestionIndex === 0}
                    >
                      ← Previous
                    </button>
                    
                    <div className="nav-progress"></div>

                    <button
                      className="nav-btn next-btn"
                      onClick={() => setCurrentQuestionIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                      disabled={
                        currentQuestionIndex === totalQuestions - 1 ||
                        selectedAnswers[currentQuestion.id] === undefined
                      }
                    >
                      Next →
                    </button>
                  </div>
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