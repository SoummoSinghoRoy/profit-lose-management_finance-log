import { configureStore, combineSlices } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storageSession from 'redux-persist/lib/storage/session';

import authSlice from "./slice/auth.slice";

const persistConfig = {
  key: 'root',
  storage: storageSession,
  whitelist: ['auth']
}

const rootReducerSlice = combineSlices({
  auth: authSlice
});

const persistedReducer = persistReducer(persistConfig, rootReducerSlice);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        ignoredPaths: ['items.dates'],
      },
    }),
})
export const persistor = persistStore(store);