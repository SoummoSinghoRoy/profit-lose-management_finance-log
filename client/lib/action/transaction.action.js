import { createAsyncThunk } from "@reduxjs/toolkit";

import { fetchAllTransactions } from "../slice/transaction.slice";
import { fetchAllTransactionRequest } from "@/utility/transaction.fetcher";

export const allTransactionsFetchAction = createAsyncThunk('transaction/fetch', async(_ ,{dispatch, getState}) => {
  try {
    const state = getState();
    const token = state.auth.token;
    const response = await fetchAllTransactionRequest(token);
    dispatch(fetchAllTransactions(response));
  } catch (error) {
    console.log(error);
    const res = {
      status: 500,
      message: `Internal server error`
    }
    dispatch(fetchAllTransactions(res));
  }
})