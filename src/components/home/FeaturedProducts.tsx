'use client';

import { useEffect, useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    // Mock data for now
    const mockProducts = [
      {
        id: '1',
        name: 'Wildflower Honey',
        description: 'A delightful, multi-floral honey with a light and sweet taste.',
        price: 12.99,
        imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784046?w=400&h=300&fit=crop',
      },
      {
        id: '2',
        name: 'Buckwheat Honey',
        description: 'Robust and full-bodied with notes of molasses and malt.',
        price: 15.99,
        imageUrl: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&h=300&fit=crop',
      },
      {
        id: '3',
        name: 'Creamed Clover Honey',
        description: 'Smooth, spreadable, and delicately sweet. Perfect for toast.',
        price: 14.99,
        imageUrl: 'https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=400&h=300&fit=crop',
      },
    ];

    setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <section className="w-full bg-dark-accent dark:bg-dark-card py-12 md:py-20 lg:py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center">
            <p className="text-text-muted-light dark:text-text-muted-dark">Loading products...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-dark-accent dark:bg-dark-card py-12 md:py-20 lg:py-24">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-12 flex flex-col items-center text-center">
          <h2 className="font-serif text-3xl font-bold text-text-light dark:text-text-dark md:text-4xl">
            Featured Products
          </h2>
          <p className="mt-2 max-w-2xl text-text-muted-light dark:text-text-muted-dark">
            A curated selection of our finest honey, straight from the hive.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card
              key={product.id}
              variant="elevated"
              padding="none"
              hover
              className="flex flex-col overflow-hidden"
            >
              <div className="relative h-60 w-full">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-xl font-bold text-text-light dark:text-text-dark">
                  {product.name}
                </h3>
                <p className="mt-2 flex-1 text-sm text-text-muted-light dark:text-text-muted-dark">
                  {product.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-bold text-text-light dark:text-text-dark">
                    ${product.price.toFixed(2)}
                  </span>
                  <button className="flex h-10 items-center justify-center gap-2 rounded-lg bg-golden-honey/20 px-4 text-sm font-bold text-golden-honey transition-colors hover:bg-golden-honey/40">
                    <span className="material-symbols-outlined text-base">add_shopping_cart</span>
                    Add to Cart
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              window.location.href = '/products';
            }}
          >
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
