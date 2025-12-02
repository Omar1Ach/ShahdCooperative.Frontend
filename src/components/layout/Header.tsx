'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { useCartStore } from '@/lib/store/cartStore';
import { useAuthStore } from '@/lib/store/authStore';
import Logo from './Logo';
import Button from '../ui/Button';
import CartDrawer from '@/components/cart/CartDrawer';
import NotificationCenter from '@/components/notifications/NotificationCenter';

export default function Header() {
    const { user } = useAuthStore();
    const { getTotalItems } = useCartStore();
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const totalItems = getTotalItems();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/products', label: 'Shop' },
        { href: '/about', label: 'Our Story' },
        { href: '/contact', label: 'Contact' },
    ];

    return (
        <>
            <header
                className={clsx(
                    'sticky top-0 z-50 w-full transition-all duration-300 border-b',
                    isScrolled
                        ? 'bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-lg shadow-sm border-golden-honey/20'
                        : 'bg-transparent border-border-light/20 dark:border-border-dark/20'
                )}
            >
                <div className="container mx-auto px-4">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo */}
                        <Logo size="md" variant="full" />

                        {/* Desktop Navigation */}
                        <nav className="hidden items-center gap-6 md:flex">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={clsx(
                                        'text-sm font-medium transition-colors',
                                        pathname === link.href
                                            ? 'text-golden-honey'
                                            : 'text-text-light/80 dark:text-text-dark/80 hover:text-golden-honey'
                                    )}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                            {user ? (
                                <>
                                    <NotificationCenter />

                                    {/* Cart Button */}
                                    <button
                                        onClick={() => setIsCartOpen(true)}
                                        className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-border-light dark:bg-border-dark text-text-light dark:text-text-dark hover:bg-golden-honey/20 transition-colors"
                                        aria-label="Shopping cart"
                                    >
                                        <span className="material-symbols-outlined">shopping_cart</span>
                                        {totalItems > 0 && (
                                            <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-golden-honey text-xs font-bold text-text-light">
                                                {totalItems}
                                            </div>
                                        )}
                                    </button>

                                    {/* User Menu */}
                                    <Link
                                        href="/dashboard"
                                        className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-golden-honey/20 text-golden-honey font-bold hover:bg-golden-honey/30 transition-colors"
                                    >
                                        {user.firstName?.[0]}
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => setIsCartOpen(true)}
                                        className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-border-light dark:bg-border-dark text-text-light dark:text-text-dark hover:bg-golden-honey/20 transition-colors"
                                        aria-label="Shopping cart"
                                    >
                                        <span className="material-symbols-outlined">shopping_cart</span>
                                        {totalItems > 0 && (
                                            <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-golden-honey text-xs font-bold text-text-light">
                                                {totalItems}
                                            </div>
                                        )}
                                    </button>
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        className="hidden md:inline-flex"
                                        onClick={() => {
                                            window.location.href = '/login';
                                        }}
                                    >
                                        Join Us
                                    </Button>
                                </>
                            )}

                            {/* Mobile Menu Button */}
                            <button
                                className="md:hidden flex h-10 w-10 items-center justify-center rounded-lg bg-border-light dark:bg-border-dark text-text-light dark:text-text-dark"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                aria-label="Toggle menu"
                            >
                                <span className="material-symbols-outlined">
                                    {isMobileMenuOpen ? 'close' : 'menu'}
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {isMobileMenuOpen && (
                        <div className="md:hidden border-t border-border-light dark:border-border-dark py-4 animate-slide-in">
                            <nav className="flex flex-col gap-4">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={clsx(
                                            'text-base font-medium transition-colors px-4 py-2',
                                            pathname === link.href
                                                ? 'text-golden-honey bg-golden-honey/10 rounded-lg'
                                                : 'text-text-light dark:text-text-dark'
                                        )}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                {!user && (
                                    <Button variant="primary" size="md" fullWidth className="mt-2">
                                        Join Us
                                    </Button>
                                )}
                            </nav>
                        </div>
                    )}
                </div>
            </header>

            {/* Cart Drawer */}
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </>
    );
}
