import apiClient from "./authService";

/**
 * Start a proctoring session
 */
export const startProctoringSession = async (quizId, resultId = null) => {
  try {
    const response = await apiClient.post('/proctoring/start', {
      quizId,
      resultId
    });

    return response.data;
  } catch (error) {
    console.error("Error starting proctoring session:", error);
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to start proctoring session";
    throw new Error(message);
  }
};

/**
 * Log a violation
 */
export const logViolation = async (sessionId, violationType, details = {}) => {
  try {
    const response = await apiClient.post('/proctoring/violation', {
      sessionId,
      violationType,
      details
    });

    return response.data;
  } catch (error) {
    console.error("Error logging violation:", error);
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to log violation";
    throw new Error(message);
  }
};

/**
 * Get session status
 */
export const getSessionStatus = async (sessionId) => {
  try {
    const response = await apiClient.get(`/proctoring/session/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error("Error getting session status:", error);
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to get session status";
    throw new Error(message);
  }
};

/**
 * End proctoring session
 */
export const endProctoringSession = async (sessionId, status = 'completed') => {
  try {
    const response = await apiClient.post('/proctoring/end', {
      sessionId,
      status
    });

    return response.data;
  } catch (error) {
    console.error("Error ending proctoring session:", error);
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to end proctoring session";
    throw new Error(message);
  }
};

/**
 * Get proctoring report (instructor only)
 */
export const getProctoringReport = async (sessionId) => {
  try {
    const response = await apiClient.get(`/proctoring/report/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error("Error getting proctoring report:", error);
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to get proctoring report";
    throw new Error(message);
  }
};
