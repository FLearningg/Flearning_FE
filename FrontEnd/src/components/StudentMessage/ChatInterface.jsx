import "../../assets/StudentMsg/ChatInterface.css";

export function ChatInterface() {
  return (
    <div className="chat-container">
      <div className="chat-list">
        <div className="chat-list-header">
          <h2 className="chat-list-title">Chat</h2>
          <button className="compose-button">
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
            <input type="text" placeholder="Search" className="search-input" />
          </div>
        </div>

        <div className="chat-list-items">
          <ChatListItem
            avatar="/placeholder.svg?height=48&width=48"
            name="Jane Cooper"
            message="Yeah sure, tell me zafor"
            time="just now"
            active
            isOnline
          />

          <ChatListItem
            avatar="/placeholder.svg?height=48&width=48"
            name="Jenny Wilson"
            message="Thank you so much, sir"
            time="2 d"
            unread
          />

          <ChatListItem
            avatar="/placeholder.svg?height=48&width=48"
            name="Marvin McKinney"
            message="You're Welcome"
            time="1 m"
            unread
          />

          <ChatListItem
            avatar="/placeholder.svg?height=48&width=48"
            name="Eleanor Pena"
            message="Thank you so much, sir"
            time="1 m"
          />

          <ChatListItem
            avatar="/placeholder.svg?height=48&width=48"
            name="Ronald Richards"
            message="Sorry, I can't help you"
            time="2 m"
          />

          <ChatListItem
            avatar="/placeholder.svg?height=48&width=48"
            name="Kathryn Murphy"
            message="new message"
            time="2 m"
          />

          <ChatListItem
            avatar="/placeholder.svg?height=48&width=48"
            name="Jacob Jones"
            message="Thank you so much, sir"
            time="6 m"
          />

          <ChatListItem
            avatar="/placeholder.svg?height=48&width=48"
            name="Cameron Williamson"
            message="It's okay, no problem brother, i will fix everythin..."
            time="6 m"
          />

          <ChatListItem
            avatar="/placeholder.svg?height=48&width=48"
            name="Arlene McCoy"
            message="Thank you so much, sir"
            time="9 m"
          />

          <ChatListItem
            avatar="/placeholder.svg?height=48&width=48"
            name="Dianne Russell"
            message="You're Welcome"
            time="9 m"
          />
        </div>

        <div className="chat-list-footer">
          © 2021 - Eduguard. Designed by Templatecookie. All rights reserved
        </div>
      </div>

      <div className="chat-content">
        <div className="chat-content-header">
          <div className="user-info">
            <div className="user-avatar-container">
              <img
                src="/placeholder.svg?height=48&width=48"
                alt="Jane Cooper"
                className="user-avatar"
              />
              <span className="online-indicator"></span>
            </div>
            <div className="user-details">
              <h3 className="user-name">Jane Cooper</h3>
              <p className="user-status">Active Now</p>
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
          <div className="date-divider">
            <span>Today</span>
          </div>

          <div className="message-received">
            <div className="message-avatar">
              <img src="/placeholder.svg?height=32&width=32" alt="Time" />
            </div>
            <div className="message-bubble">
              <p>
                Hello and thanks for signing up to the course. If you have any
                questions about the course or Adobe XD, feel free to get in
                touch and I'll be happy to help 😊
              </p>
            </div>
          </div>

          <div className="message-sent">
            <div className="message-bubble">
              <p>Hello. Good Evening.</p>
            </div>
            <div className="message-time">Time</div>
          </div>

          <div className="message-sent">
            <div className="message-bubble">
              <p>I'm Zafor</p>
            </div>
          </div>

          <div className="message-sent">
            <div className="message-bubble">
              <p>
                I only have a small doubt about your lecture. can you give me
                some time for this?
              </p>
            </div>
          </div>

          <div className="message-received">
            <div className="message-avatar">
              <img src="/placeholder.svg?height=32&width=32" alt="Time" />
            </div>
            <div className="message-bubble">
              <p>Yeah sure, tell me zafor</p>
            </div>
          </div>
        </div>

        <div className="chat-input-area">
          <div className="message-input-container">
            <input
              type="text"
              placeholder="Type your message"
              className="message-input"
            />
          </div>
          <button className="send-button">
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

        <div className="chat-footer">
          <div className="footer-links">
            <span>FAQs</span>
            <span>Privacy Policy</span>
            <span>Terms & Condition</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatListItem({
  avatar,
  name,
  message,
  time,
  active,
  unread,
  isOnline,
}) {
  return (
    <div className={`chat-item ${active ? "active" : ""}`}>
      <div className="chat-item-avatar-container">
        <img
          src={avatar || "/placeholder.svg"}
          alt={name}
          className="chat-item-avatar"
        />
        {isOnline && <span className="chat-item-online-indicator"></span>}
      </div>
      <div className="chat-item-content">
        <div className="chat-item-header">
          <h3 className="chat-item-name">{name}</h3>
          <span className="chat-item-time">{time}</span>
        </div>
        <p className="chat-item-message">{message}</p>
      </div>
      {unread && <div className="chat-item-unread"></div>}
    </div>
  );
}
