'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Book, Category } from './types';
import { booksService, categoriesService } from './lib/api';
import Button from './components/ui/Button';
import Card, { CardContent, CardHeader, CardTitle } from './components/ui/Card';
import { formatCurrency } from './lib/utils';

export default function Home() {
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksResponse, categoriesResponse] = await Promise.all([
          booksService.getAll({ per_page: 8 }),
          categoriesService.getAll(),
        ]);
        
        setFeaturedBooks(booksResponse.books || []);
        setCategories(categoriesResponse.slice(0, 6));
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
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
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to Bookworm
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Discover your next great read from thousands of books across all genres
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/books">
                <Button size="lg" variant="secondary">
                  Browse Books
                </Button>
              </Link>
              <Link href="/categories">
                <Button size="lg" variant="outline">
                  Explore Categories
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-gray-600">
            Find books that match your interests
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link key={category.id} href={`/books?category=${category.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle>{category.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    {category.description || 'Explore books in this category'}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Books
            </h2>
            <p className="text-lg text-gray-600">
              Discover our hand-picked selection
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredBooks.map((book) => (
              <Link key={book.id} href={`/books/${book.slug}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardContent className="p-4">
                    <div className="aspect-[3/4] bg-gray-200 rounded-md mb-4 flex items-center justify-center">
                      <span className="text-gray-500 text-sm">Book Cover</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {book.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      by {book.author}
                    </p>
                    <p className="text-lg font-bold text-blue-600">
                      {formatCurrency(book.price)}
                    </p>
                    {book.stock_quantity > 0 ? (
                      <p className="text-sm text-green-600 mt-2">
                        In Stock
                      </p>
                    ) : (
                      <p className="text-sm text-red-600 mt-2">
                        Out of Stock
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link href="/books">
              <Button size="lg">
                View All Books
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              Stay Updated
            </h2>
            <p className="text-xl mb-8">
              Get notified about new arrivals and exclusive offers
            </p>
            <div className="max-w-md mx-auto flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-md text-gray-900"
              />
              <Button variant="secondary">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
