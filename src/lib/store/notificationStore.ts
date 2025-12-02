import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    isRead: boolean;
    createdAt: string;
}

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    addNotification: (notification: Notification) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>()(
    persist(
        (set) => ({
            notifications: [],
            unreadCount: 0,
            addNotification: (notification) =>
                set((state) => ({
                    notifications: [notification, ...state.notifications],
                    unreadCount: state.unreadCount + 1,
                })),
            markAsRead: (id) =>
                set((state) => {
                    const notification = state.notifications.find((n) => n.id === id);
                    if (notification && !notification.isRead) {
                        return {
                            notifications: state.notifications.map((n) =>
                                n.id === id ? { ...n, isRead: true } : n
                            ),
                            unreadCount: Math.max(0, state.unreadCount - 1),
                        };
                    }
                    return state;
                }),
            markAllAsRead: () =>
                set((state) => ({
                    notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
                    unreadCount: 0,
                })),
            clearNotifications: () => set({ notifications: [], unreadCount: 0 }),
        }),
        {
            name: 'notification-storage',
        }
    )
);
