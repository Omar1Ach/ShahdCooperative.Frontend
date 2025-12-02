import { Order, OrderStatus } from '@/types/order';
import { formatDate } from '@/lib/utils/helpers';

interface OrderTimelineProps {
    order: Order;
}

export default function OrderTimeline({ order }: OrderTimelineProps) {
    const steps = [
        { status: 'Pending', label: 'Order Placed', icon: '📝' },
        { status: 'Confirmed', label: 'Confirmed', icon: '✅' },
        { status: 'Shipped', label: 'Shipped', icon: '📦' },
        { status: 'Delivered', label: 'Delivered', icon: '🎉' },
    ];

    const statusIndex = {
        Pending: 0,
        Confirmed: 1,
        Shipped: 2,
        Delivered: 3,
        Cancelled: -1,
    };

    const currentIndex = statusIndex[order.status as keyof typeof statusIndex];
    const isCancelled = order.status === 'Cancelled';

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Order Timeline</h2>

            {isCancelled ? (
                <div className="text-center py-8">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-red-600 dark:text-red-400">Order Cancelled</h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        This order was cancelled on {formatDate(order.orderDate, 'long')}
                    </p>
                </div>
            ) : (
                <div className="relative">
                    {/* Progress Bar */}
                    <div className="absolute top-8 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700">
                        <div
                            className="h-full bg-amber-600 dark:bg-amber-400 transition-all duration-500"
                            style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
                        />
                    </div>

                    {/* Steps */}
                    <div className="relative flex justify-between">
                        {steps.map((step, index) => {
                            const isComplete = index <= currentIndex;
                            const isCurrent = index === currentIndex;

                            return (
                                <div key={step.status} className="flex flex-col items-center flex-1">
                                    {/* Circle */}
                                    <div
                                        className={`w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${isComplete
                                                ? 'bg-amber-600 dark:bg-amber-400 border-amber-600 dark:border-amber-400 text-white'
                                                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400'
                                            } ${isCurrent ? 'scale-110 shadow-lg' : ''}`}
                                    >
                                        <span className="text-2xl">{step.icon}</span>
                                    </div>

                                    {/* Label */}
                                    <div className="mt-4 text-center">
                                        <p
                                            className={`font-semibold ${isComplete
                                                    ? 'text-gray-900 dark:text-white'
                                                    : 'text-gray-500 dark:text-gray-400'
                                                }`}
                                        >
                                            {step.label}
                                        </p>
                                        {isComplete && (
                                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                                {formatDate(order.orderDate, 'short')}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Tracking Number */}
                    {order.trackingNumber && currentIndex >= 2 && (
                        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                            <p className="text-sm text-blue-800 dark:text-blue-200 mb-1">
                                <span className="font-semibold">Tracking Number:</span>
                            </p>
                            <p className="font-mono font-bold text-lg text-blue-900 dark:text-blue-100">
                                {order.trackingNumber}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
