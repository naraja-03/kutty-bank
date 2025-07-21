import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Category {
  _id: string;
  name: string;
  mainCategory: 'income' | 'essentials' | 'commitments' | 'savings';
  color: string;
  icon: string;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface GetCategoriesParams {
  userId?: string;
  familyId?: string;
  mainCategory?: Category['mainCategory'];
}

export const categoriesApi = createApi({
  reducerPath: 'categoriesApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], GetCategoriesParams | void>({
      query: (params) => {
        const query = new URLSearchParams(params as Record<string, string>).toString();
        return `categories${query ? `?${query}` : ''}`;
      },
    }),
  }),
});

export const { useGetCategoriesQuery } = categoriesApi;
