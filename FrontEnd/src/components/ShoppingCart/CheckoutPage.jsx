import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CreditCard } from "lucide-react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { getCart } from "../../services/cartService";
import { getCourseById } from "../../services/courseService";
import QRCodePayment from "./QRCodePayment";

import {
  Breadcrumb,
  PaymentCard,
  NewCardForm,
  OrderSummary,
} from "./CheckoutComponents";

import "../../assets/ShoppingCart/CheckoutPage.css";

// --- Payment methods ---
const paymentOptions = [
  {
    key: "visa",
    brand: { label: "VISA", style: { backgroundColor: "#2566af" } },
    lastDigits: "4855 **** **** ****",
    expiry: "04/24",
    owner: "Valko Shvili",
  },
  {
    key: "mastercard",
    brand: {
      label: (
        <div className="mastercard-logo">
          <div className="mastercard-logo__circle--red"></div>
          <div className="mastercard-logo__circle--yellow"></div>
        </div>
      ),
      style: { background: "transparent" },
    },
    lastDigits: "5795 **** **** ****",
    expiry: "04/24",
    owner: "Valko Shvili",
  },
  {
    key: "paypal",
    brand: { label: "PP", style: { backgroundColor: "#253b80" } },
    description: "You will be redirected to PayPal after reviewing your order.",
  },
  {
    key: "new-card",
    brand: {
      label: <CreditCard size={16} />,
      style: { backgroundColor: "#ff6636" },
    },
    lastDigits: "New Payment Card",
  },
  {
    key: "qr-code",
    brand: { label: "QR", style: { backgroundColor: "#00c853" } },
    lastDigits: "Thanh toán qua QR Code",
  },
];

const toNumber = (price) => {
  if (typeof price === "number") return price;
  const numericString = String(price).replace(/[^0-9.]/g, "");
  return parseFloat(numericString) || 0;
};

const generateRandomString = (length) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join("");
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

  const [selectedPayment, setSelectedPayment] = useState("new-card");
  const [fullCourses, setFullCourses] = useState([]);

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
    return fullCourses.map((course) => {
      const originalPrice = toNumber(course.price);
      const discount = course.discountId?.value || 0;
      const currentPrice = Math.max(0, originalPrice - discount);
      return {
        ...course,
        originalPrice,
        currentPrice,
      };
    });
  }, [fullCourses]);

  const orderTotals = useMemo(() => {
    const subtotal = processedCourses.reduce(
      (sum, course) => sum + course.currentPrice,
      0
    );
    const discountAmount = subtotal * 0.08;
    const total = subtotal - discountAmount;
    return { subtotal, discountAmount, total };
  }, [processedCourses]);

  const handleNonQRPayment = () => {
    Swal.fire({
      title: "Payment Gateway",
      text: "This feature is not yet implemented.",
      icon: "info",
      confirmButtonText: "Okay",
    });
  };

  if (!currentUser) return null;

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
              qrAmount={Math.floor(orderTotals.total * 25000)}
              qrContent={`COURSE${generateRandomString(6)}`}
              cartCourses={processedCourses}
            />
          </div>
          <div className="col-lg-4">
            <OrderSummary
              courses={processedCourses}
              subtotal={orderTotals.subtotal}
              discountAmount={orderTotals.discountAmount}
              total={orderTotals.total}
              onCompletePayment={handleNonQRPayment}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
