import { createSlice } from "@reduxjs/toolkit";
import storageSession from 'redux-persist/lib/storage/session';
import { PURGE } from 'redux-persist';

import { loginAction } from "../action/auth.action";

const initialState= {
  user: {},
  error: {},
  token: '',
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
        user: action.payload.data || {},
        error: action.payload.error || {},
        token: action.payload.token || '',
        alertMessage: '',
        alertStatus: 0,
        isAuthenticated: action.payload.isAuthenticated || false
      }
    },
    logoutUser: (state, action) => {
      return initialState
    },
    clearState: (state) => {
      return initialState
    }
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, () => {
      return initialState;
    });
  },
})

export const {signupUser, loginUser, logoutUser, clearState} = authSlice.actions;
export default authSlice.reducer;