import { createSlice } from "@reduxjs/toolkit";

const initialState= {
  allTransaction: [],
  singleTransaction: {},
  error: {},
  alertMessage: '',
  alertStatus: 0
};

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    fetchAllTransactions: (state, action) => {
      return {
        ...state,
        allTransaction: action.payload.data || [],
        alertMessage: action.payload.message || '',
        alertStatus: action.payload.status
      }
    }
  }
})

export const { fetchAllTransactions } = transactionSlice.actions;
export default transactionSlice.reducer;