'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getProductById } from '@/lib/api/products';
import { Product, Review } from '@/types/product';
import { formatCurrency } from '@/lib/utils/helpers';
import { useCartStore } from '@/lib/store/cartStore';
import ImageGallery from '@/components/products/ImageGallery';
import ReviewsList from '@/components/products/ReviewsList';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';

interface ProductDetailPageProps {
    params: {
        id: string;
    };
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
    const { addItem } = useCartStore();
    const [product, setProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [showAddedMessage, setShowAddedMessage] = useState(false);

    // Mock reviews data (will be replaced with API call later)
    const [reviews] = useState<Review[]>([
        {
            reviewId: '1',
            productId: params.id,
            userId: '1',
            userName: 'Jane Doe',
            userAvatar: 'https://i.pravatar.cc/150?img=1',
            rating: 5,
            title: 'Absolutely divine!',
            comment: 'The flavor is so rich and complex. You can taste the quality in every spoonful. It arrived beautifully packaged and has become a staple in my pantry.',
            isVerifiedPurchase: true,
            createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            reviewId: '2',
            productId: params.id,
            userId: '2',
            userName: 'John Smith',
            userAvatar: 'https://i.pravatar.cc/150?img=2',
            rating: 4,
            title: 'Very good honey',
            comment: 'Great taste. A little pricey, but you get what you pay for. I use it in my tea every morning.',
            isVerifiedPurchase: true,
            createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
    ]);

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

    const handleQuantityChange = (newQuantity: number) => {
        if (!product) return;
        setQuantity(Math.min(product.stockQuantity, Math.max(1, newQuantity)));
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
                <Card padding="lg" className="text-center">
                    <div className="w-16 h-16 border-4 border-golden-honey border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-text-light dark:text-text-dark">Loading product...</p>
                </Card>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center p-4">
                <Card padding="lg" className="text-center max-w-md">
                    <span className="material-symbols-outlined text-danger mb-4 block" style={{ fontSize: '4rem' }}>
                        error
                    </span>
                    <h1 className="text-2xl font-serif font-bold text-text-light dark:text-text-dark mb-4">
                        Product Not Found
                    </h1>
                    <p className="text-text-muted-light dark:text-text-muted-dark mb-6">
                        {error || 'The product you are looking for does not exist.'}
                    </p>
                    <Link href="/products">
                        <Button>
                            <span className="material-symbols-outlined text-base">arrow_back</span>
                            Back to Products
                        </Button>
                    </Link>
                </Card>
            </div>
        );
    }

    const isOutOfStock = product.stockQuantity === 0;
    const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= product.reorderLevel;
    const stockPercentage = Math.min(100, (product.stockQuantity / (product.reorderLevel * 2)) * 100);

    // Calculate average rating
    const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

    // Mock product images (will be replaced with real images from backend)
    const productImages = product.imageUrl ? [product.imageUrl] : [];

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumbs */}
                <Breadcrumb
                    items={[
                        { label: 'Home', href: '/' },
                        { label: 'Shop', href: '/products' },
                        { label: product.name },
                    ]}
                />

                {/* Main Product Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                    {/* Image Gallery */}
                    <div>
                        <ImageGallery images={productImages} productName={product.name} />
                    </div>

                    {/* Product Info Panel */}
                    <div className="flex flex-col gap-6">
                        {/* Category & SKU */}
                        <div>
                            <Badge variant="default" size="md">
                                {product.category}
                            </Badge>
                            <p className="text-sm text-text-muted-light dark:text-text-muted-dark mt-2">
                                SKU: {product.sku}
                            </p>
                        </div>

                        {/* Title */}
                        <h1 className="text-gray-900 dark:text-gray-100 tracking-tight text-4xl font-serif font-bold leading-tight">
                            {product.name}
                        </h1>

                        {/* Brand */}
                        {product.brand && (
                            <p className="text-lg text-text-muted-light dark:text-text-muted-dark">
                                by <span className="font-semibold text-text-light dark:text-text-dark">{product.brand}</span>
                            </p>
                        )}

                        {/* Price */}
                        <p className="text-4xl font-extrabold text-golden-honey">
                            {formatCurrency(product.price)}
                        </p>

                        {/* Description */}
                        <p className="text-text-light dark:text-text-dark leading-relaxed">
                            {product.description}
                        </p>

