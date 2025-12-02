'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { User } from '@/types/auth';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: 'Admin' | 'Customer';
    redirectTo?: string;
}

export default function ProtectedRoute({
    children,
    requiredRole,
    redirectTo = '/login'
}: ProtectedRouteProps) {
    const router = useRouter();
    const { user, isAuthenticated, isLoading, initializeAuth } = useAuthStore();

    useEffect(() => {
        // Initialize auth on mount
        initializeAuth();
    }, [initializeAuth]);

    useEffect(() => {
        // Don't redirect while loading
        if (isLoading) return;

        // Redirect to login if not authenticated
        if (!isAuthenticated || !user) {
            router.push(redirectTo);
            return;
        }

        // Check role if required
        if (requiredRole && user.role !== requiredRole) {
            router.push('/unauthorized');
            return;
        }
    }, [isAuthenticated, user, isLoading, requiredRole, redirectTo, router]);

    // Show loading state
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-300">Loading...</p>
                </div>
            </div>
        );
    }

    // Don't render children if not authenticated or wrong role
    if (!isAuthenticated || !user) {
        return null;
    }

    if (requiredRole && user.role !== requiredRole) {
        return null;
    }

    return <>{children}</>;
}
