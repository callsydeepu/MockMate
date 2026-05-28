import React, { createContext, useContext, useState } from 'react';

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'alert';
}

interface UIContextType {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (value: boolean) => void;
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (value: boolean) => void;
  notifications: Notification[];
  markAllNotificationsRead: () => void;
  markNotificationRead: (id: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'time' | 'read'>) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Ready for Interview',
    message: 'Your customized Google SWE Mock Interview is ready.',
    time: '2 hours ago',
    read: false,
    type: 'success',
  },
  {
    id: '2',
    title: 'Weekly Report Out',
    message: 'Your placement readiness score improved by +5% this week.',
    time: '1 day ago',
    read: false,
    type: 'info',
  },
  {
    id: '3',
    title: 'Profile Incomplete',
    message: 'Upload your latest resume to tailormake company specific questions.',
    time: '3 days ago',
    read: true,
    type: 'warning',
  },
];

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const addNotification = (notif: Omit<Notification, 'id' | 'time' | 'read'>) => {
    const newNotif: Notification = {
      ...notif,
      id: `notif_${Date.now()}`,
      time: 'Just now',
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  return (
    <UIContext.Provider
      value={{
        sidebarCollapsed,
        setSidebarCollapsed,
        mobileSidebarOpen,
        setMobileSidebarOpen,
        notifications,
        markAllNotificationsRead,
        markNotificationRead,
        addNotification,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};
