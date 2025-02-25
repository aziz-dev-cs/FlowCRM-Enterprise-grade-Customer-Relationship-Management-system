import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  modalOpen: string | null;
  isLoading: boolean;
}

const initialState: UIState = {
  sidebarOpen: true,
  theme: 'light',
  modalOpen: null,
  isLoading: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    openModal: (state, action: PayloadAction<string>) => {
      state.modalOpen = action.payload;
    },
    closeModal: (state) => {
      state.modalOpen = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { toggleSidebar, setTheme, openModal, closeModal, setLoading } = uiSlice.actions;
export default uiSlice.reducer;