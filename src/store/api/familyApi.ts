import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User } from './authApi';
import { RootState } from '../index';

export interface Family {
  id: string;
  name: string;
  members: User[];
  budgetCap?: number;
  createdAt: string;
}

export interface InviteMemberRequest {
  email: string;
  role: 'admin' | 'member' | 'view-only';
}

export interface UpdateBudgetRequest {
  budgetCap: number;
}

export const familyApi = createApi({
  reducerPath: 'familyApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/family',
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Family'],
  endpoints: (builder) => ({
    getFamily: builder.query<Family, void>({
      query: () => '',
      providesTags: ['Family'],
    }),
    createFamily: builder.mutation<Family, { name: string }>({
      query: (data) => ({
        url: '',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Family'],
    }),
    inviteMember: builder.mutation<void, InviteMemberRequest>({
      query: (data) => ({
        url: '/invite',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Family'],
    }),
    updateBudget: builder.mutation<Family, UpdateBudgetRequest>({
      query: (data) => ({
        url: '/budget',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Family'],
    }),
    removeMember: builder.mutation<void, string>({
      query: (userId) => ({
        url: `/members/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Family'],
    }),
  }),
});

export const {
  useGetFamilyQuery,
  useCreateFamilyMutation,
  useInviteMemberMutation,
  useUpdateBudgetMutation,
  useRemoveMemberMutation,
} = familyApi;
