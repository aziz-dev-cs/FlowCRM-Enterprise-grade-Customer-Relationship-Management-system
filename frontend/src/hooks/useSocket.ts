import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAppDispatch } from './useAppDispatch';
import { addNotification } from '../store/slices/notificationsSlice';
import { updateDeal } from '../store/slices/dealsSlice';

export const useSocket = (workspaceId: string | null) => {
  const socketRef = useRef<Socket | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!workspaceId) return;

    socketRef.current = io(process.env.REACT_APP_WS_URL || 'http://localhost:3000', {
      query: { workspaceId },
      transports: ['websocket'],
    });

    socketRef.current.on('connect', () => {
      console.log('🔌 WebSocket connected');
    });

    socketRef.current.on('deal:stageUpdated', (data) => {
      dispatch(updateDeal(data.deal));
      dispatch(addNotification({
        id: Date.now().toString(),
        type: 'deal_update',
        title: 'Deal Stage Changed',
        content: `${data.deal.title} moved to ${data.newStage}`,
        isRead: false,
        createdAt: new Date().toISOString(),
      }));
    });

    socketRef.current.on('notification:new', (notification) => {
      dispatch(addNotification(notification));
      
      if (Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.content,
          icon: '/logo192.png',
        });
      }
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [workspaceId, dispatch]);

  return socketRef.current;
};