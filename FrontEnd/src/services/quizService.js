import apiClient from "./authService";

// Upload Word document to create quiz or save quiz data
export const uploadWordQuiz = async (
  file,
  courseId,
  title,
  description,
  options = {}
) => {
  try {
    // Validate courseId - allow null for temporary quizzes
    const validCourseId =
      courseId &&
      courseId !== "undefined" &&
      courseId !== "null" &&
      courseId.toString().trim() !== ""
        ? courseId.toString().trim()
        : null;

    // If options contains quiz data, save directly to database
    if (options.questions && options.fileUrl) {
      // Get current user for userId
      const currentUser = JSON.parse(
        localStorage.getItem("currentUser") || "{}"
      );
      const userId = currentUser._id || currentUser.id;

      const requestData = {
        title,
        description,
        courseId: validCourseId,
        questionPoolSize: options.questionPoolSize || null, // Add questionPoolSize support
        questions: options.questions.map((q) => ({
          content: q.question,
          type: "multiple-choice",
          score: q.score || 1,
          answers: q.options.map((option, idx) => ({
            content: option,
            isCorrect: idx === q.correctAnswer,
          })),
        })),
        firebaseUrl: options.fileUrl,
        userId: userId,
      };

      // Add section and lesson creation parameters if provided
      if (options.sectionId) {
        requestData.sectionId = options.sectionId;
      }
      if (options.autoCreateLesson) {
        requestData.autoCreateLesson = options.autoCreateLesson;
      }

      const response = await apiClient.post(
        "quiz/create-from-data",
        requestData
      );

      return response.data;
    }

    // Original file upload logic
    if (!file) {
      throw new Error("No file provided for quiz upload");
    }

    const formData = new FormData();
    formData.append("wordFile", file);
    if (validCourseId) {
      formData.append("courseId", validCourseId);
    }
    formData.append("title", title);
    formData.append("description", description);

    // Add additional options to FormData
    if (options.sectionId) {
      formData.append("sectionId", options.sectionId);
    }
    if (options.autoCreateLesson) {
      formData.append("autoCreateLesson", options.autoCreateLesson);
    }

    const response = await apiClient.post("quiz/upload-word", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error uploading Word quiz:", error);

    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to upload Word quiz";
    throw new Error(message);
  }
};

// Get quiz by ID
export const getQuizById = async (quizId) => {
  try {
    const response = await apiClient.get(`quiz/${quizId}`);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || "Failed to fetch quiz";
    const richError = new Error(message);
    richError.status = error.response?.status;
    richError.data = error.response?.data;
    throw richError;
  }
};

// Get all quizzes for a course
export const getQuizzesByCourse = async (courseId) => {
  try {
    const response = await apiClient.get(`quiz/course/${courseId}`);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch course quizzes";
    throw new Error(message);
  }
};

// Update quiz
export const updateQuiz = async (quizId, quizData) => {
  try {
    // Extract ID if object is passed instead of ID string
    const actualQuizId = typeof quizId === "object" ? quizId._id : quizId;

    // Validate quiz ID
    if (!actualQuizId || typeof actualQuizId !== "string") {
      throw new Error("Invalid Quiz ID format");
    }

    // Clean quiz ID - remove any prefixes or invalid characters
    const cleanQuizId = actualQuizId.toString().trim();

    const response = await apiClient.put(`quiz/${cleanQuizId}`, quizData);

    return response.data;
  } catch (error) {
    console.error("Error updating quiz:", error);

    const message =
      error.response?.data?.message || error.message || "Failed to update quiz";
    throw new Error(message);
  }
};

// Delete quiz
export const deleteQuiz = async (quizId) => {
  try {
    const response = await apiClient.delete(`quiz/${quizId}`);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || "Failed to delete quiz";
    throw new Error(message);
  }
};

// Link temporary quiz to course
export const linkQuizToCourse = async (quizId, courseId, userId = null) => {
  try {
    const requestData = {
      courseId: courseId,
    };

    // Add userId if provided or get from localStorage
    if (userId) {
      requestData.userId = userId;
    } else {
      // Try to get current user from localStorage
      const currentUser = JSON.parse(
        localStorage.getItem("currentUser") || "{}"
      );
      if (currentUser._id || currentUser.id) {
        requestData.userId = currentUser._id || currentUser.id;
      }
    }

    const response = await apiClient.put(
      `quiz/${quizId}/link-course`,
      requestData
    );
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to link quiz to course";
    throw new Error(message);
  }
};

// Submit quiz answers
export const submitQuiz = async (quizId, answers, options = {}) => {
  try {
    const payload = { answers };
    if (options.retake) payload.retake = true;
    const response = await apiClient.post(`quiz/${quizId}/submit`, payload);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || "Failed to submit quiz";
    const richError = new Error(message);
    richError.status = error.response?.status;
    richError.data = error.response?.data;
    throw richError;
  }
};

// Get quiz result
export const getQuizResult = async (quizId) => {
  try {
    const response = await apiClient.get(`quiz/${quizId}/result`);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch quiz result";
    const richError = new Error(message);
    richError.status = error.response?.status;
    richError.data = error.response?.data;
    throw richError;
  }
};

// Get quiz history (all quizzes student has taken)
export const getQuizHistory = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.courseId) queryParams.append("courseId", params.courseId);
    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);

    const queryString = queryParams.toString();
    const url = `quiz/my-results${queryString ? `?${queryString}` : ""}`;

    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch quiz history";
    const richError = new Error(message);
    richError.status = error.response?.status;
    richError.data = error.response?.data;
    throw richError;
  }
};

