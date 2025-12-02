import { Product } from '@/types/product';
import ProductCard from './ProductCard';

interface ProductGridProps {
    products: Product[];
    isLoading?: boolean;
}

export default function ProductGrid({ products, isLoading }: ProductGridProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse">
                        <div className="aspect-square bg-gray-300 dark:bg-gray-700"></div>
                        <div className="p-4 space-y-3">
                            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
                            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                            <div className="flex justify-between pt-2">
                                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
                                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="text-center py-16">
                <svg className="w-24 h-24 mx-auto text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    No products found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                    Try adjusting your filters or search terms
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
                <ProductCard key={product.productId} product={product} />
            ))}
        </div>
    );
}
