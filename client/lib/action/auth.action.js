import { createAsyncThunk } from "@reduxjs/toolkit";

import { loginUser } from "../slice/auth.slice";
import { loginPostRequest } from "@/app/utility/auth.fetcher";

export const loginAction = createAsyncThunk('auth/login', async (loginState) => {
  try {
    const response = await loginPostRequest(loginState);
    console.log(response);
    if(response.status !== 200) {
      return loginUser(response);
    } else {
      return loginUser(response);
    }
  } catch (error) {
    console.log(error);
    const res = {
      status: 500,
      message: `Internal server error`
    }
    return loginUser(res);
  }
})
