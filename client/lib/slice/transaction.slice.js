import { createSlice } from "@reduxjs/toolkit";

import { logoutUserAction } from "../action/auth.action";

const initialState= {
  allTransaction: [],
  singleTransaction: {},
  error: {},
  alertMessage: '',
  alertStatus: 0,
  financialState: {},
  needsClearState: false
};

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    fetchAllTransactions: (state, action) => {
      return {
        ...state,
        allTransaction: action.payload.data || [],
        financialState: action.payload.financialState || {}
      }
    },
    createTransaction: (state, action) => {
      return {
        allTransaction: action.payload.data ? [...state.allTransaction, action.payload.data] : [...state.allTransaction],
        singleTransaction: action.payload.data || {},
        error: action.payload.error || {},
        alertMessage: action.payload.message || '',
        alertStatus: action.payload.status || 0,
        financialState: action.payload.financialState || {},
        needsClearState: action.payload.message ? true : false
      }
    },
    editTransaction: (state, action) => {
      const updatedTransaction = action.payload.data;
      const index = state.allTransaction.findIndex(transaction => transaction._id === updatedTransaction._id);
      if (index !== -1) {
        state.allTransaction[index] = updatedTransaction;
      }
      state.singleTransaction = updatedTransaction || {};
      state.error = action.payload.error || {};
      state.alertMessage = action.payload.message || '';
      state.alertStatus = action.payload.status || 0;
      state.financialState = action.payload.financialState || {};
      state.needsClearState = action.payload.message ? true : false
    },
    clearTransactionState: (state, action) => {
      return {
        ...state,
        singleTransaction: state.singleTransaction && {},
        error: state.error && {},
        alertMessage: state.alertMessage && '',
        alertStatus: state.alertStatus && 0,
        needsClearState: false
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(editTransaction.fulfilled, () => {
      return initialState;
    })
  }
})

export const { fetchAllTransactions, createTransaction, editTransaction, clearTransactionState } = transactionSlice.actions;
export default transactionSlice.reducer;