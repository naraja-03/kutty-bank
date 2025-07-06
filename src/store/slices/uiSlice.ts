import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EditTransactionData {
  id: string;
  amount: number;
  date: string;
  category: string;
  type: 'income' | 'expense';
  note?: string;
}

interface CustomThreadEditData {
  id: string;
  name: string;
  description: string;
  targetAmount: number;
  startDate: Date;
  endDate: Date;
}

interface UIState {
  isAddEntryModalOpen: boolean;
  isCustomThreadModalOpen: boolean;
  customThreadMode: 'create' | 'edit';
  customThreadEditData: CustomThreadEditData | null;
  isLoading: boolean;
  error: string | null;
  currentTab: 'dashboard' | 'messages' | 'activity' | 'family';
  editTransactionData: EditTransactionData | null;
}

const initialState: UIState = {
  isAddEntryModalOpen: false,
  isCustomThreadModalOpen: false,
  customThreadMode: 'create',
  customThreadEditData: null,
  isLoading: false,
  error: null,
  currentTab: 'dashboard',
  editTransactionData: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openAddEntryModal: (state) => {
      state.isAddEntryModalOpen = true;
      state.editTransactionData = null;
    },
    openEditEntryModal: (state, action: PayloadAction<EditTransactionData>) => {
      state.isAddEntryModalOpen = true;
      state.editTransactionData = action.payload;
    },
    closeAddEntryModal: (state) => {
      state.isAddEntryModalOpen = false;
      state.editTransactionData = null;
    },
    openCustomThreadModal: (state, action: PayloadAction<'create' | 'edit'>) => {
      state.isCustomThreadModalOpen = true;
      state.customThreadMode = action.payload;
      if (action.payload === 'create') {
        state.customThreadEditData = null;
      }
    },
    openEditCustomThreadModal: (state, action: PayloadAction<CustomThreadEditData>) => {
      state.isCustomThreadModalOpen = true;
      state.customThreadMode = 'edit';
      state.customThreadEditData = action.payload;
    },
    closeCustomThreadModal: (state) => {
      state.isCustomThreadModalOpen = false;
      state.customThreadEditData = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setCurrentTab: (state, action: PayloadAction<'dashboard' | 'messages' | 'activity' | 'family'>) => {
      state.currentTab = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  openAddEntryModal,
  openEditEntryModal,
  closeAddEntryModal,
  openCustomThreadModal,
  openEditCustomThreadModal,
  closeCustomThreadModal,
  setLoading,
  setError,
  setCurrentTab,
  clearError,
} = uiSlice.actions;

export default uiSlice.reducer;
