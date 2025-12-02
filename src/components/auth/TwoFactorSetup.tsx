'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { enable2FA, disable2FA, verify2FA, getErrorMessage } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/store/authStore';

export default function TwoFactorSetup() {
    const { user } = useAuthStore();
    const [step, setStep] = useState<'initial' | 'qr' | 'verify' | 'success'>('initial');
    const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
    const [manualKey, setManualKey] = useState<string>('');
    const [verificationCode, setVerificationCode] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    const handleEnable2FA = async () => {
        setError('');
        setIsLoading(true);

        try {
            const response = await enable2FA();
            setQrCodeUrl(response.qrCodeUrl);
            setManualKey(response.manualEntryKey);
            setStep('qr');
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify2FA = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (!user) throw new Error('User not found');

            await verify2FA({ userId: user.id, code: verificationCode });
            setStep('success');
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setIsLoading(false);
        }
    };

    const handleDisable2FA = async () => {
        if (!confirm('Are you sure you want to disable Two-Factor Authentication?')) {
            return;
        }

        setError('');
        setIsLoading(true);

        try {
            await disable2FA();
            setStep('initial');
            setQrCodeUrl('');
            setManualKey('');
            setVerificationCode('');
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-300">Please log in to manage 2FA settings.</p>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Two-Factor Authentication
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
                Add an extra layer of security to your account
            </p>

            {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm mb-4">
                    {error}
                </div>
            )}

            {/* Initial State - Enable 2FA */}
            {step === 'initial' && !user.twoFactorEnabled && (
                <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="text-sm text-blue-800 dark:text-blue-200">
                            <p className="font-semibold mb-1">Enhance your account security</p>
                            <p>Two-Factor Authentication (2FA) adds an extra layer of protection by requiring a code from your phone in addition to your password.</p>
                        </div>
                    </div>

                    <button
                        onClick={handleEnable2FA}
                        disabled={isLoading}
                        className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Setting up...' : 'Enable Two-Factor Authentication'}
                    </button>
                </div>
            )}

            {/* QR Code Display */}
            {step === 'qr' && (
                <div className="space-y-6">
                    <div className="text-center">
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                            Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                        </p>
                        <div className="inline-block p-4 bg-white rounded-lg">
                            <QRCodeSVG value={qrCodeUrl} size={200} level="H" />
                        </div>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Can't scan the QR code? Enter this key manually:
                        </p>
                        <div className="flex items-center gap-2">
                            <code className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 text-sm font-mono text-gray-900 dark:text-white">
                                {manualKey}
                            </code>
                            <button
                                onClick={() => navigator.clipboard.writeText(manualKey)}
                                className="px-3 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded text-sm font-medium transition-colors"
                                title="Copy to clipboard"
                            >
                                📋
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={() => setStep('verify')}
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                        I've Scanned the QR Code
                    </button>
                </div>
            )}

            {/* Verification Step */}
            {step === 'verify' && (
                <form onSubmit={handleVerify2FA} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                            Enter the 6-digit code from your authenticator app
                        </label>
                        <input
                            type="text"
                            maxLength={6}
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                            placeholder="000000"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center text-2xl tracking-widest"
                            required
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => setStep('qr')}
                            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            Back
                        </button>
                        <button
                            type="submit"
                            disabled={verificationCode.length !== 6 || isLoading}
                            className="flex-1 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Verifying...' : 'Verify & Enable'}
                        </button>
                    </div>
                </form>
            )}

            {/* Success State */}
            {step === 'success' && (
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-green-600 dark:text-green-400">
                        2FA Enabled Successfully!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                        Your account is now protected with Two-Factor Authentication.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                        Done
                    </button>
                </div>
            )}

            {/* Already Enabled - Disable Option */}
            {step === 'initial' && user.twoFactorEnabled && (
                <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <svg className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="text-sm text-green-800 dark:text-green-200">
                            <p className="font-semibold mb-1">Two-Factor Authentication is enabled</p>
                            <p>Your account is protected with an extra layer of security.</p>
                        </div>
                    </div>

                    <button
                        onClick={handleDisable2FA}
                        disabled={isLoading}
                        className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Disabling...' : 'Disable Two-Factor Authentication'}
                    </button>
                </div>
            )}
        </div>
    );
}
