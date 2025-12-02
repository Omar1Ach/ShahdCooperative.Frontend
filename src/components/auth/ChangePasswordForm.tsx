'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { changePassword } from '@/lib/api/auth';
import { getErrorMessage } from '@/lib/api/auth';

const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character'),
    confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ["confirmNewPassword"],
});

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ChangePasswordFormData>({
        resolver: zodResolver(changePasswordSchema),
    });

    const onSubmit = async (data: ChangePasswordFormData) => {
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            await changePassword(data.currentPassword, data.newPassword);
            setSuccess('Password changed successfully');
            reset();
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {success && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-600 dark:text-green-400">
                    ✓ {success}
                </div>
            )}

            {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
                    {error}
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Current Password
                </label>
                <input
                    type="password"
                    {...register('currentPassword')}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                {errors.currentPassword && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.currentPassword.message}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    New Password
                </label>
                <input
                    type="password"
                    {...register('newPassword')}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                {errors.newPassword && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.newPassword.message}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Confirm New Password
                </label>
                <input
                    type="password"
                    {...register('confirmNewPassword')}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                {errors.confirmNewPassword && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmNewPassword.message}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:cursor-not-allowed"
            >
                {isLoading ? 'Changing Password...' : 'Change Password'}
            </button>
        </form>
    );
}
