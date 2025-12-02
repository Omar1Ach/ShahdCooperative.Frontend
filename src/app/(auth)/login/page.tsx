import LoginForm from '@/components/auth/LoginForm';

export const metadata = {
    title: 'Login - ShahdCooperative',
    description: 'Sign in to your ShahdCooperative account',
};

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 p-4">
            <LoginForm />
        </div>
    );
}
