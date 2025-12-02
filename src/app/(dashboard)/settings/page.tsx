'use client';

import Link from 'next/link';
import ChangePasswordForm from '@/components/auth/ChangePasswordForm';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

function SettingsContent() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Account Settings</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Sidebar Navigation */}
                    <div className="space-y-2">
                        <Link
                            href="/settings"
                            className="block px-4 py-2 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 font-medium rounded-lg"
                        >
                            Security
                        </Link>
                        <Link
                            href="/settings/notifications"
                            className="block px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
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
                    <div className="md:col-span-2 space-y-8">
                        {/* Change Password Section */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Change Password</h2>
                            <ChangePasswordForm />
                        </div>

                        {/* Delete Account Section (Placeholder) */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                            <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4">Danger Zone</h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Once you delete your account, there is no going back. Please be certain.
                            </p>
                            <button
                                className="px-6 py-3 border border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 font-bold rounded-lg transition-colors"
                                onClick={() => alert('Feature coming soon')}
                            >
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SettingsPage() {
    return (
        <ProtectedRoute>
            <SettingsContent />
        </ProtectedRoute>
    );
}
