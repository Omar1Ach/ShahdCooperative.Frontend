'use client';

import { Review } from '@/types/product';
import { formatDistanceToNow } from 'date-fns';

interface ReviewsListProps {
    reviews: Review[];
    averageRating: number;
    totalReviews: number;
}

export default function ReviewsList({ reviews, averageRating, totalReviews }: ReviewsListProps) {
    const renderStars = (rating: number, filled: boolean = true) => {
        return [...Array(5)].map((_, i) => (
            <span
                key={i}
                className={`material-symbols-outlined text-base ${
                    i < rating ? 'text-golden-honey' : 'text-border-light dark:text-border-dark'
                }`}
                style={{ fontVariationSettings: i < rating && filled ? "'FILL' 1" : "'FILL' 0" }}
            >
                star
            </span>
        ));
    };

    if (reviews.length === 0) {
        return (
            <div className="mt-16 pt-12 border-t border-border-light dark:border-border-dark">
                <h2 className="text-2xl font-serif font-bold text-text-light dark:text-text-dark mb-8">
                    Customer Reviews
                </h2>
                <div className="text-center py-12">
                    <span className="material-symbols-outlined text-text-muted-light dark:text-text-muted-dark mb-4 block" style={{ fontSize: '4rem' }}>
                        rate_review
                    </span>
                    <p className="text-text-muted-light dark:text-text-muted-dark">
                        No reviews yet. Be the first to review this product!
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-16 pt-12 border-t border-border-light dark:border-border-dark">
            <h2 className="text-2xl font-serif font-bold text-text-light dark:text-text-dark mb-2">
                What Our Customers Say
            </h2>
            <div className="flex items-center gap-2 mb-8">
                <div className="flex">
                    {renderStars(Math.round(averageRating))}
                </div>
                <span className="text-sm text-text-muted-light dark:text-text-muted-dark">
                    {averageRating.toFixed(1)} out of 5 ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
                </span>
            </div>

            <div className="space-y-8">
                {reviews.map((review) => (
                    <div key={review.reviewId} className="flex flex-col sm:flex-row gap-4">
                        {/* User Info */}
                        <div className="flex-shrink-0 flex sm:flex-col items-center gap-4 sm:w-40">
                            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-golden-honey/10">
                                {review.userAvatar ? (
                                    <img
                                        src={review.userAvatar}
                                        alt={review.userName}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="material-symbols-outlined text-golden-honey">
                                            person
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="text-left sm:text-center">
                                <p className="font-semibold text-text-light dark:text-text-dark">
                                    {review.userName}
                                </p>
                                {review.isVerifiedPurchase && (
                                    <p className="text-sm text-success flex items-center gap-1 sm:justify-center">
                                        <span className="material-symbols-outlined text-xs">verified</span>
                                        Verified Buyer
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Review Content */}
                        <div className="flex-1 bg-card-light/50 dark:bg-card-dark/50 p-6 rounded-lg border border-border-light dark:border-border-dark">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex">
                                    {renderStars(review.rating)}
                                </div>
                                <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                                    {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                                </p>
                            </div>
                            {review.title && (
                                <h4 className="font-bold text-text-light dark:text-text-dark mb-2">
                                    {review.title}
                                </h4>
                            )}
                            <p className="text-text-light dark:text-text-dark leading-relaxed">
                                {review.comment}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
