import { create } from 'zustand';
import { User } from '@/types/auth';
import { setAccessToken, getAccessToken } from '../api/client';
import { APP_CONFIG } from '../utils/constants';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (user: User, accessToken: string, refreshToken: string) => void;
    logout: () => void;
    setUser: (user: User | null) => void;
    initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>(set => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,

    login: (user, accessToken, refreshToken) => {
        setAccessToken(accessToken);
        localStorage.setItem(APP_CONFIG.REFRESH_TOKEN_STORAGE_KEY, refreshToken);
        localStorage.setItem(APP_CONFIG.USER_STORAGE_KEY, JSON.stringify(user));
        set({ user, isAuthenticated: true, isLoading: false });
    },

    logout: () => {
        setAccessToken(null);
        localStorage.removeItem(APP_CONFIG.REFRESH_TOKEN_STORAGE_KEY);
        localStorage.removeItem(APP_CONFIG.USER_STORAGE_KEY);
        set({ user: null, isAuthenticated: false, isLoading: false });
    },

    setUser: (user) => {
        set({ user, isAuthenticated: !!user });
    },

    initializeAuth: () => {
        try {
            const userStr = localStorage.getItem(APP_CONFIG.USER_STORAGE_KEY);
            const refreshToken = localStorage.getItem(APP_CONFIG.REFRESH_TOKEN_STORAGE_KEY);

            if (userStr && refreshToken) {
                const user = JSON.parse(userStr) as User;
                set({ user, isAuthenticated: true, isLoading: false });
            } else {
                set({ isLoading: false });
            }
        } catch (error) {
            console.error('Failed to initialize auth:', error);
            set({ isLoading: false });
        }
    },
}));
