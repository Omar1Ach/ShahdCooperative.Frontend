'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getProducts } from '@/lib/api/products';
import { Product, ProductListResponse } from '@/types/product';
import { PRODUCT_CATEGORIES } from '@/lib/utils/constants';
import ProductGrid from '@/components/products/ProductGrid';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function ProductsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
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
            setTotalCount(response.totalCount);
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
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const activeFiltersCount = [category, search, inStockOnly].filter(Boolean).length;

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark">
            {/* Header */}
            <div className="bg-dark-forest-green text-white border-b border-golden-honey/20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3">
                        Our Products
                    </h1>
                    <p className="text-white/80 text-lg max-w-2xl">
                        Premium honey and beekeeping products from ShahdCooperative
                    </p>
                    {!isLoading && totalCount > 0 && (
                        <p className="mt-2 text-white/60">
                            {totalCount} {totalCount === 1 ? 'product' : 'products'} available
                        </p>
                    )}
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filters Section */}
                <div className="mb-8 space-y-4">
                    {/* Search Bar */}
                    <div className="flex gap-3">
                        <div className="flex-1 relative">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted-light dark:text-text-muted-dark">
                                search
                            </span>
                            <input
                                type="text"
                                placeholder="Search products..."
                                defaultValue={search}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        updateFilter('search', e.currentTarget.value);
                                    }
                                }}
                                className="w-full h-12 pl-12 pr-4 border border-border-light dark:border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-honey/50 focus:border-golden-honey bg-card-light dark:bg-card-dark text-text-light dark:text-text-dark"
                            />
                        </div>
                        <Button
                            onClick={() => updateFilter('search', (document.querySelector('input[type="text"]') as HTMLInputElement)?.value || '')}
                            size="lg"
                        >
                            <span className="material-symbols-outlined">search</span>
                            Search
                        </Button>
                    </div>

                    {/* Filter Row */}
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Category Filter */}
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted-light dark:text-text-muted-dark text-xl">
                                category
                            </span>
                            <select
                                value={category}
                                onChange={(e) => updateFilter('category', e.target.value)}
                                className="pl-10 pr-8 py-2 h-10 border border-border-light dark:border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-honey/50 focus:border-golden-honey bg-card-light dark:bg-card-dark text-text-light dark:text-text-dark appearance-none cursor-pointer"
                            >
                                <option value="">All Categories</option>
                                {PRODUCT_CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* In Stock Filter */}
                        <label className="flex items-center gap-2 px-4 h-10 border border-border-light dark:border-border-dark rounded-lg bg-card-light dark:bg-card-dark cursor-pointer hover:bg-golden-honey/5 transition-colors">
                            <input
                                type="checkbox"
                                checked={inStockOnly}
                                onChange={(e) => updateFilter('inStockOnly', e.target.checked ? 'true' : '')}
                                className="rounded border-border-light dark:border-border-dark text-golden-honey focus:ring-golden-honey"
                            />
                            <span className="text-sm font-medium text-text-light dark:text-text-dark">In Stock Only</span>
                        </label>

                        {/* Active Filters Badge */}
                        {activeFiltersCount > 0 && (
                            <Badge variant="primary">
                                {activeFiltersCount} {activeFiltersCount === 1 ? 'filter' : 'filters'} active
                            </Badge>
                        )}

                        {/* Clear Filters */}
                        {activeFiltersCount > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push('/products')}
                            >
                                <span className="material-symbols-outlined text-base">close</span>
                                Clear All
                            </Button>
                        )}
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-lg text-danger flex items-center gap-3">
                        <span className="material-symbols-outlined">error</span>
                        {error}
                    </div>
                )}

                {/* Product Grid */}
                <ProductGrid products={products} isLoading={isLoading} />

                {/* Pagination */}
                {!isLoading && totalPages > 1 && (
                    <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                            Page {page} of {totalPages}
                        </p>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => changePage(page - 1)}
                                disabled={page === 1}
                            >
                                <span className="material-symbols-outlined text-base">chevron_left</span>
                                Previous
                            </Button>

                            <div className="hidden sm:flex items-center gap-2">
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
                                            className={`h-10 w-10 rounded-lg font-medium transition-colors ${
                                                page === pageNum
                                                    ? 'bg-golden-honey text-text-light'
                                                    : 'border border-border-light dark:border-border-dark hover:bg-border-light/50 dark:hover:bg-border-dark/50 text-text-light dark:text-text-dark'
                                            }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => changePage(page + 1)}
                                disabled={page === totalPages}
                            >
                                Next
                                <span className="material-symbols-outlined text-base">chevron_right</span>
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
