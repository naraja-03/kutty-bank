import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EditTransactionData {
  id: string;
  amount: number;
  date: string;
  category: string;
  type: 'income' | 'expense';
  note?: string;
}

interface CustomBudgetEditData {
  id: string;
  name: string;
  description: string;
  targetAmount: number;
  startDate: Date;
  endDate: Date;
}

interface UIState {
  isAddEntryModalOpen: boolean;
  isCustomBudgetModalOpen: boolean;
  isPeriodSelectorOpen: boolean;
  isFamilySelectorModalOpen: boolean;
  customBudgetMode: 'create' | 'edit';
  customBudgetEditData: CustomBudgetEditData | null;
  isLoading: boolean;
  error: string | null;
  currentTab: 'dashboard' | 'messages' | 'activity' | 'family';
  editTransactionData: EditTransactionData | null;
}

const initialState: UIState = {
  isAddEntryModalOpen: false,
  isCustomBudgetModalOpen: false,
  isPeriodSelectorOpen: false,
  isFamilySelectorModalOpen: false,
  customBudgetMode: 'create',
  customBudgetEditData: null,
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
    openCustomBudgetModal: (state, action: PayloadAction<'create' | 'edit'>) => {
      state.isCustomBudgetModalOpen = true;
      state.customBudgetMode = action.payload;
      if (action.payload === 'create') {
        state.customBudgetEditData = null;
      }
    },
    openEditCustomBudgetModal: (state, action: PayloadAction<CustomBudgetEditData>) => {
      state.isCustomBudgetModalOpen = true;
      state.customBudgetMode = 'edit';
      state.customBudgetEditData = action.payload;
    },
    closeCustomBudgetModal: (state) => {
      state.isCustomBudgetModalOpen = false;
      state.customBudgetEditData = null;
    },
    openPeriodSelector: (state) => {
      state.isPeriodSelectorOpen = true;
    },
    closePeriodSelector: (state) => {
      state.isPeriodSelectorOpen = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    openFamilySelectorModal: (state) => {
      state.isFamilySelectorModalOpen = true;
    },
    closeFamilySelectorModal: (state) => {
      state.isFamilySelectorModalOpen = false;
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
  openCustomBudgetModal,
  openEditCustomBudgetModal,
  closeCustomBudgetModal,
  openPeriodSelector,
  closePeriodSelector,
  openFamilySelectorModal,
  closeFamilySelectorModal,
  setLoading,
  setError,
  setCurrentTab,
  clearError,
} = uiSlice.actions;

export default uiSlice.reducer;
