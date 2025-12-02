// Authentication Types
export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    user: User;
}

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'Admin' | 'Customer';
    phoneNumber?: string;
    twoFactorEnabled: boolean;
    emailConfirmed: boolean;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface Enable2FAResponse {
    qrCodeUrl: string;
    manualEntryKey: string;
}

export interface Verify2FARequest {
    userId: string;
    code: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    email: string;
    token: string;
    newPassword: string;
    confirmPassword: string;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}
