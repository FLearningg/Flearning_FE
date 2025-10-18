import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

import apiClient from "../../services/authService";

// --- BẮT ĐẦU KHỐI CSS ---
// Toàn bộ CSS từ file .css được đặt trong một biến string
const css = `
.payment-cancelled-container {
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
  border-top: 8px solid #e07181; /* Theme color */
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

.payment-cancelled-container h2 {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.payment-cancelled-container p {
  font-size: 1rem;
}
`;
// --- KẾT THÚC KHỐI CSS ---

const PaymentCancelledPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderCode = searchParams.get("orderCode");

  useEffect(() => {
    if (orderCode) {
      const cancelOrderAndShowAlert = async () => {
        try {
          await apiClient.put(`/payment/cancel/${orderCode}`);
          console.log(`Đã gửi yêu cầu hủy cho đơn hàng: ${orderCode}`);

          Swal.fire({
            title: "Đã hủy giao dịch",
            text: "Đơn hàng của bạn đã được hủy trong hệ thống. Bạn sẽ được chuyển về giỏ hàng.",
            icon: "info",
            confirmButtonText: "Đồng ý",
            timer: 3000,
            timerProgressBar: true,
          }).then(() => {
            navigate("/");
          });
        } catch (error) {
          console.error("Lỗi khi hủy đơn hàng:", error);

          Swal.fire({
            title: "Có lỗi xảy ra",
            text: "Không thể gửi yêu cầu hủy đơn hàng. Vui lòng thử lại sau.",
            icon: "error",
            confirmButtonText: "Về trang chủ",
          }).then(() => {
            navigate("/");
          });
        }
      };

      cancelOrderAndShowAlert();
    } else {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderCode, navigate]);

  return (
    <>
      {/* Thẻ style sẽ chèn toàn bộ CSS ở trên vào trang */}
      <style>{css}</style>
      <div className="payment-cancelled-container">
        <div className="loader"></div>
        <h2>Đang xử lý hủy đơn hàng...</h2>
        <p>Vui lòng chờ trong giây lát.</p>
      </div>
    </>
  );
};

export default PaymentCancelledPage;
