import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CreditCard } from "lucide-react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { toast } from "react-toastify"; // <-- THÊM IMPORT
import { getCart } from "../../services/cartService";
import { getCourseById } from "../../services/courseService";
import { createPayOSLink } from "../../services/paymentService"; // <-- THÊM IMPORT
import QRCodePayment from "./QRCodePayment";
import AvailableDiscounts from "./AvailableDiscounts";

import {
  Breadcrumb,
  PaymentCard,
  NewCardForm,
  OrderSummary,
} from "./CheckoutComponents";

import "../../assets/ShoppingCart/CheckoutPage.css";

// --- Payment methods ---
const paymentOptions = [
  // ... (Các tuỳ chọn thanh toán của bạn giữ nguyên)
  {
    key: "PayOS",
    brand: { label: "PAYOS", style: { backgroundColor: "#00c853" } },
    description: "You will be redirected to PayOS after reviewing your order.",
  },
  // {
  //   key: "qr-code",
  //   brand: { label: "QR", style: { backgroundColor: "#00c853" } },
  //   lastDigits: "Thanh toán qua QR Code",
  // },
];

// ... (Các hàm helper: toNumber, generateContent, isDiscountValid giữ nguyên)
const toNumber = (price) => {
  if (typeof price === "number") return price;
  const numericString = String(price).replace(/[^0-9.]/g, "");
  return parseFloat(numericString) || 0;
};

const generateContent = (userId) => {
  const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
  const contentQR = `${randomString}${userId}`;
  console.log(contentQR);
  return contentQR;
};

const isDiscountValid = (discount) => {
  if (!discount) return false;
  if (discount.status && discount.status !== "active") return false;
  if (discount.endDate && new Date(discount.endDate) < new Date()) return false;
  if (
    typeof discount.usageLimit === "number" &&
    discount.usageLimit > 0 &&
    typeof discount.usage === "number" &&
    discount.usage >= discount.usageLimit
  ) {
    return false;
  }
  return true;
};

const PaymentDetails = ({
  selectedMethod,
  qrAmount,
  qrContent,
  cartCourses,
}) => {
  if (selectedMethod === "qr-code") {
    return (
      <QRCodePayment
        amount={qrAmount}
        content={qrContent}
        coursesInCart={cartCourses}
      />
    );
  }
  if (selectedMethod === "new-card") {
    return <NewCardForm />;
  }
  return null;
};

