import { createAsyncThunk } from "@reduxjs/toolkit";

import { signupUser, loginUser, logoutUser, changeUserPassword, clearState } from "../slice/auth.slice";
import { loginPostRequest, signupPostRequest, logoutRequest, changePasswordRequesut } from "@/utility/auth.fetcher";

export const signupAction = createAsyncThunk('auth/signup', async (signupState, { dispatch }) => {
  try {
    const response = await signupPostRequest(signupState);
    if (response.status !== 200) {
      dispatch(signupUser(response));
    } else {
      dispatch(signupUser(response));
    }
  } catch (error) {
    console.log(error);
    const res = {
      status: 500,
      message: `Internal server error`
    }
    dispatch(signupUser(res));
  }
})

export const loginAction = createAsyncThunk('auth/login', async (loginState, { dispatch }) => {
  try {
    const response = await loginPostRequest(loginState);
    if (response.status !== 200) {
      dispatch(loginUser(response));
    } else {
      dispatch(loginUser(response));
    }
  } catch (error) {
    console.log(error);
    const res = {
      status: 500,
      message: `Internal server error`
    }
    dispatch(loginUser(res));
  }
})

export const logoutUserAction = createAsyncThunk('auth/logout', async (token, { dispatch }) => {
  try {
    await logoutRequest(token);
    dispatch(logoutUser());
  } catch (error) {
    console.log(error);
    const res = {
      status: 500,
      message: `Internal server error`
    }
    dispatch(logoutUser(res));
  }
})

export const changeUserPasswordAction = createAsyncThunk('auth/changePassword', async (changePasswordState, { dispatch, getState }) => {
  try {
    const state = getState();
    const token = state.auth.token;
    const userId = state.auth.user.id;
    const response = await changePasswordRequesut(token, userId, changePasswordState)
    dispatch(changeUserPassword(response));
  } catch (error) {
    console.log(error);
    const res = {
      status: 500,
      message: `Internal server error`
    }
    dispatch(changeUserPassword(res));
  }
})

export const clearAuthStateAction = () => (dispatch) => {
  dispatch(clearState())
}
