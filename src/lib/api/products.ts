import { mainServiceClient } from './client';
import {
    Product,
    ProductListResponse,
    CreateProductRequest,
    UpdateProductRequest,
    ProductFilters,
} from '@/types/product';

/**
 * Get paginated list of products with optional filters
 */
export const getProducts = async (filters: ProductFilters = {}): Promise<ProductListResponse> => {
    const params = new URLSearchParams();

    if (filters.page) params.append('page', filters.page.toString());
    if (filters.pageSize) params.append('pageSize', filters.pageSize.toString());
    if (filters.category) params.append('category', filters.category);
    if (filters.search) params.append('search', filters.search);
    if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters.inStockOnly) params.append('inStockOnly', 'true');

    const { data } = await mainServiceClient.get<ProductListResponse>(`/products?${params.toString()}`);
    return data;
};

/**
 * Get a single product by ID
 */
export const getProductById = async (productId: string): Promise<Product> => {
    const { data } = await mainServiceClient.get<Product>(`/products/${productId}`);
    return data;
};

/**
 * Create a new product (Admin only)
 */
export const createProduct = async (productData: CreateProductRequest): Promise<Product> => {
    const { data } = await mainServiceClient.post<Product>('/products', productData);
    return data;
};

/**
 * Update an existing product (Admin only)
 */
export const updateProduct = async (productId: string, updates: UpdateProductRequest): Promise<Product> => {
    const { data } = await mainServiceClient.put<Product>(`/products/${productId}`, updates);
    return data;
};

/**
 * Delete a product (Admin only)
 */
export const deleteProduct = async (productId: string): Promise<{ message: string }> => {
    const { data } = await mainServiceClient.delete(`/products/${productId}`);
    return data;
};

/**
 * Get products with low stock (Admin only)
 */
export const getLowStockProducts = async (): Promise<Product[]> => {
    const { data } = await mainServiceClient.get<Product[]>('/products/low-stock');
    return data;
};
