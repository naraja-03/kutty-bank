import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Category } from '../../components/ui/FamilyBudgetWizard/types';
import { RootState } from '../index';

export interface CreateCategoryRequest {
  name: string;
  mainCategory: string;
  icon?: string;
  color?: string;
}

export interface CategoriesResponse {
  categories: Category[];
  categoriesByType?: {
    income: Category[];
    essentials: Category[];
    commitments: Category[];
    savings: Category[];
  };
}

export const categoriesApi = createApi({
  reducerPath: 'categoriesApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Category'],
  endpoints: (builder) => ({
    getCategories: builder.query<CategoriesResponse, { mainCategory?: string }>({
      query: ({ mainCategory }) => ({
        url: '/categories',
        params: mainCategory ? { mainCategory } : {},
      }),
      providesTags: ['Category'],
    }),
    getAllCategories: builder.query<CategoriesResponse, void>({
      query: () => ({
        url: '/categories',
      }),
      providesTags: ['Category'],
    }),
    createCategory: builder.mutation<{ category: Category }, CreateCategoryRequest>({
      query: (categoryData) => ({
        url: '/categories',
        method: 'POST',
        body: categoryData,
      }),
      invalidatesTags: ['Category'],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetAllCategoriesQuery,
  useCreateCategoryMutation,
} = categoriesApi;
