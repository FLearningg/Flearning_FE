import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Provider } from 'react-redux';
import { store } from './store/index'
import App from './App';
import 'antd/dist/reset.css';
import './index.css';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

const root = ReactDOM.createRoot(document.getElementById('root'));

const GOOGLE_CLIENT_ID =  process.env.REACT_APP_GOOGLE_CLIENT_ID;

root.render(
  <React.StrictMode>
    <BrowserRouter>
    <Provider store={store}>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <App />
      </GoogleOAuthProvider>
    </Provider>
    </BrowserRouter>
  </React.StrictMode>
);