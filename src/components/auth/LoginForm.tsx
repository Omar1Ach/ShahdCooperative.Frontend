'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '@/lib/utils/validation';
import { login, loginWithGoogle, loginWithFacebook, getErrorMessage } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/store/authStore';
import { setAccessToken } from '@/lib/api/client';
import Logo from '../layout/Logo';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';

export default function LoginForm() {
    const router = useRouter();
    const { login: setAuth } = useAuthStore();
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [show2FA, setShow2FA] = useState(false);
    const [twoFactorCode, setTwoFactorCode] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        setError('');
        setIsLoading(true);

        try {
            const response = await login(data);

            // Check if 2FA is enabled
            if (response.user.twoFactorEnabled && !show2FA) {
                setShow2FA(true);
                setIsLoading(false);
                return;
            }

            // Store auth data
            setAccessToken(response.accessToken);
            setAuth(response.user, response.accessToken, response.refreshToken);

            // Redirect based on role
            if (response.user.role === 'Admin') {
                router.push('/admin/dashboard');
            } else {
                router.push('/products');
            }
        } catch (err) {
            setError(getErrorMessage(err));
            setIsLoading(false);
        }
    };

    const handle2FASubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // 2FA verification will be implemented in next iteration
        setError('2FA verification - coming soon');
    };

    if (show2FA) {
        return (
            <Card variant="elevated" padding="lg" className="w-full max-w-md relative z-10">
                <div className="text-center mb-6">
                    <h2 className="font-serif text-3xl font-bold text-text-light dark:text-text-dark">
                        Two-Factor Authentication
                    </h2>
                    <p className="text-text-muted-light dark:text-text-muted-dark mt-2">
                        Enter the 6-digit code from your authenticator app
                    </p>
                </div>

                <form onSubmit={handle2FASubmit} className="space-y-5">
                    <input
                        type="text"
                        maxLength={6}
                        placeholder="000000"
                        value={twoFactorCode}
                        onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                        className="w-full h-14 px-4 py-3 border-2 border-border-light dark:border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-honey/50 focus:border-golden-honey bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark text-center text-2xl tracking-widest font-mono"
                    />

                    {error && (
                        <div className="p-3 bg-danger/10 border border-danger/20 rounded-lg text-danger text-sm flex items-center gap-2">
                            <span className="material-symbols-outlined text-base">error</span>
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={twoFactorCode.length !== 6 || isLoading}
                        fullWidth
                        size="lg"
                        loading={isLoading}
                    >
                        Verify Code
                    </Button>

                    <button
                        type="button"
                        onClick={() => setShow2FA(false)}
                        className="w-full text-text-muted-light dark:text-text-muted-dark hover:text-golden-honey text-sm flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined text-base">arrow_back</span>
                        Back to login
                    </button>
                </form>
            </Card>
        );
    }

    return (
        <Card variant="elevated" padding="lg" className="w-full max-w-md relative z-10 backdrop-blur-custom">
            {/* Logo & Title */}
            <div className="flex flex-col items-center mb-8">
                <Logo variant="icon" size="lg" />
                <h1 className="font-serif text-4xl font-bold text-text-light dark:text-text-dark mt-4">
                    ShahdCooperative
                </h1>
                <p className="text-text-muted-light dark:text-text-muted-dark mt-3 text-center">
                    Welcome back, please log in to your account.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Email Input */}
                <Input
                    label="Email or Username"
                    type="email"
                    {...register('email')}
                    error={errors.email?.message}
                    placeholder="Enter your email or username"
                    leftIcon={<span className="material-symbols-outlined text-xl">person</span>}
                    fullWidth
                />

                {/* Password Input */}
                <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    error={errors.password?.message}
                    placeholder="Enter your password"
                    leftIcon={<span className="material-symbols-outlined text-xl">lock</span>}
                    rightIcon={
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="cursor-pointer hover:text-golden-honey transition-colors"
                        >
                            <span className="material-symbols-outlined text-xl">
                                {showPassword ? 'visibility_off' : 'visibility'}
                            </span>
                        </button>
                    }
                    fullWidth
                />

                {/* Forgot Password */}
                <div className="flex justify-end">
                    <Link
                        href="/forgot-password"
                        className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark hover:text-golden-honey transition-colors"
                    >
                        Forgot Password?
                    </Link>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="p-3 bg-danger/10 border border-danger/20 rounded-lg text-danger text-sm flex items-center gap-2">
                        <span className="material-symbols-outlined text-base">error</span>
                        {error}
                    </div>
                )}

                {/* Submit Button */}
                <Button type="submit" fullWidth size="lg" loading={isLoading}>
                    Login
                </Button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border-light dark:border-border-dark"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-card-light dark:bg-card-dark text-text-muted-light dark:text-text-muted-dark">
                        Or continue with
                    </span>
                </div>
            </div>

            {/* OAuth Buttons */}
            <div className="grid grid-cols-2 gap-4">
                <button
                    type="button"
                    onClick={loginWithGoogle}
                    className="flex items-center justify-center gap-2 h-12 px-4 border-2 border-border-light dark:border-border-dark rounded-lg hover:bg-border-light/50 dark:hover:bg-border-dark/50 transition-colors"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    <span className="text-sm font-medium text-text-light dark:text-text-dark">Google</span>
                </button>

                <button
                    type="button"
                    onClick={loginWithFacebook}
                    className="flex items-center justify-center gap-2 h-12 px-4 border-2 border-border-light dark:border-border-dark rounded-lg hover:bg-border-light/50 dark:hover:bg-border-dark/50 transition-colors"
                >
                    <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span className="text-sm font-medium text-text-light dark:text-text-dark">Facebook</span>
                </button>
            </div>

            {/* Sign Up Link */}
            <p className="mt-8 text-center text-sm text-text-muted-light dark:text-text-muted-dark">
                Don't have an account?{' '}
                <Link href="/register" className="font-bold text-golden-honey hover:underline">
                    Sign Up
                </Link>
            </p>
        </Card>
    );
}
