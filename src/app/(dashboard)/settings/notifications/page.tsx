'use client';

import { useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

function NotificationSettingsContent() {
    const [preferences, setPreferences] = useState({
        emailOrders: true,
        emailPromotions: false,
        emailSecurity: true,
        smsOrders: false,
        smsSecurity: true,
        pushOrders: true,
        pushPromotions: true,
    });

    const [isSaving, setIsSaving] = useState(false);
    const [success, setSuccess] = useState('');

    const handleToggle = (key: keyof typeof preferences) => {
        setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSuccess('Preferences saved successfully');
        setIsSaving(false);
        setTimeout(() => setSuccess(''), 3000);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Notification Settings</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Sidebar Navigation */}
                    <div className="space-y-2">
                        <Link
                            href="/settings"
                            className="block px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            Security
                        </Link>
                        <Link
                            href="/settings/notifications"
                            className="block px-4 py-2 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 font-medium rounded-lg"
                        >
                            Notifications
                        </Link>
                        <Link
                            href="/settings/2fa"
                            className="block px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            Two-Factor Auth
                        </Link>
                    </div>

                    {/* Main Content */}
                    <div className="md:col-span-2">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                            {success && (
                                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-600 dark:text-green-400">
                                    ✓ {success}
                                </div>
                            )}

                            <div className="space-y-8">
                                {/* Email Notifications */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        Email Notifications
                                    </h3>
                                    <div className="space-y-4">
                                        <label className="flex items-center justify-between cursor-pointer">
                                            <span className="text-gray-700 dark:text-gray-300">Order updates</span>
                                            <input
                                                type="checkbox"
                                                checked={preferences.emailOrders}
                                                onChange={() => handleToggle('emailOrders')}
                                                className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500 border-gray-300"
                                            />
                                        </label>
                                        <label className="flex items-center justify-between cursor-pointer">
                                            <span className="text-gray-700 dark:text-gray-300">Promotions and offers</span>
                                            <input
                                                type="checkbox"
                                                checked={preferences.emailPromotions}
                                                onChange={() => handleToggle('emailPromotions')}
                                                className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500 border-gray-300"
                                            />
                                        </label>
                                        <label className="flex items-center justify-between cursor-pointer">
                                            <span className="text-gray-700 dark:text-gray-300">Security alerts</span>
                                            <input
                                                type="checkbox"
                                                checked={preferences.emailSecurity}
                                                onChange={() => handleToggle('emailSecurity')}
                                                className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500 border-gray-300"
                                            />
                                        </label>
                                    </div>
                                </div>

                                <hr className="border-gray-200 dark:border-gray-700" />

                                {/* SMS Notifications */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        </svg>
                                        SMS Notifications
                                    </h3>
                                    <div className="space-y-4">
                                        <label className="flex items-center justify-between cursor-pointer">
                                            <span className="text-gray-700 dark:text-gray-300">Order delivery updates</span>
                                            <input
                                                type="checkbox"
                                                checked={preferences.smsOrders}
                                                onChange={() => handleToggle('smsOrders')}
                                                className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500 border-gray-300"
                                            />
                                        </label>
                                        <label className="flex items-center justify-between cursor-pointer">
                                            <span className="text-gray-700 dark:text-gray-300">Security verification (2FA)</span>
                                            <input
                                                type="checkbox"
                                                checked={preferences.smsSecurity}
                                                onChange={() => handleToggle('smsSecurity')}
                                                className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500 border-gray-300"
                                            />
                                        </label>
                                    </div>
                                </div>

                                <hr className="border-gray-200 dark:border-gray-700" />

                                {/* Push Notifications */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                        </svg>
                                        Push Notifications
                                    </h3>
                                    <div className="space-y-4">
                                        <label className="flex items-center justify-between cursor-pointer">
                                            <span className="text-gray-700 dark:text-gray-300">Order status changes</span>
                                            <input
                                                type="checkbox"
                                                checked={preferences.pushOrders}
                                                onChange={() => handleToggle('pushOrders')}
                                                className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500 border-gray-300"
                                            />
                                        </label>
                                        <label className="flex items-center justify-between cursor-pointer">
                                            <span className="text-gray-700 dark:text-gray-300">New product arrivals</span>
                                            <input
                                                type="checkbox"
                                                checked={preferences.pushPromotions}
                                                onChange={() => handleToggle('pushPromotions')}
                                                className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500 border-gray-300"
                                            />
                                        </label>
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:cursor-not-allowed"
                                    >
                                        {isSaving ? 'Saving Preferences...' : 'Save Preferences'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function NotificationSettingsPage() {
    return (
        <ProtectedRoute>
            <NotificationSettingsContent />
        </ProtectedRoute>
    );
}
