import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, startOfYear, endOfYear } from 'date-fns';

export interface ThreadPeriod {
  id: string;
  label: string;
  value: 'week' | 'month' | 'quarter' | 'year' | 'custom';
  startDate?: Date;
  endDate?: Date;
}

export interface SavedThread {
  id: string;
  label: string;
  value: 'week' | 'month' | 'quarter' | 'year' | 'custom';
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  totalTransactions: number;
  totalAmount: number;
  isCustom?: boolean;
}

interface ThreadsState {
  activeThread: ThreadPeriod;
  savedThreads: SavedThread[];
  isThreadSidebarOpen: boolean;
  isCustomThreadModalOpen: boolean;
  allThreads: SavedThread[];
}

const getCurrentPeriod = (value: 'week' | 'month' | 'quarter' | 'year'): { startDate: Date; endDate: Date } => {
  const now = new Date();
  
  switch (value) {
    case 'week':
      return {
        startDate: startOfWeek(now, { weekStartsOn: 1 }),
        endDate: endOfWeek(now, { weekStartsOn: 1 })
      };
    case 'month':
      return {
        startDate: startOfMonth(now),
        endDate: endOfMonth(now)
      };
    case 'quarter':
      return {
        startDate: startOfQuarter(now),
        endDate: endOfQuarter(now)
      };
    case 'year':
      return {
        startDate: startOfYear(now),
        endDate: endOfYear(now)
      };
    default:
      return {
        startDate: startOfMonth(now),
        endDate: endOfMonth(now)
      };
  }
};

const defaultThreads: SavedThread[] = [
  {
    id: 'current-week',
    label: 'This Week',
    value: 'week',
    ...getCurrentPeriod('week'),
    createdAt: new Date(),
    totalTransactions: 12,
    totalAmount: 15600
  },
  {
    id: 'current-month',
    label: 'This Month',
    value: 'month',
    ...getCurrentPeriod('month'),
    createdAt: new Date(),
    totalTransactions: 45,
    totalAmount: 67800
  },
  {
    id: 'current-quarter',
    label: 'This Quarter',
    value: 'quarter',
    ...getCurrentPeriod('quarter'),
    createdAt: new Date(),
    totalTransactions: 134,
    totalAmount: 198400
  },
  {
    id: 'current-year',
    label: 'This Year',
    value: 'year',
    ...getCurrentPeriod('year'),
    createdAt: new Date(),
    totalTransactions: 456,
    totalAmount: 892300
  }
];

const initialState: ThreadsState = {
  activeThread: {
    id: 'current-month',
    label: 'This Month',
    value: 'month',
    ...getCurrentPeriod('month')
  },
  savedThreads: defaultThreads,
  allThreads: defaultThreads,
  isThreadSidebarOpen: false,
  isCustomThreadModalOpen: false,
};

const threadsSlice = createSlice({
  name: 'threads',
  initialState,
  reducers: {
    setActiveThread: (state, action: PayloadAction<ThreadPeriod>) => {
      state.activeThread = action.payload;
    },
    
    addSavedThread: (state, action: PayloadAction<SavedThread>) => {
      state.savedThreads.push(action.payload);
      state.allThreads.push(action.payload);
    },
    
    removeSavedThread: (state, action: PayloadAction<string>) => {
      state.savedThreads = state.savedThreads.filter(thread => thread.id !== action.payload);
      state.allThreads = state.allThreads.filter(thread => thread.id !== action.payload);
    },
    
    updateThreadStats: (state, action: PayloadAction<{ id: string; totalTransactions: number; totalAmount: number }>) => {
      const { id, totalTransactions, totalAmount } = action.payload;
      
      const threadIndex = state.savedThreads.findIndex(thread => thread.id === id);
      if (threadIndex !== -1) {
        state.savedThreads[threadIndex].totalTransactions = totalTransactions;
        state.savedThreads[threadIndex].totalAmount = totalAmount;
      }
      
      const allThreadIndex = state.allThreads.findIndex(thread => thread.id === id);
      if (allThreadIndex !== -1) {
        state.allThreads[allThreadIndex].totalTransactions = totalTransactions;
        state.allThreads[allThreadIndex].totalAmount = totalAmount;
      }
    },
    
    openThreadSidebar: (state) => {
      state.isThreadSidebarOpen = true;
    },
    
    closeThreadSidebar: (state) => {
      state.isThreadSidebarOpen = false;
    },
    
    openCustomThreadModal: (state) => {
      state.isCustomThreadModalOpen = true;
    },
    
    closeCustomThreadModal: (state) => {
      state.isCustomThreadModalOpen = false;
    },
    
    createCustomThread: (state, action: PayloadAction<{ label: string; startDate: Date; endDate: Date }>) => {
      const { label, startDate, endDate } = action.payload;
      const customThread: SavedThread = {
        id: `custom-${Date.now()}`,
        label,
        value: 'custom',
        startDate,
        endDate,
        createdAt: new Date(),
        totalTransactions: 0,
        totalAmount: 0,
        isCustom: true
      };
      
      state.savedThreads.push(customThread);
      state.allThreads.push(customThread);
      state.activeThread = customThread;
    },
    
    selectThreadFromList: (state, action: PayloadAction<string>) => {
      const thread = state.allThreads.find(t => t.id === action.payload);
      if (thread) {
        state.activeThread = thread;
      }
    }
  },
});

export const {
  setActiveThread,
  addSavedThread,
  removeSavedThread,
  updateThreadStats,
  openThreadSidebar,
  closeThreadSidebar,
  openCustomThreadModal,
  closeCustomThreadModal,
  createCustomThread,
  selectThreadFromList
} = threadsSlice.actions;

export default threadsSlice.reducer;
