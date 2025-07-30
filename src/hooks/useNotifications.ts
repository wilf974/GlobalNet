import { useState, useCallback } from 'react';
import { Notification } from '@/components/ui/NotificationCenter';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const getUnreadCount = useCallback(() => {
    return notifications.filter(notification => !notification.read).length;
  }, [notifications]);

  // Fonctions utilitaires pour différents types de notifications
  const addSuccessNotification = useCallback((title: string, message: string, action?: Notification['action']) => {
    addNotification({
      type: 'success',
      title,
      message,
      action
    });
  }, [addNotification]);

  const addErrorNotification = useCallback((title: string, message: string, action?: Notification['action']) => {
    addNotification({
      type: 'error',
      title,
      message,
      action
    });
  }, [addNotification]);

  const addWarningNotification = useCallback((title: string, message: string, action?: Notification['action']) => {
    addNotification({
      type: 'warning',
      title,
      message,
      action
    });
  }, [addNotification]);

  const addInfoNotification = useCallback((title: string, message: string, action?: Notification['action']) => {
    addNotification({
      type: 'info',
      title,
      message,
      action
    });
  }, [addNotification]);

  return {
    notifications,
    addNotification,
    addSuccessNotification,
    addErrorNotification,
    addWarningNotification,
    addInfoNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    getUnreadCount
  };
}; 