import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authSlice from './slices/authSlice';
import uiSlice from './slices/uiSlice';
import { authApi } from './api/authApi';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    ui: uiSlice,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          // RTK Query actions
          'api/executeQuery/pending',
          'api/executeQuery/fulfilled',
          'api/executeQuery/rejected',
        ],
        ignoredPaths: [
          'threads.activeThread.startDate',
          'threads.activeThread.endDate',
          'threads.savedThreads',
          'threads.allThreads',
          'api.meta.baseQueryMeta',
          'threads.activeThread.createdAt',
          // RTK Query paths
          'api.queries',
          'api.mutations',
        ],
        ignoredActionPaths: [
          'payload.startDate',
          'payload.endDate',
          'payload.createdAt',
          'meta.baseQueryMeta',
          'meta.arg',
          'error',
        ],
      },
    }).concat(
      authApi.middleware,
    ),
  devTools: process.env.NODE_ENV !== 'production',
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
