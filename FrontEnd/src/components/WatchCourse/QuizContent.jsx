import React, { useState, useEffect } from "react";
import "../../assets/WatchCourse/QuizContent.css";
import "../../assets/WatchCourse/AIExplanationPanel.css";
import apiClient, { getUserProfile } from "../../services/authService";
import {
  submitQuiz,
  getQuizResult,
  getQuizById,
} from "../../services/quizService";
import { toast } from "react-toastify";
import AIExplanationPanel from "./AIExplanationPanel";

const QuizContent = ({
  lessonId,
  quizData: propQuizData,
  onQuizComplete,
  quizId: propQuizId,
  duration: propDurationSeconds,
}) => {
  const [quizData, setQuizData] = useState(null);
  const [quizId, setQuizId] = useState(propQuizId || null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [allowRetake, setAllowRetake] = useState(true);
  const [timeLimitSeconds, setTimeLimitSeconds] = useState(
    typeof propDurationSeconds === "number"
      ? propDurationSeconds
      : propDurationSeconds
      ? Number(propDurationSeconds)
      : null
  );
  const [showExplanation, setShowExplanation] = useState(false);

  // Re-added state variables for AI explanations
  const [aiExplanations, setAiExplanations] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);

  // Re-added state for managing the detail modal visibility
  const [showDetailModal, setShowDetailModal] = useState(false);

  const PASS_THRESHOLD = 80;
  const DEFAULT_TIME_LIMIT_MIN = 15;

  useEffect(() => {
    if (!lessonId && !propQuizId) return;

    setSelectedAnswers({});
    setQuizResult(null);
    setLoading(true);
    setError(null);
    setHasStarted(false);
    setShowExplanation(false);

    // Clear AI data when switching to different quiz
    setAiExplanations(null);
    setAiLoading(false);
    setAiError(null);
    setShowDetailModal(false);

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
        } else if (propQuizId) {
          // Ensure propQuizId is a string, not an object
          const actualQuizId = typeof propQuizId === 'object' ? propQuizId._id || propQuizId.id : propQuizId;
          if (!actualQuizId) {
            throw new Error('Invalid quiz ID provided');
          }
          const response = await getQuizById(actualQuizId);
          quiz = response.data;
          setAllowRetake(true);
          fetchedQuizId = actualQuizId;
        } else if (lessonId) {
          // Ensure lessonId is a string, not an object
          const actualLessonId = typeof lessonId === 'object' ? lessonId._id || lessonId.id : lessonId;
          if (!actualLessonId) {
            throw new Error('Invalid lesson ID provided');
          }
          try {
            const quizResponse = await apiClient.get(
              `quiz/by-lesson/${actualLessonId}`
            );
            if (quizResponse.data?.success && quizResponse.data?.data) {
              quiz = quizResponse.data.data;
              fetchedQuizId = quiz._id;
              setAllowRetake(true);
              const rawDuration = quizResponse.data?.data?.lessonInfo?.duration;
              if (
                timeLimitSeconds == null &&
                (typeof rawDuration === "number" ||
                  (typeof rawDuration === "string" &&
                    rawDuration.trim() !== ""))
              ) {
                setTimeLimitSeconds(
                  Math.max(0, Math.floor(Number(rawDuration)))
                );
              }
            } else if (
              quizResponse.data &&
              quizResponse.data.isQuizLesson === false
            ) {
              setError("This lesson is not a quiz");
              setLoading(false);
              return;
            }
          } catch (e) {}

          if (!quiz) {
            try {
              const lessonResponse = await apiClient.get(
                `watch-course/lesson/${actualLessonId}`
              );
              if (lessonResponse.data && lessonResponse.data.quizData) {
                quiz = lessonResponse.data.quizData;
                if (quiz._id) {
                  fetchedQuizId = quiz._id;
                }
                setAllowRetake(true);
                const rawDuration =
                  lessonResponse.data?.data?.lessonInfo?.duration ||
                  lessonResponse.data?.lessonInfo?.duration;
                if (
                  timeLimitSeconds == null &&
                  (typeof rawDuration === "number" ||
                    (typeof rawDuration === "string" &&
                      rawDuration.trim() !== ""))
                ) {
                  setTimeLimitSeconds(
                    Math.max(0, Math.floor(Number(rawDuration)))
                  );
                }
              } else if (
                lessonResponse.data &&
                lessonResponse.data.type &&
                lessonResponse.data.type !== "quiz"
              ) {
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
            // Prefer backend _id for a stable question identifier. Fallback to index+1
            id: q._id || index + 1,
            question: q.question || q.content,
            explanation: q.explanation || "",
            options:
              (q.options &&
                q.options.map((opt, i) => ({
                  id: opt._id || i,
                  content: typeof opt === "string" ? opt : opt.content || "",
                }))) ||
              q.answers?.map((a, i) => ({
                id: a._id || i,
                content: a.content,
              })) ||
              [],
            correctAnswer:
              q.correctAnswer !== undefined
                ? q.correctAnswer
                : q.answers?.findIndex((a) => a.isCorrect) || 0,
          })),
        };

        setQuizData(transformedQuiz);

        if (fetchedQuizId) {
          try {
            const resultResponse = await getQuizResult(fetchedQuizId);
            if (resultResponse.success && resultResponse.data) {
              const result = resultResponse.data;
              const totalQuestions =
                result.details?.totalQuestions ?? result.totalQuestions;
              const correctAnswers =
                result.details?.correctAnswers ?? result.correctAnswers;
              const score =
                typeof result.score === "number"
                  ? result.score
                  : result.details?.scorePercentage ?? 0;
              setQuizResult({
                score,
                correctAnswers,
                totalQuestions,
                passed: !!result.passed,
                questionResults: result.details?.questionResults || [],
                details: result.details || null,
              });
              setHasStarted(true);
            }
          } catch (resultError) {
          }
        }

        setLoading(false);
      } catch (error) {
        setError(error.message || "Failed to load quiz data");
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [lessonId, propQuizData, propQuizId, timeLimitSeconds]);

  useEffect(() => {
    const refetchResultIfNeeded = async () => {
      if (!quizId) return;
      try {
        const resultResponse = await getQuizResult(quizId);
        if (resultResponse.success && resultResponse.data) {
          const result = resultResponse.data;
          const totalQuestions =
            result.details?.totalQuestions ?? result.totalQuestions;
          const correctAnswers =
            result.details?.correctAnswers ?? result.correctAnswers;
          const score =
            typeof result.score === "number"
              ? result.score
              : result.details?.scorePercentage ?? 0;
          const processedResult = {
            score,
            correctAnswers,
            totalQuestions,
            passed: !!result.passed,
            questionResults: result.details?.questionResults || [],
            details: result.details || result,
          };
          setQuizResult(processedResult);
          setHasStarted(true);

          // Store the raw API result for later use in AI API call
          sessionStorage.setItem(
            `quiz_result_${quizId}`,
            JSON.stringify(result)
          );
        }
      } catch (e) {
      }
    };
    refetchResultIfNeeded();
  }, [quizId]);

  const effectiveTimeLimitSeconds =
    timeLimitSeconds ?? DEFAULT_TIME_LIMIT_MIN * 60;
  const [remainingSeconds, setRemainingSeconds] = useState(
    effectiveTimeLimitSeconds
  );

  // countdown effect moved below after handleSubmit declaration

  useEffect(() => {
    if (!hasStarted) setRemainingSeconds(effectiveTimeLimitSeconds);
  }, [effectiveTimeLimitSeconds, hasStarted]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    if (quizResult) return;
    setSelectedAnswers((prev) => {
      const next = { ...prev, [questionId]: answerIndex };
      return next;
    });
  };

  // Debug: track selectedAnswers changes over time
  useEffect(() => {}, [selectedAnswers]);

  const handleSubmit = React.useCallback(async () => {
    if (!quizId) {
      toast.error("Quiz ID is missing. Cannot submit.");
      return;
    }

    // Prepare answers array from selectedAnswers object
    // selectedAnswers uses question.id as key (can be MongoDB ID or index+1)
    // We need to map to questionIndex for backend
    const answersArray = quizData.questions
      .map((question, index) => {
        const answerIndex = selectedAnswers[question.id];
        if (answerIndex !== undefined) {
          return {
            questionIndex: index, // Index in randomized array (0-19)
            originalIndex: question.originalIndex, // Index in original pool (0-59)
            selectedAnswers: [answerIndex],
          };
        }
        return null;
      })
      .filter((item) => item !== null);


    if (answersArray.length === 0) {
      toast.error("Please answer at least one question before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await submitQuiz(quizId, answersArray);

      if (response.success && response.data) {
        const result = response.data;

        setQuizResult({
          score: result.score,
          correctAnswers: result.correctAnswers,
          totalQuestions: result.totalQuestions,
          passed: result.passed,
          questionResults: result.questionResults || [],
          selectedAnswers: selectedAnswers, // Lưu selectedAnswers để dùng cho AI
        });

        // Store selectedAnswers in sessionStorage for AI explanations
        sessionStorage.setItem(
          `quiz_selected_answers_${quizId}`,
          JSON.stringify(selectedAnswers)
        );

        if (result.passed) {
          toast.success(
            `🎉 Congratulations! You passed with ${Math.round(result.score)}%`
          );
        } else {
          toast.warning(
            `📝 You scored ${Math.round(
              result.score
            )}%. You need ${PASS_THRESHOLD}% to pass.`
          );
        }

        if (onQuizComplete) {
          onQuizComplete({
            lessonId,
            quizId,
            score: result.score,
            completed: result.passed,
            passed: result.passed,
          });
        }
      } else {
        throw new Error(response.message || "Failed to submit quiz");
      }
    } catch (err) {
      const errorMessage =
        err.message || "Failed to submit quiz. Please try again.";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [quizId, selectedAnswers, quizData, onQuizComplete, lessonId]);

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

  const getQuestionResultForIndex = (questionIndex) => {
    if (!quizResult) return null;
    const fromQR = Array.isArray(quizResult.questionResults)
      ? quizResult.questionResults.find(
          (d) => d.questionIndex === questionIndex
        )
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

  // Clear AI data when quizId changes
  useEffect(() => {
    setAiExplanations(null);
    setAiLoading(false);
    setAiError(null);
    setShowDetailModal(false);
  }, [quizId]);

  // Load cached AI explanations when quiz result is available
  useEffect(() => {
    if (quizResult && quizId && !aiExplanations) {
      const cacheKey = `ai_explanations_${quizId}`;
      try {
        const cachedData = sessionStorage.getItem(cacheKey);
        if (cachedData) {
          const parsed = JSON.parse(cachedData);
          const cacheTime = parsed.timestamp;
          const now = Date.now();
          // Cache valid for 30 minutes
          if (now - cacheTime < 30 * 60 * 1000) {
            setAiExplanations(parsed.data);
          } else {
            // Cache expired, remove it
            sessionStorage.removeItem(cacheKey);
          }
        }
      } catch (error) {
      }
    }
  }, [quizResult, quizId, aiExplanations]);

  // Re-added fetchAIExplanations function with sessionStorage caching
  const fetchAIExplanations = async (skipCache = false) => {
    if (!quizId || !quizData) {
      toast.error(
        "Quiz ID or Quiz Data is missing. Cannot fetch explanations."
      );
      return;
    }

    const cacheKey = `ai_explanations_${quizId}`;

    // Try to get from sessionStorage first (unless skipCache is true)
    if (!skipCache) {
      try {
        const cachedData = sessionStorage.getItem(cacheKey);
        if (cachedData) {
          const parsed = JSON.parse(cachedData);
          const cacheTime = parsed.timestamp;
          const now = Date.now();
          if (now - cacheTime < 30 * 60 * 1000) {
            setAiExplanations(parsed.data);
            return;
          } else {
            sessionStorage.removeItem(cacheKey);
          }
        }
      } catch (error) {
      }
    } else {
      sessionStorage.removeItem(cacheKey);
    }

    let userId = null;
    try {
      const userProfile = await getUserProfile();
      if (userProfile && userProfile.data) {
        userId = userProfile.data._id || userProfile.data.userId || null;
      }
    } catch (error) {
      toast.error("Failed to fetch user profile. Cannot fetch explanations.");
      return;
    }

    if (!userId) {
      toast.error("User ID is missing. Cannot fetch explanations.");
      return;
    }

    setAiLoading(true);
    setAiError(null);
    try {
      // Step 1: Get quiz result from sessionStorage (already fetched when entering quiz)
      const storedResult = sessionStorage.getItem(`quiz_result_${quizId}`);

      if (!storedResult) {
        throw new Error(
          "Quiz result not found in sessionStorage. Please refresh the page."
        );
      }

      let apiResponse;
      try {
        apiResponse = JSON.parse(storedResult);
      } catch (parseError) {
        throw new Error("Invalid quiz result data");
      }

      // Extract details from nested structure
      const details = apiResponse.details || {};
      const totalQuestions =
        details.totalQuestions || quizData.questions.length;
      const correctAnswers = details.correctAnswers || 0;
      const scorePercentage = details.scorePercentage || apiResponse.score || 0;
      const passed =
        details.passed !== undefined ? details.passed : apiResponse.passed;


      // Build complete questionsForAI from quizData and selectedAnswers (no database needed)
      
      // Get selectedAnswers from multiple sources (priority order)
      let answersToUse = quizResult?.selectedAnswers || selectedAnswers;
      
      // If still empty, try to load from sessionStorage
      if (!answersToUse || Object.keys(answersToUse).length === 0) {
        try {
          const storedAnswers = sessionStorage.getItem(`quiz_selected_answers_${quizId}`);
          if (storedAnswers) {
            answersToUse = JSON.parse(storedAnswers);
          }
        } catch (error) {
        }
      }
      
      const questionsForAI = quizData.questions.map((question, index) => {
        // Get user answer from selectedAnswers (what student actually selected)
        const userAnswerIndex = answersToUse[question.id];
        
        // Determine if answer is correct
        const isCorrect = userAnswerIndex !== undefined && userAnswerIndex === question.correctAnswer;


        return {
          questionIndex: index,
          originalIndex: question.originalIndex, // Include originalIndex for reference
          questionId: question._id || question.id,
          questionText: question.question,
          options: question.options.map((opt, optIndex) => ({
            index: optIndex,
            content: typeof opt === "string" ? opt : opt.content,
          })),
          correctAnswer: question.correctAnswer,
          userAnswer: userAnswerIndex !== undefined ? userAnswerIndex : null,
          isCorrect: isCorrect,
          // Add user answer text and correct answer text for AI
          userAnswerText: userAnswerIndex !== undefined ? 
            (typeof question.options[userAnswerIndex] === "string" ? 
             question.options[userAnswerIndex] : 
             question.options[userAnswerIndex]?.content || "Invalid answer") : "Not answered",
          correctAnswerText: typeof question.options[question.correctAnswer] === "string" ? 
            question.options[question.correctAnswer] : 
            question.options[question.correctAnswer]?.content || "Invalid answer"
        };
      });


      // Step 3: Send complete quiz data to AI API (no database questionResults needed)


      const response = await apiClient.post("/ai/explain-quiz", {
        quizId,
        userId,
        quizData: {
          title: quizData.title,
          description: quizData.description,
          questions: questionsForAI, // Send complete questions with user answers
        },
        quizResult: {
          score: scorePercentage,
          correctAnswers,
          totalQuestions,
          passed,
        },
      });


      // Handle different response formats
      if (!response.data) {
        throw new Error("No response data from AI API");
      }

      // Check if response is successful (handle both success field and direct data)
      const isSuccess =
        response.data.success === true || response.data.explanations;

      if (isSuccess) {
        // Extract explanations - handle multiple possible response formats
        const explanations =
          response.data.data?.explanations ||
          response.data.explanations ||
          response.data ||
          [];

        setAiExplanations(explanations);

        // Save to sessionStorage
        try {
          sessionStorage.setItem(
            cacheKey,
            JSON.stringify({
              data: explanations,
              timestamp: Date.now(),
            })
          );
        } catch (error) {
          if (error.name === "QuotaExceededError") {
            try {
              Object.keys(sessionStorage).forEach((key) => {
                if (key.startsWith("ai_explanations_")) {
                  sessionStorage.removeItem(key);
                }
              });
              sessionStorage.setItem(
                cacheKey,
                JSON.stringify({
                  data: explanations,
                  timestamp: Date.now(),
                })
              );
            } catch (retryError) {
            }
          }
        }
      } else {
        const errorMsg =
          response.data.message ||
          response.data.error ||
          "Failed to fetch explanations";
        setAiError(errorMsg);
      }
    } catch (error) {

      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "An error occurred while fetching explanations";
      setAiError(errorMsg);
      toast.error(`Failed to fetch AI explanations: ${errorMsg}`);
    } finally {
      setAiLoading(false);
    }
  };

  if (loading)
    return (
      <div className="quiz-loading">
        <div className="loading-spinner"></div>
        <p>Loading quiz content...</p>
      </div>
    );

  if (error)
    return (
      <div className="quiz-error">
        <div className="error-icon">⚠️</div>
        <h3>Unable to load quiz</h3>
        <p>{error}</p>
        <button className="retry-btn" onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );

  if (!quizData)
    return (
      <div className="quiz-empty">
        <div className="empty-icon">📝</div>
        <h3>No Quiz Available</h3>
        <p>There is no quiz available for this lesson at the moment.</p>
      </div>
    );

  const totalQuestions = quizData.questions.length;
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
          <div className="intro-row">
            <span>Total questions:</span>
            <strong>{totalQuestions}</strong>
          </div>
          <div className="intro-row">
            <span>Time limit:</span>
            <strong>{Math.ceil(effectiveTimeLimitSeconds / 60)} minutes</strong>
          </div>
        </div>

        <div className="quiz-instructions">
          <h3>Instructions</h3>
          <ul>
            <li>Answer all questions before submitting.</li>
            <li>
              Pass threshold: <strong>{PASS_THRESHOLD}%</strong>.
            </li>
            <li>Timer starts when you begin the quiz.</li>
          </ul>
        </div>

        <div className="quiz-actions">
          <button
            className="start-quiz-btn"
            onClick={() => {
              setRemainingSeconds(effectiveTimeLimitSeconds);
              setHasStarted(true);
            }}
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      {quizResult && (
        <div className={`quiz-result ${quizResult.passed ? "pass" : "fail"}`}>
          <div className="result-header">
            <div
              className={`result-icon ${quizResult.passed ? "pass" : "fail"}`}
            >
              {quizResult.passed ? "🎉" : "📝"}
            </div>
            <h2>{quizResult.passed ? "Congratulations!" : "Keep Learning!"}</h2>
            <p>
              {quizResult.passed
                ? "You have successfully passed the quiz!"
                : "Don't worry, you can try again!"}
            </p>
          </div>

          <div className="result-stats">
            <div className="score-circle">
              <div className="circle-background"></div>
              <div className="circle-content">
                <span className="score-percent">
                  {Math.round(quizResult.score)}%
                </span>
                <span className="score-text">Score</span>
              </div>
            </div>

            <div className="result-details">
              <div className="detail-item">
                <span className="detail-label">Correct Answers</span>
                <span className="detail-value">
                  {quizResult.correctAnswers}/{quizResult.totalQuestions}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Status</span>
                <span
                  className={`detail-value status ${
                    quizResult.passed ? "passed" : "failed"
                  }`}
                >
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
                onClick={async () => {
                  // Reset quiz state
                  setQuizResult(null);
                  setSelectedAnswers({});
                  setCurrentQuestionIndex(0);
                  setShowExplanation(false);
                  setRemainingSeconds(effectiveTimeLimitSeconds);
                  setLoading(true);

                  // Clear old selectedAnswers from sessionStorage
                  sessionStorage.removeItem(`quiz_selected_answers_${quizId}`);
                  
                  try {
                    // Fetch fresh quiz data with cache busting
                    let freshQuiz = null;
                    
                    if (propQuizId) {
                      const actualQuizId = typeof propQuizId === 'object' ? propQuizId._id || propQuizId.id : propQuizId;
                      const response = await apiClient.get(`quiz/${actualQuizId}?t=${Date.now()}`);
                      freshQuiz = response.data.data;
                    } else if (lessonId) {
                      const actualLessonId = typeof lessonId === 'object' ? lessonId._id || lessonId.id : lessonId;
                      const response = await apiClient.get(`quiz/by-lesson/${actualLessonId}?t=${Date.now()}`);
                      freshQuiz = response.data.data;
                    }
                    
                    if (freshQuiz) {
                      // Process questions to ensure they have proper IDs
                      const processedQuestions = freshQuiz.questions.map((q, index) => ({
                        ...q,
                        id: q.id || `question_${index}`,
                        question: q.content || q.question,
                        options: q.answers
                          ? q.answers.map((a) => a.content)
                          : q.options || [],
                        correctAnswer: q.answers
                          ? q.answers.findIndex((a) => a.isCorrect)
                          : q.correctAnswer || 0,
                      }));

                      const processedQuiz = {
                        ...freshQuiz,
                        questions: processedQuestions,
                      };

                      setQuizData(processedQuiz);
                      setLoading(false);
                      setHasStarted(true);
                    } else {
                      setError("Failed to load fresh quiz questions");
                      setLoading(false);
                    }
                  } catch (error) {
                    setError("Failed to load fresh quiz questions");
                    setLoading(false);
                  }
                }}
              >
                <span className="btn-icon">🔄</span>
                Retake Quiz
              </button>
              {/* Only show AI explanation button if passed */}
              {quizResult.passed && (
                <button
                  className="view-detail-btn"
                  onClick={() => {
                    setShowDetailModal(true);
                    if (!aiExplanations) fetchAIExplanations();
                  }}
                  title={
                    aiExplanations
                      ? "View cached AI explanations"
                      : "Fetch AI explanations"
                  }
                >
                  AI Explanations
                  {aiExplanations && <span className="cached-badge">📦</span>}
                </button>
              )}
              {/* Show answers only button if failed */}
              {!quizResult.passed && (
                <button
                  className="view-detail-btn"
                  onClick={() => {
                    setShowDetailModal(true);
                  }}
                  title="View correct answers"
                >
                  <span className="btn-icon">📝</span>
                  View Answers
                </button>
              )}
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
                <span className="progress-count">
                  {formatTime(remainingSeconds)}
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className={`progress-fill ${
                    remainingSeconds / effectiveTimeLimitSeconds <= 0.2
                      ? "danger"
                      : remainingSeconds / effectiveTimeLimitSeconds <= 0.5
                      ? "warning"
                      : "safe"
                  }`}
                  style={{
                    width: `${
                      (remainingSeconds / effectiveTimeLimitSeconds) * 100
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            <div
              className={`quiz-timer ${
                remainingSeconds / effectiveTimeLimitSeconds <= 0.2
                  ? "danger"
                  : remainingSeconds / effectiveTimeLimitSeconds <= 0.4
                  ? "warning"
                  : ""
              }`}
            >
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
                      className={`question-indicator ${
                        index === currentQuestionIndex ? "active" : ""
                      } ${
                        selectedAnswers[question.id] !== undefined
                          ? "answered"
                          : ""
                      }`}
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
                  {isSubmitting ? (
                    <>
                      <span className="submit-spinner"></span> Submitting...
                    </>
                  ) : (
                    "Submit Quiz"
                  )}
                </button>
              </div>
            </div>

            {/* Question & Answers */}
            <div className="quiz-answer-section">
              <div className="current-question">
                <div className="question-content">
                  <h3 className="question-title">
                    <span className="question-number">
                      Question {currentQuestionIndex + 1}
                    </span>
                    {currentQuestion.question}
                  </h3>

                  <div className="answer-options">
                    {currentQuestion.options.map((option, optIndex) => {
                      const isSelected =
                        selectedAnswers[currentQuestion.id] === optIndex;
                      const resultDetail =
                        getQuestionResultForIndex(currentQuestionIndex);
                      const showResult = quizResult !== null;
                      const isCorrectOption = !!(
                        resultDetail &&
                        Array.isArray(resultDetail.correctAnswers) &&
                        resultDetail.correctAnswers.some(
                          (a) => a.index === optIndex
                        )
                      );
                      const isWrongSelection = !!(
                        resultDetail &&
                        Array.isArray(resultDetail.userAnswers) &&
                        resultDetail.userAnswers.some(
                          (a) => a.index === optIndex
                        ) &&
                        !resultDetail.isCorrect
                      );

                      return (
                        <div
                          key={optIndex}
                          className={`answer-option ${
                            isSelected ? "selected" : ""
                          } ${showResult && isCorrectOption ? "correct" : ""} ${
                            showResult && isWrongSelection ? "wrong" : ""
                          }`}
                          onClick={() =>
                            handleAnswerSelect(currentQuestion.id, optIndex)
                          }
                        >
                          <div className="option-selector">
                            <div
                              className={`option-circle ${
                                isSelected ? "selected" : ""
                              }`}
                            >
                              {showResult && isCorrectOption && (
                                <span className="indicator correct">✓</span>
                              )}
                              {showResult && isWrongSelection && (
                                <span className="indicator wrong">✗</span>
                              )}
                              {!showResult && isSelected && (
                                <span className="indicator selected">•</span>
                              )}
                            </div>
                            <span className="option-letter">
                              {String.fromCharCode(65 + optIndex)}
                            </span>
                          </div>
                          <span className="option-text">
                            {typeof option === "string"
                              ? option
                              : option.content}
                          </span>
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
                      onClick={() =>
                        setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
                      }
                      disabled={currentQuestionIndex === 0}
                    >
                      ← Previous
                    </button>

                    <div className="nav-progress"></div>

                    <button
                      className="nav-btn next-btn"
                      onClick={() =>
                        setCurrentQuestionIndex((prev) =>
                          Math.min(totalQuestions - 1, prev + 1)
                        )
                      }
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

      {/* Detail Modal for Quiz Results */}
      {quizResult && showDetailModal && (
        <AIExplanationPanel
          items={aiExplanations}
          loading={aiLoading}
          error={aiError}
          onRetry={(skipCache = false) => fetchAIExplanations(skipCache)}
          quizResult={quizResult}
          showModal={true}
          onClose={() => {
            setShowDetailModal(false);
            setAiLoading(false);
            setAiError(null);
          }}
        />
      )}
    </div>
  );
};

export default QuizContent;
