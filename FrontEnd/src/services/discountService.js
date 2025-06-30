import axios from 'axios';
import { store } from '../store/index';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests automatically from Redux store
api.interceptors.request.use((config) => {
  // Get current state from Redux store
  const state = store.getState();
  const token = state.auth.token;
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or unauthorized
      // Dispatch logout action
      store.dispatch({ type: 'auth/logout' });
      // Optionally redirect to login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Get all discounts with filtering and pagination
export const getAllDiscounts = async (params = {}) => {
  try {
    const response = await api.get('/api/admin/discounts', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

// Get discount by ID
export const getDiscountById = async (discountId) => {
  try {
    const response = await api.get(`/api/admin/discounts/${discountId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

// Create new discount
export const createDiscount = async (discountData) => {
  try {
    const response = await api.post('/api/admin/discounts', discountData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

// Update discount
export const updateDiscount = async (discountId, updateData) => {
  try {
    const response = await api.put(`/api/admin/discounts/${discountId}`, updateData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

// Delete discount
export const deleteDiscount = async (discountId) => {
  try {
    const response = await api.delete(`/api/admin/discounts/${discountId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

// Get discount statistics
export const getDiscountStats = async () => {
  try {
    const response = await api.get('/api/admin/discounts/stats');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
}; 