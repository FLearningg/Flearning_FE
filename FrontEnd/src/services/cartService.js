import {
  addItemToCartFailure,
  addItemToCartStart,
  addItemToCartSuccess,
  getCartFailure,
  getCartStart,
  getCartSuccess,
  removeItemFromCartFailure,
  removeItemFromCartStart,
  removeItemFromCartSuccess,
} from "../store/cartSlice";
import apiClient from "./authService";
// get cart
export const getCart = async (dispatch, userId) => {
  dispatch(getCartStart());
  try {
    const response = await apiClient.get(`/cart/${userId}`);
    dispatch(getCartSuccess(response.data.courseIds));
    return response.data;
  } catch (error) {
    console.error("Error fetching cart:", error);
    dispatch(getCartFailure(error));
    throw error;
  }
};
// add item to cart
export const addToCart = async (userId, courseId, dispatch) => {
  dispatch(addItemToCartStart());
  try {
    console.log("Adding to cart:", { userId, courseId });
    const response = await apiClient.post("/cart", {
      userId,
      courseId,
    });
    dispatch(addItemToCartSuccess(response.data));
    return response.data;
  } catch (error) {
    const message =
      error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : "Error adding to cart";
    dispatch(addItemToCartFailure(message));
    throw error;
  }
};
// remove item from cart
export const removeFromCart = async (userId, courseId, dispatch) => {
  dispatch(removeItemFromCartStart());
  try {
    const response = await apiClient.delete(
      `/cart/?userId=${userId}&courseId=${courseId}`
    );
    dispatch(removeItemFromCartSuccess(response.data));
    return response.data;
  } catch (error) {
    console.error("Error removing from cart:", error);
    const message =
      error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : "Error removing from cart";
    dispatch(removeItemFromCartFailure(message));
    throw error;
  }
};
