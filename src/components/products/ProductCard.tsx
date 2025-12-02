import { Product } from '@/types/product';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils/helpers';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= product.reorderLevel;
    const isOutOfStock = product.stockQuantity === 0;

    return (
        <Link href={`/products/${product.productId}`}>
            <div className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105">
                {/* Product Image */}
                <div className="relative aspect-square bg-gray-100 dark:bg-gray-700 overflow-hidden">
                    {product.imageUrl ? (
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                            <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    )}

                    {/* Stock Badge */}
                    {isOutOfStock && (
                        <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                            Out of Stock
                        </div>
                    )}
                    {isLowStock && !isOutOfStock && (
                        <div className="absolute top-2 right-2 bg-yellow-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                            Low Stock
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                    <div className="mb-2">
                        <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold uppercase">
                            {product.category}
                        </span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {product.name}
                    </h3>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {product.description}
                    </p>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                                {formatCurrency(product.price)}
                            </p>
                            {product.brand && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {product.brand}
                                </p>
                            )}
                        </div>

                        <div className="text-right">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {product.stockQuantity} in stock
                            </p>
                        </div>
                    </div>

                    {/* SKU */}
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            SKU: {product.sku}
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    );
}
