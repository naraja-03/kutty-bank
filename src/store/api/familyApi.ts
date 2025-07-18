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

export interface CreateFamilyRequest {
  name: string;
  targetSavingPerMonth: number;
  members?: Array<{
    email: string;
    name: string;
    role: 'admin' | 'member' | 'viewer';
  }>;
}

export interface InviteMemberRequest {
  email: string;
  role: 'admin' | 'member' | 'view-only';
}

export interface UpdateBudgetRequest {
  familyId: string;
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
  endpoints: builder => ({
    getFamilies: builder.query<Family[], string | void>({
      query: userId => (userId ? `?userId=${userId}` : ''),
      providesTags: ['Family'],
    }),
    getFamily: builder.query<Family, string>({
      query: familyId => `?familyId=${familyId}`,
      providesTags: ['Family'],
      // Handle 404 errors gracefully
      transformErrorResponse: response => {
        if (response.status === 404) {
          return { status: 404, data: 'Family not found' };
        }
        return response;
      },
    }),
    createFamily: builder.mutation<Family, CreateFamilyRequest>({
      query: data => ({
        url: '',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Family'],
    }),
    inviteMember: builder.mutation<void, InviteMemberRequest>({
      query: data => ({
        url: '/invite',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Family'],
    }),
    updateBudget: builder.mutation<Family, UpdateBudgetRequest>({
      query: data => ({
        url: '',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Family'],
    }),
    removeMember: builder.mutation<void, string>({
      query: userId => ({
        url: `/members/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Family'],
    }),
    deleteFamily: builder.mutation<void, string>({
      query: familyId => ({
        url: `?familyId=${familyId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Family'],
      // Also invalidate all family queries when a family is deleted
      onQueryStarted: async (familyId, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          // Invalidate all family-related queries
          dispatch(familyApi.util.invalidateTags(['Family']));
        } catch {
          // Handle error if needed
        }
      },
    }),
  }),
});

export const {
  useGetFamiliesQuery,
  useGetFamilyQuery,
  useCreateFamilyMutation,
  useInviteMemberMutation,
  useUpdateBudgetMutation,
  useRemoveMemberMutation,
  useDeleteFamilyMutation,
} = familyApi;
