import { createSlice } from "@reduxjs/toolkit";
import { PURGE } from 'redux-persist';

const initialState= {
  user: {},
  error: {},
  token: '',
  alertMessage: '',
  alertStatus: 0,
  isAuthenticated: false,
  needsClearState: false
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
        needsClearState: action.payload.message ? true : false
      }
    },
    loginUser: (state, action) => {
      return {
        user: action.payload.data || {},
        error: action.payload.error || {},
        token: action.payload.token || '',
        alertMessage: !action.payload.token ? action.payload.message : '',
        alertStatus: !action.payload.token ? action.payload.status : 0,
        isAuthenticated: action.payload.isAuthenticated || false,
        needsClearState: !action.payload.isAuthenticated ? true : false
      }
    },
    changeUserPassword: (state, action) => {
      return {
        ...state,
        error: action.payload.error || {},
        alertMessage: action.payload.message || '',
        alertStatus: action.payload.status || 0,
        needsClearState: action.payload.message ? true : false
      }
    },
    logoutUser: (state, action) => {
      return initialState
    },
    clearState: (state) => {
      return {
        ...state,
        error: state.error && {},
        alertMessage: state.alertMessage && '',
        alertStatus: state.alertStatus && 0,
        needsClearState: false
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, () => {
      return initialState;
    })
  },
})

export const {signupUser, loginUser, logoutUser, changeUserPassword, clearState} = authSlice.actions;
export default authSlice.reducer;