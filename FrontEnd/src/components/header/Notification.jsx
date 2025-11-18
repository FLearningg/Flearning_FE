import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { markAllRead } from "../../store/notificationSlice";
import { useNavigate } from "react-router-dom";
import {
  MoreHorizontal,
  MessageCircle,
  Heart,
  Bell,
  Check,
} from "lucide-react";

// Import file CSS
import "../../assets/Toast/CustomToast.css";

function Notification() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items: notifications, unreadCount } = useSelector(
    (state) => state.notifications
  );

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [showOptions, setShowOptions] = useState(false);

  const wrapperRef = useRef(null);

  // --- XỬ LÝ SỰ KIỆN ---

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (isOpen) setShowOptions(false);
  };

  const handleOptionsToggle = (e) => {
    e.stopPropagation();
    setShowOptions(!showOptions);
  };

  // Gọi action markAllRead và Redux sẽ tự động cập nhật giao diện
  const handleMarkAllRead = (e) => {
    e.stopPropagation();
    console.log("1. Đã bấm nút Đánh dấu tất cả đọc");
    console.log("Unread Count hiện tại:", unreadCount);

    if (unreadCount > 0) {
      console.log("2. Đang dispatch action...");
      dispatch(markAllRead())
        .unwrap()
        .then(() => {
          console.log("3. Thành công! Redux đã cập nhật.");
        })
        .catch((err) => {
          console.error("3. Thất bại! Lỗi API:", err);
        });
    } else {
      console.log("2. Không có tin chưa đọc, không gọi API.");
    }
    setShowOptions(false);
  };
  const handleNotificationClick = (notification) => {
    // Đóng dropdown
    setIsOpen(false);
    setShowOptions(false);

    // Điều hướng
    if (notification.link) {
      navigate(notification.link);
    } else {
      navigate("/profile/message");
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        setShowOptions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  // Render Icon
  const renderIcon = (type) => {
    const style = {
      position: "absolute",
      bottom: -2,
      right: -2,
      borderRadius: "50%",
      padding: "3px",
      backgroundColor: "white",
      border: "1px solid #eee",
      width: 22,
      height: 22,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 2,
    };
    switch (type) {
      case "like":
        return (
          <div style={{ ...style, backgroundColor: "#e41e3f" }}>
            <Heart size={12} color="white" fill="white" />
          </div>
        );
      case "comment":
      case "chat_message":
        return (
          <div style={{ ...style, backgroundColor: "#45bd62" }}>
            <MessageCircle size={12} color="white" fill="white" />
          </div>
        );
      case "system":
      default:
        return (
          <div style={{ ...style, backgroundColor: "#1877f2" }}>
            <Bell size={12} color="white" fill="white" />
          </div>
        );
    }
  };

  const displayedNotifications =
    activeTab === "unread"
      ? notifications.filter((n) => !n.isRead)
      : notifications;

  return (
    <div className="fb-dropdown-wrapper" ref={wrapperRef}>
      <button
        className="btn btn-light rounded-circle icon-btn position-relative"
        type="button"
        onClick={handleToggle}
        aria-expanded={isOpen}
      >
        <img
          src="/icons/bell.png"
          className="icon"
          alt="Notification"
          style={{ width: "24px", height: "24px" }}
        />
        {unreadCount > 0 && (
          <span
            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
            style={{ fontSize: "0.6rem" }}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="dropdown-menu-custom show">
          <div className="dropdown-header-custom">
            <h3 className="dropdown-title">Thông báo</h3>
            <div className="options-container">
              <div
                className={`icon-btn small ${showOptions ? "active-bg" : ""}`}
                onClick={handleOptionsToggle}
                title="Tùy chọn"
              >
                <MoreHorizontal size={20} color="#65676b" />
              </div>
              {showOptions && (
                <div className="noti-options-menu">
                  <div className="noti-option-item" onClick={handleMarkAllRead}>
                    <Check size={18} />
                    <span>Đánh dấu tất cả là đã đọc</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="dropdown-tabs">
            <button
              className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              Tất cả
            </button>
            <button
              className={`tab-btn ${activeTab === "unread" ? "active" : ""}`}
              onClick={() => setActiveTab("unread")}
            >
              Chưa đọc
            </button>
          </div>

          <div className="dropdown-content">
            <div className="section-header">
              <span>{activeTab === "all" ? "Mới nhất" : "Chưa đọc"}</span>
            </div>

            <ul className="noti-list">
              {displayedNotifications.length === 0 ? (
                <li className="empty-state">Không có thông báo nào</li>
              ) : (
                displayedNotifications.map((n) => (
                  <li
                    key={n._id}
                    className="noti-list-item"
                    onClick={() => handleNotificationClick(n)}
                  >
                    <div className="noti-avatar-container">
                      <img
                        src={
                          n.sender?.userImage || "/images/defaultImageUser.png"
                        }
                        alt="Avatar"
                        className="noti-avatar-img"
                      />
                      {renderIcon(n.type)}
                    </div>
                    <div className="noti-content">
                      <p className="noti-message">
                        <strong>
                          {n.sender?.firstName} {n.sender?.lastName}
                        </strong>{" "}
                        {n.content}
                      </p>
                      {/* LOGIC CSS: !n.isRead ? text-primary : text-muted */}
                      <span
                        className={`noti-timestamp ${
                          !n.isRead ? "text-primary" : "text-muted"
                        }`}
                      >
                        {new Date(n.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    {/* LOGIC HIỂN THỊ: Chỉ hiện chấm xanh nếu chưa đọc */}
                    {!n.isRead && <div className="noti-unread-dot"></div>}
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default Notification;
