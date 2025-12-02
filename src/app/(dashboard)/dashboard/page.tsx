'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/authStore';
import { getOrders } from '@/lib/api/orders';
import { Order } from '@/types/order';
import { formatCurrency, formatDate } from '@/lib/utils/helpers';
import { ORDER_STATUS_LABELS } from '@/lib/utils/constants';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

function DashboardContent() {
    const { user } = useAuthStore();
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalSpent: 0,
        activeOrders: 0,
    });

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const orders = await getOrders();
            setRecentOrders(orders.slice(0, 3)); // Get last 3 orders

            // Calculate stats
            const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);
            const activeOrders = orders.filter(o => o.status === 'Pending' || o.status === 'Confirmed' || o.status === 'Shipped').length;

            setStats({
                totalOrders: orders.length,
                totalSpent,
                activeOrders,
            });
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status: string): string => {
        const colors: Record<string, string> = {
            Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            Confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            Shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
            Delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            Cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        };
        return colors[status] || colors.Pending;
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Welcome back, {user?.firstName}! 👋
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Here's what's happening with your account today.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalOrders}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-600 dark:text-amber-400">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Total Spent</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(stats.totalSpent)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Active Orders</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeOrders}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Orders */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Orders</h2>
                            <Link href="/orders" className="text-amber-600 hover:text-amber-700 font-medium text-sm">
                                View All
                            </Link>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
                            {isLoading ? (
                                <div className="p-8 text-center">
                                    <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                                </div>
                            ) : recentOrders.length > 0 ? (
                                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {recentOrders.map((order) => (
                                        <div key={order.orderId} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <p className="font-bold text-gray-900 dark:text-white">#{order.orderNumber}</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(order.orderDate, 'short')}</p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                                                    {ORDER_STATUS_LABELS[order.status as keyof typeof ORDER_STATUS_LABELS]}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                                    {order.orderItems.length} items
                                                </p>
                                                <div className="flex items-center gap-4">
                                                    <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(order.totalAmount)}</span>
                                                    <Link
                                                        href={`/orders/${order.orderId}`}
                                                        className="text-amber-600 hover:text-amber-700 text-sm font-medium"
                                                    >
                                                        Details →
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                    No orders yet. <Link href="/products" className="text-amber-600 hover:underline">Start shopping!</Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Quick Actions</h2>
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 space-y-4">
                            <Link
                                href="/profile"
                                className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                            >
                                <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full group-hover:bg-amber-100 dark:group-hover:bg-amber-900/30 transition-colors">
                                    <svg className="w-6 h-6 text-gray-600 dark:text-gray-300 group-hover:text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">Edit Profile</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Update your personal info</p>
                                </div>
                            </Link>

                            <Link
                                href="/settings"
                                className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                            >
                                <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full group-hover:bg-amber-100 dark:group-hover:bg-amber-900/30 transition-colors">
                                    <svg className="w-6 h-6 text-gray-600 dark:text-gray-300 group-hover:text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">Security</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Change password & 2FA</p>
                                </div>
                            </Link>

                            <Link
                                href="/settings/notifications"
                                className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                            >
                                <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full group-hover:bg-amber-100 dark:group-hover:bg-amber-900/30 transition-colors">
                                    <svg className="w-6 h-6 text-gray-600 dark:text-gray-300 group-hover:text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">Notifications</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage preferences</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <DashboardContent />
        </ProtectedRoute>
    );
}
