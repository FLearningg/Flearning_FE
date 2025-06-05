import React from 'react';
import { Routes, Route } from 'react-router-dom';

import AppLayout from '../layouts/AppLayout';

import mainRoutesContent from './mainRoutes';
import authRoutesContent from './authRoutes';

import ErrorPage from '../pages/MainPage/ErrorPage';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        {/* Nhúng trực tiếp JSX của mainRoutesContent */}
        {mainRoutesContent}

        {/* Nhúng trực tiếp JSX của authRoutesContent */}
        {authRoutesContent}
      </Route>
      <Route path="*" element={
        <AppLayout>
          <ErrorPage />
        </AppLayout>
      } />
    </Routes>
  );
};

export default AppRouter;