// AI service: call backend `/api/ai/explain-quiz` (preferred).
// If backend call fails, fall back to a local mock response so UI still works.
import apiClient from "./authService";

const MOCK_DELAY = 700; // ms

// Updated to include `userId` in the payload
export async function getAIExplanations(payload = {}) {
  // payload: { items: [{ questionIndex, question, options, userAnswerIndex, correctAnswerIndex }], mode, lang, detail, quizId, userId }
  const body = {
    quizId: payload.quizId || null,
    userId: payload.userId || null, // Added userId
    items: payload.items || [],
    mode: payload.mode || "wrong-only",
    lang: payload.lang || "auto",
    detail: payload.detail || "short",
  };

  // Try calling real backend
  try {
    // apiClient is expected to set Authorization header (JWT) already
    const resp = await apiClient.post("ai/explain-quiz", body);
    if (resp && resp.data) {
      // Expected backend shape: { success: true, data: { explanations: [...] } }
      return resp.data;
    }
  } catch (err) {
    // Don't throw — fall back to mock. Caller will get a successful mock response.
    // Log at debug level so developers can see why backend wasn't used.
    // eslint-disable-next-line no-console
    console.warn(
      "AI backend request failed, falling back to mock explanations:",
      err && err.message
    );
  }

  // Fallback mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      const explanations = (body.items || []).map((it) => {
        const isCorrect =
          typeof it.userAnswerIndex === "number" &&
          it.userAnswerIndex === it.correctAnswerIndex;
        const userText =
          it.options && it.options[it.userAnswerIndex]
            ? it.options[it.userAnswerIndex].content ||
              it.options[it.userAnswerIndex]
            : null;
        const correctText =
          it.options && it.options[it.correctAnswerIndex]
            ? it.options[it.correctAnswerIndex].content ||
              it.options[it.correctAnswerIndex]
            : null;

        const explanation = isCorrect
          ? `Good job — Your answer is correct. Brief rationale: The correct choice (${String.fromCharCode(
              65 + (it.correctAnswerIndex || 0)
            )}) is right because it matches the definition/condition in the question. Tip: review the concept around this topic for deeper understanding.`
          : `The correct answer is ${String.fromCharCode(
              65 + (it.correctAnswerIndex || 0)
            )}${
              correctText ? ` (${correctText})` : ""
            }. Reason: Based on the question, this choice best satisfies the required condition. Tip: re-read the core concept and compare the choices; focus on the differences.`;

        return {
          questionIndex: it.questionIndex,
          explanation,
          short: explanation.split(".").slice(0, 2).join("."),
          isCorrect,
          userAnswerText: userText,
          correctAnswerText: correctText,
        };
      });

      resolve({ success: true, data: { explanations } });
    }, MOCK_DELAY);
  });
}

const aiService = { getAIExplanations };
export default aiService;
