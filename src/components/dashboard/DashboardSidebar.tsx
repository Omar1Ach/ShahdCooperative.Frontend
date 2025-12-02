'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/authStore';
import { clsx } from 'clsx';

export default function DashboardSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    const navItems = [
        {
            href: '/dashboard',
            label: 'Personal Information',
            icon: 'person',
        },
        {
            href: '/orders',
            label: 'Order History',
            icon: 'history',
        },
        {
            href: '/settings',
            label: 'Account Settings',
            icon: 'settings',
        },
    ];

    if (!user) {
        return null;
    }

    return (
        <aside className="w-64 flex-shrink-0 p-6 border-r border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark">
            <div className="flex h-full flex-col justify-between">
                <div className="flex flex-col gap-8">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="font-serif text-2xl font-bold text-text-light dark:text-text-dark"
                    >
                        Shahd<span className="text-golden-honey">Co.</span>
                    </Link>

                    {/* User Info */}
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-golden-honey/20 text-golden-honey font-bold text-lg">
                            {user.firstName?.[0]}{user.lastName?.[0]}
                        </div>
                        <div className="flex flex-col min-w-0">
                            <h1 className="text-text-light dark:text-text-dark text-base font-medium truncate">
                                {user.firstName} {user.lastName}
                            </h1>
                            <p className="text-text-muted-light dark:text-text-muted-dark text-sm truncate">
                                {user.email}
                            </p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex flex-col gap-2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={clsx(
                                        'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors duration-200',
                                        isActive
                                            ? 'bg-golden-honey/10 text-text-light dark:text-text-dark'
                                            : 'text-text-muted-light dark:text-text-muted-dark hover:bg-golden-honey/5'
                                    )}
                                >
                                    <span
                                        className={clsx(
                                            'material-symbols-outlined text-xl',
                                            isActive ? 'text-golden-honey' : ''
                                        )}
                                    >
                                        {item.icon}
                                    </span>
                                    <p className="text-sm font-medium">{item.label}</p>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Logout */}
                <div className="flex flex-col gap-1">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-danger/10 text-text-muted-light dark:text-text-muted-dark hover:text-danger transition-colors duration-200 w-full"
                    >
                        <span className="material-symbols-outlined text-xl">logout</span>
                        <p className="text-sm font-medium">Log Out</p>
                    </button>
                </div>
            </div>
        </aside>
    );
}
