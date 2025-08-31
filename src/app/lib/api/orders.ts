import { apiClient } from './base';
import { Order, OrderItem } from '@/app/types';

export interface CreateOrderData {
    user_id: number;
    total_amount: number;
    status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    shipping_address?: string;
}

export interface UpdateOrderData extends Partial<CreateOrderData> { }

export interface CreateOrderItemData {
    book_id: number;
    quantity: number;
    price_at_purchase: number;
}

export interface OrdersQueryParams {
    user_id?: number;
    status?: string;
}

const ORDERS_ENDPOINT = '/orders';

// Get all orders (with optional filters)
export const getOrders = async (params?: OrdersQueryParams): Promise<Order[]> => {
    const response = await apiClient.get<Order[]>(ORDERS_ENDPOINT, { params });
    return response.data;
};

// Get order by ID
export const getOrderById = async (id: number): Promise<Order> => {
    const response = await apiClient.get<Order>(`${ORDERS_ENDPOINT}/${id}`);
    return response.data;
};

// Create order
export const createOrder = async (orderData: CreateOrderData): Promise<Order> => {
    const response = await apiClient.post<Order>(ORDERS_ENDPOINT, { order: orderData });
    return response.data;
};

// Update order
export const updateOrder = async (id: number, orderData: UpdateOrderData): Promise<Order> => {
    const response = await apiClient.put<Order>(`${ORDERS_ENDPOINT}/${id}`, { order: orderData });
    return response.data;
};

// Delete order
export const deleteOrder = async (id: number): Promise<void> => {
    await apiClient.delete(`${ORDERS_ENDPOINT}/${id}`);
};

// Get orders by user
export const getUserOrders = async (userId: number): Promise<Order[]> => {
    return getOrders({ user_id: userId });
};

// Get orders by status
export const getOrdersByStatus = async (status: string): Promise<Order[]> => {
    return getOrders({ status });
};

// Order Items operations
export const getOrderItems = async (orderId: number): Promise<OrderItem[]> => {
    const response = await apiClient.get<OrderItem[]>(`${ORDERS_ENDPOINT}/${orderId}/order_items`);
    return response.data;
};

export const createOrderItem = async (orderId: number, itemData: CreateOrderItemData): Promise<OrderItem> => {
    const response = await apiClient.post<OrderItem>(
        `${ORDERS_ENDPOINT}/${orderId}/order_items`,
        { order_item: itemData }
    );
    return response.data;
};

export const updateOrderItem = async (
    orderId: number,
    itemId: number,
    itemData: Partial<CreateOrderItemData>
): Promise<OrderItem> => {
    const response = await apiClient.put<OrderItem>(
        `${ORDERS_ENDPOINT}/${orderId}/order_items/${itemId}`,
        { order_item: itemData }
    );
    return response.data;
};

export const deleteOrderItem = async (orderId: number, itemId: number): Promise<void> => {
    await apiClient.delete(`${ORDERS_ENDPOINT}/${orderId}/order_items/${itemId}`);
};

// Maintain backward compatibility with service object
export const ordersService = {
    getAll: getOrders,
    getById: getOrderById,
    create: createOrder,
    update: updateOrder,
    delete: deleteOrder,
    getUserOrders,
    getOrdersByStatus,
    getOrderItems,
    createOrderItem,
    updateOrderItem,
    deleteOrderItem,
};

export default ordersService;