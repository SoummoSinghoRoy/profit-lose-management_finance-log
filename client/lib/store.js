import { configureStore } from "@reduxjs/toolkit";
import { 
  persistStore, 
  persistReducer, 
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER } from 'redux-persist';
import storageSession from 'redux-persist/lib/storage/session';

import authSlice from "./slice/auth.slice";
import transactionSlice from "./slice/transaction.slice";

const userPersistConfig = {
  key: 'auth',
  storage: storageSession
}

export const store = configureStore({
  reducer: {
    auth: persistReducer(userPersistConfig, authSlice),
    transaction: transactionSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [PERSIST, REHYDRATE, PURGE, FLUSH, PAUSE, REGISTER],
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        ignoredPaths: ['items.dates'],
      },
    }),
})

export const persistor = persistStore(store);