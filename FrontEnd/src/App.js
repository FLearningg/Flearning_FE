import React, { useEffect } from "react";
import AppRouter from "./routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser } from "./store/authSlice";
import NotificationSocketHandler from "./utils/NotificationSocketHandler";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCurrentUser());
    }
  }, [isAuthenticated, dispatch]);

  return (
    <>
      <AppRouter />

      {/* === 1. TOAST CŨ (Dành cho thông báo hệ thống chung) === */}
      {/* Không set containerId -> Nó sẽ nhận các toast mặc định */}
      <ToastContainer
        enableMultiContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {/* === 2. TOAST MỚI (Dành riêng cho thông báo Socket/Facebook) === */}
      {/* Bọc trong div riêng như bạn muốn để dễ chỉnh CSS vị trí nếu cần */}
      <div className="socket-toast-wrapper">
        <ToastContainer
          enableMultiContainer // Cho phép chạy song song với cái trên
          containerId="socket-notification" // ĐẶT TÊN ĐỊNH DANH RIÊNG
          position="bottom-left" // Vị trí góc dưới trái
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          icon={false} // Tắt icon mặc định để dùng giao diện custom của bạn
        />
      </div>

      {isAuthenticated && <NotificationSocketHandler />}
    </>
  );
}

export default App;
