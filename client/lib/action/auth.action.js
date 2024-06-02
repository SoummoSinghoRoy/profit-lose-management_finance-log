import { createAsyncThunk } from "@reduxjs/toolkit";

import { signupUser, loginUser, logoutUser, clearState } from "../slice/auth.slice";
import { loginPostRequest, signupPostRequest, logoutRequest } from "@/utility/auth.fetcher";

export const signupAction = createAsyncThunk('auth/signup', async(signupState, {dispatch}) => {
  try {
    const response = await signupPostRequest(signupState);
    if(response.status !== 200) {
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

export const loginAction = createAsyncThunk('auth/login', async (loginState, {dispatch}) => {
  try {
    const response = await loginPostRequest(loginState);
    if(response.status !== 200) {
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

export const logoutUserAction = createAsyncThunk('auth/logout', async(token, {dispatch}) => {
  try {
    const response = await logoutRequest(token);
    if(response.status !== 200) {
      dispatch(logoutUser());
    } else {
      dispatch(logoutUser());
    }
  } catch (error) {
    console.log(error);
    // const res = {
    //   status: 500,
    //   message: `Internal server error`
    // }
    dispatch(logoutUser());
  }
})

export const clearAuthStateAction = () => (dispatch) => {
  dispatch(clearState())
}
