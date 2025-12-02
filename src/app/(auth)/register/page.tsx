import RegisterForm from '@/components/auth/RegisterForm';

export const metadata = {
    title: 'Register - ShahdCooperative',
    description: 'Create a new ShahdCooperative account',
};

export default function RegisterPage() {
    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden p-6 sm:p-8 bg-hex-pattern bg-background-light dark:bg-background-dark">
            {/* Hexagon background pattern */}
            <div className="absolute inset-0 z-0 h-full w-full opacity-5 dark:opacity-[0.03]" />
            <RegisterForm />
        </div>
    );
}
