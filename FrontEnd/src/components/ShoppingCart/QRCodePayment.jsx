import { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { useLocation } from "react-router-dom";

import { removeFromCart } from "../../services/cartService";
import {
  getRecentBankTransactions,
  saveTransactionToDB,
} from "../../services/paymentService";
import { enrollInCourses } from "../../services/courseService";
import { increaseDiscountUsage } from "../../services/adminService";

const MY_BANK = {
  BANK_ID: process.env.REACT_APP_MY_BANK_ID,
  ACCOUNT_NO: process.env.REACT_APP_MY_BANK_ID_ACCOUNT_NO,
};

const usePaymentPolling = ({ amount, content, isPolling }) => {
  const [matchedTransaction, setMatchedTransaction] = useState(null);
  const [isChecking, setIsChecking] = useState(isPolling);
  const intervalIdRef = useRef(null);
  const hasFoundMatchRef = useRef(false);

  const stopPolling = useCallback(() => {
    if (intervalIdRef.current) {
      clearTimeout(intervalIdRef.current);
      intervalIdRef.current = null;
    }
    setIsChecking(false);
  }, []);

  useEffect(() => {
    if (!isPolling || hasFoundMatchRef.current) {
      stopPolling();
      return;
    }

    const simulateSuccessfulPayment = () => {
      console.log("Simulating a successful payment check...");

      // 1. Create a fake transaction with the CORRECT property names
      const fakeTransaction = {
        "Giá trị": amount,
        "Mô tả": `Thanh toan don hang ${content} thanh cong`,
        // FIX #1: Added the correct property for the date
        "Ngày diễn ra": new Date().toISOString(),
        // FIX #2: Added the required transaction ID property
        "Mã GD": `FAKE_${Date.now()}`,
      };

      console.log("Fake transaction created:", fakeTransaction);

      // 2. Update the state to trigger the success logic
      hasFoundMatchRef.current = true;
      setMatchedTransaction(fakeTransaction);
      stopPolling();
    };

    // 3. Simulate receiving the payment after 5 seconds
    intervalIdRef.current = setTimeout(simulateSuccessfulPayment, 5000);

    return stopPolling;
  }, [isPolling, amount, content, stopPolling]);

  return { matchedTransaction, isChecking };
};

export default function QRCodePayment({ amount, content, coursesInCart }) {
  const currentUser = useSelector((state) => state.auth.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isCheckoutPage = location.pathname.includes("/checkout");

  const [isProcessing, setIsProcessing] = useState(false);
  const qrCodeUrl = `https://img.vietqr.io/image/${MY_BANK.BANK_ID}-${MY_BANK.ACCOUNT_NO}-compact2.png?amount=${amount}&addInfo=${content}`;

  const { matchedTransaction, isChecking } = usePaymentPolling({
    amount,
    content,
    isPolling: !isProcessing && !!currentUser?._id,
  });

  useEffect(() => {
    if (matchedTransaction && !isProcessing) {
      const handleSuccessfulPayment = async () => {
        setIsProcessing(true);
        console.log("Payment matched! Starting post-payment process...");

        try {
          // STEP 1: Save the transaction to your database
          console.log("Step 1: Saving transaction to DB...");
          await saveTransactionToDB(
            matchedTransaction,
            currentUser,
            coursesInCart.map((course) => course._id)
          );
          console.log("Transaction saved successfully.");

          // STEP 1.5: Increase usage for each valid discount
          for (const course of coursesInCart) {
            const discount = course.discountId;
            if (
              discount &&
              discount.status === "active" &&
              (!discount.endDate || new Date(discount.endDate) >= new Date()) &&
              (typeof discount.usageLimit !== "number" ||
                discount.usageLimit === 0 ||
                (typeof discount.usage === "number" &&
                  discount.usage < discount.usageLimit))
            ) {
              try {
                await increaseDiscountUsage(discount._id || discount.id);
              } catch (err) {
                console.error("Failed to increase discount usage:", err);
              }
            }
          }

          // STEP 2: Enroll the user in the purchased courses
          console.log("Step 2: Enrolling user in courses...");
          const courseIdsToEnroll = coursesInCart.map((course) => course._id);
          await enrollInCourses(currentUser._id, courseIdsToEnroll);
          console.log("User enrolled successfully.");

          // STEP 3: Remove all courses from the user's cart (only on /checkout and if any)
          if (
            isCheckoutPage &&
            Array.isArray(coursesInCart) &&
            coursesInCart.length > 0
          ) {
            try {
              console.log("Step 3: Clearing cart for user:", currentUser._id);
              const removalPromises = coursesInCart.map((course) =>
                removeFromCart(currentUser._id, course._id, dispatch)
              );
              await Promise.all(removalPromises);
              console.log("All items removed from cart successfully.");
            } catch (cartError) {
              console.error(
                "Payment successful, but failed to clear cart:",
                cartError
              );
            }
          } else {
            console.log(
              "Step 3: Skipping cart removal (not in /checkout or cart empty)."
            );
          }

          // STEP 4: Show the success alert to the user
          console.log("Step 4: Showing success alert.");
          Swal.fire({
            icon: "success",
            title: "Payment Successful!",
            text: "Thank you for your purchase. You have been enrolled in your new courses.",
            confirmButtonText: "Go to My Courses",
            allowOutsideClick: false,
            didOpen: () => {
              const popup = Swal.getPopup();
              const container = Swal.getContainer();
              const backdrop = document.querySelector(".swal2-backdrop");
              if (container) container.style.zIndex = "3000";
              if (backdrop) backdrop.style.zIndex = "2999";
            },
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/profile/courses");
            }
          });
        } catch (error) {
          console.error(
            "A critical error occurred while processing the payment:",
            error
          );
          Swal.fire({
            icon: "error",
            title: "Processing Error",
            text: "Your payment was received, but we encountered an error setting up your account. Please contact support.",
          });
        }
      };

      handleSuccessfulPayment();
    }
  }, [
    matchedTransaction,
    isProcessing,
    currentUser,
    coursesInCart,
    dispatch,
    navigate,
  ]);

  return (
    <div className="qr-payment-container border p-3 bg-light mt-3 text-center">
      <h4 className="mb-3">Quét mã QR để thanh toán</h4>
      <img
        src={qrCodeUrl}
        alt="QR Code for payment"
        className="img-fluid mb-3"
        style={{ maxWidth: "350px", display: "inline", width: "100%" }}
      />
      <p className="mb-1">
        Nội dung chuyển khoản:{" "}
        <strong className="text-danger">{content}</strong>
      </p>
      <p>
        Số tiền:{" "}
        <strong className="text-danger">
          {amount.toLocaleString("vi-VN")} VND
        </strong>
      </p>
      {isChecking && (
        <div className="d-flex justify-content-center align-items-center mt-2">
          <div className="spinner-border spinner-border-sm" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <span className="ms-2">Đang chờ xác nhận...</span>
        </div>
      )}
    </div>
  );
}
