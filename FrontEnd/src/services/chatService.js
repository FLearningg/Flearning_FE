import apiClient from "./authService";

// Chat API Endpoints
export const sendMessage = (messageData) =>
  apiClient.post("/chat/send", messageData);

export const getConversations = (page = 1, limit = 20) =>
  apiClient.get(`/chat/conversations?page=${page}&limit=${limit}`);

export const getConversationMessages = (conversationId, page = 1, limit = 50) =>
  apiClient.get(
    `/chat/conversations/${conversationId}/messages?page=${page}&limit=${limit}`
  );

export const markMessagesAsRead = (conversationId) =>
  apiClient.put(`/chat/conversations/${conversationId}/read`);

export const getUnreadCount = () => apiClient.get("/chat/unread-count");

export const deleteMessage = (messageId) =>
  apiClient.delete(`/chat/messages/${messageId}`);

export const searchChat = (query, type = "all") =>
  apiClient.get(`/chat/search?query=${encodeURIComponent(query)}&type=${type}`);

// Conversation API Endpoints
export const createConversation = (participantIds) =>
  apiClient.post("/conversations", { participantIds });

export const getConversationById = (conversationId) =>
  apiClient.get(`/conversations/${conversationId}`);

export const updateConversation = (conversationId, updateData) =>
  apiClient.put(`/conversations/${conversationId}`, updateData);

export const deleteConversation = (conversationId) =>
  apiClient.delete(`/conversations/${conversationId}`);

export const getConversationStats = () => apiClient.get("/conversations/stats");

export const getRecentConversations = (limit = 10) =>
  apiClient.get(`/conversations/recent?limit=${limit}`);

export const refreshToken = () => apiClient.post("/auth/refresh-token");