                        {/* Inventory Status with Progress Bar */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <p className="font-semibold text-text-light dark:text-text-dark">
                                    Availability
                                </p>
                                {isOutOfStock ? (
                                    <p className="text-sm font-medium text-danger flex items-center gap-1">
                                        <span className="material-symbols-outlined text-base">block</span>
                                        Out of Stock
                                    </p>
                                ) : isLowStock ? (
                                    <p className="text-sm font-medium text-warning flex items-center gap-1">
                                        <span className="material-symbols-outlined text-base">warning</span>
                                        Low Stock
                                    </p>
                                ) : (
                                    <p className="text-sm font-medium text-success flex items-center gap-1">
                                        <span className="material-symbols-outlined text-base">check_circle</span>
                                        In Stock
                                    </p>
                                )}
                            </div>
                            <div className="w-full bg-border-light dark:bg-border-dark rounded-full h-2 overflow-hidden">
                                <div
                                    className={`h-2 rounded-full transition-all ${
                                        isOutOfStock
                                            ? 'bg-danger'
                                            : isLowStock
                                            ? 'bg-warning'
                                            : 'bg-success'
                                    }`}
                                    style={{ width: `${isOutOfStock ? 0 : stockPercentage}%` }}
                                ></div>
                            </div>
                            {!isOutOfStock && isLowStock && (
                                <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                                    Only {product.stockQuantity} items left!
                                </p>
                            )}
                        </div>

                        {/* Quantity Selector & Add to Cart */}
                        <div className="flex items-center gap-4 pt-4">
                            {!isOutOfStock && (
                                <div className="flex items-center border-2 border-border-light dark:border-border-dark rounded-lg">
                                    <button
                                        onClick={() => handleQuantityChange(quantity - 1)}
                                        className="w-10 h-12 flex items-center justify-center text-text-light dark:text-text-dark hover:bg-border-light/50 dark:hover:bg-border-dark/50 rounded-l-lg transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-xl">remove</span>
                                    </button>
                                    <span className="w-12 text-center font-semibold text-text-light dark:text-text-dark">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => handleQuantityChange(quantity + 1)}
                                        disabled={quantity >= product.stockQuantity}
                                        className="w-10 h-12 flex items-center justify-center text-text-light dark:text-text-dark hover:bg-border-light/50 dark:hover:bg-border-dark/50 rounded-r-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span className="material-symbols-outlined text-xl">add</span>
                                    </button>
                                </div>
                            )}
                            <Button
                                onClick={handleAddToCart}
                                disabled={isOutOfStock}
                                size="lg"
                                className="flex-1"
                            >
                                <span className="material-symbols-outlined text-xl">add_shopping_cart</span>
                                {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                            </Button>
                        </div>

                        {/* Added to Cart Success Message */}
                        {showAddedMessage && (
                            <div className="p-3 bg-success/10 border border-success/20 rounded-lg text-success text-sm flex items-center gap-2 animate-fade-in">
                                <span className="material-symbols-outlined text-base">check_circle</span>
                                Added to cart successfully!
                            </div>
                        )}

                        {/* Reviews Summary */}
                        {reviews.length > 0 && (
                            <div className="flex items-center gap-2 pt-4 border-t border-border-light dark:border-border-dark">
                                <div className="flex text-golden-honey">
                                    {[...Array(5)].map((_, i) => (
                                        <span
                                            key={i}
                                            className="material-symbols-outlined"
                                            style={{
                                                fontVariationSettings: i < Math.round(averageRating) ? "'FILL' 1" : "'FILL' 0",
                                            }}
                                        >
                                            star
                                        </span>
                                    ))}
                                </div>
                                <span className="text-sm text-text-muted-light dark:text-text-muted-dark">
                                    {averageRating.toFixed(1)} ({reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'})
                                </span>
                            </div>
                        )}

                        {/* Product Details */}
                        {(product.weight || product.dimensions) && (
                            <div className="pt-6 border-t border-border-light dark:border-border-dark space-y-3">
                                <h3 className="font-bold text-text-light dark:text-text-dark mb-3">
                                    Product Details
                                </h3>
                                {product.weight && (
                                    <p className="text-sm text-text-muted-light dark:text-text-muted-dark flex items-center gap-2">
                                        <span className="material-symbols-outlined text-base">scale</span>
                                        <span className="font-semibold">Weight:</span> {product.weight}g
                                    </p>
                                )}
                                {product.dimensions && (
                                    <p className="text-sm text-text-muted-light dark:text-text-muted-dark flex items-center gap-2">
                                        <span className="material-symbols-outlined text-base">straighten</span>
                                        <span className="font-semibold">Dimensions:</span> {product.dimensions}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Reviews Section */}
                <ReviewsList
                    reviews={reviews}
                    averageRating={averageRating}
                    totalReviews={reviews.length}
                />
            </div>
        </div>
    );
}
