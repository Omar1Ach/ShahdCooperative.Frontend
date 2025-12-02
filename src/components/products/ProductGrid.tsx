import { Product } from '@/types/product';
import ProductCard from './ProductCard';
import Card from '../ui/Card';

interface ProductGridProps {
    products: Product[];
    isLoading?: boolean;
}

export default function ProductGrid({ products, isLoading }: ProductGridProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                    <Card key={i} padding="none" className="overflow-hidden animate-pulse">
                        <div className="aspect-square bg-border-light dark:bg-border-dark"></div>
                        <div className="p-5 space-y-3">
                            <div className="h-5 bg-border-light dark:bg-border-dark rounded w-1/4"></div>
                            <div className="h-6 bg-border-light dark:bg-border-dark rounded w-3/4"></div>
                            <div className="h-4 bg-border-light dark:bg-border-dark rounded w-full"></div>
                            <div className="h-4 bg-border-light dark:bg-border-dark rounded w-5/6"></div>
                            <div className="flex justify-between pt-4 border-t border-border-light dark:border-border-dark">
                                <div className="h-8 bg-border-light dark:bg-border-dark rounded w-1/3"></div>
                                <div className="h-6 bg-border-light dark:bg-border-dark rounded w-1/4"></div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <Card padding="lg" className="text-center py-16">
                <span className="material-symbols-outlined text-text-muted-light dark:text-text-muted-dark mb-4 mx-auto block" style={{ fontSize: '6rem' }}>
                    inventory_2
                </span>
                <h3 className="text-2xl font-serif font-bold text-text-light dark:text-text-dark mb-3">
                    No products found
                </h3>
                <p className="text-text-muted-light dark:text-text-muted-dark max-w-md mx-auto">
                    We couldn't find any products matching your criteria. Try adjusting your filters or search terms.
                </p>
            </Card>
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
