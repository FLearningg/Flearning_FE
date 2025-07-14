import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CreditCard } from "lucide-react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { getCart } from "../../services/cartService";
import QRCodePayment from "./QRCodePayment";
import {
  Breadcrumb,
  PaymentCard,
  NewCardForm,
  OrderSummary,
} from "./CheckoutComponents";

import "../../assets/ShoppingCart/CheckoutPage.css";

// --- Constants and Configuration ---
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
    description:
      "You will be redirected to the PayPal site after reviewing your order.",
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

// --- Helper Functions ---
const toNumber = (price) => {
  if (typeof price === "number") return price;
  const numericString = String(price).replace(/[^0-9.]/g, "");
  return parseFloat(numericString) || 0;
};

// Helper to generate a random string
const generateRandomString = (length) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

// --- Sub-Components ---
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
//           MAIN CHECKOUT PAGE COMPONENT
// =============================================
export default function CheckoutPage() {
  // --- State and Hooks ---
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.currentUser);
  const coursesInCart = useSelector((state) => state.cart.getCart.items) || [];
  const [selectedPayment, setSelectedPayment] = useState("new-card");

  // --- Side Effects ---
  useEffect(() => {
    if (currentUser === null) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (currentUser?._id) {
      getCart(dispatch, currentUser._id);
    }
  }, [dispatch, currentUser]);

  // --- Memoized Calculations ---
  const orderTotals = useMemo(() => {
    const subtotal = coursesInCart.reduce(
      (sum, course) => sum + toNumber(course.price),
      0
    );
    const couponDiscountPercent = 8;
    const discountAmount = subtotal * (couponDiscountPercent / 100);
    const total = subtotal - discountAmount;
    return { subtotal, discountAmount, total };
  }, [coursesInCart]);

  // --- Handlers ---
  const handleNonQRPayment = () => {
    Swal.fire({
      title: "Payment Gateway",
      text: "This feature is not yet implemented.",
      icon: "info",
      confirmButtonText: "Okay",
    });
  };

  // To prevent rendering the page for a split second before redirecting
  if (currentUser === null) {
    return null;
  }

  return (
    <div className="checkout-page">
      <Breadcrumb />
      <div className="container-fluid px-4 py-5">
        <div className="row g-5">
          <div className="col-lg-8">
            <h2 className="section-title">Payment Method</h2>
            {paymentOptions.map(({ key, ...methodProps }) => (
              <PaymentCard
                key={key}
                {...methodProps}
                isSelected={selectedPayment === key}
                onClick={() => setSelectedPayment(key)}
              />
            ))}
            <PaymentDetails
              selectedMethod={selectedPayment}
              qrAmount={orderTotals.total * 25000}
              qrContent={`COURSE${generateRandomString(6)}`}
              cartCourses={coursesInCart}
            />
          </div>
          <div className="col-lg-4">
            <OrderSummary
              courses={coursesInCart}
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
