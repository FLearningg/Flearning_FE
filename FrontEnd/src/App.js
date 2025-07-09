import React, { useEffect } from "react";
import AppRouter from "./routes"; // Import AppRouter từ thư mục routes (routes/index.js)
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser } from "./store/authSlice"; // Import action để lấy thông tin người dùng hiện tại

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  // useEffect này sẽ chạy một lần khi ứng dụng tải,
  // hoặc mỗi khi trạng thái isAuthenticated thay đổi.
  useEffect(() => {
    // Nếu có token (isAuthenticated = true), gọi API để lấy thông tin mới nhất
    if (isAuthenticated) {
      dispatch(fetchCurrentUser());
    }
  }, [isAuthenticated, dispatch]);

  return (
    <>
      <AppRouter />
      <ToastContainer autoClose={8000} />
    </>
  );
}

export default App;
