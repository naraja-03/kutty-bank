import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  isAddEntryModalOpen: boolean;
  isLoading: boolean;
  error: string | null;
  currentTab: 'dashboard' | 'messages' | 'activity' | 'family';
}

const initialState: UIState = {
  isAddEntryModalOpen: false,
  isLoading: false,
  error: null,
  currentTab: 'dashboard',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openAddEntryModal: (state) => {
      state.isAddEntryModalOpen = true;
    },
    closeAddEntryModal: (state) => {
      state.isAddEntryModalOpen = false;
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
  closeAddEntryModal,
  setLoading,
  setError,
  setCurrentTab,
  clearError,
} = uiSlice.actions;

export default uiSlice.reducer;
