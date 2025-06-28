import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { searchUsers } from "../../services/userService";
import "../../assets/StudentMsg/ChatInterface.css";

export function ComposeModal({ isOpen, onClose, onSendMessage }) {
  const { currentUser } = useSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Search for users
  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      const response = await searchUsers(query, 1, 10);
      if (response.data.success) {
        // Filter out current user
        const users = response.data.data.users.filter(
          (user) => user._id !== currentUser?._id
        );
        setSearchResults(users);
      }
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle search input change with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Handle sending message
  const handleSend = async () => {
    if (!selectedUser || !message.trim()) return;

    try {
      await onSendMessage(selectedUser._id, message);
      onClose();
      setSelectedUser(null);
      setMessage("");
      setSearchQuery("");
      setSearchResults([]);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  // Handle user selection
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setSearchQuery(`${user.firstName} ${user.lastName}`);
    setSearchResults([]);
  };

  // Handle modal close
  const handleClose = () => {
    onClose();
    setSelectedUser(null);
    setMessage("");
    setSearchQuery("");
    setSearchResults([]);
  };

  if (!isOpen) return null;

  return (
    <div className="compose-modal-overlay" onClick={handleClose}>
      <div
        className="compose-modal-modern"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="compose-header">
          <h3>New Message</h3>
          <button className="close-button" onClick={handleClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="compose-content">
          {/* To Section */}
          <div className="compose-to-section">
            <div className="to-label">To:</div>
            <div className="to-input-container">
              {selectedUser ? (
                <div className="selected-user-chip">
                  <div className="user-avatar-chip">
                    {selectedUser.userImage ? (
                      <img
                        src={selectedUser.userImage}
                        alt={selectedUser.firstName}
                      />
                    ) : (
                      <div
                        className="avatar-placeholder-chip"
                        style={{
                          backgroundColor: getAvatarColor(
                            selectedUser.firstName
                          ),
                        }}
                      >
                        {getInitials(
                          selectedUser.firstName,
                          selectedUser.lastName
                        )}
                      </div>
                    )}
                  </div>
                  <span className="user-chip-name">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </span>
                  <button
                    className="remove-user-chip"
                    onClick={() => {
                      setSelectedUser(null);
                      setSearchQuery("");
                    }}
                  >
                    ×
                  </button>
                </div>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="Search people..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="user-search-modern"
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      className="clear-search-button"
                      onClick={() => {
                        setSearchQuery("");
                        setSearchResults([]);
                      }}
                    >
                      ×
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && !selectedUser && (
              <div className="search-results-modern">
                {searchResults.map((user) => (
                  <div
                    key={user._id}
                    className="search-result-modern"
                    onClick={() => handleUserSelect(user)}
                  >
                    <div className="user-avatar-result">
                      {user.userImage ? (
                        <img src={user.userImage} alt={user.firstName} />
                      ) : (
                        <div
                          className="avatar-placeholder-result"
                          style={{
                            backgroundColor: getAvatarColor(user.firstName),
                          }}
                        >
                          {getInitials(user.firstName, user.lastName)}
                        </div>
                      )}
                    </div>
                    <div className="user-info-result">
                      <div className="user-name-result">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="user-username-result">
                        @{user.userName}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {loading && (
              <div className="search-loading">
                <div className="loading-spinner-small"></div>
                <span>Searching...</span>
              </div>
            )}
          </div>

          {/* Message Section */}
          <div className="compose-message-section">
            <textarea
              placeholder={
                selectedUser
                  ? "Write a message..."
                  : "Select a person to start messaging"
              }
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              disabled={!selectedUser}
              className="message-textarea-modern"
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                  handleSend();
                }
              }}
            />
            <div className="message-hint">
              {selectedUser ? "Press Ctrl+Enter to send" : ""}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="compose-footer">
          <button className="cancel-button" onClick={handleClose}>
            Cancel
          </button>
          <button
            className="send-button-modern"
            onClick={handleSend}
            disabled={!selectedUser || !message.trim()}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
}

// Utility functions
function getInitials(firstName, lastName) {
  return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
}

function getAvatarColor(name) {
  const colors = [
    "#FF6636",
    "#564FFD",
    "#23BD33",
    "#FFD600",
    "#FF3D68",
    "#00B8D9",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}
