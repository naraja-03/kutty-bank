import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Simple thread interface for the store
interface Thread {
  id: string;
  title: string;
  content: string;
  authorId: string;
  familyId: string;
  createdAt: string;
  updatedAt: string;
  replies?: Thread[];
}

interface ThreadsState {
  threads: Thread[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ThreadsState = {
  threads: [],
  isLoading: false,
  error: null,
};

const threadsSlice = createSlice({
  name: 'threads',
  initialState,
  reducers: {
    setThreads: (state, action: PayloadAction<Thread[]>) => {
      state.threads = action.payload;
    },
    addThread: (state, action: PayloadAction<Thread>) => {
      state.threads.push(action.payload);
    },
    updateThread: (state, action: PayloadAction<Thread>) => {
      const index = state.threads.findIndex(thread => thread.id === action.payload.id);
      if (index !== -1) {
        state.threads[index] = action.payload;
      }
    },
    removeThread: (state, action: PayloadAction<string>) => {
      state.threads = state.threads.filter(thread => thread.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setThreads,
  addThread,
  updateThread,
  removeThread,
  setLoading,
  setError,
  clearError,
} = threadsSlice.actions;

export default threadsSlice.reducer;
