'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Order } from '@/app/types';
import { usersService, ordersService } from '@/app/lib/api';
import Button from '@/app/components/ui/Button';
import Input from '@/app/components/ui/Input';
import Card, { CardContent, CardHeader, CardTitle } from '@/app/components/ui/Card';
import { formatCurrency, formatDateTime, isAuthenticated, isValidEmail } from '@/app/lib/utils';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const currentUser = await usersService.getCurrentUser();
      setUser(currentUser);
      setFormData({
        name: currentUser.name,
        email: currentUser.email,
        address: currentUser.address || '',
      });
      
      // Fetch user's orders
      const userOrders = await ordersService.getUserOrders(parseInt(currentUser.id));
      setOrders(userOrders);
      
      setError(null);
    } catch (err) {
      console.error('Failed to fetch user data:', err);
      setError('Failed to load profile. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user) {
      return;
    }

    setUpdating(true);
    try {
      const updatedUser = await usersService.update(user.id, formData);
      setUser(updatedUser);
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      alert('Profile updated successfully!');
    } catch (err: any) {
      console.error('Profile update failed:', err);
      setErrors({
        general: err.response?.data?.message || 'Failed to update profile. Please try again.',
      });
    } finally {
      setUpdating(false);
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'processing':
        return 'text-blue-600 bg-blue-100';
      case 'shipped':
        return 'text-purple-600 bg-purple-100';
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'User not found'}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          My Account
        </h1>
        <p className="text-lg text-gray-600">
          Manage your profile and view your orders
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'profile'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'orders'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Order History ({orders.length})
          </button>
        </nav>
      </div>

      {activeTab === 'profile' && (
        <div className="max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                {errors.general && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                    {errors.general}
                  </div>
                )}

                <Input
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  error={errors.name}
                  required
                />

                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={errors.email}
                  required
                />

                <Input
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  error={errors.address}
                  helperText="Used for shipping orders"
                />

                <div className="flex space-x-4">
                  <Button
                    type="submit"
                    isLoading={updating}
                  >
                    Update Profile
                  </Button>
                  <Link href="/change-password">
                    <Button variant="outline">
                      Change Password
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="space-y-6">
          {orders.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <svg
                  className="mx-auto h-24 w-24 text-gray-400 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No orders yet
                </h3>
                <p className="text-gray-600 mb-4">
                  You haven't placed any orders yet.
                </p>
                <Link href="/books">
                  <Button>
                    Start Shopping
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Order #{order.id}</CardTitle>
                      <p className="text-sm text-gray-600">
                        Placed on {formatDateTime(order.created_at)}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(order.status)}`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.order_items?.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{item.book?.title}</h4>
                          <p className="text-sm text-gray-600">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <p className="font-medium">
                          {formatCurrency(item.price_at_purchase)}
                        </p>
                      </div>
                    ))}
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center text-lg font-semibold">
                        <span>Total</span>
                        <span>{formatCurrency(order.total_amount)}</span>
                      </div>
                    </div>
                    {order.shipping_address && (
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Shipping to:</span>
                        <span className="ml-2 text-gray-600">{order.shipping_address}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}