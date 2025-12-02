'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getOrderById, cancelOrder } from '@/lib/api/orders';
import { Order } from '@/types/order';
import { formatCurrency, formatDate } from '@/lib/utils/helpers';
import { ORDER_STATUS_LABELS } from '@/lib/utils/constants';
import { getErrorMessage } from '@/lib/api/auth';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

interface OrderDetailPageProps {
    params: {
        id: string;
    };
}

function OrderDetailContent({ params }: OrderDetailPageProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [isCancelling, setIsCancelling] = useState(false);
    const showSuccess = searchParams.get('success') === 'true';

    useEffect(() => {
        loadOrder();
    }, [params.id]);

    const loadOrder = async () => {
        setIsLoading(true);
        setError('');

        try {
            const data = await getOrderById(params.id);
            setOrder(data);
        } catch (err) {
            setError('Order not found');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelOrder = async () => {
        if (!confirm('Are you sure you want to cancel this order?')) return;

        setIsCancelling(true);
        setError('');

        try {
            await cancelOrder(params.id);
            loadOrder(); // Reload to show updated status
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setIsCancelling(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-300">Loading order...</p>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Order Not Found</h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
                    <button
                        onClick={() => router.push('/orders')}
                        className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                        Back to Orders
                    </button>
                </div>
            </div>
        );
    }

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

    const canCancel = order.status === 'Pending' || order.status === 'Confirmed';

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Success Message */}
                {showSuccess && (
                    <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-600 dark:text-green-400">
                        ✓ Order placed successfully! We'll send you updates via email.
                    </div>
                )}

                {/* Back Button */}
                <button
                    onClick={() => router.push('/orders')}
                    className="mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Orders
                </button>

                {/* Order Header */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Order #{order.orderNumber}
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Placed on {formatDate(order.orderDate, 'long')}
                            </p>
                        </div>
                        <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(order.status)}`}>
                            {ORDER_STATUS_LABELS[order.status as keyof typeof ORDER_STATUS_LABELS]}
                        </span>
                    </div>

                    {order.trackingNumber && (
                        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Tracking Number</p>
                            <p className="font-mono font-bold text-lg text-gray-900 dark:text-white">
                                {order.trackingNumber}
                            </p>
                        </div>
                    )}
                </div>

                {/* Order Items */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Order Items</h2>
                    <div className="space-y-4">
                        {order.orderItems.map((item) => (
                            <div key={item.orderItemId} className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                        {item.productName || `Product ID: ${item.productId}`}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Quantity: {item.quantity} × {formatCurrency(item.unitPrice)}
                                    </p>
                                </div>
                                <p className="font-bold text-lg text-gray-900 dark:text-white">
                                    {formatCurrency(item.subtotal)}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between text-2xl font-bold">
                            <span className="text-gray-900 dark:text-white">Total</span>
                            <span className="text-amber-600 dark:text-amber-400">{formatCurrency(order.totalAmount)}</span>
                        </div>
                    </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Shipping Address</h2>
                    <div className="text-gray-700 dark:text-gray-300">
                        <p>{order.shippingStreet}</p>
                        <p>{order.shippingCity}, {order.shippingState} {order.shippingPostalCode}</p>
                        <p>{order.shippingCountry}</p>
                    </div>
                </div>

                {/* Actions */}
                {canCancel && (
                    <div className="flex gap-4">
                        <button
                            onClick={handleCancelOrder}
                            disabled={isCancelling}
                            className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:cursor-not-allowed"
                        >
                            {isCancelling ? 'Cancelling...' : 'Cancel Order'}
                        </button>
                    </div>
                )}

                {error && (
                    <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function OrderDetailPage(props: OrderDetailPageProps) {
    return (
        <ProtectedRoute>
            <OrderDetailContent {...props} />
        </ProtectedRoute>
    );
}
