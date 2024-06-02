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

const userPersistConfig = {
  key: 'auth',
  storage: storageSession
}

export const store = configureStore({
  reducer: {
    auth: persistReducer(userPersistConfig, authSlice)
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        ignoredPaths: ['items.dates'],
      },
    }),
})
export const persistor = persistStore(store);