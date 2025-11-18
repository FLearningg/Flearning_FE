import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // Import hook điều hướng
import { MessageCircle } from "lucide-react";
import "../assets/Toast/CustomToast.css"; // Import CSS tùy chỉnh

// Import socket và actions
import { socket } from "./socket";
import {
  fetchNotifications,
  addNewNotification,
  updateUnreadCount,
} from "../store/notificationSlice";
import { logout } from "../store/authSlice";

// === COMPONENT HIỂN THỊ NỘI DUNG TOAST ===
const CustomToastContent = ({ data, closeToast }) => {
  // Logic bảo vệ (Defensive coding)
  const sender =
    data?.sender && typeof data.sender === "object" ? data.sender : null;
  const senderImage = sender?.userImage || "/images/defaultImageUser.png";
  const senderName = sender
    ? `${sender.firstName} ${sender.lastName}`
    : "Thông báo hệ thống";
  const content = data?.content || "Bạn có thông báo mới.";

  let actionIcon = null;

  // Render icon nhỏ dựa trên loại thông báo
  if (data?.type === "like") {
    actionIcon = (
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Facebook_Like_button.svg/1024px-Facebook_Like_button.svg.png"
        alt="Like"
        className="toast-action-icon like"
      />
    );
  } else if (data?.type === "comment" || data?.type === "chat_message") {
    actionIcon = (
      <div className="toast-action-icon comment">
        <MessageCircle size={14} color="#ffffff" fill="#ffffff" />
      </div>
    );
  }

  return (
    <div className="fb-toast-wrapper">
      {/* Header */}
      <div className="toast-header">
        <span className="toast-title">Thông báo mới</span>
        <button
          className="toast-close-btn"
          onClick={(e) => {
            e.stopPropagation(); // Ngăn chặn sự kiện click lan ra ngoài (để không kích hoạt navigate khi bấm nút X)
            closeToast();
          }}
        >
          &times;
        </button>
      </div>

      {/* Nội dung chính */}
      <div className="toast-content-wrapper">
        <div className="toast-avatar-container">
          <img src={senderImage} alt="Avatar" className="toast-avatar" />
          {actionIcon}
        </div>
        <div className="toast-text-content">
          <p className="toast-message">
            <strong>{senderName}</strong> {content}
          </p>
          <span className="toast-time">Vừa xong</span>
        </div>
        <div className="toast-read-dot" />
      </div>
    </div>
  );
};

// === COMPONENT DỊCH VỤ ===
function NotificationSocketHandler() {
  const dispatch = useDispatch();
  const { isAuthenticated, currentUser } = useSelector((state) => state.auth);
  const navigate = useNavigate(); // Khởi tạo hook điều hướng

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      // 1. Cấu hình và kết nối
      const token = localStorage.getItem("accessToken");
      socket.auth = { token };
      socket.connect();

      // 2. Lấy dữ liệu ban đầu
      dispatch(fetchNotifications());

      // 3. Xử lý sự kiện: Thông báo mới
      const onNewNotification = (data) => {
        // Kiểm tra dữ liệu hợp lệ
        if (!data || !data._id) {
          console.warn("Bỏ qua thông báo rỗng/không hợp lệ.");
          return;
        }

        console.log("🔔 Nhận thông báo:", data);
        dispatch(addNewNotification(data));

        // Hiển thị Toast với sự kiện onClick
        toast.info(
          ({ closeToast }) => (
            <CustomToastContent data={data} closeToast={closeToast} />
          ),
          {
            containerId: "socket-notification",
            // Xử lý khi click vào toàn bộ hộp thông báo
            onClick: () => {
              // Nếu backend có gửi kèm link thì ưu tiên dùng link đó
              if (data.link) {
                navigate(data.link);
              } else {
                // Nếu không, mặc định nhảy về trang tin nhắn
                navigate("/profile/message");
              }
            },
          }
        );
      };

      // 4. Xử lý sự kiện: Cập nhật số lượng chưa đọc
      const onUnreadCount = (count) => {
        dispatch(updateUnreadCount(count));
      };

      const onAccountBanned = (data) => {
        console.warn("⚠️ TÀI KHOẢN ĐÃ BỊ KHÓA:", data.reason);

        // a. Hiển thị thông báo lỗi nghiêm trọng
        toast.error(
          `Tài khoản của bạn đã bị KHÓA vĩnh viễn. Lý do: ${data.reason}`,
          {
            position: "top-center", // Hiện ở giữa trên cùng cho dễ thấy
            autoClose: 10000, // Hiện lâu (10s)
            containerId: "global_toast", // Dùng container toàn cục
          }
        );

        // b. Thực hiện đăng xuất (Xóa Redux state & LocalStorage)
        dispatch(logout());

        // c. Ngắt kết nối socket
        socket.disconnect();

        // d. Chuyển hướng về trang đăng nhập
        navigate("/login");
      };

      // Đăng ký lắng nghe sự kiện
      socket.on("new_notification", onNewNotification);
      socket.on("unread_notification_count", onUnreadCount);
      socket.on("account_banned", onAccountBanned);

      // Cleanup khi unmount/logout
      return () => {
        console.log("Ngắt kết nối Socket Notification...");
        socket.off("new_notification", onNewNotification);
        socket.off("unread_notification_count", onUnreadCount);
        socket.off("account_banned", onAccountBanned);
        socket.disconnect();
      };
    }
  }, [isAuthenticated, currentUser, dispatch, navigate]); // Thêm navigate vào dependency

  return null;
}

export default NotificationSocketHandler;
