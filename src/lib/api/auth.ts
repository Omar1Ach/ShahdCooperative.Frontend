import { authServiceClient, getErrorMessage } from './client';
import {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    Enable2FAResponse,
    Verify2FARequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    ChangePasswordRequest,
} from '@/types/auth';

/**
 * User login with email and password
 */
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
    const { data } = await authServiceClient.post<LoginResponse>('/auth/login', credentials);
    return data;
};

/**
 * Register a new user account
 */
export const register = async (userData: RegisterRequest): Promise<{ userId: string; email: string; message: string }> => {
    const { data } = await authServiceClient.post('/auth/register', userData);
    return data;
};

/**
 * Refresh access token using refresh token
 */
export const refreshAccessToken = async (refreshToken: string): Promise<LoginResponse> => {
    const { data } = await authServiceClient.post<LoginResponse>('/auth/refresh', { refreshToken });
    return data;
};

/**
 * Logout user (revoke tokens)
 */
export const logout = async (): Promise<void> => {
    await authServiceClient.post('/auth/logout');
};

/**
 * Enable two-factor authentication
 */
export const enable2FA = async (): Promise<Enable2FAResponse> => {
    const { data } = await authServiceClient.post<Enable2FAResponse>('/auth/enable-2fa');
    return data;
};

/**
 * Verify 2FA code during login or setup
 */
export const verify2FA = async (payload: Verify2FARequest): Promise<LoginResponse> => {
    const { data } = await authServiceClient.post<LoginResponse>('/auth/verify-2fa', payload);
    return data;
};

/**
 * Disable two-factor authentication
 */
export const disable2FA = async (): Promise<{ message: string }> => {
    const { data } = await authServiceClient.post('/auth/disable-2fa');
    return data;
};

/**
 * Send password reset email
 */
export const forgotPassword = async (payload: ForgotPasswordRequest): Promise<{ message: string }> => {
    const { data } = await authServiceClient.post('/auth/forgot-password', payload);
    return data;
};

/**
 * Reset password with token from email
 */
export const resetPassword = async (payload: ResetPasswordRequest): Promise<{ message: string }> => {
    const { data } = await authServiceClient.post('/auth/reset-password', payload);
    return data;
};

/**
 * Change password for authenticated user
 */
export const changePassword = async (payload: ChangePasswordRequest): Promise<{ message: string }> => {
    const { data } = await authServiceClient.post('/auth/change-password', payload);
    return data;
};

/**
 * Confirm email with token
 */
export const confirmEmail = async (userId: string, token: string): Promise<{ message: string }> => {
    const { data } = await authServiceClient.get(`/auth/confirm-email?userId=${userId}&token=${encodeURIComponent(token)}`);
    return data;
};

/**
 * Google OAuth login - redirect to Google consent screen
 */
export const loginWithGoogle = (): void => {
    window.location.href = `${authServiceClient.defaults.baseURL}/auth/google/login`;
};

/**
 * Facebook OAuth login - redirect to Facebook consent screen
 */
export const loginWithFacebook = (): void => {
    window.location.href = `${authServiceClient.defaults.baseURL}/auth/facebook/login`;
};

export { getErrorMessage };
