import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../api/authApi';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      
      // Store token in localStorage (only on client side)
      if (typeof window !== 'undefined' && action.payload.token) {
        localStorage.setItem('token', action.payload.token);
      }
    },
    loginFailure: (state) => {
      state.isLoading = false;
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      
      // Remove token from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    setCurrentFamily: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.familyId = action.payload;
      }
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, updateUser, setCurrentFamily } = authSlice.actions;
export default authSlice.reducer;
