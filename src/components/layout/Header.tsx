'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/cartStore';
import { useAuthStore } from '@/lib/store/authStore';
import CartDrawer from '@/components/cart/CartDrawer';
import NotificationCenter from '@/components/notifications/NotificationCenter';

export default function Header() {
    const { user } = useAuthStore();
    const { getTotalItems } = useCartStore();
    const [isCartOpen, setIsCartOpen] = useState(false);
    const totalItems = getTotalItems();

    return (
        <>
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2">
                            <span className="text-2xl">🍯</span>
                            <span className="text-xl font-bold text-gray-900 dark:text-white">
                                ShahdCooperative
                            </span>
                        </Link>

                        {/* Navigation */}
                        <nav className="hidden md:flex items-center gap-6">
                            <Link
                                href="/products"
                                className="text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 font-medium transition-colors"
                            >
                                Products
                            </Link>
                            <Link
                                href="/about"
                                className="text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 font-medium transition-colors"
                            >
                                About
                            </Link>
                            <Link
                                href="/contact"
                                className="text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 font-medium transition-colors"
                            >
                                Contact
                            </Link>
                        </nav>

                        {/* Actions */}
                        <div className="flex items-center gap-4">
                            {user ? (
                                <>
                                    <NotificationCenter />

                                    {/* Cart Button */}
                                    <button
                                        onClick={() => setIsCartOpen(true)}
                                        className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                        {totalItems > 0 && (
                                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                                {totalItems}
                                            </span>
                                        )}
                                    </button>

                                    {/* User Menu */}
                                    <div className="relative group">
                                        <Link href="/dashboard" className="flex items-center gap-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                                            <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center font-bold">
                                                {user.firstName?.[0]}
                                            </div>
                                        </Link>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => setIsCartOpen(true)}
                                        className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                        {totalItems > 0 && (
                                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                                {totalItems}
                                            </span>
                                        )}
                                    </button>
                                    <Link
                                        href="/login"
                                        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors"
                                    >
                                        Login
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Cart Drawer */}
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </>
    );
}