// Generate quiz using AI
export const generateQuizWithAI = async (params) => {
  try {
    const {
      topic,
      lessonContent = '',
      numberOfQuestions = 5,
      difficulty = 'medium',
      questionType = 'multiple-choice',
      courseId,
      lessonId = null,
      title = '',
      description = ''
    } = params;

    // Validate required fields
    if (!topic || topic.trim().length === 0) {
      throw new Error("Topic is required for AI quiz generation");
    }

    if (!courseId) {
      throw new Error("Course ID is required for AI quiz generation");
    }

    const response = await apiClient.post('ai/generate-quiz', {
      topic: topic.trim(),
      lessonContent,
      numberOfQuestions: parseInt(numberOfQuestions, 10),
      difficulty,
      questionType,
      courseId,
      lessonId,
      title: title || `Quiz: ${topic}`,
      description: description || `AI-generated quiz about ${topic}`
    });

    return response.data;
  } catch (error) {
    console.error("Error generating quiz with AI:", error);

    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to generate quiz with AI";

    const richError = new Error(message);
    richError.status = error.response?.status;
    richError.data = error.response?.data;
    throw richError;
  }
};

// Create essay-only quiz
export const createEssayQuiz = async (quizData) => {
  try {
    const { title, description, courseId, lessonId, questions } = quizData;

    // Validate required fields
    if (!title || title.trim().length === 0) {
      throw new Error("Quiz title is required");
    }

    if (!questions || questions.length === 0) {
      throw new Error("At least one essay question is required");
    }

    // Validate essay questions
    const invalidQuestions = questions.filter(
      q => !q.content || !q.content.trim() || q.type !== 'essay'
    );

    if (invalidQuestions.length > 0) {
      throw new Error("All questions must have content and be of type 'essay'");
    }

    const response = await apiClient.post('quiz/create-essay', {
      title: title.trim(),
      description: description?.trim() || '',
      courseId: courseId || null,
      lessonId: lessonId || null,
      quizType: 'essay',
      questions: questions.map(q => ({
        content: q.content.trim(),
        type: 'essay',
        essayGuideline: q.essayGuideline?.trim() || '',
        essayMaxLength: q.essayMaxLength || 1000,
        score: q.score || 10,
        order: q.order || 0
      }))
    });

    return response.data;
  } catch (error) {
    console.error("Error creating essay quiz:", error);

    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to create essay quiz";

    const richError = new Error(message);
    richError.status = error.response?.status;
    richError.data = error.response?.data;
    throw richError;
  }
};

// Submit essay quiz answers
export const submitEssayQuiz = async (quizId, essayAnswers) => {
  try {
    if (!quizId) {
      throw new Error("Quiz ID is required");
    }

    if (!essayAnswers || essayAnswers.length === 0) {
      throw new Error("Essay answers are required");
    }

    const response = await apiClient.post(`quiz/${quizId}/submit`, {
      essayAnswers: essayAnswers.map(ans => ({
        questionIndex: ans.questionIndex,
        questionContent: ans.questionContent,
        studentAnswer: ans.studentAnswer?.trim() || '',
        maxScore: ans.maxScore || 10
      }))
    });

    return response.data;
  } catch (error) {
    console.error("Error submitting essay quiz:", error);

    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to submit essay quiz";

    const richError = new Error(message);
    richError.status = error.response?.status;
    richError.data = error.response?.data;
    throw richError;
  }
};

// Grade essay answers with AI
export const gradeEssayAnswers = async (resultId) => {
  try {
    if (!resultId) {
      throw new Error("Result ID is required");
    }

    const response = await apiClient.post('ai/grade-essay', {
      resultId
    });

    return response.data;
  } catch (error) {
    console.error("Error grading essay answers:", error);

    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to grade essay answers";

    const richError = new Error(message);
    richError.status = error.response?.status;
    richError.data = error.response?.data;
    throw richError;
  }
};

// Get essay quiz result with AI grading
export const getEssayQuizResult = async (quizId) => {
  try {
    if (!quizId) {
      throw new Error("Quiz ID is required");
    }

    const response = await apiClient.get(`quiz/${quizId}/result`);

    return response.data;
  } catch (error) {
    console.error("Error fetching essay quiz result:", error);

    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch essay quiz result";

    const richError = new Error(message);
    richError.status = error.response?.status;
    richError.data = error.response?.data;
    throw richError;
  }
};
