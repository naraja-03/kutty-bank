import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Helper to get token from localStorage if available
const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token') || '';
  }
  return '';
};

export interface FamilyData {
  name: string;
  detailedBudget?: {
    income: {
      sources: Array<{ id: string; category: string; source: string; amount: number }>;
      totalIncome: number;
    };
    essentials: {
      categories: Array<{ id: string; name: string; amount: number }>;
      totalEssentials: number;
    };
    commitments: {
      categories: Array<{ id: string; name: string; amount: number }>;
      totalCommitments: number;
    };
    savings: {
      categories: Array<{ id: string; name: string; amount: number }>;
      totalSavings: number;
    };
  };
}

export interface CreateFamilyRequest {
  familyInfo?: { name: string; trackingPeriod?: string };
  income?: { sources: Array<{ id: string; category: string; source: string; amount: number }>; totalIncome: number };
  essentials?: { categories: Array<{ id: string; name: string; amount: number }>; totalEssentials: number };
  commitments?: { categories: Array<{ id: string; name: string; amount: number }>; totalCommitments: number };
  savings?: { categories: Array<{ id: string; name: string; amount: number }>; totalSavings: number };
}

export interface CreateFamilyResponse {
  success: boolean;
  family: FamilyData;
}

export const familyApi = createApi({
  reducerPath: 'familyApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  endpoints: (builder) => ({
    getFamily: builder.query<FamilyData, void>({
      query: () => {
        const token = getToken();
        return {
          url: 'family',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        };
      },
      transformResponse: (response: { families?: FamilyData[] }) => {
        if (response.families && response.families.length > 0) {
          return response.families[0];
        }
        return {} as FamilyData;
      }
    }),
    createFamily: builder.mutation<CreateFamilyResponse, CreateFamilyRequest>({
      query: (body) => {
        const token = getToken();
        return {
          url: 'family',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(body),
        };
      },
    }),
  })
});

export const { useGetFamilyQuery, useCreateFamilyMutation } = familyApi;
