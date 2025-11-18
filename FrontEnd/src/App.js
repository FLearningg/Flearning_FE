import React, { useEffect } from "react";
import AppRouter from "./routes"; // Import AppRouter từ thư mục routes (routes/index.js)
import { ToastContainer } from "react-toastify"; // Chỉ import Container, không cần hàm toast nữa
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser } from "./store/authSlice"; // Import action để lấy thông tin người dùng hiện tại

// === QUAN TRỌNG: Import component dịch vụ xử lý socket vừa tạo ===
// Đảm bảo đường dẫn này đúng với nơi bạn tạo file ở bước trước
import NotificationSocketHandler from "./utils/NotificationSocketHandler";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  // 1. Giữ nguyên logic lấy thông tin user khi load trang
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCurrentUser());
    }
  }, [isAuthenticated, dispatch]);

  return (
    <>
      {/* Router điều hướng trang */}
      <AppRouter />

      {/* Container chứa Toast (Popup thông báo) */}
      {/* Nó cần nằm ở root để hiển thị đè lên mọi thứ */}
      <ToastContainer
        position="bottom-left" // Vị trí giống Facebook
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        icon={false}
      />

      {/* === COMPONENT XỬ LÝ SOCKET === */}
      {/* Chỉ render (và kết nối socket) khi user đã đăng nhập */}
      {isAuthenticated && <NotificationSocketHandler />}
    </>
  );
}

export default App;
