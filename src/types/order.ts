// Order Types
export type OrderStatus = 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface OrderItem {
    orderItemId: string;
    orderId: string;
    productId: string;
    productName?: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

export interface Order {
    orderId: string;
    orderNumber: string;
    customerId: string;
    customerName?: string;
    orderDate: string;
    status: OrderStatus;
    totalAmount: number;
    shippingStreet: string;
    shippingCity: string;
    shippingState: string;
    shippingPostalCode: string;
    shippingCountry: string;
    trackingNumber?: string;
    orderItems: OrderItem[];
    createdAt: string;
    updatedAt: string;
}

export interface OrderListResponse {
    orders: Order[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface OrderItemRequest {
    productId: string;
    quantity: number;
}

export interface CreateOrderRequest {
    customerId: string;
    orderItems: OrderItemRequest[];
    shippingStreet: string;
    shippingCity: string;
    shippingState: string;
    shippingPostalCode: string;
    shippingCountry: string;
}

export interface UpdateOrderStatusRequest {
    status: OrderStatus;
    trackingNumber?: string;
}

export interface OrderFilters {
    page?: number;
    pageSize?: number;
    status?: OrderStatus;
}
