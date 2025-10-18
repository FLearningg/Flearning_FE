import { useState } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { createPayOSLink } from "../../services/paymentService";

export default function PayOSPayment({ amount, coursesInCart }) {
  const currentUser = useSelector((state) => state.auth.currentUser);
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    if (!currentUser) {
      Swal.fire("Lỗi", "Vui lòng đăng nhập để thực hiện thanh toán.", "error");
      return;
    }

    setIsLoading(true);

    try {
      const paymentData = {
        description: `Thanh toán cho ${coursesInCart.length} khóa học`,
        price: amount,
        packageType: "COURSE_PURCHASE",
        courseIds: coursesInCart.map((course) => course._id),
      };

      // 1. Gọi API backend để lấy checkoutUrl
      const { checkoutUrl } = await createPayOSLink(paymentData);

      // 2. Chuyển hướng người dùng đến cổng thanh toán PayOS
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        throw new Error("Không nhận được đường link thanh toán.");
      }
    } catch (error) {
      console.error("Lỗi khi tạo link thanh toán:", error);
      Swal.fire(
        "Đã có lỗi xảy ra",
        error.message || "Không thể tạo link thanh toán. Vui lòng thử lại.",
        "error"
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="payment-container border p-4 bg-light mt-3 rounded">
      <h4 className="mb-3">Xác nhận thanh toán</h4>
      <div className="d-flex justify-content-between mb-3">
        <span>Tổng số tiền:</span>
        <strong className="text-danger fs-5">
          {amount.toLocaleString("vi-VN")} VND
        </strong>
      </div>
      <button
        className="btn btn-primary w-100 fw-bold"
        onClick={handlePayment}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
            <span className="ms-2">Đang xử lý...</span>
          </>
        ) : (
          "Tiến hành thanh toán"
        )}
      </button>
    </div>
  );
}
