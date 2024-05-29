import { createSlice } from "@reduxjs/toolkit";
import { loginAction } from "../action/auth.action";

const initialState= {
  user: {},
  error: {},
  alertMessage: '',
  alertStatus: 0,
  isAuthenticated: false
};
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginUser: (state, action) => {
      return {
        user: {},
        error: action.payload.error || {},
        alertMessage: action.payload.message || '',
        alertStatus: action.payload.status || 0,
        isAuthenticated: action.payload.isAuthenticated || false
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginAction.fulfilled, (state, action) => {
      state.user = action.payload.payload.data || {},
      state.error = action.payload.payload.error || {},
      state.alertMessage = action.payload.payload.message || '',
      state.alertStatus = action.payload.payload.status || 0,
      state.isAuthenticated = action.payload.payload.isAuthenticated || false
    })
    // builder.addCase(loginAction.rejected, (state, action) => {
    //   state.user = action.payload.payload.data || {},
    //   state.error = action.payload.payload.error || {},
    //   state.alertMessage = action.payload.payload.message || '',
    //   state.alertStatus = action.payload.payload.status || 0,
    //   state.isAuthenticated = action.payload.payload.isAuthenticated || false
    // })
  }
})

export const {loginUser} = authSlice.actions;
export default authSlice.reducer;