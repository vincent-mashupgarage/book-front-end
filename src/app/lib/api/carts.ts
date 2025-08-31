import { apiClient } from './base';
import { Cart, CartItem } from '@/app/types';

export interface CreateCartData {
    user_id: number;
}

export interface AddToCartData {
    book_id: number;
    quantity: number;
}

export interface UpdateCartItemData {
    quantity: number;
}

const CARTS_ENDPOINT = '/carts';

// Get user's cart
export const getUserCart = async (userId: number): Promise<Cart> => {
    const response = await apiClient.get<Cart>(`/users/${userId}/cart`);
    return response.data;
};

// Create cart for user
export const createCart = async (userId: number): Promise<Cart> => {
    const response = await apiClient.post<Cart>(`/users/${userId}/cart`);
    return response.data;
};

// Clear cart (remove all items)
export const clearCart = async (cartId: number): Promise<void> => {
    await apiClient.delete(`${CARTS_ENDPOINT}/${cartId}/clear`);
};

// Delete cart
export const deleteCart = async (cartId: number): Promise<void> => {
    await apiClient.delete(`${CARTS_ENDPOINT}/${cartId}`);
};

// Add item to cart
export const addToCart = async (cartId: number, itemData: AddToCartData): Promise<CartItem> => {
    const response = await apiClient.post<CartItem>(`${CARTS_ENDPOINT}/${cartId}/cart_items`, {
        cart_item: itemData
    });
    return response.data;
};

// Update cart item quantity
export const updateCartItem = async (
    cartId: number,
    itemId: number,
    updateData: UpdateCartItemData
): Promise<CartItem> => {
    const response = await apiClient.put<CartItem>(
        `${CARTS_ENDPOINT}/${cartId}/cart_items/${itemId}`,
        { cart_item: updateData }
    );
    return response.data;
};

// Remove item from cart
export const removeFromCart = async (cartId: number, itemId: number): Promise<void> => {
    await apiClient.delete(`${CARTS_ENDPOINT}/${cartId}/cart_items/${itemId}`);
};

// Get cart items
export const getCartItems = async (cartId: number): Promise<CartItem[]> => {
    const response = await apiClient.get<CartItem[]>(`${CARTS_ENDPOINT}/${cartId}/cart_items`);
    return response.data;
};

// Maintain backward compatibility with service object
export const cartsService = {
    getUserCart,
    createCart,
    clearCart,
    deleteCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    getCartItems,
};

export default cartsService;