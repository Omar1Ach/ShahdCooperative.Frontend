'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getOrders } from '@/lib/api/orders';
import { Order, OrderStatus } from '@/types/order';
import { useAuthStore } from '@/lib/store/authStore';
import { formatCurrency, formatDate } from '@/lib/utils/helpers';
import { ORDER_STATUS_LABELS } from '@/lib/utils/constants';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

function OrderHistoryContent() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [filterStatus, setFilterStatus] = useState<OrderStatus | ''>('');

    useEffect(() => {
        if (user) {
            loadOrders();
        }
    }, [user, filterStatus]);

    const loadOrders = async () => {
        setIsLoading(true);
        setError('');

        try {
            const response = await getOrders({
                page: 1,
                pageSize: 50,
                status: filterStatus || undefined,
            });
            setOrders(response.orders);
        } catch (err) {
            setError('Failed to load orders');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status: OrderStatus): string => {
        const colors = {
            Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            Confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            Shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
            Delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            Cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        };
        return colors[status];
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Order History</h1>
                    <p className="text-gray-600 dark:text-gray-400">View and track your orders</p>
                </div>

                {/* Filter */}
                <div className="mb-6">
                    <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Filter by Status
                    </label>
                    <select
                        id="statusFilter"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as OrderStatus | '')}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                        <option value="">All Orders</option>
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
                        {error}
                    </div>
                )}

                {/* Loading */}
                {isLoading && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-300">Loading orders...</p>
                    </div>
                )}

                {/* Orders List */}
                {!isLoading && orders.length === 0 && (
                    <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl">
                        <svg className="w-24 h-24 mx-auto text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            No orders found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            You haven't placed any orders yet
                        </p>
                        <Link
                            href="/products"
                            className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                        >
                            Start Shopping
                        </Link>
                    </div>
                )}

                {!isLoading && orders.length > 0 && (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <Link
                                key={order.orderId}
                                href={`/orders/${order.orderId}`}
                                className="block bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                                            Order #{order.orderNumber}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Placed on {formatDate(order.orderDate, 'long')}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                                        {ORDER_STATUS_LABELS[order.status]}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Amount</p>
                                        <p className="text-xl font-bold text-amber-600 dark:text-amber-400">
                                            {formatCurrency(order.totalAmount)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Items</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            {order.orderItems.length} item{order.orderItems.length !== 1 ? 's' : ''}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Shipping To</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            {order.shippingCity}, {order.shippingState}
                                        </p>
                                    </div>
                                </div>

                                {order.trackingNumber && (
                                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Tracking: <span className="font-mono font-semibold text-gray-900 dark:text-white">{order.trackingNumber}</span>
                                        </p>
                                    </div>
                                )}

                                <div className="mt-4">
                                    <span className="text-amber-600 dark:text-amber-400 text-sm font-semibold">
                                        View Details →
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function OrderHistoryPage() {
    return (
        <ProtectedRoute>
            <OrderHistoryContent />
        </ProtectedRoute>
    );
}
