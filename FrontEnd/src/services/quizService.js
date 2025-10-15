import apiClient from "./authService";

// Upload Word document to create quiz or save quiz data
export const uploadWordQuiz = async (file, courseId, title, description, options = {}) => {
  try {
    // Validate courseId - allow null for temporary quizzes
    const validCourseId = (courseId && courseId !== "undefined" && courseId !== "null" && courseId.toString().trim() !== "") 
      ? courseId.toString().trim() 
      : null;

    // If options contains quiz data, save directly to database
    if (options.questions && options.fileUrl) {
      // Get current user for userId
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
      const userId = currentUser._id || currentUser.id;

      const requestData = {
        title,
        description,
        courseId: validCourseId,
        questions: options.questions.map(q => ({
          content: q.question,
          type: "multiple-choice",
          score: q.score || 1,
          answers: q.options.map((option, idx) => ({
            content: option,
            isCorrect: idx === q.correctAnswer
          }))
        })),
        firebaseUrl: options.fileUrl,
        userId: userId
      };

      // Add section and lesson creation parameters if provided
      if (options.sectionId) {
        requestData.sectionId = options.sectionId;
      }
      if (options.autoCreateLesson) {
        requestData.autoCreateLesson = options.autoCreateLesson;
      }

      const response = await apiClient.post("quiz/create-from-data", requestData);
      
      
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
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch quiz";
    throw new Error(message);
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
    const actualQuizId = typeof quizId === 'object' ? quizId._id : quizId;
    
    
    // Validate quiz ID
    if (!actualQuizId || typeof actualQuizId !== 'string') {
      throw new Error("Invalid Quiz ID format");
    }

    // Clean quiz ID - remove any prefixes or invalid characters
    const cleanQuizId = actualQuizId.toString().trim();
    

    const response = await apiClient.put(`quiz/${cleanQuizId}`, quizData);
    
    return response.data;
  } catch (error) {
    console.error("Error updating quiz:", error);
    
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to update quiz";
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
      error.response?.data?.message ||
      error.message ||
      "Failed to delete quiz";
    throw new Error(message);
  }
};

// Link temporary quiz to course
export const linkQuizToCourse = async (quizId, courseId, userId = null) => {
  try {
    const requestData = {
      courseId: courseId
    };

    // Add userId if provided or get from localStorage
    if (userId) {
      requestData.userId = userId;
    } else {
      // Try to get current user from localStorage
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
      if (currentUser._id || currentUser.id) {
        requestData.userId = currentUser._id || currentUser.id;
      }
    }

    const response = await apiClient.put(`quiz/${quizId}/link-course`, requestData);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to link quiz to course";
    throw new Error(message);
  }
};
