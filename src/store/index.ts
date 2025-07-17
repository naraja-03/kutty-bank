import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { transactionApi } from './api/transactionApi';
import { threadsApi } from './api/threadsApi';
import { budgetsApi } from './api/budgetsApi';
import authSlice from './slices/authSlice';
import threadsSlice from './slices/threadsSlice';
import uiSlice from './slices/uiSlice';
import { authApi } from './api/authApi';
import { familyApi } from './api/familyApi';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    ui: uiSlice,
    threads: threadsSlice,
    [transactionApi.reducerPath]: transactionApi.reducer,
    [threadsApi.reducerPath]: threadsApi.reducer,
    [budgetsApi.reducerPath]: budgetsApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [familyApi.reducerPath]: familyApi.reducer,
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
      transactionApi.middleware,
      threadsApi.middleware,
      budgetsApi.middleware,
      authApi.middleware,
      familyApi.middleware
    ),
  devTools: process.env.NODE_ENV !== 'production',
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
