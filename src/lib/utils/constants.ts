// Configuration constants
export const API_CONFIG = {
    AUTH_SERVICE_URL: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || 'http://localhost:5002',
    MAIN_SERVICE_URL: process.env.NEXT_PUBLIC_MAIN_SERVICE_URL || 'http://localhost:5001',
    NOTIFICATION_SERVICE_URL: process.env.NEXT_PUBLIC_NOTIFICATION_SERVICE_URL || 'http://localhost:5003',
    SIGNALR_HUB_URL: process.env.NEXT_PUBLIC_SIGNALR_HUB_URL || 'http://localhost:5003/notificationHub',
} as const;

export const APP_CONFIG = {
    APP_NAME: 'ShahdCooperative',
    ITEMS_PER_PAGE: 20,
    TOKEN_STORAGE_KEY: 'access_token',
    REFRESH_TOKEN_STORAGE_KEY: 'refresh_token',
    USER_STORAGE_KEY: 'user',
    CART_STORAGE_KEY: 'shahd-cart',
} as const;

// Product categories
export const PRODUCT_CATEGORIES = [
    'Honey',
    'Beeswax Products',
    'Beekeeping Equipment',
    'Pollen',
    'Royal Jelly',
    'Propolis',
] as const;

// Order statuses with display names
export const ORDER_STATUS_LABELS = {
    Pending: 'Pending',
    Confirmed: 'Confirmed',
    Shipped: 'Shipped',
    Delivered: 'Delivered',
    Cancelled: 'Cancelled',
} as const;

// Notification priorities
export const NOTIFICATION_PRIORITY_LABELS = {
    Low: 'Low',
    Normal: 'Normal',
    High: 'High',
    Urgent: 'Urgent',
} as const;
