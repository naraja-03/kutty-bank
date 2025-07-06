import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../index';

export interface Thread {
  id: string;
  label: string;
  transactionId: string;
  note?: string;
  createdAt: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  userName: string;
  profileImage?: string;
  timestamp: string;
}

export interface CreateThreadRequest {
  transactionId: string;
  label: string;
  note?: string;
}

export const threadsApi = createApi({
  reducerPath: 'threadsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/threads',
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Thread'],
  endpoints: (builder) => ({
    getThreads: builder.query<Thread[], void>({
      query: () => '',
      providesTags: ['Thread'],
    }),
    createThread: builder.mutation<Thread, CreateThreadRequest>({
      query: (thread) => ({
        url: '',
        method: 'POST',
        body: thread,
      }),
      invalidatesTags: ['Thread'],
    }),
  }),
});

export const {
  useGetThreadsQuery,
  useCreateThreadMutation,
} = threadsApi;
