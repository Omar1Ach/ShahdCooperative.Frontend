import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

export const metadata = {
    title: 'Forgot Password - ShahdCooperative',
    description: 'Reset your ShahdCooperative account password',
};

export default function ForgotPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 p-4">
            <ForgotPasswordForm />
        </div>
    );
}
