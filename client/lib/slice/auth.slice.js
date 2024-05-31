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
    signupUser: (state, action) => {
      return {
        ...state,
        user: action.payload.data || {},
        error: action.payload.error || {},
        alertMessage: action.payload.message || '',
        alertStatus: action.payload.status || 0, 
      }
    },
    loginUser: (state, action) => {
      return {
        ...state,
        user: action.payload.data || {},
        error: action.payload.error || {},
        alertMessage: action.payload.message || '',
        alertStatus: action.payload.status || 0,
        isAuthenticated: action.payload.isAuthenticated || false
      }
    },
    clearState: (state) => {
      return initialState
    }
  },
})

export const {signupUser, loginUser, clearState} = authSlice.actions;
export default authSlice.reducer;