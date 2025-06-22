import React from 'react';
import { Route } from 'react-router-dom';

import LoginPage from '../pages/AuthPage/LoginPage';
import SignUpPage from '../pages/AuthPage/SignUpPage';
import VerifyEmailPage from '../pages/AuthPage/VerifyEmailPage';
import RegistrationSuccessPage from '../pages/AuthPage/RegistrationSuccessPage';


const authRoutesContent = ( // Đây là JSX, không phải là một component
  <>
    <Route path="login" element={<LoginPage />} />
    <Route path="signup" element={<SignUpPage />} />
    <Route path="/registration-success" element={<RegistrationSuccessPage />} />
    <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
  </>
);

export default authRoutesContent; // Export trực tiếp JSX fragment