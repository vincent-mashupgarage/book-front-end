'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Book, Category, Order, User } from '@/app/types';
import { booksService, categoriesService, ordersService, usersService } from '@/app/lib/api';
import Button from '@/app/components/ui/Button';
import Card, { CardContent, CardHeader, CardTitle } from '@/app/components/ui/Card';
import { formatCurrency } from '@/app/lib/utils';

interface DashboardStats {
  totalBooks: number;
  totalCategories: number;
  totalOrders: number;
  totalUsers: number;
  recentOrders: Order[];
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Add proper admin authentication check
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [booksResponse, categories, orders, users] = await Promise.all([
        booksService.getAll({ per_page: 1 }),
        categoriesService.getAll(),
        ordersService.getAll(),
        usersService.getAll(),
      ]);

      const dashboardStats: DashboardStats = {
        totalBooks: booksResponse.meta?.total_count || booksResponse.books?.length || 0,
        totalCategories: categories.length,
        totalOrders: orders.length,
        totalUsers: users.length,
        recentOrders: orders.slice(0, 5), // Get 5 most recent orders
      };

      setStats(dashboardStats);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
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
          <p className="text-gray-600">Loading dashboard...</p>
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Admin Dashboard
        </h1>
        <p className="text-lg text-gray-600">
          Manage your bookstore from here
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Books
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stats?.totalBooks || 0}
            </div>
            <Link href="/admin/books">
              <Button variant="ghost" size="sm" className="mt-2">
                Manage Books →
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stats?.totalCategories || 0}
            </div>
            <Link href="/admin/categories">
              <Button variant="ghost" size="sm" className="mt-2">
                Manage Categories →
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stats?.totalOrders || 0}
            </div>
            <Link href="/admin/orders">
              <Button variant="ghost" size="sm" className="mt-2">
                View Orders →
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stats?.totalUsers || 0}
            </div>
            <Link href="/admin/users">
              <Button variant="ghost" size="sm" className="mt-2">
                Manage Users →
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <Link href="/admin/books/new">
                <Button className="w-full justify-start">
                  + Add New Book
                </Button>
              </Link>
              <Link href="/admin/categories/new">
                <Button variant="outline" className="w-full justify-start">
                  + Add New Category
                </Button>
              </Link>
              <Link href="/admin/orders">
                <Button variant="outline" className="w-full justify-start">
                  📦 View All Orders
                </Button>
              </Link>
              <Link href="/admin/users">
                <Button variant="outline" className="w-full justify-start">
                  👥 Manage Users
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.recentOrders && stats.recentOrders.length > 0 ? (
              <div className="space-y-3">
                {stats.recentOrders.map((order) => (
                  <div key={order.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Order #{order.id}</p>
                      <p className="text-sm text-gray-600">
                        {order.user?.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {formatCurrency(order.total_amount)}
                      </p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
                <Link href="/admin/orders">
                  <Button variant="ghost" size="sm" className="w-full mt-4">
                    View All Orders →
                  </Button>
                </Link>
              </div>
            ) : (
              <p className="text-gray-600 text-center py-4">
                No orders yet
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Navigation Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/admin/books">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="text-center p-6">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-lg font-semibold mb-2">Books Management</h3>
              <p className="text-gray-600">Add, edit, and manage book inventory</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/categories">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="text-center p-6">
              <div className="text-4xl mb-4">🏷️</div>
              <h3 className="text-lg font-semibold mb-2">Categories</h3>
              <p className="text-gray-600">Organize books into categories</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/orders">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="text-center p-6">
              <div className="text-4xl mb-4">📦</div>
              <h3 className="text-lg font-semibold mb-2">Orders</h3>
              <p className="text-gray-600">Track and manage customer orders</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}