import { createSlice } from "@reduxjs/toolkit";
const categorySlice = createSlice({
    name: 'categories',
    initialState: {
        getCategories: {
            categories: [],
            isLoading: false,
            error: false,
            errorMsg: ''
        }
    },
    reducers: {
        getCategoriesStart: (state) => {
            state.getCategories.isLoading = true;
        },
        getCategoriesSuccess: (state, action) => {
            state.getCategories.isLoading = false;
            state.getCategories.categories = action.payload;
            state.getCategories.error = false;
        },
        getCategoriesFailure: (state, action) => {
            state.getCategories.isLoading = false;
            state.getCategories.error = true;
            state.getCategories.errorMsg = action.payload;
        },
    }
});
export const { 
    getCategoriesStart, 
    getCategoriesSuccess, 
    getCategoriesFailure 
} = categorySlice.actions;
export default categorySlice.reducer;
