'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterFormData } from '@/lib/utils/validation';
import { register as registerUser, getErrorMessage } from '@/lib/api/auth';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';

export default function RegisterForm() {
    const router = useRouter();
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const password = watch('password', '');

    // Calculate password strength
    useEffect(() => {
        const calculatePasswordStrength = (pass: string): number => {
            let strength = 0;
            if (pass.length >= 8) strength++;
            if (/[A-Z]/.test(pass)) strength++;
            if (/[a-z]/.test(pass)) strength++;
            if (/[0-9]/.test(pass)) strength++;
            if (/[^A-Za-z0-9]/.test(pass)) strength++;
            return strength;
        };

        setPasswordStrength(calculatePasswordStrength(password));
    }, [password]);

    const getStrengthText = (strength: number): string => {
        if (strength === 0) return '';
        if (strength <= 2) return 'Weak';
        if (strength === 3) return 'Fair';
        if (strength === 4) return 'Good';
        return 'Strong';
    };

    const getStrengthColor = (strength: number): string => {
        if (strength === 0) return 'bg-border-light dark:bg-border-dark';
        if (strength <= 2) return 'bg-danger';
        if (strength === 3) return 'bg-warning';
        if (strength === 4) return 'bg-info';
        return 'bg-success';
    };

    const onSubmit = async (data: RegisterFormData) => {
        setError('');
        setSuccess('');
        setIsLoading(true);

        try {
            const response = await registerUser(data);
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

    return (
        <Card variant="elevated" padding="lg" className="w-full max-w-lg relative z-10 backdrop-blur-custom">
            {/* Title */}
            <div className="text-center mb-8">
                <h1 className="font-serif text-4xl font-bold text-text-light dark:text-text-dark">
                    Create Your Account
                </h1>
                <p className="text-text-muted-light dark:text-text-muted-dark mt-3">
                    Join the ShahdCooperative community.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Full Name */}
                <Input
                    label="Full Name"
                    type="text"
                    {...register('firstName')}
                    error={errors.firstName?.message}
                    placeholder="Enter your full name"
                    fullWidth
                />

                {/* Email */}
                <Input
                    label="Email Address"
                    type="email"
                    {...register('email')}
                    error={errors.email?.message}
                    placeholder="Enter your email address"
                    fullWidth
                />

                {/* Phone Number (Optional) */}
                <Input
                    label="Phone Number (Optional)"
                    type="tel"
                    {...register('phoneNumber')}
                    error={errors.phoneNumber?.message}
                    placeholder="+1234567890"
                    fullWidth
                />

                {/* Password */}
                <div>
                    <Input
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        {...register('password')}
                        error={errors.password?.message}
                        placeholder="8+ characters"
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

                    {/* Password Strength Indicator */}
                    {password && (
                        <div className="mt-2">
                            <div className="flex items-center gap-1 mb-1">
                                {[...Array(5)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-1.5 flex-1 rounded-full ${
                                            i < passwordStrength
                                                ? getStrengthColor(passwordStrength)
                                                : 'bg-border-light dark:bg-border-dark'
                                        }`}
                                    />
                                ))}
                            </div>
                            <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                                Strength:{' '}
                                <span className="font-semibold">{getStrengthText(passwordStrength)}</span>
                            </p>
                        </div>
                    )}
                </div>

                {/* Confirm Password */}
                <Input
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...register('confirmPassword')}
                    error={errors.confirmPassword?.message}
                    placeholder="Re-enter your password"
                    rightIcon={
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="cursor-pointer hover:text-golden-honey transition-colors"
                        >
                            <span className="material-symbols-outlined text-xl">
                                {showConfirmPassword ? 'visibility_off' : 'visibility'}
                            </span>
                        </button>
                    }
                    fullWidth
                />

                {/* Terms and Conditions */}
                <div className="flex items-start gap-3">
                    <input
                        id="terms"
                        type="checkbox"
                        required
                        className="mt-1 h-4 w-4 rounded border-border-light dark:border-border-dark text-golden-honey focus:ring-golden-honey"
                    />
                    <label htmlFor="terms" className="text-sm text-text-light dark:text-text-dark">
                        I agree to the{' '}
                        <Link href="/terms" className="text-golden-honey hover:underline font-medium">
                            Terms and Conditions
                        </Link>{' '}
                        and{' '}
                        <Link href="/privacy" className="text-golden-honey hover:underline font-medium">
                            Privacy Policy
                        </Link>
                    </label>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="p-3 bg-danger/10 border border-danger/20 rounded-lg text-danger text-sm flex items-center gap-2">
                        <span className="material-symbols-outlined text-base">error</span>
                        {error}
                    </div>
                )}

                {/* Success Message */}
                {success && (
                    <div className="p-3 bg-success/10 border border-success/20 rounded-lg text-success text-sm flex items-center gap-2">
                        <span className="material-symbols-outlined text-base">check_circle</span>
                        <div>
                            {success}
                            <p className="mt-1 text-xs">Redirecting to login...</p>
                        </div>
                    </div>
                )}

                {/* Submit Button */}
                <Button type="submit" fullWidth size="lg" loading={isLoading} disabled={!!success}>
                    Create Account
                </Button>
            </form>

            {/* Sign In Link */}
            <p className="mt-8 text-center text-sm text-text-muted-light dark:text-text-muted-dark">
                Already have an account?{' '}
                <Link href="/login" className="font-bold text-deep-moss-green dark:text-forest-green hover:underline">
                    Log in
                </Link>
            </p>
        </Card>
    );
}
