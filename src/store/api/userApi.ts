import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

interface GetUsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

interface GetUsersRequest {
  page?: number;
  limit?: number;
  search?: string;
}

interface UpdateUserRequest {
  id: string;
  data: Partial<User>;
}

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/users',
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as { auth: { token?: string } };
      const token = state.auth?.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUsers: builder.query<GetUsersResponse, GetUsersRequest>({
      query: ({ page = 1, limit = 10, search = '' } = {}) => ({
        url: `?page=${page}&limit=${limit}&search=${search}`,
      }),
      providesTags: ['User'],
    }),
    getUserById: builder.query<User, string>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    updateUser: builder.mutation<User, UpdateUserRequest>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }],
    }),
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const { 
  useGetUsersQuery, 
  useGetUserByIdQuery, 
  useUpdateUserMutation, 
  useDeleteUserMutation 
} = userApi;
