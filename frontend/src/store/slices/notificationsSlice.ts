import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Notification } from '../../types';

interface NotificationsState {
  items: Notification[];
  unreadCount: number;
  isConnected: boolean;
}

const initialState: NotificationsState = {
  items: [],
  unreadCount: 0,
  isConnected: false,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.items.unshift(action.payload);
      if (!action.payload.isRead) {
        state.unreadCount++;
      }
      if (state.items.length > 50) {
        state.items.pop();
      }
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.items.find(n => n.id === action.payload);
      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.unreadCount--;
      }
    },
    markAllAsRead: (state) => {
      state.items.forEach(notification => {
        notification.isRead = true;
      });
      state.unreadCount = 0;
    },
    setConnectionStatus: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    clearNotifications: (state) => {
      state.items = [];
      state.unreadCount = 0;
    },
  },
});

export const { addNotification, markAsRead, markAllAsRead, setConnectionStatus, clearNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;