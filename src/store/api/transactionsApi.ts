import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Helper to get token from localStorage if available
const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token') || '';
  }
  return '';
};

export interface Transaction {
  id?: string;
  category: 'income' | 'essential' | 'commitment' | 'saving';
  subCategory: string;
  customCategory?: string;
  amount: number;
  description: string;
  date: string;
  createdAt?: string;
  updatedAt?: string;
  familyId?: string;
  userId?: string;
  transactionId?: string; // For external transaction IDs
  transactionType?: 'expense' | 'income'; // Optional field to specify type
}

export const transactionsApi = createApi({
  reducerPath: 'transactionsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  tagTypes: ['Transactions'],
  endpoints: builder => ({
    getTransactions: builder.query<Transaction[], void>({
      query: () => {
        const token = getToken();
        return {
          url: 'transactions',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        };
      },
      transformResponse: (response: { transactions?: Transaction[] }) => {
        if (response.transactions && response.transactions.length > 0) {
          return response.transactions;
        }
        return [] as Transaction[];
      },
      providesTags: ['Transactions'],
    }),
    addTransaction: builder.mutation<Transaction, Partial<Transaction>>({
      query: body => {
        const token = getToken();
        return {
          url: 'transactions',
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body,
        };
      },
      invalidatesTags: ['Transactions'],
    }),
  }),
});

export const { useGetTransactionsQuery, useAddTransactionMutation } = transactionsApi;
