import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../index';

export interface Thread {
  id: string;
  label: string;
  value: 'week' | 'month' | 'year' | 'custom';
  startDate?: Date;
  endDate?: Date;
  description?: string;
  targetAmount?: number;
  userId: string;
  familyId?: string;
  isCustom: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateThreadRequest {
  label: string;
  startDate?: Date;
  endDate?: Date;
  description?: string;
  targetAmount?: number;
  userId: string;
  familyId?: string;
}

export interface UpdateThreadRequest {
  id: string;
  label: string;
  startDate?: Date;
  endDate?: Date;
  description?: string;
  targetAmount?: number;
  userId: string;
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
  endpoints: builder => ({
    getThreads: builder.query<Thread[], { userId: string; familyId?: string }>({
      query: ({ userId, familyId }) => ({
        url: '',
        params: { userId, familyId },
      }),
      providesTags: ['Thread'],
    }),

    createThread: builder.mutation<Thread, CreateThreadRequest>({
      query: threadData => ({
        url: '',
        method: 'POST',
        body: threadData,
      }),
      invalidatesTags: ['Thread'],
    }),

    updateThread: builder.mutation<Thread, UpdateThreadRequest>({
      query: threadData => ({
        url: '',
        method: 'PUT',
        body: threadData,
      }),
      invalidatesTags: ['Thread'],
    }),

    deleteThread: builder.mutation<{ message: string }, { id: string; userId: string }>({
      query: ({ id, userId }) => ({
        url: '',
        method: 'DELETE',
        params: { id, userId },
      }),
      invalidatesTags: ['Thread'],
    }),
  }),
});

export const {
  useGetThreadsQuery,
  useCreateThreadMutation,
  useUpdateThreadMutation,
  useDeleteThreadMutation,
} = threadsApi;
