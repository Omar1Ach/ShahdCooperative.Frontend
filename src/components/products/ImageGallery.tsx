'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageGalleryProps {
    images: string[];
    productName: string;
}

export default function ImageGallery({ images, productName }: ImageGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);

    // If no images provided, use placeholder
    const displayImages = images.length > 0 ? images : ['/placeholder-product.png'];
    const selectedImage = displayImages[selectedIndex];

    return (
        <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-background-light dark:bg-card-dark rounded-xl overflow-hidden shadow-sm">
                {selectedImage ? (
                    <Image
                        src={selectedImage}
                        alt={productName}
                        fill
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-muted-light dark:text-text-muted-dark">
                        <span className="material-symbols-outlined" style={{ fontSize: '8rem' }}>
                            image
                        </span>
                    </div>
                )}
            </div>

            {/* Thumbnails */}
            {displayImages.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                    {displayImages.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedIndex(index)}
                            className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-all ${
                                index === selectedIndex
                                    ? 'ring-2 ring-golden-honey opacity-100'
                                    : 'opacity-60 hover:opacity-100'
                            }`}
                        >
                            {image ? (
                                <Image
                                    src={image}
                                    alt={`${productName} - View ${index + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-border-light dark:bg-border-dark flex items-center justify-center">
                                    <span className="material-symbols-outlined text-text-muted-light dark:text-text-muted-dark">
                                        image
                                    </span>
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
