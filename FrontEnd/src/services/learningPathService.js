import api from "./authService";

// Survey API
export const surveyService = {
  // Submit survey preferences
  submitSurvey: async (surveyData) => {
    try {
      const response = await api.post("/survey/submit", surveyData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get user's learning preferences
  getPreferences: async () => {
    try {
      const response = await api.get("/survey/preferences");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update learning preferences
  updatePreferences: async (updateData) => {
    try {
      const response = await api.put("/survey/update", updateData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Check if user has completed survey
  checkCompletion: async () => {
    try {
      const response = await api.get("/survey/check-completion");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

// Recommendation API
export const recommendationService = {
  // Generate new learning path
  // Accepts a payload describing the user-submitted learning path (phases/steps and metadata)
  // For AI auto-generate: pass empty object {}
  generateLearningPath: async (payload = {}) => {
    try {
      const response = await api.post("/recommendations/generate", payload);
      console.log("🔥 generateLearningPath response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ generateLearningPath error:", error.response?.data || error);
      throw error.response?.data || error;
    }
  },

  // Get existing learning path
  getLearningPath: async () => {
    try {
      const response = await api.get("/recommendations/learning-path");
      console.log("🔥 getLearningPath response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ getLearningPath error:", error.response?.data || error);
      throw error.response?.data || error;
    }
  },
};

export default {
  survey: surveyService,
  recommendation: recommendationService,
};
