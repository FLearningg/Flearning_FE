import apiClient from "./authService";

// Get all discounts with filtering and pagination
export const getAllDiscounts = async (params = {}) => {
  try {
    const response = await apiClient.get("/admin/discounts", { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

// Get discount by ID
export const getDiscountById = async (discountId) => {
  try {
    const response = await apiClient.get(`/admin/discounts/${discountId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

// Create new discount
export const createDiscount = async (discountData) => {
  try {
    const response = await apiClient.post("/admin/discounts", discountData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

// Update discount
export const updateDiscount = async (discountId, updateData) => {
  try {
    const response = await apiClient.put(
      `/admin/discounts/${discountId}`,
      updateData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

// Delete discount
export const deleteDiscount = async (discountId) => {
  try {
    const response = await apiClient.delete(`/admin/discounts/${discountId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

// Get discount statistics
export const getDiscountStats = async () => {
  try {
    const response = await apiClient.get("/admin/discounts/stats");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};
