import { create } from 'zustand';
import { Notification } from '@/types/notification';

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    addNotification: (notification: Notification) => void;
    markAsRead: (notificationId: string) => void;
    markAllAsRead: () => void;
    removeNotification: (notificationId: string) => void;
    setNotifications: (notifications: Notification[]) => void;
    updateUnreadCount: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
    notifications: [],
    unreadCount: 0,

    addNotification: (notification) => {
        set((state) => {
            const updated = [notification, ...state.notifications];
            const unread = updated.filter(n => !n.isRead).length;
            return { notifications: updated, unreadCount: unread };
        });
    },

    markAsRead: (notificationId) => {
        set((state) => {
            const updated = state.notifications.map((n) =>
                n.notificationId === notificationId ? { ...n, isRead: true, readAt: new Date().toISOString() } : n
            );
            const unread = updated.filter(n => !n.isRead).length;
            return { notifications: updated, unreadCount: unread };
        });
    },

    markAllAsRead: () => {
        set((state) => ({
            notifications: state.notifications.map((n) => ({
                ...n,
                isRead: true,
                readAt: n.readAt || new Date().toISOString(),
            })),
            unreadCount: 0,
        }));
    },

    removeNotification: (notificationId) => {
        set((state) => {
            const updated = state.notifications.filter((n) => n.notificationId !== notificationId);
            const unread = updated.filter(n => !n.isRead).length;
            return { notifications: updated, unreadCount: unread };
        });
    },

    setNotifications: (notifications) => {
        const unread = notifications.filter(n => !n.isRead).length;
        set({ notifications, unreadCount: unread });
    },

    updateUnreadCount: () => {
        const unread = get().notifications.filter(n => !n.isRead).length;
        set({ unreadCount: unread });
    },
}));
