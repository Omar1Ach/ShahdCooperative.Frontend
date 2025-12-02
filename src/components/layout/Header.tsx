'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/store/cartStore';
import Logo from './Logo';

export default function Header() {
    const router = useRouter();
    const { getTotalItems } = useCartStore();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const totalItems = getTotalItems();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border-light dark:border-border-dark bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-4">
                        <Logo variant="icon" size="sm" />
                        <h2 className="text-text-light dark:text-text-dark text-lg font-bold">
                            ShahdCooperative
                        </h2>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden items-center gap-9 md:flex">
                        <Link
                            href="/"
                            className="text-text-light dark:text-text-dark text-sm font-medium hover:text-golden-honey transition-colors"
                        >
                            Home
                        </Link>
                        <Link
                            href="/products"
                            className="text-text-light dark:text-text-dark text-sm font-medium hover:text-golden-honey transition-colors"
                        >
                            Shop
                        </Link>
                        <Link
                            href="/about"
                            className="text-text-light dark:text-text-dark text-sm font-medium hover:text-golden-honey transition-colors"
                        >
                            About Us
                        </Link>
                        <Link
                            href="/contact"
                            className="text-text-light dark:text-text-dark text-sm font-medium hover:text-golden-honey transition-colors"
                        >
                            Contact
                        </Link>
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        {/* Login Button - Desktop */}
                        <Link href="/login" className="hidden md:block">
                            <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-golden-honey hover:bg-golden-honey/90 text-text-light text-sm font-bold tracking-wide transition-colors">
                                <span>Log In</span>
                            </button>
                        </Link>

                        {/* Cart Button */}
                        <button
                            onClick={() => router.push('/cart')}
                            className="relative flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-border-light dark:bg-border-dark text-text-light dark:text-text-dark hover:bg-golden-honey/20 transition-colors"
                        >
                            <span className="material-symbols-outlined">shopping_cart</span>
                            {totalItems > 0 && (
                                <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-golden-honey text-xs font-bold text-text-light">
                                    {totalItems > 99 ? '99+' : totalItems}
                                </div>
                            )}
                        </button>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-border-light dark:bg-border-dark text-text-light dark:text-text-dark hover:bg-golden-honey/20 transition-colors"
                        >
                            <span className="material-symbols-outlined">
                                {isMobileMenuOpen ? 'close' : 'menu'}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-border-light dark:border-border-dark py-4">
                        <nav className="flex flex-col gap-4">
                            <Link
                                href="/"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-text-light dark:text-text-dark text-sm font-medium hover:text-golden-honey transition-colors"
                            >
                                Home
                            </Link>
                            <Link
                                href="/products"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-text-light dark:text-text-dark text-sm font-medium hover:text-golden-honey transition-colors"
                            >
                                Shop
                            </Link>
                            <Link
                                href="/about"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-text-light dark:text-text-dark text-sm font-medium hover:text-golden-honey transition-colors"
                            >
                                About Us
                            </Link>
                            <Link
                                href="/contact"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-text-light dark:text-text-dark text-sm font-medium hover:text-golden-honey transition-colors"
                            >
                                Contact
                            </Link>
                            <Link
                                href="/login"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-golden-honey text-sm font-bold"
                            >
                                Log In
                            </Link>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}
