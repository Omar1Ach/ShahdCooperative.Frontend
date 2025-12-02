'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getProductById } from '@/lib/api/products';
import { Product } from '@/types/product';
import { formatCurrency } from '@/lib/utils/helpers';
import { useCartStore } from '@/lib/store/cartStore';

interface ProductDetailPageProps {
    params: {
        id: string;
    };
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
    const router = useRouter();
    const { addItem } = useCartStore();
    const [product, setProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [showAddedMessage, setShowAddedMessage] = useState(false);

    useEffect(() => {
        loadProduct();
    }, [params.id]);

    const loadProduct = async () => {
        setIsLoading(true);
        setError('');

        try {
            const data = await getProductById(params.id);
            setProduct(data);
        } catch (err) {
            setError('Product not found');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (!product) return;

        addItem(product, quantity);
        setShowAddedMessage(true);
        setTimeout(() => setShowAddedMessage(false), 3000);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-300">Loading product...</p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Product Not Found</h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
                    <button
                        onClick={() => router.push('/products')}
                        className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                        Back to Products
                    </button>
                </div>
            </div>
        );
    }

    const isOutOfStock = product.stockQuantity === 0;
    const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= product.reorderLevel;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Products
                </button>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                        {/* Product Image */}
                        <div>
                            <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden">
                                {product.imageUrl ? (
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                                        <svg className="w-32 h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="flex flex-col">
                            {/* Category & SKU */}
                            <div className="mb-4">
                                <span className="inline-block px-3 py-1 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 text-sm font-semibold rounded-full">
                                    {product.category}
                                </span>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                    SKU: {product.sku}
                                </p>
                            </div>

                            {/* Title */}
                            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                {product.name}
                            </h1>

                            {/* Brand */}
                            {product.brand && (
                                <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                                    by <span className="font-semibold">{product.brand}</span>
                                </p>
                            )}

                            {/* Description */}
                            <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                                {product.description}
                            </p>

                            {/* Price */}
                            <div className="mb-6">
                                <p className="text-5xl font-bold text-amber-600 dark:text-amber-400">
                                    {formatCurrency(product.price)}
                                </p>
                            </div>

                            {/* Stock Status */}
                            <div className="mb-6">
                                {isOutOfStock ? (
                                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                        <span className="font-semibold">Out of Stock</span>
                                    </div>
                                ) : isLowStock ? (
                                    <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        <span className="font-semibold">Only {product.stockQuantity} left in stock!</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span className="font-semibold">In Stock ({product.stockQuantity} available)</span>
                                    </div>
                                )}
                            </div>

                            {/* Quantity Selector */}
                            {!isOutOfStock && (
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Quantity
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-10 h-10 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            min="1"
                                            max={product.stockQuantity}
                                            value={quantity}
                                            onChange={(e) => setQuantity(Math.min(product.stockQuantity, Math.max(1, parseInt(e.target.value) || 1)))}
                                            className="w-20 text-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                        <button
                                            onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                                            className="w-10 h-10 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Add to Cart Button */}
                            <button
                                onClick={handleAddToCart}
                                disabled={isOutOfStock}
                                className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-lg transition-colors disabled:cursor-not-allowed text-lg shadow-lg"
                            >
                                {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                            </button>

                            {/* Added to Cart Message */}
                            {showAddedMessage && (
                                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-600 dark:text-green-400 text-center animate-fade-in">
                                    ✓ Added to cart successfully!
                                </div>
                            )}

                            {/* Product Details */}
                            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 space-y-3">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Product Details</h3>
                                {product.weight && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        <span className="font-semibold">Weight:</span> {product.weight}g
                                    </p>
                                )}
                                {product.dimensions && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        <span className="font-semibold">Dimensions:</span> {product.dimensions}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