// =============================================
//                  CHECKOUT PAGE
// =============================================
export default function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.currentUser);
  const coursesInCart = useSelector((state) => state.cart.getCart.items) || [];

  const [selectedPayment, setSelectedPayment] = useState("PayOS"); // <-- Đặt PayOS làm mặc định
  const [fullCourses, setFullCourses] = useState([]);
  const [isBuying, setIsBuying] = useState(false); // <-- THÊM STATE LOADING
  const [selectedDiscount, setSelectedDiscount] = useState(null); // <-- STATE cho discount được chọn

  useEffect(() => {
    if (currentUser === null) navigate("/");
  }, [currentUser, navigate]);

  useEffect(() => {
    if (currentUser?._id) {
      getCart(dispatch, currentUser._id);
    }
  }, [dispatch, currentUser]);

  useEffect(() => {
    const fetchCourses = async () => {
      const results = await Promise.allSettled(
        coursesInCart.map((item) => getCourseById(item._id))
      );
      const enriched = results
        .filter((r) => r.status === "fulfilled")
        .map((r) => r.value);
      setFullCourses(enriched);
    };

    if (coursesInCart.length > 0) fetchCourses();
    else setFullCourses([]);
  }, [coursesInCart]);

  const processedCourses = useMemo(() => {
    // ... (logic processedCourses của bạn giữ nguyên)
    return fullCourses.map((course) => {
      const originalPrice = toNumber(course.price);
      let finalPrice = originalPrice;
      let discountText = "";

      if (isDiscountValid(course.discountId)) {
        if (course.discountId.type === "fixedAmount") {
          finalPrice = Math.max(0, originalPrice - course.discountId.value);
          discountText = `-${course.discountId.value}`;
        } else if (course.discountId.type === "percent") {
          finalPrice = Math.max(
            0,
            originalPrice * (1 - course.discountId.value / 100)
          );
          discountText = `-${course.discountId.value}%`;
        }
      }

      return {
        ...course,
        originalPrice,
        currentPrice: finalPrice,
        discountText,
      };
    });
  }, [fullCourses]);

  const orderTotals = useMemo(() => {
    let subtotal = 0;
    let discountAmount = 0;

    // Calculate subtotal and discount for each course
    processedCourses.forEach((course) => {
      const coursePrice = course.currentPrice;
      subtotal += coursePrice;

      // Apply selected discount to each course if applicable
      if (selectedDiscount) {
        if (selectedDiscount.type === "percent") {
          // Percent discount applies to ORIGINAL price of each individual course
          let courseDiscount = course.originalPrice * (selectedDiscount.value / 100);

          // Check if discount applies to this specific course
          const appliesToThisCourse =
            !selectedDiscount.applyCourses ||
            selectedDiscount.applyCourses.length === 0 ||
            selectedDiscount.applyCourses.some((dc) => dc._id === course._id || dc === course._id);

          if (appliesToThisCourse) {
            discountAmount += courseDiscount;
          }
        }
      }
    });

    // For fixed amount discount, apply to total order
    if (selectedDiscount && selectedDiscount.type === "fixedAmount") {
      discountAmount = selectedDiscount.value;
    }

    // Apply maximum discount limit if set
    if (selectedDiscount && selectedDiscount.maximumDiscount > 0) {
      discountAmount = Math.min(discountAmount, selectedDiscount.maximumDiscount);
    }

    const total = Math.max(0, subtotal - discountAmount);
    return { subtotal, discountAmount, total };
  }, [processedCourses, selectedDiscount]);

  // SỬA LẠI HOÀN TOÀN HÀM NÀY
  const handleCompletePayment = async () => {
    // Chỉ xử lý khi phương thức là PayOS
    if (selectedPayment !== "PayOS") {
      toast.info("Please select PayOS to proceed.");
      return;
    }

    if (!currentUser) return navigate("/login");

    if (processedCourses.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    setIsBuying(true);
    try {
      // 1. Lấy tất cả ID khoá học
      const courseIds = processedCourses.map((course) => course._id);

      // 2. Lấy tổng tiền
      const totalPrice = orderTotals.total;

      // 3. Tạo data gửi đi
      const paymentData = {
        description: `Thanh toan cho ${courseIds.length} khoa hoc`,
        // price: totalPrice, // <-- Dùng tổng tiền đã tính
        price: 2000, // <-- Tạm thời đặt 2000 để test PayOS
        packageType: "COURSE_PURCHASE",
        courseIds: courseIds, // <-- Dùng mảng ID
        cancelUrl: `${window.location.origin}/cart`, // <-- URL khi huỷ
        returnUrl: `${window.location.origin}/my-learning`, // <-- URL khi thành công
      };

      const { checkoutUrl } = await createPayOSLink(paymentData);

      if (checkoutUrl) {
        window.location.href = checkoutUrl; // Chuyển hướng đến PayOS
      } else {
        throw new Error("Checkout URL not received.");
      }
    } catch (error) {
      console.error("Error creating payment link:", error);
      toast.error("Failed to create payment link. Please try again.");
      setIsBuying(false);
    }
  };

  if (!currentUser) return null;

  // Get course IDs for fetching available discounts
  const courseIds = processedCourses.map((course) => course._id);

  return (
    <div className="checkout-page">
      <Breadcrumb />
      <div className="container-fluid px-4 py-5">
        <div className="row g-5">
          <div className="col-lg-8">
            <h2 className="section-title">Payment Method</h2>
            {paymentOptions.map(({ key, ...props }) => (
              <PaymentCard
                key={key}
                {...props}
                isSelected={selectedPayment === key}
                onClick={() => setSelectedPayment(key)}
              />
            ))}
            <PaymentDetails
              selectedMethod={selectedPayment}
              qrAmount={Math.floor(orderTotals.total * 25000)} // Giữ logic đổi tiền của bạn
              qrContent={`COURSE${generateContent(currentUser?._id)}`}
              cartCourses={processedCourses}
            />

            {/* Available Discounts Section - Moved below Payment Method */}
            <AvailableDiscounts
              courseIds={courseIds}
              courses={processedCourses}
              onSelectDiscount={(discount) => {
                setSelectedDiscount(discount);
              }}
            />
          </div>
          <div className="col-lg-4">
            <OrderSummary
              courses={processedCourses}
              subtotal={orderTotals.subtotal}
              discountAmount={orderTotals.discountAmount} // Sửa ở đây
              total={orderTotals.total}
              selectedDiscount={selectedDiscount} // Pass selected discount
              onRemoveDiscount={() => setSelectedDiscount(null)} // Function to remove discount
              onCompletePayment={handleCompletePayment} // <-- SỬA TÊN HÀM
              isLoading={isBuying} // <-- THÊM PROP LOADING
            />
          </div>
        </div>
      </div>
    </div>
  );
}
