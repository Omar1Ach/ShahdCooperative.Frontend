// Product Types
export interface Product {
    productId: string;
    name: string;
    description: string;
    sku: string;
    price: number;
    costPrice: number;
    category: string;
    brand?: string;
    stockQuantity: number;
    reorderLevel: number;
    isActive: boolean;
    imageUrl?: string;
    weight?: number;
    dimensions?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ProductListResponse {
    products: Product[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface CreateProductRequest {
    name: string;
    description: string;
    sku: string;
    price: number;
    costPrice: number;
    category: string;
    brand?: string;
    stockQuantity: number;
    reorderLevel: number;
    imageUrl?: string;
    weight?: number;
    dimensions?: string;
}

export interface UpdateProductRequest {
    name?: string;
    description?: string;
    price?: number;
    costPrice?: number;
    category?: string;
    brand?: string;
    stockQuantity?: number;
    reorderLevel?: number;
    isActive?: boolean;
    imageUrl?: string;
    weight?: number;
    dimensions?: string;
}

export interface ProductFilters {
    page?: number;
    pageSize?: number;
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    inStockOnly?: boolean;
}
