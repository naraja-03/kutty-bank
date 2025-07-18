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
    loginStart: state => {
      state.isLoading = true;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      
      // Save to localStorage only for real authenticated users (not anonymous)
      if (!action.payload.user.isAnonymous && typeof window !== 'undefined') {
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      }
    },
    loginFailure: state => {
      state.isLoading = false;
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    logout: state => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    },
    setAnonymousUser: state => {
      // Set anonymous user in memory only - no localStorage
      state.user = {
        id: 'anonymous',
        email: 'anonymous@guest.com',
        name: 'Guest User',
        isAnonymous: true,
        role: 'member',
        families: [],
      };
      state.token = null; // No token for anonymous users
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    initializeAuth: state => {
      // Only check for real authenticated users from localStorage
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        
        if (token && userStr) {
          try {
            const user = JSON.parse(userStr);
            if (user && !user.isAnonymous) {
              state.user = user;
              state.token = token;
              state.isAuthenticated = true;
            }
          } catch {
            // Clear invalid data
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
      }
      state.isLoading = false;
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

export const { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  logout, 
  updateUser, 
  setCurrentFamily, 
  initializeAuth,
  setAnonymousUser 
} = authSlice.actions;

// Selectors
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectIsAnonymous = (state: { auth: AuthState }) => state.auth.user?.isAnonymous || false;
export const selectAuthToken = (state: { auth: AuthState }) => state.auth.token;
export const selectIsLoading = (state: { auth: AuthState }) => state.auth.isLoading;

export default authSlice.reducer;
