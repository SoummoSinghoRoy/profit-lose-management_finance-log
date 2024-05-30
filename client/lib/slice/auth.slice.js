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
        ...state,
        user: {},
        error: action.payload.error || {},
        alertMessage: action.payload.message || '',
        alertStatus: action.payload.status || 0,
        isAuthenticated: action.payload.isAuthenticated || false
      }
    },
  },
})

export const {loginUser} = authSlice.actions;
export default authSlice.reducer;