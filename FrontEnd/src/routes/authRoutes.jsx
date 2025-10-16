import React from "react";
import { Route } from "react-router-dom";

import LoginPage from "../pages/AuthPage/LoginPage";
import SignUpPage from "../pages/AuthPage/SignUpPage";
import VerifyEmailPage from "../pages/AuthPage/VerifyEmailPage";
import RegistrationSuccessPage from "../pages/AuthPage/RegistrationSuccessPage";
import ForgotPasswordPage from "../pages/AuthPage/ForgotPasswordPage";
import ResetPasswordPage from "../pages/AuthPage/ResetPasswordPage";
import InstructorRegisterPage from "../pages/AuthPage/InstructorRegisterPage";

const authRoutesContent = // Đây là JSX, không phải là một component
  (
    <>
      <Route path="login" element={<LoginPage />} />
      <Route path="signup" element={<SignUpPage />} />
      <Route path="instructor/register" element={<InstructorRegisterPage />} />
      <Route
        path="/registration-success"
        element={<RegistrationSuccessPage />}
      />
      <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
    </>
  );

export default authRoutesContent; // Export trực tiếp JSX fragment
