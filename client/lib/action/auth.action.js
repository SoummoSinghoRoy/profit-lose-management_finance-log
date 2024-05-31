import { createAsyncThunk } from "@reduxjs/toolkit";

import { signupUser, loginUser, clearState } from "../slice/auth.slice";
import { loginPostRequest, signupPostRequest } from "@/app/utility/auth.fetcher";

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

export const clearAuthStateAction = () => (dispatch) => {
  dispatch(clearState())
}
