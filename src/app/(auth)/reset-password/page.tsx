import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

export const metadata = {
    title: 'Reset Password - ShahdCooperative',
    description: 'Set a new password for your account',
};

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 p-4">
            <ResetPasswordForm />
        </div>
    );
}
