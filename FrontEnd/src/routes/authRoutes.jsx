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

// Routes with layout (login, signup, forgot password, reset password)
export const authRoutesWithLayout = (
  <>
    <Route path="login" element={<LoginPage />} />
    <Route path="signup" element={<SignUpPage />} />
    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
    <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
  </>
);

// Routes without layout (verification and confirmation pages)
export const authRoutesWithoutLayout = (
  <>
    <Route path="/registration-success" element={<RegistrationSuccessPage />} />
    <Route path="/check-email" element={<CheckEmailPage />} />
    <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
    <Route path="/verify-instructor-email/:token" element={<InstructorVerifyEmailPage />} />
  </>
);

// Keep backward compatibility
const authRoutesContent = (
  <>
    {authRoutesWithLayout}
    {authRoutesWithoutLayout}
  </>
);

export default authRoutesContent;
