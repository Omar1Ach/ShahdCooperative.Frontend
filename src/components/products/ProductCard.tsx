import { Product } from '@/types/product';
import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils/helpers';
import Badge from '../ui/Badge';
import Card from '../ui/Card';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= product.reorderLevel;
    const isOutOfStock = product.stockQuantity === 0;

    return (
        <Link href={`/products/${product.productId}`}>
            <Card padding="none" hover className="group overflow-hidden h-full flex flex-col">
                {/* Product Image */}
                <div className="relative aspect-square bg-border-light/50 dark:bg-border-dark/50 overflow-hidden">
                    {product.imageUrl ? (
                        <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-text-muted-light dark:text-text-muted-dark">
                            <span className="material-symbols-outlined" style={{ fontSize: '4rem' }}>
                                image
                            </span>
                        </div>
                    )}

                    {/* Stock Badge */}
                    <div className="absolute top-3 right-3">
                        {isOutOfStock && (
                            <Badge variant="danger" size="sm">
                                <span className="material-symbols-outlined text-xs">block</span>
                                Out of Stock
                            </Badge>
                        )}
                        {isLowStock && !isOutOfStock && (
                            <Badge variant="warning" size="sm">
                                <span className="material-symbols-outlined text-xs">warning</span>
                                Low Stock
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Product Info */}
                <div className="p-5 flex flex-col flex-1">
                    {/* Category */}
                    <div className="mb-2">
                        <Badge variant="default" size="sm">
                            {product.category}
                        </Badge>
                    </div>

                    {/* Product Name */}
                    <h3 className="text-lg font-bold text-text-light dark:text-text-dark mb-2 line-clamp-2 group-hover:text-golden-honey transition-colors">
                        {product.name}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-4 line-clamp-2 flex-1">
                        {product.description}
                    </p>

                    {/* Price and Stock */}
                    <div className="flex items-end justify-between mt-auto pt-4 border-t border-border-light dark:border-border-dark">
                        <div>
                            <p className="text-2xl font-bold text-golden-honey">
                                {formatCurrency(product.price)}
                            </p>
                            {product.brand && (
                                <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-1">
                                    by {product.brand}
                                </p>
                            )}
                        </div>

                        <div className="text-right">
                            <div className="flex items-center gap-1 text-text-muted-light dark:text-text-muted-dark">
                                <span className="material-symbols-outlined text-base">inventory_2</span>
                                <p className="text-sm font-medium">
                                    {product.stockQuantity}
                                </p>
                            </div>
                            <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                                SKU: {product.sku}
                            </p>
                        </div>
                    </div>

                    {/* Add to Cart Button (Visible on hover) */}
                    <button className="mt-4 w-full h-11 flex items-center justify-center gap-2 bg-golden-honey text-text-light rounded-lg font-bold opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        <span className="material-symbols-outlined">add_shopping_cart</span>
                        Add to Cart
                    </button>
                </div>
            </Card>
        </Link>
    );
}
