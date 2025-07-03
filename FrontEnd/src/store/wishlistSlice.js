import { createSlice } from "@reduxjs/toolkit";
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    // get wishlist
    getWishlist: {
      items: [],
      isLoading: false,
      error: false,
      errorMsg: "",
    },
    // add item to wishlist
    addItemToWishlist: {
      isLoading: false,
      error: false,
      success: false,
      errorMsg: "",
    },
    // remove item from wishlist
    removeItemFromWishlist: {
      isLoading: false,
      error: false,
      success: false,
      errorMsg: "",
    },
  },
  reducers: {
    // get wishlist
    getWishlistStart: (state) => {
      state.getWishlist.isLoading = true;
    },
    getWishlistSuccess: (state, action) => {
      state.getWishlist.isLoading = false;
      state.getWishlist.items = action.payload;
      state.getWishlist.error = false;
    },
    getWishlistFailure: (state, action) => {
      state.getWishlist.isLoading = false;
      state.getWishlist.error = true;
      state.getWishlist.errorMsg = action.payload;
    },
    // add item to wishlist
    addItemToWishlistStart: (state) => {
      state.addItemToWishlist.isLoading = true;
      state.addItemToWishlist.success = false;
      state.addItemToWishlist.error = false;
    },
    addItemToWishlistSuccess: (state) => {
      state.addItemToWishlist.isLoading = false;
      state.addItemToWishlist.success = true;
      state.addItemToWishlist.error = false;
    },
    addItemToWishlistFailure: (state, action) => {
      state.addItemToWishlist.isLoading = false;
      state.addItemToWishlist.error = true;
      state.addItemToWishlist.errorMsg = action.payload;
    },
    // remove item from wishlist
    removeItemFromWishlistStart: (state) => {
      state.removeItemFromWishlist.isLoading = true;
      state.removeItemFromWishlist.success = false;
      state.removeItemFromWishlist.error = false;
    },
    removeItemFromWishlistSuccess: (state) => {
      state.removeItemFromWishlist.isLoading = false;
      state.removeItemFromWishlist.success = true;
      state.removeItemFromWishlist.error = false;
    },
    removeItemFromWishlistFailure: (state, action) => {
      state.removeItemFromWishlist.isLoading = false;
      state.removeItemFromWishlist.error = true;
      state.removeItemFromWishlist.errorMsg = action.payload;
    },
  },
});
export const {
  getWishlistStart,
  getWishlistSuccess,
  getWishlistFailure,
  addItemToWishlistStart,
  addItemToWishlistSuccess,
  addItemToWishlistFailure,
  removeItemFromWishlistStart,
  removeItemFromWishlistSuccess,
  removeItemFromWishlistFailure,
} = wishlistSlice.actions;
export default wishlistSlice.reducer;
