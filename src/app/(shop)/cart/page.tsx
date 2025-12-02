'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/store/cartStore';
import { formatCurrency } from '@/lib/utils/helpers';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function CartPage() {
    const router = useRouter();
    const { items, updateQuantity, removeItem, getTotalPrice, getTotalItems } = useCartStore();
    const [removingId, setRemovingId] = useState<string | null>(null);

    const subtotal = getTotalPrice();
    const totalItems = getTotalItems();

    const handleQuantityChange = (productId: string, newQuantity: number) => {
        if (newQuantity >= 1) {
            updateQuantity(productId, newQuantity);
        }
    };

    const handleRemoveItem = (productId: string) => {
        setRemovingId(productId);
        setTimeout(() => {
            removeItem(productId);
            setRemovingId(null);
        }, 200);
    };

    const handleCheckout = () => {
        router.push('/checkout');
    };

    // Empty cart state
    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-background-light dark:bg-background-dark">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Breadcrumb
                        items={[
                            { label: 'Home', href: '/' },
                            { label: 'Shop', href: '/products' },
                            { label: 'Cart' },
                        ]}
                    />

                    <h1 className="font-serif text-4xl md:text-5xl font-bold text-text-light dark:text-text-dark mb-8">
                        Your Shopping Cart
                    </h1>

                    <Card padding="lg" className="text-center py-16">
                        <span className="material-symbols-outlined text-text-muted-light dark:text-text-muted-dark mb-4 mx-auto block" style={{ fontSize: '6rem' }}>
                            shopping_cart
                        </span>
                        <h3 className="text-2xl font-serif font-bold text-text-light dark:text-text-dark mb-3">
                            Your cart is empty
                        </h3>
                        <p className="text-text-muted-light dark:text-text-muted-dark max-w-md mx-auto mb-6">
                            Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
                        </p>
                        <Link href="/products">
                            <Button size="lg">
                                <span className="material-symbols-outlined text-base">storefront</span>
                                Continue Shopping
                            </Button>
                        </Link>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
                {/* Breadcrumbs */}
                <Breadcrumb
                    items={[
                        { label: 'Home', href: '/' },
                        { label: 'Shop', href: '/products' },
                        { label: 'Cart' },
                    ]}
                />

                {/* Page Title */}
                <h1 className="font-serif text-4xl md:text-5xl font-bold text-text-light dark:text-text-dark mb-8">
                    Your Shopping Cart
                </h1>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <Card padding="none" className="divide-y divide-border-light dark:divide-border-dark">
                            {items.map((item) => (
                                <div
                                    key={item.product.productId}
                                    className={`flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between transition-all ${
                                        removingId === item.product.productId ? 'opacity-50 scale-95' : ''
                                    }`}
                                >
                                    {/* Product Info */}
                                    <div className="flex items-start gap-4">
                                        {/* Product Image */}
                                        <Link href={`/products/${item.product.productId}`}>
                                            <div className="relative h-24 w-24 shrink-0 rounded-lg overflow-hidden bg-border-light dark:bg-border-dark cursor-pointer hover:opacity-80 transition-opacity">
                                                {item.product.imageUrl ? (
                                                    <Image
                                                        src={item.product.imageUrl}
                                                        alt={item.product.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-text-muted-light dark:text-text-muted-dark">
                                                        <span className="material-symbols-outlined" style={{ fontSize: '3rem' }}>
                                                            image
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </Link>

                                        {/* Product Details */}
                                        <div className="flex flex-1 flex-col justify-center">
                                            <Link href={`/products/${item.product.productId}`}>
                                                <p className="text-base font-medium text-text-light dark:text-text-dark hover:text-golden-honey transition-colors cursor-pointer">
                                                    {item.product.name}
                                                </p>
                                            </Link>
                                            <p className="text-sm font-normal text-text-muted-light dark:text-text-muted-dark">
                                                {item.product.category}
                                            </p>
                                            <p className="mt-1 text-sm font-normal text-text-muted-light dark:text-text-muted-dark">
                                                {formatCurrency(item.product.price)} each
                                            </p>
                                            {item.product.stockQuantity < item.quantity && (
                                                <p className="mt-1 text-sm font-medium text-warning flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-xs">warning</span>
                                                    Only {item.product.stockQuantity} in stock
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Quantity & Actions */}
                                    <div className="flex shrink-0 items-center justify-between gap-4 sm:justify-end">
                                        {/* Quantity Selector */}
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleQuantityChange(item.product.productId, item.quantity - 1)}
                                                className="flex h-8 w-8 items-center justify-center rounded-full bg-border-light dark:bg-border-dark text-text-light dark:text-text-dark cursor-pointer hover:bg-golden-honey/20 transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-base">remove</span>
                                            </button>
                                            <input
                                                type="number"
                                                min="1"
                                                max={item.product.stockQuantity}
                                                value={item.quantity}
                                                onChange={(e) => handleQuantityChange(item.product.productId, parseInt(e.target.value) || 1)}
                                                className="w-12 border-none bg-transparent p-0 text-center text-base font-medium text-text-light dark:text-text-dark focus:outline-0 focus:ring-0 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                            />
                                            <button
                                                onClick={() => handleQuantityChange(item.product.productId, item.quantity + 1)}
                                                disabled={item.quantity >= item.product.stockQuantity}
                                                className="flex h-8 w-8 items-center justify-center rounded-full bg-border-light dark:bg-border-dark text-text-light dark:text-text-dark cursor-pointer hover:bg-golden-honey/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <span className="material-symbols-outlined text-base">add</span>
                                            </button>
                                        </div>

                                        {/* Remove Button */}
                                        <button
                                            onClick={() => handleRemoveItem(item.product.productId)}
                                            className="text-text-muted-light dark:text-text-muted-dark hover:text-danger transition-colors"
                                            title="Remove item"
                                        >
                                            <span className="material-symbols-outlined">delete</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </Card>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <Card padding="lg">
                                <h2 className="font-serif text-2xl font-bold text-text-light dark:text-text-dark mb-6">
                                    Order Summary
                                </h2>

                                <div className="flex flex-col gap-4">
                                    {/* Items Count */}
                                    <div className="flex justify-between items-center">
                                        <span className="text-text-muted-light dark:text-text-muted-dark">
                                            Items ({totalItems})
                                        </span>
                                        <span className="font-medium text-text-light dark:text-text-dark">
                                            {formatCurrency(subtotal)}
                                        </span>
                                    </div>

                                    {/* Shipping */}
                                    <div className="flex justify-between items-center">
                                        <span className="text-text-muted-light dark:text-text-muted-dark">
                                            Shipping
                                        </span>
                                        <span className="text-sm text-text-muted-light dark:text-text-muted-dark">
                                            Calculated at next step
                                        </span>
                                    </div>

                                    <hr className="border-border-light dark:border-border-dark" />

                                    {/* Total */}
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold text-text-light dark:text-text-dark">
                                            Total
                                        </span>
                                        <span className="text-lg font-bold text-golden-honey">
                                            {formatCurrency(subtotal)}
                                        </span>
                                    </div>
                                </div>

                                {/* Checkout Button */}
                                <Button
                                    onClick={handleCheckout}
                                    fullWidth
                                    size="lg"
                                    className="mt-6"
                                >
                                    <span className="material-symbols-outlined text-base">shopping_bag</span>
                                    Proceed to Checkout
                                </Button>

                                {/* Continue Shopping Link */}
                                <Link
                                    href="/products"
                                    className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-text-muted-light dark:text-text-muted-dark hover:text-golden-honey transition-colors"
                                >
                                    <span className="material-symbols-outlined text-base">arrow_back</span>
                                    Continue Shopping
                                </Link>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
