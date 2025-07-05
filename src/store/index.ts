import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { transactionApi } from "./api/transactionApi";
import authSlice from "./slices/authSlice";
import threadsSlice from "./slices/threadsSlice";
import uiSlice from "./slices/uiSlice";
import { authApi } from "./api/authApi";
import { familyApi } from "./api/familyApi";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    ui: uiSlice,
    threads: threadsSlice,
    [transactionApi.reducerPath]: transactionApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [familyApi.reducerPath]: familyApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        ignoredPaths: [
          "threads.activeThread.startDate",
          "threads.activeThread.endDate",
          "threads.savedThreads",
          "threads.allThreads",
          "api.meta.baseQueryMeta",
        ],
        ignoredActionPaths: [
          "payload.startDate",
          "payload.endDate",
          "payload.createdAt",
          "meta.baseQueryMeta",
        ],
      },
    }).concat(
      transactionApi.middleware,
      authApi.middleware,
      familyApi.middleware
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
