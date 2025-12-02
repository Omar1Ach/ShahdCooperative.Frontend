import { mainServiceClient } from './client';
import {
    Order,
    OrderListResponse,
    CreateOrderRequest,
    UpdateOrderStatusRequest,
    OrderFilters,
} from '@/types/order';

/**
 * Get paginated list of orders (Admin: all orders, Customer: own orders)
 */
export const getOrders = async (filters: OrderFilters = {}): Promise<OrderListResponse> => {
    const params = new URLSearchParams();

    if (filters.page) params.append('page', filters.page.toString());
    if (filters.pageSize) params.append('pageSize', filters.pageSize.toString());
    if (filters.status) params.append('status', filters.status);

    const { data } = await mainServiceClient.get<OrderListResponse>(`/orders?${params.toString()}`);
    return data;
};

/**
 * Get a single order by ID
 */
export const getOrderById = async (orderId: string): Promise<Order> => {
    const { data } = await mainServiceClient.get<Order>(`/orders/${orderId}`);
    return data;
};

/**
 * Create a new order
 */
export const createOrder = async (orderData: CreateOrderRequest): Promise<Order> => {
    const { data } = await mainServiceClient.post<Order>('/orders', orderData);
    return data;
};

/**
 * Update order status (Admin only)
 */
export const updateOrderStatus = async (
    orderId: string,
    statusUpdate: UpdateOrderStatusRequest
): Promise<Order> => {
    const { data } = await mainServiceClient.put<Order>(`/orders/${orderId}/status`, statusUpdate);
    return data;
};

/**
 * Cancel an order
 */
export const cancelOrder = async (orderId: string): Promise<Order> => {
    const { data } = await mainServiceClient.put<Order>(`/orders/${orderId}/cancel`);
    return data;
};

/**
 * Get customer's order history
 */
export const getCustomerOrders = async (customerId: string): Promise<Order[]> => {
    const { data } = await mainServiceClient.get<Order[]>(`/customers/${customerId}/orders`);
    return data;
};
