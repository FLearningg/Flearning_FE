import React, { useState } from "react";
import { Sparkles, X, Loader2, AlertCircle, FileText } from "lucide-react";
import { toast } from "react-toastify";
import { generateQuizWithAI } from "../../services/quizService";
import "../../assets/CRUDCourseAndLesson/AIQuizGeneratorModal.css";

export default function AIQuizGeneratorModal({
  open,
  onClose,
  onQuizGenerated,
  courseId,
  sectionIndex,
  lessonIndex,
  currentSection, // Add section data to access lessons
}) {
  const [formData, setFormData] = useState({
    topic: "",
    lessonContent: "",
    numberOfQuestions: 5,
    difficulty: "medium",
    questionType: "multiple-choice",
    title: "",
    description: "",
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [autoLoadedContent, setAutoLoadedContent] = useState(false);

  // Auto-load lesson content from section when modal opens
  React.useEffect(() => {
    if (open && currentSection && !autoLoadedContent) {
      // Collect lesson notes from all lessons in the section
      const lessonNotes = currentSection.lessons
        .filter(lesson => lesson.lessonNotes && lesson.lessonNotes.trim().length > 0)
        .map((lesson, idx) => {
          const title = lesson.title || `Lesson ${idx + 1}`;
          return `=== ${title} ===\n${lesson.lessonNotes}`;
        })
        .join('\n\n');

      if (lessonNotes.trim().length > 0) {
        setFormData(prev => ({
          ...prev,
          lessonContent: lessonNotes,
          topic: prev.topic || currentSection.name || "Quiz"
        }));
        setAutoLoadedContent(true);
      }
    }

    // Reset auto-loaded flag when modal closes
    if (!open) {
      setAutoLoadedContent(false);
    }
  }, [open, currentSection, autoLoadedContent]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleGenerate = async () => {
    if (!formData.topic.trim()) {
      setError("Topic is required");
      return;
    }

    if (formData.numberOfQuestions < 1 || formData.numberOfQuestions > 50) {
      setError("Number of questions must be between 1 and 50");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      console.log("Generating quiz with params:", {
        ...formData,
        courseId,
      });

      const response = await generateQuizWithAI({
        ...formData,
        courseId,
        title: formData.title || `Quiz: ${formData.topic}`,
        description:
          formData.description || `AI-generated quiz about ${formData.topic}`,
      });

      if (!response.success || !response.data?.quiz) {
        throw new Error(response.message || "Failed to generate quiz");
      }

      const generatedQuiz = response.data.quiz;
      console.log("Generated quiz:", generatedQuiz);

      // Transform backend quiz format to frontend format
      const transformedQuiz = {
        _id: `temp-quiz-ai-${Date.now()}`,
        title: generatedQuiz.title,
        description: generatedQuiz.description,
        isTemporary: true,
        isAIGenerated: true,
        questions: generatedQuiz.questions.map((q) => ({
          question: q.content,
          options: q.answers.map((a) => a.content),
          correctAnswer: q.answers.findIndex((a) => a.isCorrect),
          score: q.score || 10,
        })),
        questionPoolSize: generatedQuiz.questionPoolSize || null,
        estimatedDuration: generatedQuiz.questions.length * 60,
      };

      toast.success(
        `Quiz generated successfully! ${transformedQuiz.questions.length} questions created. Review and edit before saving.`
      );

      // Pass the quiz to parent component
      onQuizGenerated(transformedQuiz, sectionIndex, lessonIndex);

      // Reset form
      setFormData({
        topic: "",
        lessonContent: "",
        numberOfQuestions: 5,
        difficulty: "medium",
        questionType: "multiple-choice",
        title: "",
        description: "",
      });

      onClose();
    } catch (err) {
      console.error("Error generating quiz:", err);
      setError(err.message || "Failed to generate quiz with AI");
      toast.error(err.message || "Failed to generate quiz with AI");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!open) return null;

  return (
    <div className="ai-quiz-modal-overlay">
      <div className="ai-quiz-modal-content">
        <div className="ai-quiz-modal-header">
          <div className="ai-quiz-modal-title">
            <Sparkles size={24} className="ai-icon" />
            <h3>Generate Quiz with AI</h3>
          </div>
          <button onClick={onClose} className="ai-quiz-modal-close">
            <X size={20} />
          </button>
        </div>

        <div className="ai-quiz-modal-body">
          {error && (
            <div className="ai-quiz-error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="ai-quiz-form">
            <div className="form-group">
              <label className="form-label required">
                Topic
                <span className="required-mark">*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Introduction to React Hooks"
                value={formData.topic}
                onChange={(e) => handleChange("topic", e.target.value)}
                disabled={isGenerating}
              />
              <small className="form-hint">
                The main topic or subject for the quiz
              </small>
            </div>

            <div className="form-group">
              <label className="form-label">Quiz Title (Optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="Leave empty to auto-generate from topic"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                disabled={isGenerating}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description (Optional)</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Leave empty to auto-generate from topic"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                disabled={isGenerating}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <FileText size={16} />
                Lesson Content (Optional - for context)
              </label>
              {autoLoadedContent && formData.lessonContent && (
                <div style={{
                  padding: "8px 12px",
                  background: "#f0fdf4",
                  border: "1px solid #86efac",
                  borderRadius: "6px",
                  marginBottom: "8px",
                  fontSize: "13px",
                  color: "#166534"
                }}>
                  <strong>✓ Auto-loaded:</strong> {formData.lessonContent.length} characters from {currentSection?.lessons?.filter(l => l.lessonNotes?.trim().length > 0).length || 0} lesson(s)
                </div>
              )}
              <textarea
                className="form-textarea"
                rows={6}
                placeholder="Lesson content will be auto-loaded from this section, or paste your own content here..."
                value={formData.lessonContent}
                onChange={(e) => handleChange("lessonContent", e.target.value)}
                disabled={isGenerating}
              />
              <small className="form-hint">
                AI will analyze lesson notes to create relevant questions. Edit or add more content if needed.
              </small>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Number of Questions</label>
                <input
                  type="number"
                  className="form-input"
                  min="1"
                  max="50"
                  value={formData.numberOfQuestions}
                  onChange={(e) =>
                    handleChange(
                      "numberOfQuestions",
                      parseInt(e.target.value, 10) || 5
                    )
                  }
                  disabled={isGenerating}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Difficulty Level</label>
                <select
                  className="form-select"
                  value={formData.difficulty}
                  onChange={(e) => handleChange("difficulty", e.target.value)}
                  disabled={isGenerating}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Question Type</label>
              <select
                className="form-select"
                value={formData.questionType}
                onChange={(e) => handleChange("questionType", e.target.value)}
                disabled={isGenerating}
              >
                <option value="multiple-choice">Multiple Choice</option>
                <option value="true-false">True/False</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>
          </div>
        </div>

        <div className="ai-quiz-modal-footer">
          <button
            onClick={onClose}
            className="btn-secondary"
            disabled={isGenerating}
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            className="btn-primary"
            disabled={isGenerating || !formData.topic.trim()}
          >
            {isGenerating ? (
              <>
                <Loader2 size={16} className="spinner" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Generate Quiz
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
