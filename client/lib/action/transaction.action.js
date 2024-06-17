import { createAsyncThunk } from "@reduxjs/toolkit";

import { fetchAllTransactions, createTransaction, editTransaction, clearTransactionState } from "../slice/transaction.slice";
import { fetchAllTransactionRequest, createTransactionPostRequest, editTransactionPutRequest } from "@/utility/transaction.fetcher";

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

export const createTransactionAction = createAsyncThunk('transaction/create', async(transactionMakingState, {dispatch, getState}) => {
  try {
    const state = getState();
    const token = state.auth.token;
    const response = await createTransactionPostRequest(transactionMakingState, token);
    dispatch(createTransaction(response));
  } catch (error) {
    console.log(error);
    const res = {
      status: 500,
      message: `Internal server error`
    }
    dispatch(createTransaction(res));
  }
})

export const editTransactionAction = createAsyncThunk('transaction/edit', async({transactionid, transactionEditState}, {dispatch, getState}) => {
  try {
    const state = getState();
    const token = state.auth.token;
    const response = await editTransactionPutRequest(transactionid, transactionEditState, token);
    dispatch(editTransaction(response));
  } catch (error) {
    console.log(error);
    const res = {
      status: 500,
      message: `Internal server error`
    }
    dispatch(editTransaction(res));
  }
})

export const clearTransactionStateAction = () => (dispatch) => {
  dispatch(clearTransactionState());
}