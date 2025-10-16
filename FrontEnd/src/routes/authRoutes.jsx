import React from "react";
import { Route } from "react-router-dom";

import LoginPage from "../pages/AuthPage/LoginPage";
import SignUpPage from "../pages/AuthPage/SignUpPage";
import VerifyEmailPage from "../pages/AuthPage/VerifyEmailPage";
import InstructorVerifyEmailPage from "../pages/AuthPage/InstructorVerifyEmailPage";
import RegistrationSuccessPage from "../pages/AuthPage/RegistrationSuccessPage";
import CheckEmailPage from "../pages/AuthPage/CheckEmailPage";
import ForgotPasswordPage from "../pages/AuthPage/ForgotPasswordPage";
import ResetPasswordPage from "../pages/AuthPage/ResetPasswordPage";

const authRoutesContent = // Đây là JSX, không phải là một component
  (
    <>
      <Route path="login" element={<LoginPage />} />
      <Route path="signup" element={<SignUpPage />} />
      <Route
        path="/registration-success"
        element={<RegistrationSuccessPage />}
      />
      <Route path="/check-email" element={<CheckEmailPage />} />
      <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
      <Route path="/verify-instructor-email/:token" element={<InstructorVerifyEmailPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
    </>
  );

export default authRoutesContent; // Export trực tiếp JSX fragment
