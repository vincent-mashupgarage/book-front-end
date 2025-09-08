'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Cart, CartItem } from '@/app/types';
import { getUserCart, createCart, addToCart, removeFromCart, updateCartItem } from '@/app/lib/api/carts';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: Cart | null;
  cartItems: CartItem[];
  cartItemCount: number;
  loading: boolean;
  addItemToCart: (bookId: number, quantity?: number) => Promise<void>;
  removeItemFromCart: (itemId: number) => Promise<void>;
  updateItemQuantity: (itemId: number, quantity: number) => Promise<void>;
  clearCart: () => void;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const { user, isLoggedIn } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const refreshCart = async () => {
    if (!isLoggedIn || !user?.id) {
      setCart(null);
      setCartItems([]);
      return;
    }

    setLoading(true);
    try {
      const userCart = await getUserCart(parseInt(user.id));
      setCart(userCart);
      setCartItems(userCart.cart_items || []);
    } catch (error) {
      // If cart doesn't exist, create one
      try {
        const newCart = await createCart(parseInt(user.id));
        setCart(newCart);
        setCartItems([]);
      } catch (createError) {
        console.error('Failed to create cart:', createError);
      }
    } finally {
      setLoading(false);
    }
  };

  const addItemToCart = async (bookId: number, quantity: number = 1) => {
    if (!cart) return;

    try {
      const cartItem = await addToCart(cart.id, { book_id: bookId, quantity });
      setCartItems(prev => {
        const existingItemIndex = prev.findIndex(item => item.book_id === bookId);
        if (existingItemIndex >= 0) {
          const updated = [...prev];
          updated[existingItemIndex] = cartItem;
          return updated;
        }
        return [...prev, cartItem];
      });
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      throw error;
    }
  };

  const removeItemFromCart = async (itemId: number) => {
    if (!cart) return;

    try {
      await removeFromCart(cart.id, itemId);
      setCartItems(prev => prev.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
      throw error;
    }
  };

  const updateItemQuantity = async (itemId: number, quantity: number) => {
    if (!cart) return;

    try {
      const updatedItem = await updateCartItem(cart.id, itemId, { quantity });
      setCartItems(prev => 
        prev.map(item => item.id === itemId ? updatedItem : item)
      );
    } catch (error) {
      console.error('Failed to update item quantity:', error);
      throw error;
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  useEffect(() => {
    refreshCart();
  }, [isLoggedIn, user?.id]);

  const value = {
    cart,
    cartItems,
    cartItemCount,
    loading,
    addItemToCart,
    removeItemFromCart,
    updateItemQuantity,
    clearCart,
    refreshCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}