'use client';

import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/login?redirect=/dashboard');
        }
    }, [user, router]);

    if (!user) {
        return null;
    }

    return (
        <div className="flex h-screen bg-background-light dark:bg-background-dark overflow-hidden">
            <DashboardSidebar />
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
