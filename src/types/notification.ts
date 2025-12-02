// Notification Types
export type NotificationType = 'Email' | 'SMS' | 'InApp' | 'Push';
export type NotificationPriority = 'Low' | 'Normal' | 'High' | 'Urgent';

export interface Notification {
    notificationId: string;
    userId: string;
    type: NotificationType;
    subject: string;
    message: string;
    isRead: boolean;
    priority: NotificationPriority;
    metadata?: Record<string, any>;
    createdAt: string;
    readAt?: string;
}

export interface NotificationListResponse {
    notifications: Notification[];
    totalCount: number;
    unreadCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface NotificationPreferences {
    userId: string;
    emailEnabled: boolean;
    smsEnabled: boolean;
    pushEnabled: boolean;
    inAppEnabled: boolean;
    orderUpdates: boolean;
    promotions: boolean;
    newsletters: boolean;
}

export interface UpdatePreferencesRequest {
    emailEnabled?: boolean;
    smsEnabled?: boolean;
    pushEnabled?: boolean;
    inAppEnabled?: boolean;
    orderUpdates?: boolean;
    promotions?: boolean;
    newsletters?: boolean;
}
