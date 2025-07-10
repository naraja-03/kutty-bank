import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ThreadPeriod {
  id: string;
  label: string;
  value: 'week' | 'month' | 'year' | 'custom' | 'daily';
  startDate?: Date;
  endDate?: Date;
  budgetId?: string;
  isCustomBudget?: boolean;
}

export interface SavedThread {
  id: string;
  label: string;
  value: 'week' | 'month' | 'year' | 'custom' | 'daily';
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  totalTransactions: number;
  totalAmount: number;
  isCustom?: boolean;
  description?: string;
  targetAmount?: number;
  budgetId?: string;
  isCustomBudget?: boolean;
}

interface ThreadsState {
  activeThread: ThreadPeriod;
  savedThreads: SavedThread[];
  isThreadSidebarOpen: boolean;
  allThreads: SavedThread[];
}

const defaultThreads: SavedThread[] = [
  {
    id: 'daily-budget',
    label: 'Daily Budget',
    value: 'daily',
    createdAt: new Date(),
    totalTransactions: 12,
    totalAmount: 15600,
    budgetId: 'daily',
    isCustomBudget: false
  }
];

const initialState: ThreadsState = {
  activeThread: {
    id: 'daily-budget',
    label: 'Daily Budget',
    value: 'daily',
    budgetId: 'daily',
    isCustomBudget: false
  },
  savedThreads: defaultThreads,
  allThreads: defaultThreads,
  isThreadSidebarOpen: false,
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
    
    createCustomThread: (state, action: PayloadAction<{ 
      label: string; 
      description?: string; 
      targetAmount?: number; 
    }>) => {
      const { label, description, targetAmount } = action.payload;
      const customThread: SavedThread = {
        id: `custom-${Date.now()}`,
        label,
        value: 'custom',
        createdAt: new Date(),
        totalTransactions: 0,
        totalAmount: 0,
        isCustom: true,
        description,
        targetAmount
      };
      
      state.savedThreads.push(customThread);
      state.allThreads.push(customThread);
      state.activeThread = customThread;
    },

    updateCustomThread: (state, action: PayloadAction<{
      id: string;
      label: string;
      description?: string;
      targetAmount?: number;
    }>) => {
      const { id, label, description, targetAmount } = action.payload;
      
      const threadIndex = state.savedThreads.findIndex(thread => thread.id === id);
      if (threadIndex !== -1) {
        state.savedThreads[threadIndex] = {
          ...state.savedThreads[threadIndex],
          label,
          description,
          targetAmount
        };
      }
      
      const allThreadIndex = state.allThreads.findIndex(thread => thread.id === id);
      if (allThreadIndex !== -1) {
        state.allThreads[allThreadIndex] = {
          ...state.allThreads[allThreadIndex],
          label,
          description,
          targetAmount
        };
      }
      
      if (state.activeThread.id === id) {
        state.activeThread = {
          ...state.activeThread,
          label
        };
      }
    },
    
    selectThreadFromList: (state, action: PayloadAction<string>) => {
      const selectedThread = state.allThreads.find(thread => thread.id === action.payload);
      if (selectedThread) {
        state.activeThread = {
          id: selectedThread.id,
          label: selectedThread.label,
          value: selectedThread.value,
          startDate: selectedThread.startDate,
          endDate: selectedThread.endDate,
          budgetId: selectedThread.budgetId,
          isCustomBudget: selectedThread.isCustomBudget
        };
      }
    },
    addCustomBudgetThread: (state, action: PayloadAction<{
      id: string;
      label: string;
      description?: string;
      targetAmount?: number;
      startDate?: Date;
      endDate?: Date;
    }>) => {
      const newThread: SavedThread = {
        id: action.payload.id,
        label: action.payload.label,
        value: 'custom',
        startDate: action.payload.startDate,
        endDate: action.payload.endDate,
        createdAt: new Date(),
        totalTransactions: 0,
        totalAmount: 0,
        isCustom: true,
        isCustomBudget: true,
        budgetId: action.payload.id,
        description: action.payload.description,
        targetAmount: action.payload.targetAmount
      };
      
      state.allThreads.push(newThread);
      state.savedThreads.push(newThread);
    },
    removeCustomBudgetThread: (state, action: PayloadAction<string>) => {
      state.allThreads = state.allThreads.filter(thread => thread.id !== action.payload);
      state.savedThreads = state.savedThreads.filter(thread => thread.id !== action.payload);
      
      if (state.activeThread.id === action.payload) {
        const dailyBudget = state.allThreads.find(thread => thread.budgetId === 'daily');
        if (dailyBudget) {
          state.activeThread = {
            id: dailyBudget.id,
            label: dailyBudget.label,
            value: dailyBudget.value,
            budgetId: dailyBudget.budgetId,
            isCustomBudget: dailyBudget.isCustomBudget
          };
        }
      }
    },
    setPeriodFromSelector: (state, action: PayloadAction<{ 
      label: string; 
      date: Date; 
      type: 'week' | 'month' | 'year' 
    }>) => {
      const { label, date, type } = action.payload;
      state.activeThread = {
        id: `selected-${type}-${Date.now()}`,
        label,
        value: type,
        startDate: date,
        endDate: date
      };
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
  createCustomThread,
  updateCustomThread,
  selectThreadFromList,
  setPeriodFromSelector,
  addCustomBudgetThread,
  removeCustomBudgetThread
} = threadsSlice.actions;

export default threadsSlice.reducer;
