import { createAsyncThunk } from "@reduxjs/toolkit";

import { fetchAllTransactions, createTransaction, editTransaction, deleteTransaction, searchTransaction, clearTransactionState } from "../slice/transaction.slice";
import { fetchAllTransactionRequest, createTransactionPostRequest, editTransactionPutRequest, deleteTransactionRequest, searchTransactionRequest } from "@/utility/transaction.fetcher";

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

export const deleteTransactionAction = createAsyncThunk('transaction/delete', async(transactionid, {dispatch, getState}) => {
  try {
    const state = getState();
    const token = state.auth.token;
    const response = await deleteTransactionRequest(transactionid, token);
    dispatch(deleteTransaction(response));
  } catch (error) {
    console.log(error);
    const res = {
      status: 500,
      message: `Internal server error`
    }
    dispatch(deleteTransaction(res));
  }
})

export const searchTransactionAction = createAsyncThunk('transaction/search', async(searchterm, {dispatch, getState}) => {
  try {
    const state = getState();
    const token = state.auth.token;
    const response = await searchTransactionRequest(searchterm, token);
    dispatch(searchTransaction(response));
  } catch (error) {
    console.log(error);
    const res = {
      status: 500,
      message: `Internal server error`
    }
    dispatch(searchTransaction(res));
  }
})

export const clearTransactionStateAction = () => (dispatch) => {
  dispatch(clearTransactionState());
}