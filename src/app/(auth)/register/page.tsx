import RegisterForm from '@/components/auth/RegisterForm';

export const metadata = {
    title: 'Register - ShahdCooperative',
    description: 'Create a new ShahdCooperative account',
};

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 p-4">
            <RegisterForm />
        </div>
    );
}
