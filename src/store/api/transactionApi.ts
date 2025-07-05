import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { TransactionData } from '../../components/ui/TransactionPost/types';
import { RootState } from '../index';

export interface CreateTransactionRequest {
  amount: number;
  category: string;
  type: 'income' | 'expense';
  note?: string;
  date: string;
  imageUrl?: string;
}

export interface TransactionStats {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
}

export const transactionApi = createApi({
  reducerPath: 'transactionApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/transactions',
    prepareHeaders: (headers, { getState }) => {
      // Add auth token if available
      const state = getState() as RootState;
      const token = state.auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Transaction', 'Stats'],
  endpoints: (builder) => ({
    getTransactions: builder.query<TransactionData[], { limit?: number; offset?: number }>({
      query: ({ limit = 20, offset = 0 }) => `?limit=${limit}&offset=${offset}`,
      providesTags: ['Transaction'],
    }),
    getTransactionStats: builder.query<TransactionStats, void>({
      query: () => '/stats',
      providesTags: ['Stats'],
    }),
    createTransaction: builder.mutation<TransactionData, CreateTransactionRequest>({
      query: (transaction) => ({
        url: '',
        method: 'POST',
        body: transaction,
      }),
      invalidatesTags: ['Transaction', 'Stats'],
    }),
    deleteTransaction: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Transaction', 'Stats'],
    }),
  }),
});

export const {
  useGetTransactionsQuery,
  useGetTransactionStatsQuery,
  useCreateTransactionMutation,
  useDeleteTransactionMutation,
} = transactionApi;
