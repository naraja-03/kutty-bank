import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../index';

export interface Budget {
  _id: string;
  label: string;
  value: 'week' | 'month' | 'year' | 'custom';
  description?: string;
  targetAmount?: number;
  userId: string;
  familyId?: string;
  isCustom: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBudgetRequest {
  label: string;
  description?: string;
  targetAmount?: number;
  userId: string;
  familyId?: string;
}

export interface UpdateBudgetRequest {
  id: string;
  label: string;
  description?: string;
  targetAmount?: number;
  userId: string;
}

export const budgetsApi = createApi({
  reducerPath: 'budgetsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/budgets',
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Budget'],
  endpoints: (builder) => ({
    getBudgets: builder.query<Budget[], { userId: string; familyId?: string }>({
      query: ({ userId, familyId }) => ({
        url: '',
        params: { userId, familyId }
      }),
      providesTags: ['Budget'],
    }),
    
    createBudget: builder.mutation<Budget, CreateBudgetRequest>({
      query: (budgetData) => ({
        url: '',
        method: 'POST',
        body: budgetData,
      }),
      invalidatesTags: ['Budget'],
    }),
    
    updateBudget: builder.mutation<Budget, UpdateBudgetRequest>({
      query: (budgetData) => ({
        url: '',
        method: 'PUT',
        body: budgetData,
      }),
      invalidatesTags: ['Budget'],
    }),
    
    deleteBudget: builder.mutation<{ message: string }, { id: string; userId: string }>({
      query: ({ id, userId }) => ({
        url: '',
        method: 'DELETE',
        params: { id, userId }
      }),
      invalidatesTags: ['Budget'],
    }),
  }),
});

export const {
  useGetBudgetsQuery,
  useCreateBudgetMutation,
  useUpdateBudgetMutation,
  useDeleteBudgetMutation,
} = budgetsApi;
