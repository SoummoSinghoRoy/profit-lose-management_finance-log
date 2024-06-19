import { createSlice } from "@reduxjs/toolkit";

import { logoutUserAction } from "../action/auth.action";

const initialState= {
  allTransaction: [],
  singleTransaction: {},
  error: {},
  alertMessage: '',
  alertStatus: 0,
  financialState: {},
  isSearching: false,
  needsClearState: false
};

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    fetchAllTransactions: (state, action) => {
      const transactionRecords = action.payload.data || []
      return {
        ...state,
        allTransaction: transactionRecords.reverse(),
        financialState: action.payload.financialState || {}
      }
    },
    createTransaction: (state, action) => {
      const transactionRecords = action.payload.data ? [...state.allTransaction, action.payload.data] : [...state.allTransaction]
      return {
        allTransaction: transactionRecords.reverse(),
        singleTransaction: action.payload.data || {},
        error: action.payload.error || {},
        alertMessage: action.payload.message || '',
        alertStatus: action.payload.status || 0,
        financialState: action.payload.financialState || {},
        isSearching: false,
        needsClearState: action.payload.message ? true : false
      }
    },
    editTransaction: (state, action) => {
      const updatedTransaction = action.payload.data || {};
      const index = state.allTransaction.findIndex(transaction => transaction._id === updatedTransaction._id);
      state.allTransaction.splice(index, 1, updatedTransaction);
      state.singleTransaction = action.payload.data || {};
      state.error = action.payload.error || {};
      state.alertMessage = action.payload.message || '';
      state.alertStatus = action.payload.status || 0;
      state.financialState = action.payload.financialState || {};
      state.isSearching = false;
      state.needsClearState = action.payload.message ? true : false;
    },
    deleteTransaction: (state, action) => {
      const deletedTransaction = action.payload.data || {};
      const index = state.allTransaction.findIndex( transaction => transaction._id === deletedTransaction._id);
      state.allTransaction.splice(index, 1);
      state.singleTransaction = action.payload.data || {};
      state.error = {};
      state.alertMessage = '';
      state.alertStatus = 0;
      state.financialState = action.payload.financialState || {};
      state.isSearching = false;
      state.needsClearState = false
    },
    searchTransaction: (state, action) => {
      return {
        ...state,
        allTransaction: action.payload.data || [],
        isSearching: true
      }
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
    builder.addCase(logoutUserAction.fulfilled, () => {
      return initialState;
    })
  }
})

export const { fetchAllTransactions, createTransaction, editTransaction, deleteTransaction, searchTransaction, clearTransactionState } = transactionSlice.actions;
export default transactionSlice.reducer;