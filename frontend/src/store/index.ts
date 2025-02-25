import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import dealsReducer from './slices/dealsSlice';
import contactsReducer from './slices/contactsSlice';
import tasksReducer from './slices/tasksSlice';
import notificationsReducer from './slices/notificationsSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    deals: dealsReducer,
    contacts: contactsReducer,
    tasks: tasksReducer,
    notifications: notificationsReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;