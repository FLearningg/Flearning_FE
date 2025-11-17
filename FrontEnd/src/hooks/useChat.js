import { useState, useEffect, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import {
  sendMessage,
  getConversations,
  getConversationMessages,
  markMessagesAsRead,
  getUnreadCount,
  searchChat,
  createConversation,
  refreshToken,
} from "../services/chatService";
import socket from "../utils/socket";

export const useChat = () => {
  const { currentUser, token } = useSelector((state) => state.auth);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(() => {
    // Khôi phục selectedConversation từ localStorage khi khởi tạo
    try {
      const saved = localStorage.getItem("selectedConversation");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [messages, setMessages] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({
    conversations: [],
    messages: [],
  });

  // Lazy loading states
  const [messagesPage, setMessagesPage] = useState(1);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [messagesPerPage] = useState(10);

  const socketRef = useRef(null);
  const selectedConversationRef = useRef(selectedConversation);
  const messagesLoadedRef = useRef(false);

  useEffect(() => {
    selectedConversationRef.current = selectedConversation;
  }, [selectedConversation]);

  useEffect(() => {
    if (!currentUser || !token) return;

    console.log("🔌 Initializing socket connection...", {
      currentUser: currentUser._id,
      socketConnected: socket.connected,
      socketUrl: socket.io.uri,
    });

    if (!socket.connected) {
      socket.auth = { token };
      socket.connect();
    }
    socketRef.current = socket;

    // Only emit join after connect
    const handleConnect = () => {
      console.log("✅ Socket connected successfully!", {
        socketId: socket.id,
        transport: socket.io.engine?.transport?.name,
        userId: currentUser._id,
        url: socket.io.uri,
      });
      socket.emit("join", { userId: currentUser._id });
    };
    socket.on("connect", handleConnect);

    // Main chat logic: handle new messages
    const handleNewMessage = (msg) => {
      console.log("🔍 DEBUG: handleNewMessage received:", {
        conversation_id: msg.conversation_id,
        message: msg.message?.substring(0, 20) + "...",
        status: msg.status,
        sender_id: msg.sender_id._id,
        currentUserId: currentUser?._id,
      });

      setConversations((prev) => {
        // Đưa hội thoại lên đầu danh sách khi có tin nhắn mới
        const updated = prev.map((conv) =>
          conv.id === msg.conversation_id
            ? {
                ...conv,
                lastMessage: msg.message,
                updatedAt: msg.createdAt,
                status: msg.status,
                lastMessageSenderId: msg.sender_id._id,
              }
            : conv
        );
        const idx = updated.findIndex(
          (conv) => conv.id === msg.conversation_id
        );
        if (idx > -1) {
          const [conv] = updated.splice(idx, 1);
          return [conv, ...updated];
        }
        return updated;
      });
      // Only add message to current conversation if it's not from current user
      // (to avoid duplicate when sending own messages)
      if (
        selectedConversationRef.current &&
        msg.conversation_id === selectedConversationRef.current.id &&
        msg.sender_id._id !== currentUser?._id
      ) {
        setMessages((prev) => {
          if (!prev.some((m) => m._id === msg._id)) {
            return [...prev, msg];
          }
          return prev;
        });
      }
    };
    socket.on("new_message", handleNewMessage);

    socket.on("conversation_updated", (conv) => {
      console.log("🔍 DEBUG: conversation_updated received:", conv);

      setConversations((prev) => {
        // Format conversation data to match frontend structure
        const formattedConv = {
          id: conv._id,
          lastMessage: conv.last_message,
          status: conv.status,
          updatedAt: conv.updatedAt,
          createdAt: conv.createdAt,
          // Extract otherParticipant from populated participants
          otherParticipant: conv.participants?.find(
            (p) => p._id.toString() !== currentUser?._id.toString()
          ) || null,
          participants: conv.participants,
        };

        console.log("🔍 DEBUG: formattedConv:", formattedConv);

        return prev.map((c) =>
          c.id === formattedConv.id ? { ...c, ...formattedConv } : c
        );
      });
    });

    socket.on("unread_count_updated", (count) => {
      setUnreadCount(count);
    });

    socket.on("conversation", (conv) => {
      console.log("🔍 DEBUG: new conversation received:", conv);

      // Format conversation data to match frontend structure
      const formattedConv = {
        id: conv._id,
        lastMessage: conv.last_message,
        status: conv.status,
        updatedAt: conv.updatedAt,
        createdAt: conv.createdAt,
        // Extract otherParticipant from populated participants
        otherParticipant: conv.participants?.find(
          (p) => p._id.toString() !== currentUser?._id.toString()
        ) || null,
        participants: conv.participants,
      };

      console.log("🔍 DEBUG: formattedConv (new):", formattedConv);

      setConversations((prev) => [formattedConv, ...prev]);
    });

    socket.on("connect_error", async (err) => {
      console.error("🚨 Socket connection error:", {
        error: err.message,
        description: err.description,
        context: err.context,
        type: err.type,
        transport: socket.io.engine?.transport?.name,
        url: socket.io.uri,
      });

      if (err.message && err.message.includes("jwt expired")) {
        console.log("🔄 Attempting to refresh token...");
        try {
          const res = await refreshToken();
          const newToken = res.data.accessToken;
          localStorage.setItem("accessToken", newToken);
          socket.auth = { token: newToken };
          socket.connect();
          console.log("✅ Token refreshed, reconnecting...");
        } catch (refreshErr) {
          console.error("❌ Token refresh failed:", refreshErr);
          localStorage.removeItem("accessToken");
          localStorage.removeItem("currentUser");
          window.location.href = "/login";
        }
      }
    });

    return () => {
      socket.off("connect", handleConnect);
      socket.off("new_message", handleNewMessage);
      socket.off("conversation_updated");
      socket.off("unread_count_updated");
      socket.off("conversation");
      socket.off("connect_error");
    };
  }, [currentUser, token]);

  // Fetch conversations
  const fetchConversations = useCallback(
    async (page = 1) => {
      try {
        setLoadingConversations(true);
        const response = await getConversations(page);
        if (response.data.success) {
          const conversations = response.data.data.conversations;

          // DEBUG: Kiểm tra status của conversations từ backend
          console.log("🔍 DEBUG: Full conversation data from backend:");
          conversations.forEach((conv, index) => {
            console.log(`Conversation ${index + 1} - FULL OBJECT:`, conv);
          });

          setConversations(conversations);
        }
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch conversations"
        );
      } finally {
        setLoadingConversations(false);
      }
    },
    [currentUser]
  );

  // Fetch messages for a conversation (chỉ lấy data, không mark as read)
  const fetchMessages = useCallback(
    async (conversationId, page = 1, append = false) => {
      if (!conversationId) return;

      try {
        if (append) {
          setLoadingMore(true);
        } else {
          setLoadingMessages(true);
        }

        const response = await getConversationMessages(
          conversationId,
          page,
          messagesPerPage
        );

        if (response.data.success) {
          const newMessages = response.data.data.messages;

          // DEBUG: Kiểm tra status của messages từ backend
          console.log(
            "🔍 DEBUG: Messages from backend:",
            newMessages.map((msg) => ({
              id: msg._id,
              message: msg.message.substring(0, 20) + "...",
              status: msg.status,
              sender: msg.sender_id._id,
            }))
          );

          if (append) {
            // Append older messages to the beginning
            setMessages((prev) => [...newMessages, ...prev]);
          } else {
            // Replace messages (first load) - don't preserve scroll
            setMessages(newMessages);
          }

          // Check if there are more messages to load
          // If we got fewer messages than requested, we've reached the end
          const hasMore = newMessages.length === messagesPerPage;
          setHasMoreMessages(hasMore);
        }
      } catch (err) {
        console.error("Failed to fetch messages:", err);
        setError(err.response?.data?.message || "Failed to fetch messages");
      } finally {
        if (append) {
          setLoadingMore(false);
        } else {
          setLoadingMessages(false);
        }
      }
    },
    [messagesPerPage]
  );

  // Khi user thực sự mở hội thoại, gọi markMessagesAsRead
  const markConversationAsRead = useCallback(async (conversationId) => {
    console.log(
      "🔍 DEBUG: markConversationAsRead called for conversation:",
      conversationId
    );
    try {
      const response = await markMessagesAsRead(conversationId);
      console.log(
        "🔍 DEBUG: markConversationAsRead API call successful",
        response.data
      );
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId ? { ...conv, status: "read" } : conv
        )
      );
    } catch (err) {
      console.error("🔍 DEBUG: markConversationAsRead failed:", err);
      setError(err.response?.data?.message || "Failed to mark as read");
    }
  }, []);

  // Select a conversation (không tự động mark as read)
  const selectConversation = useCallback(
    async (conversation, markAsRead = true) => {
      console.log(
        "🔍 DEBUG: selectConversation called for:",
        conversation.id,
        conversation.lastMessage,
        "markAsRead:",
        markAsRead
      );
      setSelectedConversation(conversation);
      // Lưu vào localStorage để persist khi reload
      localStorage.setItem(
        "selectedConversation",
        JSON.stringify(conversation)
      );

      setMessagesPage(1);
      setHasMoreMessages(true);
      setMessages([]);
      messagesLoadedRef.current = false; // Reset để cho phép load messages cho conversation mới
      await fetchMessages(conversation.id, 1, false);
      messagesLoadedRef.current = true;

      // Chỉ mark as read khi user có tương tác thực sự
      if (markAsRead) {
        await markConversationAsRead(conversation.id);
      }

      socket.emit("join_conversation", { conversationId: conversation.id });
    },
    [fetchMessages, markConversationAsRead]
  );

  // Load more messages (lazy loading)
  const loadMoreMessages = useCallback(async () => {
    if (!selectedConversation || !hasMoreMessages || loadingMore) return;

    setLoadingMore(true);
    const nextPage = messagesPage + 1;
    setMessagesPage(nextPage);
    await fetchMessages(selectedConversation.id, nextPage, true);
  }, [
    selectedConversation,
    hasMoreMessages,
    loadingMore,
    messagesPage,
    fetchMessages,
  ]);

  // Send a message (emit via socket and call API for persistence)
  const sendNewMessage = useCallback(
    async (receiverId, message, conversationId = null) => {
      try {
        const messageData = {
          receiverId,
          message,
          ...(conversationId && { conversationId }),
        };

        // Only add optimistic update if we're in an existing conversation
        // For new conversations (compose), don't add optimistic message
        if (conversationId) {
          const optimisticMessage = {
            _id: `temp_${Date.now()}`,
            message: message,
            sender_id: currentUser,
            conversation_id: conversationId,
            createdAt: new Date().toISOString(),
            status: "sending",
          };

          setMessages((prev) => [...prev, optimisticMessage]);
        }

        // Emit to socket for real-time
        socket.emit("send_message", messageData);

        // Call API for persistence
        const response = await sendMessage(messageData);
        if (response.data.success) {
          const newMessage = response.data.data.message;
          const newConversationId = response.data.data.conversationId;

          // Only update messages if we're in the same conversation
          if (conversationId && conversationId === newConversationId) {
            // Replace optimistic message with real message
            setMessages((prev) =>
              prev.map((msg) =>
                msg._id === `temp_${Date.now() - 100}` ? newMessage : msg
              )
            );
          }

          // Update conversations list
          setConversations((prev) => {
            const existingConversation = prev.find(
              (conv) => conv.id === newConversationId
            );

            // Use conversation data from backend response if available
            const conversationData = response.data.data.conversation;

            if (existingConversation) {
              // Update existing conversation và đưa lên đầu
              const updated = prev.map((conv) => {
                if (conv.id === newConversationId) {
                  return {
                    ...conv,
                    ...(conversationData || {}), // Use backend data if available
                    lastMessage: message,
                    status: "sent",
                    updatedAt: new Date().toISOString(),
                    lastMessageSenderId: currentUser._id,
                  };
                }
                return conv;
              });
              const idx = updated.findIndex(
                (conv) => conv.id === newConversationId
              );
              if (idx > -1) {
                const [conv] = updated.splice(idx, 1);
                return [conv, ...updated];
              }
              return updated;
            } else {
              // Use conversation from backend response
              if (conversationData) {
                return [
                  {
                    ...conversationData,
                    lastMessageSenderId: currentUser._id,
                  },
                  ...prev,
                ];
              } else {
                // Fallback: Create new conversation object (should not happen with updated backend)
                console.warn(
                  "⚠️ Backend did not return conversation data, using fallback"
                );
                const newConversation = {
                  id: newConversationId,
                  lastMessage: message,
                  status: "sent",
                  updatedAt: new Date().toISOString(),
                  otherParticipant: { _id: receiverId },
                  participants: [currentUser, { _id: receiverId }],
                  lastMessageSenderId: currentUser._id,
                };
                return [newConversation, ...prev];
              }
            }
          });

          return response.data.data;
        }
      } catch (err) {
        // Remove optimistic message on error
        setMessages((prev) =>
          prev.filter((msg) => !msg._id.startsWith("temp_"))
        );
        setError(err.response?.data?.message || "Failed to send message");
        throw err;
      }
    },
    [currentUser]
  );

  // Create a new conversation
  const createNewConversation = useCallback(async (participantIds) => {
    try {
      const response = await createConversation(participantIds);
      if (response.data.success) {
        const newConversation = response.data.data;
        setConversations((prev) => [newConversation, ...prev]);
        // Optionally emit to socket
        socket.emit("create_conversation", newConversation);
        return newConversation;
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create conversation");
      throw err;
    }
  }, []);

  // Search conversations and messages
  const performSearch = useCallback(async (query, type = "all") => {
    if (!query.trim()) {
      setSearchResults({ conversations: [], messages: [] });
      return;
    }

    try {
      const response = await searchChat(query, type);
      if (response.data.success) {
        setSearchResults(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Search failed");
    }
  }, []);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await getUnreadCount();
      if (response.data.success) {
        setUnreadCount(response.data.data.totalUnread);
      }
    } catch (err) {
      console.error("Failed to fetch unread count:", err);
    }
  }, []);

  // Format time for display
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return "just now";
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h`;
    } else if (diffInHours < 48) {
      return "1d";
    } else {
      return `${Math.floor(diffInHours / 24)}d`;
    }
  };

  // Initial load
  useEffect(() => {
    if (currentUser) {
      fetchConversations();
      fetchUnreadCount();
    }
  }, [currentUser, fetchConversations, fetchUnreadCount]);

  // Khôi phục selectedConversation và load messages khi component mount
  useEffect(() => {
    if (
      currentUser &&
      selectedConversation &&
      conversations.length > 0 &&
      !messagesLoadedRef.current
    ) {
      // Kiểm tra conversation còn tồn tại trong danh sách không
      const existingConversation = conversations.find(
        (conv) => conv.id === selectedConversation.id
      );

      if (existingConversation) {
        // Cập nhật selectedConversation với data mới nhất từ conversations
        setSelectedConversation(existingConversation);
        localStorage.setItem(
          "selectedConversation",
          JSON.stringify(existingConversation)
        );

        // Load messages cho conversation đã được khôi phục
        fetchMessages(existingConversation.id, 1, false);
        socket.emit("join_conversation", {
          conversationId: existingConversation.id,
        });
        messagesLoadedRef.current = true;
      } else {
        // Conversation không còn tồn tại, clear localStorage
        setSelectedConversation(null);
        localStorage.removeItem("selectedConversation");
      }
    }
  }, [currentUser, conversations, selectedConversation?.id, fetchMessages]);

  // Clear selectedConversation khi user logout
  useEffect(() => {
    if (!currentUser) {
      setSelectedConversation(null);
      setMessages([]);
      messagesLoadedRef.current = false;
      localStorage.removeItem("selectedConversation");
    }
  }, [currentUser]);

  // Search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        performSearch(searchQuery);
      } else {
        setSearchResults({ conversations: [], messages: [] });
      }
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchQuery, performSearch]);

  // Handle scroll position preservation when loading older messages
  useEffect(() => {
    if (loadingMore && messages.length > 0) {
      const chatMessagesContainer = document.querySelector(".chat-messages");
      if (chatMessagesContainer) {
        // Store current scroll position
        const scrollHeightBefore = chatMessagesContainer.scrollHeight;
        const scrollTopBefore = chatMessagesContainer.scrollTop;

        // Restore position after a short delay
        setTimeout(() => {
          if (chatMessagesContainer) {
            const scrollHeightAfter = chatMessagesContainer.scrollHeight;
            const scrollHeightDifference =
              scrollHeightAfter - scrollHeightBefore;
            chatMessagesContainer.scrollTop =
              scrollTopBefore + scrollHeightDifference;
          }
        }, 100);
      }
    }
  }, [messages.length, loadingMore]);

  return {
    // State
    conversations,
    selectedConversation,
    messages,
    loadingConversations,
    loadingMessages,
    error,
    unreadCount,
    searchQuery,
    searchResults,

    // Lazy loading states
    messagesPage,
    hasMoreMessages,
    loadingMore,
    messagesPerPage,

    // Actions
    setSearchQuery,
    selectConversation,
    sendNewMessage,
    createNewConversation,
    fetchConversations,
    fetchMessages,
    loadMoreMessages,
    performSearch,
    formatTime,

    // Utilities
    currentUser,
  };
};
