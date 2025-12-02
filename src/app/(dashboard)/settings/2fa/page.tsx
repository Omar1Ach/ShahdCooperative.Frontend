import ProtectedRoute from '@/components/auth/ProtectedRoute';
import TwoFactorSetup from '@/components/auth/TwoFactorSetup';

export const metadata = {
    title: 'Two-Factor Authentication - ShahdCooperative',
    description: 'Manage your two-factor authentication settings',
};

export default function TwoFactorPage() {
    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
                <div className="max-w-2xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Account Security</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your security settings</p>
                    </div>

                    <TwoFactorSetup />
                </div>
            </div>
        </ProtectedRoute>
    );
}
