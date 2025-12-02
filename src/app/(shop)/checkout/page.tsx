'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { shippingAddressSchema, type ShippingAddressFormData } from '@/lib/utils/validation';
import { useCartStore } from '@/lib/store/cartStore';
import { useAuthStore } from '@/lib/store/authStore';
import { createOrder } from '@/lib/api/orders';
import { formatCurrency } from '@/lib/utils/helpers';
import { getErrorMessage } from '@/lib/api/auth';

export default function CheckoutPage() {
    const router = useRouter();
    const { user, isAuthenticated } = useAuthStore();
    const { items, getTotalItems, getTotalPrice, clearCart } = useCartStore();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ShippingAddressFormData>({
        resolver: zodResolver(shippingAddressSchema),
    });

    // Redirect if not authenticated
    if (!isAuthenticated || !user) {
        router.push('/login?redirect=/checkout');
        return null;
    }

    // Redirect if cart is empty
    if (items.length === 0) {
        router.push('/products');
        return null;
    }

    const onSubmit = async (data: ShippingAddressFormData) => {
        setError('');
        setIsLoading(true);

        try {
            const orderData = {
                customerId: user.id,
                orderItems: items.map(item => ({
                    productId: item.product.productId,
                    quantity: item.quantity,
                })),
                ...data,
            };

            const order = await createOrder(orderData);

            // Clear cart and redirect to success page
            clearCart();
            router.push(`/orders/${order.orderId}?success=true`);
        } catch (err) {
            setError(getErrorMessage(err));
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Shipping Address Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                                Shipping Address
                            </h2>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                {/* Street */}
                                <div>
                                    <label htmlFor="shippingStreet" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                                        Street Address *
                                    </label>
                                    <input
                                        id="shippingStreet"
                                        type="text"
                                        {...register('shippingStreet')}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="123 Main St"
                                    />
                                    {errors.shippingStreet && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.shippingStreet.message}</p>
                                    )}
                                </div>

                                {/* City & State */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="shippingCity" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                                            City *
                                        </label>
                                        <input
                                            id="shippingCity"
                                            type="text"
                                            {...register('shippingCity')}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            placeholder="New York"
                                        />
                                        {errors.shippingCity && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.shippingCity.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="shippingState" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                                            State/Province *
                                        </label>
                                        <input
                                            id="shippingState"
                                            type="text"
                                            {...register('shippingState')}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            placeholder="NY"
                                        />
                                        {errors.shippingState && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.shippingState.message}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Postal Code & Country */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="shippingPostalCode" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                                            Postal Code *
                                        </label>
                                        <input
                                            id="shippingPostalCode"
                                            type="text"
                                            {...register('shippingPostalCode')}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            placeholder="10001"
                                        />
                                        {errors.shippingPostalCode && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.shippingPostalCode.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="shippingCountry" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                                            Country *
                                        </label>
                                        <input
                                            id="shippingCountry"
                                            type="text"
                                            {...register('shippingCountry')}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            placeholder="USA"
                                        />
                                        {errors.shippingCountry && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.shippingCountry.message}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                                        {error}
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-lg transition-colors disabled:cursor-not-allowed text-lg shadow-lg mt-6"
                                >
                                    {isLoading ? 'Processing Order...' : 'Place Order'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-8">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                                Order Summary
                            </h2>

                            {/* Items */}
                            <div className="space-y-4 mb-6">
                                {items.map((item) => (
                                    <div key={item.product.productId} className="flex gap-3">
                                        <div className="w-16 h-16 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                                            {item.product.imageUrl ? (
                                                <img
                                                    src={item.product.imageUrl}
                                                    alt={item.product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                                {item.product.name}
                                            </h3>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                                Qty: {item.quantity} × {formatCurrency(item.product.price)}
                                            </p>
                                            <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">
                                                {formatCurrency(item.product.price * item.quantity)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Subtotal ({getTotalItems()} items)</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(getTotalPrice())}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                                    <span className="font-semibold text-green-600 dark:text-green-400">Free</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
                                    <span className="text-gray-900 dark:text-white">Total</span>
                                    <span className="text-amber-600 dark:text-amber-400">{formatCurrency(getTotalPrice())}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
