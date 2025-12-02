'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store/authStore';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const { initializeAuth } = useAuthStore();

    useEffect(() => {
        // Initialize authentication on app load
        initializeAuth();
    }, [initializeAuth]);

    return <>{children}</>;
}
