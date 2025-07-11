import apiClient from "./authService";
import {
  getWishlistStart,
  getWishlistSuccess,
  getWishlistFailure,
  addItemToWishlistStart,
  addItemToWishlistSuccess,
  addItemToWishlistFailure,
  removeItemFromWishlistStart,
  removeItemFromWishlistSuccess,
  removeItemFromWishlistFailure,
} from "../store/wishlistSlice";

export const getWishlist = async (dispatch, userId) => {
  dispatch(getWishlistStart());
  try {
    const response = await apiClient.get(`/wishlist/${userId}`);
    dispatch(getWishlistSuccess(response.data.courseIds));
    // console.log("Wishlist data:", response.data.courseIds);
    return response.data;
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    dispatch(getWishlistFailure(error));
    throw error;
  }
};

export const addToWishlist = async (userId, courseId, dispatch) => {
  dispatch(addItemToWishlistStart());
  try {
    const response = await apiClient.post("/wishlist", {
      userId,
      courseId,
    });
    dispatch(addItemToWishlistSuccess());
    return response.data;
  } catch (error) {
    const message =
      error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : "Error adding to wishlist";
    dispatch(addItemToWishlistFailure(message));
    throw error;
  }
};

export const removeFromWishlist = async (userId, courseId, dispatch) => {
  dispatch(removeItemFromWishlistStart());
  try {
    const response = await apiClient.delete(
      `/wishlist/?userId=${userId}&courseId=${courseId}`
    );
    dispatch(removeItemFromWishlistSuccess());
    return response.data;
  } catch (error) {
    const message =
      error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : "Error removing from wishlist";
    dispatch(removeItemFromWishlistFailure(message));
    throw error;
  }
};
