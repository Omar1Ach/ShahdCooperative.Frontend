'use client';

import { useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import { useNotificationStore } from '@/lib/store/notificationStore';
import { signalRService } from '@/lib/signalr/signalrService';
import { useAuthStore } from '@/lib/store/authStore';

export default function NotificationProvider() {
    const { user, token } = useAuthStore();
    const { addNotification } = useNotificationStore();

    useEffect(() => {
        if (user && token) {
            // Connect to SignalR
            signalRService.startConnection(token);

            // Listen for notifications
            const unsubscribe = signalRService.onNotification((notification) => {
                // Add to store
                addNotification({
                    id: Date.now().toString(), // Use backend ID in production
                    title: notification.title,
                    message: notification.message,
                    type: notification.type,
                    isRead: false,
                    createdAt: new Date().toISOString(),
                });

                // Show toast
                toast(notification.title, {
                    description: notification.message,
                    duration: 5000,
                    action: {
                        label: 'View',
                        onClick: () => console.log('View notification'),
                    },
                });
            });

            return () => {
                unsubscribe();
                signalRService.stopConnection();
            };
        }
    }, [user, token, addNotification]);

    return (
        <Toaster
            position="top-right"
            expand={true}
            richColors
            closeButton
            theme="system"
            className="font-sans"
        />
    );
}
