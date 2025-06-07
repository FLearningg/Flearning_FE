import React from 'react';
import { Route } from 'react-router-dom';

import LoginPage from '../pages/AuthPage/LoginPage';
import SignUpPage from '../pages/AuthPage/SignUpPage';

const authRoutesContent = ( // Đây là JSX, không phải là một component
  <>
    <Route path="login" element={<LoginPage />} />
    <Route path="signup" element={<SignUpPage />} />
  </>
);

export default authRoutesContent; // Export trực tiếp JSX fragment