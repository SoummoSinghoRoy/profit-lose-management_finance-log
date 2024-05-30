import { createAsyncThunk } from "@reduxjs/toolkit";

import { loginUser } from "../slice/auth.slice";
import { loginPostRequest } from "@/app/utility/auth.fetcher";

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
