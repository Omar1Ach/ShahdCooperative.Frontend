import { notificationServiceClient } from './client';
import {
    Notification,
    NotificationListResponse,
    NotificationPreferences,
    UpdatePreferencesRequest,
} from '@/types/notification';

/**
 * Get user's notifications with optional filters
 */
export const getNotifications = async (
    userId: string,
    isRead?: boolean,
    page: number = 1,
    pageSize: number = 20
): Promise<NotificationListResponse> => {
    const params = new URLSearchParams({
        userId,
        page: page.toString(),
        pageSize: pageSize.toString(),
    });

    if (isRead !== undefined) {
        params.append('isRead', isRead.toString());
    }

    const { data } = await notificationServiceClient.get<NotificationListResponse>(
        `/notifications?${params.toString()}`
    );
    return data;
};

/**
 * Mark a notification as read
 */
export const markNotificationAsRead = async (notificationId: string): Promise<Notification> => {
    const { data } = await notificationServiceClient.put<Notification>(
        `/notifications/${notificationId}/read`
    );
    return data;
};

/**
 * Mark all notifications as read for a user
 */
export const markAllNotificationsAsRead = async (userId: string): Promise<{ message: string; count: number }> => {
    const { data } = await notificationServiceClient.put(`/notifications/read-all?userId=${userId}`);
    return data;
};

/**
 * Delete a notification
 */
export const deleteNotification = async (notificationId: string): Promise<{ message: string }> => {
    const { data } = await notificationServiceClient.delete(`/notifications/${notificationId}`);
    return data;
};

/**
 * Get user's notification preferences
 */
export const getNotificationPreferences = async (userId: string): Promise<NotificationPreferences> => {
    const { data } = await notificationServiceClient.get<NotificationPreferences>(
        `/notifications/preferences/${userId}`
    );
    return data;
};

/**
 * Update user's notification preferences
 */
export const updateNotificationPreferences = async (
    userId: string,
    preferences: UpdatePreferencesRequest
): Promise<NotificationPreferences> => {
    const { data } = await notificationServiceClient.put<NotificationPreferences>(
        `/notifications/preferences/${userId}`,
        preferences
    );
    return data;
};
