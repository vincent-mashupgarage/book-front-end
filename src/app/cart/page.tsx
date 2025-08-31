'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Cart, CartItem } from '@/app/types';
import { cartsService } from '@/app/lib/api';
import Button from '@/app/components/ui/Button';
import Card, { CardContent, CardHeader, CardTitle } from '@/app/components/ui/Card';
import { formatCurrency, calculateCartTotal } from '@/app/lib/utils';
import { useAuth } from '@/app/contexts/AuthContext';

export default function CartPage() {
  const router = useRouter();
  const { user, isLoggedIn } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!isLoggedIn || !user) {
      router.push('/login');
      return;
    }
    
    fetchCart();
  }, [isLoggedIn, user]);

  const fetchCart = async () => {
    if (!user) return;
    
    try {
      // Use the actual logged-in user's ID
      const userId = parseInt(user.id);
      const cartData = await cartsService.getUserCart(userId);
      setCart(cartData);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
      // If cart doesn't exist, create one
      try {
        const userId = parseInt(user.id);
        const newCart = await cartsService.createCart(userId);
        setCart(newCart);
      } catch (createErr) {
        setError('Failed to load cart. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: number, newQuantity: number) => {
    if (!cart) return;

    setUpdatingItems(prev => new Set(prev).add(itemId));
    
    try {
      if (newQuantity === 0) {
        await cartsService.removeFromCart(cart.id, itemId);
      } else {
        await cartsService.updateCartItem(cart.id, itemId, { quantity: newQuantity });
      }
      
      // Refresh cart
      await fetchCart();
    } catch (err) {
      console.error('Failed to update cart item:', err);
      alert('Failed to update item. Please try again.');
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const removeItem = async (itemId: number) => {
    if (!cart) return;
    await updateQuantity(itemId, 0);
  };

  const clearCart = async () => {
    if (!cart) return;
    
    try {
      await cartsService.clearCart(cart.id);
      await fetchCart();
    } catch (err) {
      console.error('Failed to clear cart:', err);
      alert('Failed to clear cart. Please try again.');
    }
  };

  const proceedToCheckout = () => {
    router.push('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  const cartItems = cart?.cart_items || [];
  const total = calculateCartTotal(cartItems);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Shopping Cart
        </h1>
        <p className="text-lg text-gray-600">
          Review your items before checkout
        </p>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-8">
            <svg
              className="mx-auto h-24 w-24 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L6 6H3m4 7v6a1 1 0 001 1h8a1 1 0 001-1v-6m-9 0h10"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any books to your cart yet.
          </p>
          <Link href="/books">
            <Button size="lg">
              Continue Shopping
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item: CartItem) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    {/* Book Image */}
                    <div className="flex-shrink-0">
                      <div className="w-20 h-28 bg-gray-200 rounded-md flex items-center justify-center">
                        <span className="text-xs text-gray-500">Cover</span>
                      </div>
                    </div>

                    {/* Book Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {item.book?.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        by {item.book?.author}
                      </p>
                      <p className="text-lg font-bold text-blue-600">
                        {formatCurrency(item.book?.price || 0)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={updatingItems.has(item.id)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={updatingItems.has(item.id)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                      >
                        +
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      disabled={updatingItems.has(item.id)}
                      className="text-red-600 hover:text-red-800 disabled:opacity-50"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Clear Cart Button */}
            <div className="text-center">
              <Button variant="outline" onClick={clearCart}>
                Clear Cart
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>{formatCurrency(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
                <Button
                  size="lg"
                  className="w-full"
                  onClick={proceedToCheckout}
                >
                  Proceed to Checkout
                </Button>
                <Link href="/books" className="block">
                  <Button variant="outline" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}