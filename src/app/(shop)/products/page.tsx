'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getProducts } from '@/lib/api/products';
import { Product, ProductListResponse } from '@/types/product';
import { PRODUCT_CATEGORIES } from '@/lib/utils/constants';
import ProductGrid from '@/components/products/ProductGrid';

export default function ProductsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string>('');

    // Get filters from URL
    const page = parseInt(searchParams.get('page') || '1');
    const category = searchParams.get('category') || '';
    const search = searchParams.get('search') || '';
    const inStockOnly = searchParams.get('inStockOnly') === 'true';

    useEffect(() => {
        loadProducts();
    }, [page, category, search, inStockOnly]);

    const loadProducts = async () => {
        setIsLoading(true);
        setError('');

        try {
            const response: ProductListResponse = await getProducts({
                page,
                pageSize: 20,
                category: category || undefined,
                search: search || undefined,
                inStockOnly: inStockOnly || undefined,
            });

            setProducts(response.products);
            setTotalPages(response.totalPages);
        } catch (err) {
            setError('Failed to load products. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        params.set('page', '1'); // Reset to page 1 when filters change
        router.push(`/products?${params.toString()}`);
    };

    const changePage = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', newPage.toString());
        router.push(`/products?${params.toString()}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        Our Products
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Premium honey and beekeeping products from ShahdCooperative
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filters */}
                <div className="mb-8 space-y-4">
                    {/* Search Bar */}
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Search products..."
                                defaultValue={search}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        updateFilter('search', e.currentTarget.value);
                                    }
                                }}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>
                        <button
                            onClick={() => updateFilter('search', (document.querySelector('input[type="text"]') as HTMLInputElement)?.value || '')}
                            className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors"
                        >
                            Search
                        </button>
                    </div>

                    {/* Filter Row */}
                    <div className="flex flex-wrap gap-4">
                        {/* Category Filter */}
                        <select
                            value={category}
                            onChange={(e) => updateFilter('category', e.target.value)}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                            <option value="">All Categories</option>
                            {PRODUCT_CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>

                        {/* In Stock Filter */}
                        <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={inStockOnly}
                                onChange={(e) => updateFilter('inStockOnly', e.target.checked ? 'true' : '')}
                                className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">In Stock Only</span>
                        </label>

                        {/* Clear Filters */}
                        {(category || search || inStockOnly) && (
                            <button
                                onClick={() => router.push('/products')}
                                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white underline"
                            >
                                Clear All Filters
                            </button>
                        )}
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
                        {error}
                    </div>
                )}

                {/* Product Grid */}
                <ProductGrid products={products} isLoading={isLoading} />

                {/* Pagination */}
                {!isLoading && totalPages > 1 && (
                    <div className="mt-12 flex items-center justify-center gap-2">
                        <button
                            onClick={() => changePage(page - 1)}
                            disabled={page === 1}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Previous
                        </button>

                        {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                            let pageNum: number;
                            if (totalPages <= 5) {
                                pageNum = i + 1;
                            } else if (page <= 3) {
                                pageNum = i + 1;
                            } else if (page >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                            } else {
                                pageNum = page - 2 + i;
                            }

                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => changePage(pageNum)}
                                    className={`px-4 py-2 rounded-lg transition-colors ${page === pageNum
                                            ? 'bg-amber-600 text-white'
                                            : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}

                        <button
                            onClick={() => changePage(page + 1)}
                            disabled={page === totalPages}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Next
                        </button>
                    </div>
                )}

                {/* Results Count */}
                {!isLoading && products.length > 0 && (
                    <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
                        Showing page {page} of {totalPages} ({products.length} products)
                    </p>
                )}
            </div>
        </div>
    );
}
