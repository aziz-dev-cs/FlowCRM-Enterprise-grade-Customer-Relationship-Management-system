import React, { useState } from 'react';
import { IconButton, Badge, Popover, List, ListItem, ListItemText, Typography, Button } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { markAllAsRead, markAsRead } from '../../store/slices/notificationsSlice';

export const NotificationBell: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const dispatch = useAppDispatch();
  const { items, unreadCount } = useAppSelector(state => state.notifications);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAsRead = (id: string) => {
    dispatch(markAsRead(id));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ width: 350, maxHeight: 400, overflow: 'auto', p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Notifications</Typography>
            {unreadCount > 0 && (
              <Button size="small" onClick={handleMarkAllAsRead}>
                Mark all as read
              </Button>
            )}
          </Box>
          
          {items.length === 0 ? (
            <Typography color="text.secondary" align="center">
              No notifications
            </Typography>
          ) : (
            <List>
              {items.map((notification) => (
                <ListItem
                  key={notification.id}
                  sx={{
                    bgcolor: notification.isRead ? 'transparent' : '#f0f7ff',
                    mb: 1,
                    borderRadius: 1,
                    cursor: 'pointer',
                  }}
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  <ListItemText
                    primary={notification.title}
                    secondary={
                      <>
                        <Typography variant="body2">{notification.content}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(notification.createdAt).toLocaleTimeString()}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Popover>
    </>
  );
};