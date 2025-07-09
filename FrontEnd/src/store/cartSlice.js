import { createSlice } from "@reduxjs/toolkit";
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    // get cart
    getCart: {
      items: [],
      isLoading: false,
      error: false,
      errorMsg: "",
    },
    // add item to cart
    addItemToCart: {
      isLoading: false,
      error: false,
      success: false,
      errorMsg: "",
    },
    // remove item from cart
    removeItemFromCart: {
      isLoading: false,
      error: false,
      success: false,
      errorMsg: "",
    },
  },
  reducers: {
    // get cart
    getCartStart: (state) => {
      state.getCart.isLoading = true;
    },
    getCartSuccess: (state, action) => {
      state.getCart.isLoading = false;
      state.getCart.items = action.payload;
      state.getCart.error = false;
    },
    getCartFailure: (state, action) => {
      state.getCart.isLoading = false;
      state.getCart.error = true;
      state.getCart.errorMsg = action.payload;
    },
    // add item to cart
    addItemToCartStart: (state) => {
      state.addItemToCart.isLoading = true;
      state.addItemToCart.success = false;
      state.addItemToCart.error = false;
    },
    addItemToCartSuccess: (state) => {
      state.addItemToCart.isLoading = false;
      state.addItemToCart.success = true;
      state.addItemToCart.error = false;
    },
    addItemToCartFailure: (state, action) => {
      state.addItemToCart.isLoading = false;
      state.addItemToCart.error = true;
      state.addItemToCart.errorMsg = action.payload;
    },
    // remove item from cart
    removeItemFromCartStart: (state) => {
      state.removeItemFromCart.isLoading = true;
      state.removeItemFromCart.success = false;
      state.removeItemFromCart.error = false;
    },
    removeItemFromCartSuccess: (state) => {
      state.removeItemFromCart.isLoading = false;
      state.removeItemFromCart.success = true;
      state.removeItemFromCart.error = false;
    },
    removeItemFromCartFailure: (state, action) => {
      state.removeItemFromCart.isLoading = false;
      state.removeItemFromCart.error = true;
      state.removeItemFromCart.errorMsg = action.payload;
    },
  },
});
export const {
  getCartStart,
  getCartSuccess,
  getCartFailure,
  addItemToCartStart,
  addItemToCartSuccess,
  addItemToCartFailure,
  removeItemFromCartStart,
  removeItemFromCartSuccess,
  removeItemFromCartFailure,
} = cartSlice.actions;
export default cartSlice.reducer;
