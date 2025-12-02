import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG, APP_CONFIG } from '../utils/constants';

// Create base axios instances for each service
export const authServiceClient: AxiosInstance = axios.create({
    baseURL: API_CONFIG.AUTH_SERVICE_URL + '/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const mainServiceClient: AxiosInstance = axios.create({
    baseURL: API_CONFIG.MAIN_SERVICE_URL + '/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const notificationServiceClient: AxiosInstance = axios.create({
    baseURL: API_CONFIG.NOTIFICATION_SERVICE_URL + '/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Token management helpers
let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
    accessToken = token;
};

export const getAccessToken = (): string | null => {
    return accessToken;
};

// Request interceptor - Attach JWT token
const requestInterceptor = (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
};

// Response interceptor - Handle token refresh
const createResponseInterceptor = (client: AxiosInstance) => {
    return client.interceptors.response.use(
        (response) => response,
        async (error: AxiosError) => {
            const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

            // If 401 and not already retried, try to refresh token
            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                try {
                    const refreshToken = localStorage.getItem(APP_CONFIG.REFRESH_TOKEN_STORAGE_KEY);
                    if (!refreshToken) {
                        throw new Error('No refresh token available');
                    }

                    // Call refresh token endpoint
                    const { data } = await authServiceClient.post('/auth/refresh', {
                        refreshToken,
                    });

                    // Update tokens
                    setAccessToken(data.accessToken);
                    localStorage.setItem(APP_CONFIG.REFRESH_TOKEN_STORAGE_KEY, data.refreshToken);

                    // Retry original request with new token
                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                    }
                    return axios(originalRequest);
                } catch (refreshError) {
                    // Refresh failed - clear tokens and redirect to login
                    setAccessToken(null);
                    localStorage.removeItem(APP_CONFIG.REFRESH_TOKEN_STORAGE_KEY);
                    localStorage.removeItem(APP_CONFIG.USER_STORAGE_KEY);

                    // Only redirect if in browser
                    if (typeof window !== 'undefined') {
                        window.location.href = '/login';
                    }
                    return Promise.reject(refreshError);
                }
            }

            return Promise.reject(error);
        }
    );
};

// Apply interceptors to all clients
[authServiceClient, mainServiceClient, notificationServiceClient].forEach((client) => {
    client.interceptors.request.use(requestInterceptor);
    createResponseInterceptor(client);
});

// Error response type
export interface ApiErrorResponse {
    statusCode: number;
    message: string;
    errors?: Array<{
        propertyName: string;
        errorMessage: string;
    }>;
    traceId?: string;
}

// Helper to extract error message
export const getErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as ApiErrorResponse;
        if (apiError?.message) {
            return apiError.message;
        }
        if (apiError?.errors && apiError.errors.length > 0) {
            return apiError.errors.map(e => e.errorMessage).join(', ');
        }
        return error.message;
    }
    if (error instanceof Error) {
        return error.message;
    }
    return 'An unknown error occurred';
};
