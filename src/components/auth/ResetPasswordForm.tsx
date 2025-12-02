'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema, type ResetPasswordFormData } from '@/lib/utils/validation';
import { resetPassword, getErrorMessage } from '@/lib/api/auth';

export default function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    const email = searchParams.get('email') || '';
    const token = searchParams.get('token') || '';

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            email,
            token,
        },
    });

    const password = watch('newPassword', '');

    const onSubmit = async (data: ResetPasswordFormData) => {
        setError('');
        setSuccess('');
        setIsLoading(true);

        try {
            const response = await resetPassword(data);
            setSuccess(response.message);

            // Redirect to login after 2 seconds
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } catch (err) {
            setError(getErrorMessage(err));
            setIsLoading(false);
        }
    };

    if (!email || !token) {
        return (
            <div className="w-full max-w-md mx-auto p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl text-center">
                <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Invalid Reset Link</h1>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    This password reset link is invalid or has expired.
                </p>
                <a
                    href="/forgot-password"
                    className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                    Request New Link
                </a>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md mx-auto p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reset Password</h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2">Enter your new password</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <input type="hidden" {...register('email')} />
                <input type="hidden" {...register('token')} />

                <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                        New Password
                    </label>
                    <input
                        id="newPassword"
                        type="password"
                        {...register('newPassword')}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="••••••••"
                    />
                    {errors.newPassword && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.newPassword.message}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                        Confirm New Password
                    </label>
                    <input
                        id="confirmPassword"
                        type="password"
                        {...register('confirmPassword')}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="••••••••"
                    />
                    {errors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword.message}</p>
                    )}
                </div>

                {error && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-600 dark:text-green-400 text-sm">
                        {success}
                        <p className="mt-1 text-xs">Redirecting to login...</p>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading || !!success}
                    className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-lg disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Resetting Password...' : 'Reset Password'}
                </button>
            </form>
        </div>
    );
}
