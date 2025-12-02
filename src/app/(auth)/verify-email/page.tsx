'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { confirmEmail, getErrorMessage } from '@/lib/api/auth';

export default function EmailVerificationPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState<string>('');

    const userId = searchParams.get('userId');
    const token = searchParams.get('token');

    useEffect(() => {
        const verifyEmail = async () => {
            if (!userId || !token) {
                setStatus('error');
                setMessage('Invalid verification link. Missing required parameters.');
                return;
            }

            try {
                const response = await confirmEmail(userId, token);
                setStatus('success');
                setMessage(response.message);

                // Redirect to login after 3 seconds
                setTimeout(() => {
                    router.push('/login');
                }, 3000);
            } catch (err) {
                setStatus('error');
                setMessage(getErrorMessage(err));
            }
        };

        verifyEmail();
    }, [userId, token, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 p-4">
            <div className="w-full max-w-md mx-auto p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl text-center">
                {status === 'loading' && (
                    <>
                        <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Verifying Email...
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300">
                            Please wait while we confirm your email address
                        </p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                            Email Verified!
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            {message}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Redirecting to login...
                        </p>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
                            Verification Failed
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            {message}
                        </p>
                        <a
                            href="/login"
                            className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                        >
                            Go to Login
                        </a>
                    </>
                )}
            </div>
        </div>
    );
}
