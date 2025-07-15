import React, { useState, useRef, useEffect } from "react";
import { useChat } from "../../hooks/useChat";
import { ComposeModal } from "./ComposeModal";
import "../../assets/StudentMsg/ChatInterface.css";
import "../../assets/StudentMsg/StudentMsgGlobal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileVideo } from "@fortawesome/free-solid-svg-icons"; // dùng tạm nếu không có faGif

// GIPHY API Key (đã được user cung cấp)
const GIPHY_API_KEY = "GIPHY_API_KEY";

// GIPHY API Key (đã được user cung cấp)
const GIPHY_API_KEY = process.env.GIPHY_API_KEY;

export function ChatInterface({ chatListOpen, setChatListOpen }) {
  const {
    conversations,
    selectedConversation,
    messages,
    loading,
    error,
    unreadCount,
    searchQuery,
    searchResults,
    setSearchQuery,
    selectConversation,
    sendNewMessage,
    formatTime,
    currentUser,
    // Lazy loading
    hasMoreMessages,
    loadingMore,
    loadMoreMessages,
    messagesPage,
    loadingConversations,
    loadingMessages,
  } = useChat();

  const [newMessage, setNewMessage] = useState("");
  const [showComposeModal, setShowComposeModal] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesTopRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const previousMessagesLength = useRef(0);
  const shouldMaintainPosition = useRef(false);
  const lastLoadTime = useRef(0);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [gifSearch, setGifSearch] = useState("");
  const [gifResults, setGifResults] = useState([]);
  const [gifLoading, setGifLoading] = useState(false);

  // Helper to detect tablet mode - simplified to width-only for consistency
  const [isTablet, setIsTablet] = React.useState(false);
  React.useEffect(() => {
    function handleResize() {
      // Simplified: only check width like most responsive apps
      const isMobile = window.innerWidth <= 768;
      setIsTablet(isMobile);

      // Debug logging (remove in production)
      console.log("📱 Responsive check:", {
        width: window.innerWidth,
        height: window.innerHeight,
        isTablet: isMobile,
      });
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-scroll to bottom when new messages arrive (but not when loading more)
  useEffect(() => {
    // Skip auto-scroll completely if we're maintaining position
    if (shouldMaintainPosition.current || isLoadingMore || loadingMore) return;

    if (messagesEndRef.current) {
      const chatMessagesContainer =
        messagesEndRef.current.closest(".chat-messages");
      if (chatMessagesContainer) {
        // Only auto-scroll if user is near the bottom (within 100px)
        const isNearBottom =
          chatMessagesContainer.scrollTop +
            chatMessagesContainer.clientHeight >=
          chatMessagesContainer.scrollHeight - 100;

        if (isNearBottom) {
          chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
        }
      }
    }
  }, [messages, loadingMore, isLoadingMore]);

  // Auto-scroll to bottom when conversation is selected and messages are loaded (initial load only)
  useEffect(() => {
    if (
      selectedConversation &&
      messages.length > 0 &&
      !loading &&
      !loadingMore &&
      !isLoadingMore &&
      !shouldMaintainPosition.current &&
      messagesPage === 1 // Only scroll to bottom on initial load, not when loading more
    ) {
      const scrollToBottom = () => {
        if (messagesEndRef.current) {
          const chatMessagesContainer =
            messagesEndRef.current.closest(".chat-messages");
          if (chatMessagesContainer) {
            chatMessagesContainer.scrollTop =
              chatMessagesContainer.scrollHeight;
          }
        }
      };

      // Try immediate scroll
      scrollToBottom();

      // Also try after a short delay to ensure DOM is fully rendered
      setTimeout(scrollToBottom, 50);
      setTimeout(scrollToBottom, 200);
    }
  }, [
    selectedConversation?.id,
    messages.length,
    loading,
    loadingMore,
    isLoadingMore,
    messagesPage,
  ]);

  // Reset loading state when conversation changes
  useEffect(() => {
    setIsLoadingMore(false);
    shouldMaintainPosition.current = false;
    previousMessagesLength.current = 0;
    lastLoadTime.current = 0; // Reset debounce timer
  }, [selectedConversation?.id]);

  // Preserve scroll position when loading more messages
  const savedScrollTop = useRef(0);
  const savedScrollHeight = useRef(0);

  // Messenger-style smooth loading
  React.useLayoutEffect(() => {
    if (loadingMore) {
      const chatMessagesContainer =
        messagesEndRef.current?.closest(".chat-messages");
      if (chatMessagesContainer) {
        // Save current position for restoration
        savedScrollTop.current = chatMessagesContainer.scrollTop;
        savedScrollHeight.current = chatMessagesContainer.scrollHeight;
        messagesContainerRef.current = chatMessagesContainer;
        shouldMaintainPosition.current = true;
        setIsLoadingMore(true);

        console.log(
          "🔍 Starting smooth load, saved position:",
          savedScrollTop.current
        );
      }
    }
  }, [loadingMore]);

  // Smooth scroll position restoration
  React.useLayoutEffect(() => {
    if (isLoadingMore && !loadingMore && messagesContainerRef.current) {
      const chatMessagesContainer = messagesContainerRef.current;

      // Calculate the height difference and maintain position
      const newScrollHeight = chatMessagesContainer.scrollHeight;
      const heightDifference = newScrollHeight - savedScrollHeight.current;
      const newScrollTop = savedScrollTop.current + heightDifference;

      console.log("🔍 Smooth restore:", {
        oldTop: savedScrollTop.current,
        newTop: newScrollTop,
        heightDiff: heightDifference,
      });

      // Smoothly adjust scroll position
      chatMessagesContainer.scrollTop = newScrollTop;

      // Clean up
      setTimeout(() => {
        setIsLoadingMore(false);
        shouldMaintainPosition.current = false;
        console.log("🔍 Smooth loading complete");
      }, 100);
    }
  }, [isLoadingMore, loadingMore, messages.length]);

  // Infinite scroll observer - only trigger when user scrolls near the very top
  useEffect(() => {
    if (!hasMoreMessages || loadingMore || isLoadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !shouldMaintainPosition.current) {
            // Debounce: only load if it's been at least 1 second since last load
            const now = Date.now();
            if (now - lastLoadTime.current > 1000) {
              console.log("🔍 Infinite scroll triggered");
              lastLoadTime.current = now;
              loadMoreMessages();
            } else {
              console.log("🔍 Infinite scroll debounced - too soon");
            }
          }
        });
      },
      {
        threshold: 0.8, // Trigger when 80% of the load button is visible (user really needs to scroll up)
        rootMargin: "0px", // No margin - only trigger when actually visible
      }
    );

    if (messagesTopRef.current) {
      observer.observe(messagesTopRef.current);
    }

    return () => observer.disconnect();
  }, [hasMoreMessages, loadingMore, loadMoreMessages, isLoadingMore]);

  // Fetch GIFs from Giphy
  useEffect(() => {
    if (!showGifPicker) return;
    setGifLoading(true);
    const q = gifSearch || "funny";
    fetch(
      `https://api.giphy.com/v1/gifs/search?q=${encodeURIComponent(
        q
      )}&api_key=${GIPHY_API_KEY}&limit=16&rating=g`
    )
      .then((res) => res.json())
      .then((data) => {
        setGifResults(data.data || []);
        setGifLoading(false);
      })
      .catch(() => setGifLoading(false));
  }, [gifSearch, showGifPicker]);

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const otherParticipant = selectedConversation.otherParticipant;
      await sendNewMessage(
        otherParticipant._id,
        newMessage,
        selectedConversation.id
      );
      setNewMessage("");

      // Scroll to bottom after sending message
      setTimeout(() => {
        if (messagesEndRef.current) {
          const chatMessagesContainer =
            messagesEndRef.current.closest(".chat-messages");
          if (chatMessagesContainer) {
            chatMessagesContainer.scrollTop =
              chatMessagesContainer.scrollHeight;
          }
        }
      }, 100);
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  // Handle send GIF
  const handleSendGif = (gifUrl) => {
    setShowGifPicker(false);
    setNewMessage("");
    if (!selectedConversation) return;
    sendNewMessage(
      selectedConversation.otherParticipant._id,
      gifUrl,
      selectedConversation.id
    );
  };

  // Handle compose new message
  const handleComposeMessage = async (receiverId, message) => {
    try {
      const result = await sendNewMessage(receiverId, message);

      // Always select the conversation where the message was sent
      if (result && result.conversationId) {
        // Wait a bit for conversations to update, then find and select the conversation
        setTimeout(() => {
          const targetConversation = conversations.find(
            (conv) => conv.id === result.conversationId
          );
          if (targetConversation) {
            // Không mark as read khi tự động chọn conversation sau khi compose message
            selectConversation(targetConversation, false);
            // Auto close chat list on tablet when selecting conversation
            if (isTablet) {
              setChatListOpen(false);
            }
          }
        }, 100);
      }
    } catch (err) {
      console.error("Failed to send compose message:", err);
      throw err;
    }
  };

  // Handle conversation selection with auto-close on tablet
  const handleConversationSelect = (conversation) => {
    selectConversation(conversation);
    // Auto close chat list on tablet when selecting conversation
    if (isTablet) {
      setChatListOpen(false);
    }
  };

  // Handle overlay click to close chat list
  const handleOverlayClick = () => {
    if (isTablet && chatListOpen) {
      setChatListOpen(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Get display data for conversations
  const getDisplayConversations = () => {
    if (searchQuery && searchResults.conversations.length > 0) {
      return searchResults.conversations;
    }
    return conversations;
  };

  // Get other participant from conversation
  const getOtherParticipant = (conversation) => {
    return (
      conversation.otherParticipant ||
      conversation.participants?.find((p) => p._id !== currentUser?._id)
    );
  };

  // Render skeleton loading messages (Messenger style)
  const renderSkeletonMessages = () => {
    const skeletons = [];
    for (let i = 0; i < 3; i++) {
      const isReceived = Math.random() > 0.5;
      const size = ["small", "medium", "large"][Math.floor(Math.random() * 3)];

      skeletons.push(
        <div
          key={`skeleton-${i}`}
          className={`message-skeleton ${isReceived ? "received" : "sent"}`}
          style={{
            animationDelay: `${i * 0.1}s`,
          }}
        >
          {isReceived && <div className="skeleton-avatar"></div>}
          <div className={`skeleton-bubble ${size}`}></div>
          {!isReceived && <div style={{ width: "32px" }}></div>}
        </div>
      );
    }
    return skeletons;
  };

  return (
    <div className="chat-main-wrapper">
      {/* Overlay for tablet mode */}
      {isTablet && chatListOpen && (
        <div
          className={`chat-overlay ${chatListOpen ? "visible" : ""}`}
          onClick={handleOverlayClick}
        />
      )}

      {/* Mobile toggle button when chat list is closed */}
      {isTablet && !chatListOpen && (
        <button
          className="mobile-chat-toggle"
          onClick={() => setChatListOpen(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          Messages
        </button>
      )}

      <div className="chat-container">
        <div
          className={
            isTablet ? `chat-list${chatListOpen ? " open" : ""}` : "chat-list"
          }
        >
          <div className="chat-list-header">
            <div className="header-left">
              <h2 className="chat-list-title">
                Chat {unreadCount > 0 && `(${unreadCount})`}
              </h2>
            </div>
            <div className="header-right">
              <button
                className="compose-button"
                onClick={() => setShowComposeModal(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="16"></line>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
                <span>Compose</span>
              </button>
              {isTablet && (
                <button
                  className="chat-list-toggle"
                  onClick={() => setChatListOpen(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                  Close
                </button>
              )}
            </div>
          </div>

          <div className="chat-list-search">
            <div className="search-wrapper">
              <svg
                className="search-icon"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                placeholder="Search"
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="chat-list-items">
            {loadingConversations ? (
              <div className="loading-indicator">Loading conversations...</div>
            ) : error ? (
              <div className="error-message">{error}</div>
            ) : getDisplayConversations().length === 0 ? (
              <div className="no-conversations">No conversations found</div>
            ) : (
              getDisplayConversations()
                .slice()
                .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                .map((conversation) => {
                  const otherParticipant = getOtherParticipant(conversation);

                  // FIXED UNREAD LOGIC: Chỉ unread khi tin nhắn cuối KHÔNG phải từ current user
                  let isUnread = false;
                  if (currentUser?._id) {
                    const currentUserId = String(currentUser._id);
                    let lastMessageFromCurrentUser = false;

                    // Kiểm tra ai là người gửi tin nhắn cuối
                    if (conversation.lastMessageSenderId) {
                      const lastSenderId = String(
                        conversation.lastMessageSenderId
                      );
                      lastMessageFromCurrentUser =
                        lastSenderId === currentUserId;
                    } else if (
                      selectedConversation?.id === conversation.id &&
                      messages.length > 0
                    ) {
                      // Fallback: dùng messages array
                      const lastMessage = messages[messages.length - 1];
                      const lastMessageSender = String(
                        lastMessage.sender_id?._id || ""
                      );
                      lastMessageFromCurrentUser =
                        lastMessageSender === currentUserId;
                    } else {
                      // Conservative fallback: chỉ "sending" mới chắc chắn là từ current user
                      lastMessageFromCurrentUser =
                        conversation.status === "sending";
                    }

                    // CHỈ unread khi tin nhắn cuối KHÔNG phải từ current user VÀ status cho biết chưa đọc
                    isUnread =
                      !lastMessageFromCurrentUser &&
                      ["sending", "sent", "delivered", "unread"].includes(
                        conversation.status
                      );
                  }

                  // Format message preview: chỉ hiển thị nội dung tin nhắn
                  let formattedMessage =
                    conversation.lastMessage || "No messages yet";

                  return (
                    <ChatListItem
                      key={conversation.id}
                      userImage={otherParticipant?.userImage}
                      name={`${otherParticipant?.firstName || ""} ${
                        otherParticipant?.lastName || ""
                      }`}
                      message={formattedMessage}
                      time={formatTime(conversation.updatedAt)}
                      active={selectedConversation?.id === conversation.id}
                      unread={isUnread}
                      onClick={() => handleConversationSelect(conversation)}
                      className={isUnread ? "unread" : ""}
                    />
                  );
                })
            )}
          </div>
        </div>

        <div className="chat-content">
          {selectedConversation ? (
            <>
              <div className="chat-content-header">
                <div className="user-info">
                  <div className="user-avatar-container">
                    <img
                      src={
                        getOtherParticipant(selectedConversation)?.userImage ||
                        "/images/defaultImageUser.png"
                      }
                      alt={
                        getOtherParticipant(selectedConversation)?.firstName ||
                        "User"
                      }
                      className="user-avatar"
                    />
                  </div>
                  <div className="user-details">
                    <h3 className="user-name">
                      {`${
                        getOtherParticipant(selectedConversation)?.firstName ||
                        ""
                      } ${
                        getOtherParticipant(selectedConversation)?.lastName ||
                        ""
                      }`}
                    </h3>
                  </div>
                </div>

                <button className="more-options">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="19" cy="12" r="1"></circle>
                    <circle cx="5" cy="12" r="1"></circle>
                  </svg>
                </button>
              </div>

              <div className="chat-messages">
                {loadingMessages ? (
                  <div className="loading-indicator">Loading messages...</div>
                ) : error ? (
                  <div className="error-message">{error}</div>
                ) : messages.length === 0 ? (
                  <div className="no-messages">
                    No messages yet. Start a conversation!
                  </div>
                ) : (
                  <>
                    {/* Infinite scroll trigger */}
                    {hasMoreMessages && (
                      <div
                        ref={messagesTopRef}
                        style={{
                          height: "32px",
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#65676b",
                          fontSize: "13px",
                          background: "transparent",
                          border: "none",
                          borderRadius: "16px",
                          margin: "8px 0",
                          cursor: "pointer",
                          transition: "background-color 0.2s",
                          fontWeight: "500",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = "#f2f3f5";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = "transparent";
                        }}
                        onClick={() => {
                          // Manual click always works, regardless of debounce
                          const now = Date.now();
                          lastLoadTime.current = now;
                          loadMoreMessages();
                        }}
                      >
                        {loadingMore ? (
                          <div className="spinner-dots">
                            <div className="dot"></div>
                            <div className="dot"></div>
                            <div className="dot"></div>
                          </div>
                        ) : (
                          "Load more messages"
                        )}
                      </div>
                    )}

                    {/* Messenger-style loading */}
                    {loadingMore && (
                      <>
                        {/* Skeleton messages */}
                        {renderSkeletonMessages()}

                        {/* Loading dots indicator */}
                        <div className="loading-more-messages">
                          <div className="spinner-dots">
                            <div className="dot"></div>
                            <div className="dot"></div>
                            <div className="dot"></div>
                          </div>
                        </div>
                      </>
                    )}

                    <div className="date-divider">
                      <span>Today</span>
                    </div>

                    {messages.map((message) => {
                      const isOwnMessage =
                        message.sender_id._id === currentUser?._id;
                      // Format tooltip time
                      const fullTime = new Date(
                        message.createdAt
                      ).toLocaleString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      });
                      const isGif =
                        typeof message.message === "string" &&
                        message.message.match(/(giphy\.com|\.gif($|\?))/i);
                      return (
                        <div
                          key={message._id}
                          className={
                            isOwnMessage ? "message-sent" : "message-received"
                          }
                          style={{ position: "relative" }}
                        >
                          {!isOwnMessage && (
                            <div className="message-avatar">
                              <img
                                src={
                                  message.sender_id.userImage ||
                                  "/images/defaultImageUser.png"
                                }
                                alt={message.sender_id.firstName}
                              />
                            </div>
                          )}
                          {isGif ? (
                            <img
                              src={message.message}
                              alt="gif"
                              style={{
                                maxWidth: 220,
                                maxHeight: 180,
                                borderRadius: 12,
                                display: "block",
                                background: "#fff",
                                padding: 2,
                              }}
                            />
                          ) : (
                            <div className="message-bubble message-tooltip-parent">
                              <p className="m-0">{message.message}</p>
                              <span className="message-tooltip">
                                {fullTime}
                              </span>
                            </div>
                          )}
                          {isOwnMessage && (
                            <div className="message-time">
                              {formatTime(message.createdAt)}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              <div className="chat-input-area" style={{ position: "relative" }}>
                <div className="message-input-container">
                  <input
                    type="text"
                    placeholder="Type your message"
                    className="message-input"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                  />
                </div>
                <div style={{ position: "relative", display: "inline-block" }}>
                  <button
                    type="button"
                    className="gif-picker-btn"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: 22,
                      marginLeft: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onClick={() => setShowGifPicker((v) => !v)}
                    title="Send GIF"
                  >
                    {/* Nếu có faGif thì dùng: <FontAwesomeIcon icon={faGif} /> */}
                    {/* Nếu không có, dùng SVG chữ GIF */}
                    <span
                      style={{
                        display: "inline-block",
                        background: "#ff6636",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: 14,
                        borderRadius: 4,
                        padding: "2px 7px",
                        letterSpacing: 1,
                        fontFamily: "monospace",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                      }}
                    >
                      GIF
                    </span>
                  </button>
                  {/* GIF Picker Popup */}
                  {showGifPicker && (
                    <div
                      className="gif-picker-modal"
                      style={{
                        position: "absolute",
                        bottom: 44,
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 1000,
                        background: "#fff",
                        border: "1px solid #eee",
                        borderRadius: 8,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        padding: 12,
                        width: 340,
                      }}
                    >
                      <div style={{ display: "flex", marginBottom: 8 }}>
                        <input
                          type="text"
                          placeholder="Search GIFs"
                          value={gifSearch}
                          onChange={(e) => setGifSearch(e.target.value)}
                          style={{
                            flex: 1,
                            border: "1px solid #ddd",
                            borderRadius: 4,
                            padding: 4,
                          }}
                        />
                        <button
                          style={{ marginLeft: 8 }}
                          onClick={() => setShowGifPicker(false)}
                        >
                          ✕
                        </button>
                      </div>
                      <div
                        style={{
                          minHeight: 120,
                          maxHeight: 260,
                          overflowY: "auto",
                        }}
                      >
                        {gifLoading ? (
                          <div>Loading...</div>
                        ) : gifResults.length === 0 ? (
                          <div>No GIFs found</div>
                        ) : (
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 6,
                            }}
                          >
                            {gifResults.map((gif) => (
                              <img
                                key={gif.id}
                                src={gif.images.fixed_height.url}
                                alt={gif.title || "gif"}
                                style={{
                                  width: 70,
                                  height: 70,
                                  objectFit: "cover",
                                  borderRadius: 4,
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  handleSendGif(gif.images.original.url)
                                }
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <button
                  className="send-button main-orange"
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || loading}
                  style={{
                    backgroundColor: "#ff6636",
                    color: "white",
                    borderRadius: "8px",
                    padding: "8px 20px",
                    fontWeight: 600,
                    fontSize: "16px",
                    border: "none",
                    boxShadow: "0 2px 8px rgba(255,102,54,0.08)",
                    transition: "background 0.2s",
                    marginLeft: 8,
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor = "#e55a2b")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor = "#ff6636")
                  }
                >
                  <span>Send</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <div className="no-conversation-selected">
              <div className="empty-state">
                <h3>Select a conversation</h3>
                <p>Choose a conversation from the list to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Compose Modal */}
      <ComposeModal
        isOpen={showComposeModal}
        onClose={() => setShowComposeModal(false)}
        onSendMessage={handleComposeMessage}
      />
    </div>
  );
}

function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function ChatListItem({
  userImage,
  name,
  message,
  time,
  active,
  unread,
  onClick,
  className,
}) {
  // DEBUG: Log ChatListItem props
  console.log(`🔍 DEBUG: ChatListItem for ${name}:`, {
    unread,
    className,
    active,
    finalClassName: `chat-item ${active ? "active" : ""} ${className || ""}`,
  });

  const isGif =
    typeof message === "string" && message.match(/(giphy\.com|\.gif($|\?))/i);
  return (
    <div
      className={`chat-item ${active ? "active" : ""} ${className || ""}`}
      onClick={onClick}
    >
      <div className="chat-item-avatar-container">
        {userImage ? (
          <img
            src={userImage}
            alt={name}
            className="chat-item-avatar"
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        ) : (
          <img
            src="/images/defaultImageUser.png"
            alt={name}
            className="chat-item-avatar"
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        )}
      </div>
      <div className="chat-item-content">
        <div className="chat-item-header">
          <span className="chat-item-name">{name}</span>
          <span className="chat-item-time">{time}</span>
          {unread && (
            <div
              className="chat-item-unread"
              style={{
                width: "8px",
                height: "8px",
                backgroundColor: "#ff6636",
                borderRadius: "50%",
                marginLeft: "8px",
                display: "inline-block",
              }}
            ></div>
          )}
        </div>
        <span className="chat-item-message">{isGif ? "GIF" : message}</span>
        <span className="chat-item-message">{message}</span>
      </div>
    </div>
  );
}
