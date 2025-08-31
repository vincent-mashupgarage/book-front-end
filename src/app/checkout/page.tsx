'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Cart, User } from '@/app/types';
import { cartsService, ordersService, usersService } from '@/app/lib/api';
import Button from '@/app/components/ui/Button';
import Input from '@/app/components/ui/Input';
import Card, { CardContent, CardHeader, CardTitle } from '@/app/components/ui/Card';
import { formatCurrency, calculateCartTotal, isAuthenticated } from '@/app/lib/utils';

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // For now, assume user ID is 1 (we'll implement proper auth later)
      const userId = 1;
      
      const [cartData, userData] = await Promise.all([
        cartsService.getUserCart(userId),
        usersService.getCurrentUser(),
      ]);
      
      setCart(cartData);
      setUser(userData);
      setShippingAddress(userData.address || '');
      setError(null);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Failed to load checkout data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cart || !user || !shippingAddress.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!cart.cart_items || cart.cart_items.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    setSubmitting(true);
    try {
      const total = calculateCartTotal(cart.cart_items);
      
      // Create the order
      const order = await ordersService.create({
        user_id: parseInt(user.id),
        total_amount: total,
        status: 'pending',
        shipping_address: shippingAddress,
      });

      // Add order items
      for (const cartItem of cart.cart_items) {
        if (cartItem.book) {
          await ordersService.createOrderItem(order.id, {
            book_id: cartItem.book.id,
            quantity: cartItem.quantity,
            price_at_purchase: cartItem.book.price,
          });
        }
      }

      // Clear the cart
      await cartsService.clearCart(cart.id);

      // Redirect to order confirmation
      router.push(`/orders/${order.id}`);
    } catch (err: any) {
      console.error('Failed to place order:', err);
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (error && !cart) {
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

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h1>
          <p className="text-gray-600 mb-6">
            Add some books to your cart before checkout.
          </p>
          <Button onClick={() => router.push('/books')}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePlaceOrder} className="space-y-4">
                <Input
                  label="Full Name"
                  value={user?.name || ''}
                  disabled
                />

                <Input
                  label="Email"
                  value={user?.email || ''}
                  disabled
                />

                <Input
                  label="Shipping Address"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  required
                  placeholder="Enter your full shipping address"
                />
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="credit_card"
                    name="payment_method"
                    type="radio"
                    value="credit_card"
                    checked={paymentMethod === 'credit_card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="credit_card" className="ml-2 text-sm text-gray-900">
                    Credit Card
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="cash_on_delivery"
                    name="payment_method"
                    type="radio"
                    value="cash_on_delivery"
                    checked={paymentMethod === 'cash_on_delivery'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="cash_on_delivery" className="ml-2 text-sm text-gray-900">
                    Cash on Delivery
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Cart Items */}
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">
                        {item.book?.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity} × {formatCurrency(item.book?.price || 0)}
                      </p>
                    </div>
                    <p className="text-sm font-medium">
                      {formatCurrency((item.book?.price || 0) * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                  {error}
                </div>
              )}

              <Button
                onClick={handlePlaceOrder}
                isLoading={submitting}
                className="w-full"
                size="lg"
              >
                Place Order
              </Button>

              <Button
                variant="outline"
                onClick={() => router.push('/cart')}
                className="w-full"
              >
                Back to Cart
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}