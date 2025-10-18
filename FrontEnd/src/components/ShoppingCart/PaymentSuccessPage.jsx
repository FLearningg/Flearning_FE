import React, { useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

import apiClient from "../../services/authService";

// --- BẮT ĐẦU KHỐI CSS ---
const css = `
.payment-success-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 80vh;
  text-align: center;
  color: #555;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.loader {
  border: 8px solid #f3f3f3; /* Light grey */
  border-top: 8px solid #28a745; /* Success color */
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 1.5s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.payment-success-container h2 {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.payment-success-container p {
  font-size: 1rem;
}
`;
// --- KẾT THÚC KHỐI CSS ---

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderCode = searchParams.get("orderCode");

  // Dùng useRef để tránh useEffect chạy lại không cần thiết
  const alertShownRef = useRef(false);

  useEffect(() => {
    if (!orderCode) {
      Swal.fire({
        title: "Lỗi",
        text: "Không tìm thấy mã đơn hàng. Đang chuyển hướng...",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => navigate("/courses"));
      return;
    }

    // Nếu alert đã hiện thì không làm gì nữa
    if (alertShownRef.current) return;

    // --- BẮT ĐẦU KIỂM TRA TRẠNG THÁI (POLLING) ---
    const intervalId = setInterval(async () => {
      try {
        // Sửa lại đường dẫn API cho đúng
        const response = await apiClient.get(`/payment/status/${orderCode}`);
        const status = response.data.status; // 'pending', 'completed', 'cancelled'

        if (status === "completed") {
          alertShownRef.current = true; // Đánh dấu đã hiện alert
          clearInterval(intervalId); // Dừng kiểm tra

          Swal.fire({
            title: "Thanh toán thành công!",
            text: "Khóa học đã được thêm vào tài khoản của bạn. Chúc bạn học tập hiệu quả!",
            icon: "success",
            confirmButtonText: "Xem khóa học của tôi",
            timer: 4000,
            timerProgressBar: true,
          }).then(() => {
            navigate("/profile/courses"); // Chuyển hướng đến trang khóa học của bạn
          });
        } else if (status === "cancelled" || status === "failed") {
          alertShownRef.current = true;
          clearInterval(intervalId);

          Swal.fire({
            title: "Giao dịch không thành công",
            text: "Giao dịch đã bị hủy hoặc thất bại. Vui lòng thử lại.",
            icon: "error",
            confirmButtonText: "Về giỏ hàng",
          }).then(() => {
            navigate("/profile/cart");
          });
        }
        // Nếu vẫn là "pending", không làm gì cả, chờ lần kiểm tra tiếp theo
      } catch (error) {
        alertShownRef.current = true;
        clearInterval(intervalId); // Dừng lại khi có lỗi
        console.error("Lỗi khi kiểm tra trạng thái:", error);

        Swal.fire({
          title: "Có lỗi xảy ra",
          text: "Không thể xác thực thanh toán của bạn lúc này. Vui lòng liên hệ hỗ trợ.",
          icon: "error",
          confirmButtonText: "Về trang chủ",
        }).then(() => {
          navigate("/");
        });
      }
    }, 2500); // Kiểm tra mỗi 2.5 giây

    // Dọn dẹp interval khi component bị unmount
    return () => clearInterval(intervalId);
  }, [orderCode, navigate]);

  return (
    <>
      <style>{css}</style>
      <div className="payment-success-container">
        <div className="loader"></div>
        <h2>Đang xác thực thanh toán...</h2>
        <p>
          Vui lòng chờ trong giây lát. Hệ thống đang cập nhật trạng thái khóa
          học của bạn.
        </p>
      </div>
    </>
  );
};

export default PaymentSuccessPage;
